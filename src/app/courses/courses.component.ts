import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {
  courses = [
    { name: 'Mathematik' },
    { name: 'Informatik' }
  ];

  constructor(public dialog: MatDialog) {}

  openCourseDialog(): void {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      width: '400px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courses.push(result);
      }
    });
  }

  editCourse(course: { name: string; }): void {
    const dialogRef = this.dialog.open(CourseDialogComponent, {
      width: '400px',
      data: { ...course, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.courses.findIndex(c => c.name === course.name);
        if (index > -1) {
          this.courses[index] = result;
        }
      }
    });
  }

  deleteCourse(course: { name: string; }): void {
    const index = this.courses.findIndex(c => c.name === course.name);
    if (index > -1) {
      this.courses.splice(index, 1);
    }
  }
}
