import {Component, OnInit} from '@angular/core';
import {AxiosService} from "../axios.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  location: string = 'Hamburg';
  weatherWidgetUrl: string = 'https://forecast7.com/de/53d559d99/hamburg/';

  constructor(private axiosService: AxiosService, private router: Router) {}

  ngOnInit() {
    this.loadWeatherWidgetScript();
  }

  async logout() {
    this.axiosService.logout();
    await this.router.navigate(['/login']);
  }

  loadWeatherWidgetScript() {
    const script = document.createElement('script');
    script.id = 'weatherwidget-io-js';
    script.src = 'https://weatherwidget.io/js/widget.min.js';
    document.head.appendChild(script);
  }

  updateWeatherWidget() {
    // Update the weather widget URL based on the input location
    this.weatherWidgetUrl = `https://forecast7.com/de/53d559d99/${this.location.replace(' ', '').toLowerCase()}/`;

    // Reload the weather widget script to apply changes
    this.loadWeatherWidgetScript();
  }
}
