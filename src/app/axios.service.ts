import { Injectable } from '@angular/core';
import axios, {AxiosResponse} from 'axios';
import {ToDo} from "./to-do";
import {Course} from "./course";

@Injectable({
  providedIn: 'root'
})
export class AxiosService {

  constructor() {
    axios.defaults.baseURL = "http://localhost:8080"
    axios.defaults.headers.post["Content-Type"] = "application/json"
  }

  login(credentials: {username: string, password: string}) {
    localStorage.removeItem("auth_token");
    return this.request('POST', '/login', credentials);
  }

  register(credentials: {username: string, password: string}) {
    return this.request('POST', '/register', credentials);
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

  isLoggedIn(): boolean {
    return this.getAuthToken() !== null;
  }

  logout(): void {
    this.setAuthToken(null);
  }

  request(method: string, url: string, data: any): Promise<any> {
    let headers: Record<string, string> = {};

    if (this.getAuthToken() !== null) {
      headers["Authorization"] = "Bearer " + this.getAuthToken();
    }

    return axios({
      method: method,
      url: url,
      data: data,
      headers: headers
    });
  }

  async isTokenValid(): Promise<boolean> {
    try {
      const response = await this.request('GET', '/validate-token', null);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async getToDosByUser(): Promise<AxiosResponse> {
    return this.request('GET', '/todos/user', null);
  }

  async createToDo(todo: ToDo): Promise<AxiosResponse> {
    return this.request('POST', '/todos/add', todo);
  }

  async deleteToDo(id: number): Promise<AxiosResponse> {
    return this.request('DELETE', `/todos/delete/${id}`, null);
  }

  async updateToDo(id: number, updatedToDo: ToDo): Promise<AxiosResponse> {
    return this.request('PUT', `/todos/update/${id}`, updatedToDo);
  }

  async getCoursesByUser(): Promise<AxiosResponse> {
    return this.request('GET', '/courses/get', null);
  }

  async createCourse(course: Course): Promise<AxiosResponse> {
    return this.request('POST', '/courses/add', course);
  }

  async deleteCourse(id: number): Promise<AxiosResponse> {
    return this.request('DELETE', `/courses/delete/${id}`, null);
  }

  async updateCourse(id: number, updatedCourse: Course): Promise<AxiosResponse> {
    return this.request('PUT', `/courses/update/${id}`, updatedCourse);
  }
}
