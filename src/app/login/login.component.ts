import {Component, EventEmitter, Output} from '@angular/core';
import {AxiosService} from "../axios.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() onSubmitLoginEvent = new EventEmitter();

  constructor(private axiosService: AxiosService, private router: Router) {}

  username: string = "";
  password: string = "";

  onSubmitLogin(): void {
    this.axiosService.login({"username": this.username, "password": this.password}).then((response) => {
      localStorage.setItem('auth_token', response.data.token);
      this.onSubmitLoginEvent.emit(response);
      this.router.navigate(['/dashboard']);
    }).catch((error) => {
      console.error(error);
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
