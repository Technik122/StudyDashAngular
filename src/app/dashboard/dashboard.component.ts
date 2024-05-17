import {Component, OnInit} from '@angular/core';
import {AxiosService} from "../axios.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent{

  constructor(private axiosService: AxiosService, private router: Router) {}

  async logout() {
    this.axiosService.logout();
    await this.router.navigate(['/login']);
  }
}
