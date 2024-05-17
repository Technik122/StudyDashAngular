import {Component, OnInit} from '@angular/core';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatExpansionPanelHeader } from "@angular/material/expansion";
import {AxiosService} from "../axios.service";
import {ToDo} from "../to-do";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {

  constructor(private axiosService: AxiosService) {}

  panelOpenState = false;

  toDos: ToDo[] = [];

  async ngOnInit() {
    const response = await this.axiosService.getToDosByUser();
    this.toDos = response.data;
  }
}
