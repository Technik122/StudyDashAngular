import {Component, OnInit} from '@angular/core';
import {AxiosService} from "../axios.service";
import {ToDo} from "../to-do";
import {MatDialog} from "@angular/material/dialog";
import {TaskDialogComponent} from "../task-dialog/task-dialog.component";
import {ConfirmDeleteDialogComponent} from "../confirm-delete-dialog/confirm-delete-dialog.component";
import {Subtask} from "../subtask";
import {CompletedToDosDialogComponent} from "../completed-to-dos-dialog/completed-to-dos-dialog.component";
import {Course} from "../course";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  priorities = ['HOCH', 'MITTEL', 'NIEDRIG'];
  toDos: ToDo[] = [];
  completedToDos: ToDo[] = [];
  subtasks: Map<string, Subtask[]> = new Map();
  courses: Course[] = [];
  courseColors: Map<string, string> = new Map();

  constructor(public dialog: MatDialog, private axiosService: AxiosService) {}

  async ngOnInit() {
    await this.loadCourses();
    await this.loadToDosAndSubtasks();
  }

  async markAsCompleted(toDo: ToDo) {
    toDo.completed = true;
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

  async loadToDosAndSubtasks(): Promise<void> {
    const response = await this.axiosService.getToDosByUser();
    this.toDos = response.data.filter((todo: ToDo) => !todo.completed);
    this.completedToDos = response.data.filter((todo: ToDo) => todo.completed);
    await this.loadCourses();

    for (const toDo of this.toDos) {
      const subtasks = await this.getSubtasksByParentToDoId(toDo.id);
      this.subtasks.set(toDo.id, subtasks);
      const color = await this.getCourseColor(toDo.course ? toDo.course : 'white');
      this.courseColors.set(toDo.id, color);
    }

    for (const toDo of this.completedToDos) {
      const subtasks = await this.getSubtasksByParentToDoId(toDo.id);
      this.subtasks.set(toDo.id, subtasks);
      const color = await this.getCourseColor(toDo.course ? toDo.course : 'white');
      this.courseColors.set(toDo.id, color);
    }
  }

  async getSubtasksByParentToDoId(parentToDoId: string): Promise<Subtask[]> {
    const response = await this.axiosService.getSubtasksByToDoId(parentToDoId);
    return response.data;
  }

  async openCompletedToDosDialog(): Promise<void> {
    const dialogRef = this.dialog.open(CompletedToDosDialogComponent, {
      width: '600px'
    });

    dialogRef.componentInstance.toDoUncompleted.subscribe(async () => {
      await this.loadToDosAndSubtasks();
    });
  }

  async loadCourses(): Promise<void> {
    const response = await this.axiosService.getCoursesByUser();
    this.courses = response.data;
  }

  async getCourseColor(courseId: string): Promise<string> {
    const course = this.courses.find(course => course.id === courseId);
    return (course ? course.color : '#FFFFFF') as string;
  }

  getCourseName(courseId: string): string {
    const course = this.courses.find(course => course.id === courseId);
    return course ? course.name : '';
  }
}
