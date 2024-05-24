import {Component, OnInit} from '@angular/core';
import {AxiosService} from "../axios.service";
import {ToDo} from "../to-do";
import {MatDialog} from "@angular/material/dialog";
import {TaskDialogComponent} from "../task-dialog/task-dialog.component";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  priorities = ['HOCH', 'MITTEL', 'NIEDRIG'];
  toDos: ToDo[] = [];

  constructor(public dialog: MatDialog, private axiosService: AxiosService) {}

  async ngOnInit() {
    const response = await this.axiosService.getToDosByUser();
    this.toDos = response.data;
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
        this.toDos = response.data;
      }
    });
  }

  async deleteTask(id: number) {
    await this.axiosService.deleteToDo(id);
    const response = await this.axiosService.getToDosByUser();
    this.toDos = response.data;
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
        this.toDos = response.data;
      }
    });
  }
}
