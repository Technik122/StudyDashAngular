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
  @Input() subtask!: Subtask;
  private tasksComponent: TasksComponent;

  constructor(private axiosService: AxiosService) {}

  async updateSubtask() {
    await this.axiosService.updateSubtask(this.subtask.id, this.subtask);
  }

  async addSubtask(todoId: number, description: string) {
    const newSubtask: Subtask = {
      description: description,
      completed: false
    };

    await this.axiosService.createSubtask(todoId, newSubtask);
    await this.tasksComponent.updateSubtasks(todoId);
  }
}
