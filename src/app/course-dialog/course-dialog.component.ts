import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NotificationsService} from "angular2-notifications";
import {CourseService} from "../course.service";

@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit {
  courseForm: FormGroup;
  semesters: number[] = Array.from({length: 10}, (_, i) => i + 1);

  @Output() courseEdited = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notificationsService: NotificationsService,
    private courseService: CourseService
  ) {
    this.courseForm = this.fb.group({
      name: [data.name || '', [Validators.required, Validators.maxLength(50)]],
      semester: [data.semeter || '', [Validators.required, Validators.min(1), Validators.max(10)]],
      exam: [data.exam || '', [Validators.required, Validators.maxLength(50)]],
      examDate: [data.examDate || ''],
      grade: [data.grade || '', [this.gradeFormatValidator]],
      color: [data.color || '']
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.data.isEdit) {
      let examDate = this.data.examDate ? new Date(this.data.examDate) : null;

      this.courseForm.patchValue({
        name: this.data.name,
        semester: this.data.semester,
        exam: this.data.exam,
        examDate: examDate,
        grade: this.data.grade,
        color: this.data.color
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.courseForm.valid) {
      this.dialogRef.close(this.courseForm.value);
      this.courseEdited.emit();
      const gradeControl = this.courseForm.get('grade');
      if (gradeControl && gradeControl.value) {
        if (gradeControl.value < 4.0) {
          this.notificationsService.success('Note hinzugefügt 🥳', `Herzlichen Glückwunsch!`, {timeOut: 10000});
        } else {
          this.notificationsService.warn('Note hinzugefügt 😞', `Schade!`, {timeOut: 10000});
        }
        this.courseService.grandeChanged.next();
      }
      if (this.courseForm.get('color')?.dirty) {
        this.courseService.colorChanged.next();
      }
    }
  }

  gradeFormatValidator(control: FormControl) {
    const value = control.value;
    const valid = /^\d+(\.\d{1,2})?$/.test(value);
    return valid ? null : { invalidGrade: true };
  }
}
