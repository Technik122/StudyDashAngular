import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoteDialogComponent } from '../note-dialog/note-dialog.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent {
  notes = [
    { title: 'Einkaufsliste', content: 'Milch, Brot, Eier', date: new Date() },
    { title: 'Projektideen', content: 'Neues App-Design', date: new Date() }
  ];

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(NoteDialogComponent, {
      width: '400px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notes.push(result);
      }
    });
  }

  editNote(note: { title: string; }): void {
    const dialogRef = this.dialog.open(NoteDialogComponent, {
      width: '400px',
      data: { ...note, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.notes.findIndex(n => n.title === note.title);
        if (index > -1) {
          this.notes[index] = result;
        }
      }
    });
  }

  deleteNote(note: { title: string; }): void {
    const index = this.notes.findIndex(n => n.title === note.title);
    if (index > -1) {
      this.notes.splice(index, 1);
    }
  }
}
