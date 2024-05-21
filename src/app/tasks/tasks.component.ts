import {Component, OnInit} from '@angular/core';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatExpansionPanelHeader } from "@angular/material/expansion";
import {AxiosService} from "../axios.service";
import {ToDo} from "../to-do";
import {MatDialog} from "@angular/material/dialog";
import {TaskDialogComponent} from "../task-dialog/task-dialog.component";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
/*export class TasksComponent implements OnInit {

  constructor(private axiosService: AxiosService) {}

  panelOpenState = false;

  toDos: ToDo[] = [];

  async ngOnInit() {
    const response = await this.axiosService.getToDosByUser();
    this.toDos = response.data;
  }*/
  export class TasksComponent {
  panelOpenState = false;
  priorities = ['HOCH', 'MITTEL', 'NIEDRIG'];
  tasks: ToDo[] = [
    /*{
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
    }*/
  ];

  constructor(public dialog: MatDialog, private axiosService: AxiosService) {}

  async ngOnInit() {
    const response = await this.axiosService.getToDosByUser();
    this.tasks = response.data;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(async (result: ToDo) => {
      if (result) {
        await this.axiosService.createToDo(result);
        const response = await this.axiosService.getToDosByUser();
        this.tasks = response.data;
      }
    });
  }
}
