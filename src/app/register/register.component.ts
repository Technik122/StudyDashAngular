import {Component, EventEmitter, Output} from '@angular/core';
import {AxiosService} from "../axios.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @Output() onSubmitRegisterEvent = new EventEmitter();

  constructor(private axiosService: AxiosService, private router: Router) {}

  username: string = "";
  password: string = "";

  onSubmitRegister(): void {
    this.axiosService.register({"username": this.username, "password": this.password }).then((response) => {
      console.log(response);
      this.onSubmitRegisterEvent.emit(response);
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error(error);
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
