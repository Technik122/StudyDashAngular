import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Course} from "../course";
import {AxiosService} from "../axios.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmDeleteDialogComponent} from "../confirm-delete-dialog/confirm-delete-dialog.component";
import {Subtask} from "../subtask";

@Component({
  selector: 'app-completed-courses-dialog',
  templateUrl: './completed-courses-dialog.component.html',
  styleUrl: './completed-courses-dialog.component.css'
})
export class CompletedCoursesDialogComponent implements OnInit {
  @Output() courseUncompleted: EventEmitter<void> = new EventEmitter();

  completedCourses: { [key: string]: Course[] } = {};
  subtasks: Map<string, Subtask[]> = new Map();

  constructor(public dialog: MatDialog, private axiosService: AxiosService, public dialogRef: MatDialogRef<CompletedCoursesDialogComponent>){}

  async ngOnInit() {
    const response = await this.axiosService.getCoursesByUser();
    const completedCourses = response.data.filter((course: Course) => course.completed);

    this.completedCourses = completedCourses.reduce((acc: { [key:string]: Course[] }, course:Course) => {
      (acc[course.semester] = acc[course.semester] || []).push(course);
      return acc;
    }, {});
  }

  async markAsUncompleted(course: Course) {
    course.completed = false;
    await this.axiosService.updateCourse(course.id, course);
    await this.ngOnInit();
    this.courseUncompleted.emit();
  }

  async confirmDeleteCourse(course: Course) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.deleteCourse(course);
      }
    });
  }

  private async deleteCourse(course: Course): Promise<void> {
    await this.axiosService.deleteCourse(course.id);
    await this.ngOnInit();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
