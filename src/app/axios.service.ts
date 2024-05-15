import { Injectable } from '@angular/core';
import axios from 'axios';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AxiosService {

  constructor() {
    axios.defaults.baseURL = "http://localhost:8080"
    axios.defaults.headers.post["Content-Type"] = "application/json"
  }

  login(credentials: {username: string, password: string}) {
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
}
