import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html',
  styleUrls: ['./note-dialog.component.css']
})
export class NoteDialogComponent {
  noteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.noteForm = this.fb.group({
      title: [data.title || '', [Validators.required, Validators.maxLength(50)]],
      content: [data.content || '', [Validators.required, Validators.maxLength(255)]],
      date: [data.date || '', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data.isEdit) {
      let noteDate = this.data.date ? new Date(this.data.date) : null;

      this.noteForm.patchValue({
        title: this.data.title,
        content: this.data.content,
        date: noteDate
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.noteForm.valid) {
      this.dialogRef.close(this.noteForm.value);
    }
  }
}
