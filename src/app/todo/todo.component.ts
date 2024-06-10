import {Component, OnInit} from '@angular/core';
import {AxiosService} from "../axios.service";
import {Todo} from "../todo";
import {MatDialog} from "@angular/material/dialog";
import {TodoDialogComponent} from "../todo-dialog/todo-dialog.component";
import {ConfirmDeleteDialogComponent} from "../confirm-delete-dialog/confirm-delete-dialog.component";
import {Subtask} from "../subtask";
import {CompletedToDosDialogComponent} from "../completed-to-dos-dialog/completed-to-dos-dialog.component";
import {Course} from "../course";
import {CourseService} from "../course.service";

@Component({
  selector: 'app-tasks',
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css',
})
export class TodoComponent implements OnInit {
  priorities = ['HOCH', 'MITTEL', 'NIEDRIG'];
  toDos: Todo[] = [];
  completedToDos: Todo[] = [];
  subtasks: Map<string, Subtask[]> = new Map();
  courses: Course[] = [];
  courseColors: Map<string, string> = new Map();

  constructor(public dialog: MatDialog, private axiosService: AxiosService, private courseService: CourseService) {
    this.courseService.colorChanged.subscribe(async () => {
      await this.loadToDosAndSubtasks();
    });
  }

  async ngOnInit() {
    await this.loadToDosAndSubtasks();
  }

  async markAsCompleted(toDo: Todo) {
    toDo.completed = true;
    await this.axiosService.updateToDo(toDo.id, toDo);
    await this.loadToDosAndSubtasks();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(async (result: Todo) => {
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

  async editTask(task: Todo) {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      width: '400px',
      data: { ...task, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(async (result: Todo) => {
      if (result) {
        await this.axiosService.updateToDo(task.id, result);
        await this.loadToDosAndSubtasks();
      }
    });
  }

  async loadToDosAndSubtasks(): Promise<void> {
    const response = await this.axiosService.getToDosByUser();
    this.toDos = response.data.filter((todo: Todo) => !todo.completed);
    this.toDos.sort((a, b) => new Date(a.deadLine).getTime() - new Date(b.deadLine).getTime());
    this.completedToDos = response.data.filter((todo: Todo) => todo.completed);
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

  sortToDos(option: string): void {
    switch (option) {
      case 'priority':
        this.toDos.sort((a, b) => this.priorities.indexOf(a.priority) - this.priorities.indexOf(b.priority));
        break;
      case 'deadline':
        this.toDos.sort((a, b) => new Date(a.deadLine).getTime() - new Date(b.deadLine).getTime());
        break;
      case 'course':
        this.toDos.sort((a, b) => {
          const courseA = this.courses.find(course => course.id === a.course);
          const courseB = this.courses.find(course => course.id === b.course);
          const dateA = courseA?.examDate ? new Date(courseA.examDate).getTime() : 0;
          const dateB = courseB?.examDate ? new Date(courseB.examDate).getTime() : 0;
          return dateA - dateB;
        });
        break;
    }
  }
}
