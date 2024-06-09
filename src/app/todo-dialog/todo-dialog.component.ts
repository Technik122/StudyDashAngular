import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AxiosService} from "../axios.service";
import {Subtask} from "../subtask";
import {Course} from "../course";

@Component({
  selector: 'app-task-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.css']
})
export class TodoDialogComponent implements OnInit {
  taskForm: FormGroup;
  courses: Course[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private axiosService: AxiosService
  ) {
    this.taskForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(50)]],
      deadLine: [''],
      priority: ['', Validators.required],
      subtasks: this.fb.array([this.initSubtask()]),
      course: ['']
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.data.isEdit) {
      let deadLineDate = this.data.deadLine ? new Date(this.data.deadLine) : null;

      this.taskForm.patchValue({
        description: this.data.description,
        deadLine: deadLineDate,
        priority: this.data.priority,
        course: this.data.course
      });

      const subtasksResponse = await this.axiosService.getSubtasksByToDoId(this.data.id);
      const subtasks = subtasksResponse.data;

      const subtasksFormArray = this.taskForm.get('subtasks') as FormArray;

      while (subtasksFormArray.length !== 0) {
        subtasksFormArray.removeAt(0);
      }

      subtasks.forEach((subtask: Subtask) => {
        subtasksFormArray.push(this.fb.group({
          id: [subtask.id],
          description: [subtask.description, [Validators.required, Validators.maxLength(50)]],
          completed: [subtask.completed]
        }));
      });
    }

    const response = await this.axiosService.getCoursesByUser();
    this.courses = response.data;
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  async onSave(): Promise<void> {
    if (this.taskForm.valid) {
      const result = this.taskForm.value;
      result.subtasks = this.subtasks.value;

      if (this.data.isEdit) {
        const originalSubtasksResponse = await this.axiosService.getSubtasksByToDoId(this.data.id);
        const originalSubtasks = originalSubtasksResponse.data;

        const removedSubtasks = originalSubtasks.filter((originalSubtask: Subtask) =>
          !result.subtasks.some((subtask: Subtask) => subtask.id === originalSubtask.id)
        );

        for (const removedSubtask of removedSubtasks) {
          await this.axiosService.deleteSubtask(removedSubtask.id)
        }

        await this.axiosService.updateToDo(this.data.id, result);
        for (const subtask of result.subtasks) {
          if (subtask.id) {
            await this.axiosService.updateSubtask(subtask.id, subtask);
          } else {
            await this.axiosService.createSubtask(this.data.id, subtask);
          }
        }
      } else {
        const response = await this.axiosService.createToDo(result);
        const toDoId = response.data.id;
        for (const subtask of result.subtasks) {
          await this.axiosService.createSubtask(toDoId, subtask);
        }
      }
      this.dialogRef.close(result);
    }
  }

  addSubtask() {
    const subtasks = this.taskForm.get('subtasks') as FormArray;
    subtasks.push(this.fb.group({
      description: ['', Validators.required],
      completed: [false]
    }));
  }

  removeSubtask(index: number) {
    const subtasks = this.taskForm.get('subtasks') as FormArray;
    subtasks.removeAt(index);
  }

  get subtasks(): FormArray {
    return this.taskForm.get('subtasks') as FormArray;
  }

  initSubtask(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(50)]],
      completed: [false]
    })
  }
}
