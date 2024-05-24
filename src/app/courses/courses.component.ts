import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import {AxiosService} from "../axios.service";
import {Course} from "../course";
import {ConfirmDeleteDialogComponent} from "../confirm-delete-dialog/confirm-delete-dialog.component";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {
  courses: Course[] = [];

  constructor(public dialog: MatDialog, private axiosService: AxiosService) {}

  async ngOnInit() {
    const response = await this.axiosService.getCoursesByUser();
    this.courses = response.data;
  }

  async openCourseDialog(): Promise<void> {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      width: '400px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.axiosService.createCourse(result)
        const response = await this.axiosService.getCoursesByUser();
        this.courses = response.data;
      }
    });
  }

  async editCourse(course: Course): Promise<void> {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      width: '400px',
      data: { ...course, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.axiosService.updateCourse(course.id, result);
        const response = await this.axiosService.getCoursesByUser();
        this.courses = response.data;
      }
    });
  }

  async confirmDeleteCourse(course: Course): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.deleteCourse(course);
      }
    });
  }

  private async deleteCourse(course: Course): Promise<void> {
    await this.axiosService.deleteCourse(course.id);
    const response = await this.axiosService.getCoursesByUser();
    this.courses = response.data;
  }
}
