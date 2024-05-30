import {Component, Input} from '@angular/core';
import {Subtask} from "../subtask";
import {AxiosService} from "../axios.service";

@Component({
  selector: 'app-subtask',
  templateUrl: './subtask.component.html',
  styleUrl: './subtask.component.css'
})
export class SubtaskComponent {
  @Input() subtask!: Subtask;

  constructor(private axiosService: AxiosService) {}

  async onCheckboxClick(subtask: Subtask): Promise<void> {
    subtask.completed = !subtask.completed;
    await this.axiosService.updateSubtask(subtask.id, subtask);
  }
}
