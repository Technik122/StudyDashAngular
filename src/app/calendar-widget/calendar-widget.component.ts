import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';

@Component({
  selector: 'app-calendar-widget',
  templateUrl: './calendar-widget.component.html',
  styleUrl: './calendar-widget.component.css',
})
export class CalendarWidgetComponent {
  selectedDate: Date | null = null;

  constructor(public dialog: MatDialog) {}

  openDialog(date: Date): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      width: '250px',
      data: { date }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle the result if needed
    });
  }
}
