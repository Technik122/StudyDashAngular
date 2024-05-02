import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Output() onSubmitLoginEvent = new EventEmitter();
  @Output() onSubmitRegisterEvent = new EventEmitter();

  active: string = "login";
  username: string = "";
  password: string = "";

  onLoginTab(): void {
    this.active = "login";
  }

  onRegisterTab(): void {
    this.active = "register";
  }

  onSubmitLogin(): void {
    this.onSubmitLoginEvent.emit({"username": this.username, "password": this.password });
  }

  onSubmitRegister(): void {
    this.onSubmitRegisterEvent.emit({"username": this.username, "password": this.password });
  }
}
