import {Component, OnInit} from '@angular/core';
import {AxiosService} from "../axios.service";
import {ToDo} from "../to-do";
import {MatDialog} from "@angular/material/dialog";
import {TaskDialogComponent} from "../task-dialog/task-dialog.component";
import {ConfirmDeleteDialogComponent} from "../confirm-delete-dialog/confirm-delete-dialog.component";
import {Subtask} from "../subtask";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  priorities = ['HOCH', 'MITTEL', 'NIEDRIG'];
  toDos: ToDo[] = [];
  completedToDos: ToDo[] = [];
  subtasks: Subtask[] = [];

  showCompleted: boolean = false;

  constructor(public dialog: MatDialog, private axiosService: AxiosService) {}

  async ngOnInit() {
    await this.loadToDosAndSubtasks();
  }

  async markAsCompleted(toDo: ToDo) {
    toDo.completed = true;
    await this.axiosService.updateToDo(toDo.id, toDo);
    await this.loadToDosAndSubtasks();
  }

  async markAsUncompleted(toDo: ToDo) {
    toDo.completed = false;
    await this.axiosService.updateToDo(toDo.id, toDo);
    await this.loadToDosAndSubtasks();
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(async (result: ToDo) => {
      if (result) {
        await this.axiosService.createToDo(result);
        await this.loadToDosAndSubtasks();
      }
    });
  }

  async confirmDeleteTask(id: string): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.deleteTask(id);
      }
    });
  }

  async deleteTask(id: string): Promise<void> {
    await this.axiosService.deleteToDo(id);
    await this.loadToDosAndSubtasks();
  }

  async editTask(task: ToDo) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: { ...task, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(async (result: ToDo) => {
      if (result) {
        await this.axiosService.updateToDo(task.id, result);
        await this.loadToDosAndSubtasks();
      }
    });
  }

  toggleCompleted(): void {
    this.showCompleted = !this.showCompleted;
  }

  async loadToDosAndSubtasks(): Promise<void> {
    const response = await this.axiosService.getToDosByUser();
    this.toDos = response.data.filter((todo: ToDo) => !todo.completed);
    this.completedToDos = response.data.filter((todo: ToDo) => todo.completed);

    for (let todo of this.toDos) {
      const subtasksResponse = await this.axiosService.getSubtasksByToDoId(todo.id);
      todo.subtasks = subtasksResponse.data;
    }

    for (let todo of this.completedToDos) {
      const subtasksResponse = await this.axiosService.getSubtasksByToDoId(todo.id);
      todo.subtasks = subtasksResponse.data;
    }
  }
}
