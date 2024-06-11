import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import {AxiosService} from "../axios.service";
import {Course} from "../course";
import {ConfirmDeleteDialogComponent} from "../confirm-delete-dialog/confirm-delete-dialog.component";
import {CompletedCoursesDialogComponent} from "../completed-courses-dialog/completed-courses-dialog.component";
import {CourseService} from "../course.service";

@Component({
  selector: 'app-courses',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  courses: Course[] = [];
  courseToDosCount: Map<string, number> = new Map();

  constructor(public dialog: MatDialog, private axiosService: AxiosService, private courseService: CourseService) {
  }

  async ngOnInit() {
    await this.refreshCourses();
    await this.loadToDosCountForCourses();
  }

  async refreshCourses(): Promise<void> {
    const response = await this.axiosService.getCoursesByUser();
    this.courses = response.data.filter((course:Course) => !course.completed);
    this.courses.sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
  }

  async openCourseDialog(): Promise<void> {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      width: '400px',
      data: {isEdit: false}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.axiosService.createCourse(result)
        this.courseService.courseAdded.emit();
        await this.refreshCourses();
      }
    });
  }

  async editCourse(course: Course): Promise<void> {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      width: '400px',
      data: {...course, isEdit: true}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.axiosService.updateCourse(course.id, result);
        this.courseService.courseChanged.emit();
        await this.refreshCourses();
      }
    });
  }

  async confirmDeleteCourse(course: Course): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.deleteCourse(course);
        this.courseService.courseDeleted.emit();
      }
    });
  }

  private async deleteCourse(course: Course): Promise<void> {
    await this.axiosService.deleteCourse(course.id);
    await this.refreshCourses();
  }

  async openCompletedCoursesDialog(): Promise<void> {
    const dialogRef = this.dialog.open(CompletedCoursesDialogComponent, {
      width: '600px'
    });

    dialogRef.componentInstance.courseUncompleted.subscribe(async () => {
      await this.refreshCourses();
    });
  }

  async markAsCompleted(course: Course) {
    course.completed = true;
    await this.axiosService.updateCourse(course.id, course);
    await this.refreshCourses();
  }

  async loadToDosCountForCourses(): Promise<void> {
    for (const course of this.courses) {
      const response = await this.axiosService.getToDosByCourse(course.id);
      this.courseToDosCount.set(course.id, response.data.length);
    }
  }
}
