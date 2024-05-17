import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {
  panelOpenState = false;
  priorities = ['Hoch', 'Mittel', 'Niedrig'];
  tasks = [
    {
      title: 'Mathematik Hausaufgaben',
      endDate: '2024-05-20',
      description: 'Lösen Sie die Aufgaben im Buch Kapitel 3',
      priority: 'Hoch'
    },
    {
      title: 'Geschichtsprojekt überprüfen',
      endDate: '2024-05-25',
      description: 'Überprüfen Sie das Projekt und bereiten Sie die Präsentation vor',
      priority: 'Mittel'
    },
    {
      title: 'Physik-Experiment vorbereiten',
      endDate: '2024-05-30',
      description: 'Bereiten Sie das Experiment für die Klasse vor',
      priority: 'Niedrig'
    }
  ];

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tasks.push(result);
      }
    });
  }
}
