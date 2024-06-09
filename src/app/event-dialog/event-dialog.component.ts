import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent {
  eventName: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { date: Date }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  addEvent(): void {
    // Logic to add the event
    console.log(`Event: ${this.eventName} on ${this.data.date}`);
    this.dialogRef.close();
  }
}
