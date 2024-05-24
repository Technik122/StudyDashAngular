import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoteDialogComponent } from '../note-dialog/note-dialog.component';
import {AxiosService} from "../axios.service";
import {Note} from "../note";
import {ConfirmDeleteDialogComponent} from "../confirm-delete-dialog/confirm-delete-dialog.component";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent {
  notes: Note[] = [];

  constructor(public dialog: MatDialog, private axiosService: AxiosService) {}

  async ngOnInit() {
    const response = await this.axiosService.getNotesByUser();
    this.notes = response.data;
  }

  async openNoteDialog(): Promise<void> {
    const dialogRef = this.dialog.open(NoteDialogComponent, {
      width: '400px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(async result => {
      await this.axiosService.createNote(result)
      const response = await this.axiosService.getNotesByUser();
      this.notes = response.data;
    });
  }

  async editNote(note: Note): Promise<void> {
    const dialogRef = this.dialog.open(NoteDialogComponent, {
      width: '400px',
      data: { ...note, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.axiosService.updateNote(note.id, result);
        const response = await this.axiosService.getNotesByUser();
        this.notes = response.data;
      }
    });
  }

  async confirmDeleteNote(note: Note): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.deleteNote(note);
      }
    });
  }

  private async deleteNote(note: Note): Promise<void> {
    await this.axiosService.deleteNote(note.id);
    const response = await this.axiosService.getNotesByUser();
    this.notes = response.data;
  }
}
