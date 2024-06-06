import { Component } from '@angular/core';
import {AxiosService} from "./axios.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private axiosService: AxiosService, private router: Router) {}

  async ngOnInit() {
    if (this.axiosService.isLoggedIn()) {
      const isValid = await this.axiosService.isTokenValid();
      if (isValid) {
        await this.router.navigate(['/dashboard']);
      } else {
        await this.router.navigate(['/login']);
      }
    } else {
      await this.router.navigate(['/login']);
    }
  }
}
