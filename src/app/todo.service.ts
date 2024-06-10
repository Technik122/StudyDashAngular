import { Injectable } from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {AxiosService} from "./axios.service";
import {Todo} from "./todo";

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private axiosService: AxiosService, private notificationsService: NotificationsService) {
    this.axiosService.todoAddedOrChanged.subscribe((todo: Todo) => {
      this.checkTodos(todo);
    });
  }

  async checkToDos(): Promise<void> {
    const response = await this.axiosService.getToDosByUser();
    const toDos = response.data;
    const currentDate = new Date();
    toDos.forEach((toDo: Todo) => {
      const deadLineDate = new Date(toDo.deadLine);
      const diffInDays = Math.ceil((deadLineDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
      if (diffInDays === 2) {
        const message = `${toDo.description} muss in 2 Tagen fertig sein!`;
        if (toDo.priority === 'HOCH') {
          this.notificationsService.error(message);
        } else {
          this.notificationsService.info(message);
        }
      }
    });
  }

  checkTodos(todo: Todo): void {
    const currentDate = new Date();
    const deadlineDate = new Date(todo.deadLine);
    const diffInDays = Math.ceil((deadlineDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffInDays === 2) {
      const message = `${todo.description} muss in 2 Tagen fertig sein!`;
      if (todo.priority === 'HOCH') {
        this.notificationsService.error(message);
      } else {
        this.notificationsService.info(message);
      }
    }
  }
}
