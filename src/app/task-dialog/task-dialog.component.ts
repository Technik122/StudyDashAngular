import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AxiosService} from "../axios.service";
import {Subtask} from "../subtask";

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent {
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private axiosService: AxiosService
  ) {
    this.taskForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(50)]],
      deadLine: ['', Validators.required],
      priority: ['', Validators.required],
      subtasks: this.fb.array([this.initSubtask()])
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.data.isEdit) {
      let deadLineDate = this.data.deadLine ? new Date(this.data.deadLine) : null;

      this.taskForm.patchValue({
        description: this.data.description,
        deadLine: deadLineDate,
        priority: this.data.priority
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
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  async onSave(): Promise<void> {
    if (this.taskForm.valid) {
      const result = this.taskForm.value;
      result.subtasks = this.subtasks.value;

      if (this.data.isEdit) {
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
