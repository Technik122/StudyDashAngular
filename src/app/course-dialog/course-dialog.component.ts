import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit {
  courseForm: FormGroup;

  @Output() courseEdited = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.courseForm = this.fb.group({
      name: [data.name || '', [Validators.required, Validators.maxLength(50)]],
      semester: [data.semeter || '', [Validators.required, Validators.min(1), Validators.max(10)]],
      exam: [data.exam || '', [Validators.required, Validators.maxLength(50)]],
      examDate: [data.examDate || ''],
      grade: [data.grade || ''],
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
    }
  }
}
