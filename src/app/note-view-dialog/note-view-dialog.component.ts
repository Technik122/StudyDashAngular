import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-note-view-dialog',
  templateUrl: './note-view-dialog.component.html',
  styleUrls: ['./note-view-dialog.component.css']
})
export class NoteViewDialogComponent {
  noteContent: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.noteContent = data.noteContent;
  }
}
