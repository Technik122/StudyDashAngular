import {Component, Input} from '@angular/core';
import {Subtask} from "../subtask";
import {AxiosService} from "../axios.service";
import {Todo} from "../todo";

@Component({
  selector: 'app-subtask',
  templateUrl: './subtask.component.html',
  styleUrl: './subtask.component.css'
})
export class SubtaskComponent {
  @Input() subtask!: Subtask;
  @Input() toDos: Todo[] = [];

  constructor(private axiosService: AxiosService) {}

  async onCheckboxClick(subtask: Subtask): Promise<void> {
    subtask.completed = !subtask.completed;
    await this.axiosService.updateSubtask(subtask.id, subtask);
  }

  isParentToDoCompleted(subtask: Subtask): boolean {
    const parentToDo = this.toDos.find(toDo => toDo.id === subtask.parentToDo);
    return parentToDo ? parentToDo.completed : false;
  }
}
