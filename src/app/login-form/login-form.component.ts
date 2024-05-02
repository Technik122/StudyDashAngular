import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
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
