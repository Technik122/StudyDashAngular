import { Component } from '@angular/core';
import { AxiosService } from "../axios.service";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

  componentToShow: string = "welcome";

  constructor(private axiosService: AxiosService) {}

  showComponent(componentToShow: string) : void {
    this.componentToShow = componentToShow;
  }

  onLogin(input: any): void {
    this.axiosService.request(
      "POST",
      "/login",
      {
        username: input.username,
        password: input.password
      }
    ).then(response => {
      this.axiosService.setAuthToken(response.data.token);
      this.componentToShow = "messages";
    });

  }

  onRegister(input: any): void {
    this.axiosService.request(
      "POST",
      "/register",
      {
        username: input.username,
        password: input.password
      }
    ).then(response => {
      this.axiosService.setAuthToken(response.data.token);
      this.componentToShow = "messages";
    });
  }
}
