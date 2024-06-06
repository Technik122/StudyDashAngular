import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Course} from "../course";
import {ToDo} from "../to-do";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AxiosService} from "../axios.service";
import {ConfirmDeleteDialogComponent} from "../confirm-delete-dialog/confirm-delete-dialog.component";
import {Subtask} from "../subtask";

@Component({
  selector: 'app-completed-to-dos-dialog',
  templateUrl: './completed-to-dos-dialog.component.html',
  styleUrl: './completed-to-dos-dialog.component.css'
})
export class CompletedToDosDialogComponent implements OnInit  {
  @Output() toDoUncompleted: EventEmitter<void> = new EventEmitter();

  completedToDos: { [key: string]: ToDo[] } = {};
  outputToDos: ToDo[] = [];
  subtasks: Map<string, Subtask[]> = new Map();

  constructor(public dialog: MatDialog, private axiosService: AxiosService, public dialogRef: MatDialogRef<CompletedToDosDialogComponent>){}

  async ngOnInit() {
    const response = await this.axiosService.getToDosByUser()
    const completedToDos = response.data.filter((course: Course) => course.completed);

    this.completedToDos = completedToDos.reduce((acc: { [key:string]: ToDo[] }, toDo: ToDo) => {
      const deadLineDate = new Date(toDo.deadLine);
      const yearMonthKey = new Intl.DateTimeFormat('en', { year: 'numeric',
        month: '2-digit' }).format(deadLineDate);
      (acc[yearMonthKey] = acc[yearMonthKey] || []).push(toDo);
      return acc;
    }, {});

    for (const key in this.completedToDos) {
      const toDos = this.completedToDos[key];
      this.outputToDos = toDos;
      for (const toDo of toDos) {
        const response = await this.axiosService.getSubtasksByToDoId(toDo.id);
        const subtasks = response.data;
        this.subtasks.set(toDo.id, subtasks);
      }
    }
  }

  async markAsUncompleted(toDo: ToDo) {
    toDo.completed = false;
    await this.axiosService.updateToDo(toDo.id, toDo);
    await this.ngOnInit();
    this.toDoUncompleted.emit();
  }

  async confirmDeleteCourse(toDo: ToDo) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.deleteToDo(toDo);
      }
    });
  }

  private async deleteToDo(toDo: ToDo): Promise<void> {
    await this.axiosService.deleteCourse(toDo.id);
    await this.ngOnInit();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
