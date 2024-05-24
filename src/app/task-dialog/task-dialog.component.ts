import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent {
  taskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.taskForm = this.fb.group({
      description: ['', Validators.required],
      deadLine: ['', Validators.required],
      priority: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data.isEdit) {
      let deadLineDate = this.data.deadLine ?
        new Date(this.data.deadLine) : null;

      this.taskForm.patchValue({
        description: this.data.description,
        deadLine: deadLineDate,
        priority: this.data.priority
      });
    }
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value);
    }
  }
}
