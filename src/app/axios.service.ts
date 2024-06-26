import {EventEmitter, Injectable} from '@angular/core';
import axios, {AxiosError, AxiosResponse} from 'axios';
import {Todo} from "./todo";
import {Course} from "./course";
import {Note} from "./note";
import {Subtask} from "./subtask";
import {NotificationsService} from "angular2-notifications";
import {Event} from "./event";

@Injectable({
  providedIn: 'root'
})
export class AxiosService {
  todoAddedOrChanged = new EventEmitter<Todo>();

  constructor(private notificationsService: NotificationsService) {
    axios.defaults.baseURL = "https://studydash-426211.ey.r.appspot.com/"
    axios.defaults.headers.post["Content-Type"] = "application/json"
  }

  async login(credentials: { username: string, password: string }) {
    localStorage.removeItem("auth_token");
    try {
      const response = await this.request('POST', '/login', credentials);
      if (response.status === 200) {
        this.notificationsService.success('Willkommen 🥳', `${credentials.username}`, {timeOut: 10000});
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(credentials: { username: string, password: string }) {
    localStorage.removeItem("auth_token");
    try {
      const response = await this.request('POST', '/register', credentials);
      if (response.status === 201) {
        this.notificationsService.success('Erfolgreich registriert 🥳', `Bitte loggen Sie sich ein`, {timeOut: 10000});
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  getAuthToken(): string | null {
    return window.localStorage.getItem("auth_token");
  }

  setAuthToken(token: string | null): void {
    if (token !== null) {
      window.localStorage.setItem("auth_token", token);
    } else {
      window.localStorage.removeItem("auth_token");
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const response = await this.request('POST', '/refresh-token', null);

      if (response.status === 200) {
        this.setAuthToken(response.data.token);
        return response.data.token;
      } else {
        console.error('Token kann nicht erneuert werden');
        return '';
      }
    } catch (error) {
      console.error(error);
      return '';
    }
  }

  isLoggedIn(): boolean {
    return this.getAuthToken() !== null;
  }

  logout(): void {
    this.notificationsService.success('Auf Wiedersehen 🥳', 'Sie haben sich erfolgreich ausgeloggt.', {timeOut: 10000});
    this.setAuthToken(null);
  }

  async request(method: string, url: string, data: any): Promise<any> {
    try {
      let headers: Record<string, string> = {};

      if (this.getAuthToken() !== null) {
        headers["Authorization"] = "Bearer " + this.getAuthToken();
      }

      return await axios({
        method: method,
        url: url,
        data: data,
        headers: headers
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const errorData = axiosError.response.data as ErrorData;
        if (axiosError.response.status === 401) {
          this.notificationsService.error('Fehler', errorData.message, {timeOut: 10000});
        } else if (axiosError.response.status === 404) {
          this.notificationsService.error('Fehler', errorData.message, {timeOut: 10000});
        } else if (axiosError.response.status === 400) {
          this.notificationsService.error('Fehler', errorData.message, {timeOut: 10000});
        }
      } else if (axiosError.request) {
        this.notificationsService.error('Fehler', 'Es gab einen Fehler bei der Verbindung zum Server', {timeOut: 10000});
      } else {
        this.notificationsService.error('Fehler', 'Es gab einen Fehler bei der Anfrage', {timeOut: 10000});
      }
      throw axiosError;
    }
  }

  async isTokenValid(): Promise<boolean> {
    try {
      const response = await this.request('GET', '/validate-token', null);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async deleteUser(id: string): Promise<AxiosResponse> {
    return this.request('DELETE', `/user/delete/${id}`, null);
  }

  async getUser(): Promise<any> {
    return this.request('GET', '/user/get', null);
  }

  async getToDosByUser(): Promise<AxiosResponse> {
    return this.request('GET', '/todos/get', null);
  }

  async createToDo(toDo: Todo): Promise<AxiosResponse> {
    this.todoAddedOrChanged.emit(toDo);
    return this.request('POST', '/todos/add', toDo);
  }

  async deleteToDo(id: string): Promise<AxiosResponse> {
    return this.request('DELETE', `/todos/delete/${id}`, null);
  }

  async updateToDo(id: string, updatedToDo: Todo): Promise<AxiosResponse> {
    this.todoAddedOrChanged.emit(updatedToDo);
    return this.request('PUT', `/todos/update/${id}`, updatedToDo);
  }

  async getToDosByCourse(courseId: string): Promise<AxiosResponse> {
    return this.request('GET', `/todos/course/${courseId}`, null);
  }

  async getCoursesByUser(): Promise<AxiosResponse> {
    return this.request('GET', '/courses/get', null);
  }

  async createCourse(course: Course): Promise<AxiosResponse> {
    return this.request('POST', '/courses/add', course);
  }

  async deleteCourse(id: string): Promise<AxiosResponse> {
    return this.request('DELETE', `/courses/delete/${id}`, null);
  }

  async updateCourse(id: string, updatedCourse: Course): Promise<AxiosResponse> {
    return this.request('PUT', `/courses/update/${id}`, updatedCourse);
  }

  async getNotesByUser(): Promise<AxiosResponse> {
    return this.request('GET', '/notes/get', null);
  }

  async createNote(note: Note): Promise<AxiosResponse> {
    return this.request('POST', '/notes/add', note);
  }

  async deleteNote(id: string): Promise<AxiosResponse> {
    return this.request('DELETE', `/notes/delete/${id}`, null);
  }

  async updateNote(id: string, updatedNote: Note): Promise<AxiosResponse> {
    return this.request('PUT', `/notes/update/${id}`, updatedNote);
  }

  async getSubtasksByToDoId(toDoId: string): Promise<AxiosResponse> {
    return this.request('GET', `/todos/${toDoId}/subtasks/get`, null);
  }

  async createSubtask(toDoId: string, subtask: Subtask): Promise<AxiosResponse> {
    return this.request('POST', `/todos/${toDoId}/subtasks/add`, subtask);
  }

  async updateSubtask(subtaskId: string, updatedSubtask: Subtask): Promise<AxiosResponse> {
    return this.request('PUT', `/subtasks/update/${subtaskId}`, updatedSubtask);
  }

  async deleteSubtask(subtaskId: string): Promise<AxiosResponse> {
    return this.request('DELETE', `/subtasks/delete/${subtaskId}`, null);
  }

  async getEventsByUser(): Promise<AxiosResponse> {
    return this.request('GET', '/events/get', null);
  }

  async createEvent(event: Event): Promise<AxiosResponse> {
    return this.request('POST', '/events/add', event);
  }

  async deleteEvent(id: string): Promise<AxiosResponse> {
    return this.request('DELETE', `/events/delete/${id}`, null);
  }

  async updateEvent(id: string, updatedEvent: Event): Promise<AxiosResponse> {
    return this.request('PUT', `/events/update/${id}`, updatedEvent);
  }
}

interface ErrorData {
  message: string;
}
