import {Component, Input} from '@angular/core';
import {Subtask} from "../subtask";
import {AxiosService} from "../axios.service";
import {TasksComponent} from "../tasks/tasks.component";

@Component({
  selector: 'app-subtask',
  templateUrl: './subtask.component.html',
  styleUrl: './subtask.component.css'
})
export class SubtaskComponent {

  constructor(private axiosService: AxiosService) {}

}
