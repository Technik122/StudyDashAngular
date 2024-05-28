import {Component, OnInit} from '@angular/core';
import {AxiosService} from "../axios.service";
import {ToDo} from "../to-do";
import {MatDialog} from "@angular/material/dialog";
import {TaskDialogComponent} from "../task-dialog/task-dialog.component";
import {ConfirmDeleteDialogComponent} from "../confirm-delete-dialog/confirm-delete-dialog.component";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  priorities = ['HOCH', 'MITTEL', 'NIEDRIG'];
  toDos: ToDo[] = [];
  completedToDos: ToDo[] = [];

  showCompleted: boolean = false;

  constructor(public dialog: MatDialog, private axiosService: AxiosService) {}

  async ngOnInit() {
    const response = await this.axiosService.getToDosByUser();
    this.toDos = response.data.filter((todo: ToDo) => !todo.completed);
    this.completedToDos = response.data.filter((todo: ToDo) => todo.completed);
  }

  async markAsCompleted(toDo: ToDo) {
    toDo.completed = true;
    await this.axiosService.updateToDo(toDo.id, toDo);
    const response = await this.axiosService.getToDosByUser();
    this.toDos = response.data.filter((todo: ToDo) => !todo.completed);
    this.completedToDos = response.data.filter((todo: ToDo) => todo.completed);
  }

  async markAsUncompleted(toDo: ToDo) {
    toDo.completed = false;
    await this.axiosService.updateToDo(toDo.id, toDo);
    const response = await this.axiosService.getToDosByUser();
    this.toDos = response.data.filter((todo: ToDo) => !todo.completed);
    this.completedToDos = response.data.filter((todo: ToDo) => todo.completed);
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(async (result: ToDo) => {
      if (result) {
        await this.axiosService.createToDo(result);
        const response = await this.axiosService.getToDosByUser();
        this.toDos = response.data.filter((todo: ToDo) => !todo.completed);
        this.completedToDos = response.data.filter((todo: ToDo) => todo.completed);
      }
    });
  }

  async confirmDeleteTask(id: number): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.deleteTask(id);
      }
    });
  }

  async deleteTask(id: number): Promise<void> {
    await this.axiosService.deleteToDo(id);
    const response = await this.axiosService.getToDosByUser();
    this.toDos = response.data.filter((todo: ToDo) => !todo.completed);
    this.completedToDos = response.data.filter((todo: ToDo) => todo.completed);
  }

  async editTask(task: ToDo) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: { ...task, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(async (result: ToDo) => {
      if (result) {
        await this.axiosService.updateToDo(task.id, result);
        const response = await this.axiosService.getToDosByUser();
        this.toDos = response.data.filter((todo: ToDo) => !todo.completed);
        this.completedToDos = response.data.filter((todo: ToDo) => todo.completed);
      }
    });
  }

  toggleCompleted(): void {
    this.showCompleted = !this.showCompleted;
  }

  async updateSubtasks(toDoId: number) {
    const response = await this.axiosService.getSubtasksByToDoId(toDoId);
  }
}
