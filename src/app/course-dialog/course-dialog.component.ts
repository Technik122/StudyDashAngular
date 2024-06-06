import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent {
  courseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.courseForm = this.fb.group({
      name: [data.name || '', [Validators.required, Validators.maxLength(50)]],
      semester: [data.semeter || '', [Validators.required, Validators.min(1), Validators.max(10)]],
      exam: [data.exam || '', [Validators.required, Validators.maxLength(50)]],
      examDate: [data.examDate || '', Validators.required],
      grade: [data.grade || '']
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
        grade: this.data.grade
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.courseForm.valid) {
      this.dialogRef.close(this.courseForm.value);
    }
  }
}
