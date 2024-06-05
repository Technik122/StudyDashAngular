import { Component, OnInit } from '@angular/core';
import { AxiosService } from "../axios.service";
import { Router } from "@angular/router";
import axios from 'axios';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  location: string = '';
  weatherWidgetUrl: string = '';
  apiKey: string = 'fd47a08e88f0d4a4f95ac90752a82759'; // Füge hier deinen API-Schlüssel ein
  weatherData: any;

  constructor(private axiosService: AxiosService, private router: Router) {}

  ngOnInit() {
    this.loadWeatherWidgetScript();
    this.loadStoredLocation();
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

  loadStoredLocation() {
    const storedLocation = localStorage.getItem('location');
    if (storedLocation) {
      this.location = storedLocation;
      this.updateWeatherWidget();
    }
  }

  updateWeatherWidget() {
    if (!this.location) {
      document.getElementById('weather')!.innerHTML = `<p>Bitte geben Sie einen Ort ein.</p>`;
      return;
    }

    // Speichere den aktuellen Ort im localStorage
    localStorage.setItem('location', this.location);

    // Update the weather widget URL based on the input location
    this.weatherWidgetUrl = `https://forecast7.com/de/53d559d99/${this.location.replace(' ', '').toLowerCase()}/`;

    // Reload the weather widget script to apply changes
    this.loadWeatherWidgetScript();

    // Fetch the weather data from OpenWeatherMap API
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.location}&appid=${this.apiKey}&units=metric`;

    axios.get(url).then(response => {
      if (response.data.cod === 200) {
        this.weatherData = response.data;
        this.displayWeatherData();
      } else {
        this.weatherData = null;
        document.getElementById('weather')!.innerHTML = `<p>Ort nicht gefunden!</p>`;
      }
    }).catch(error => {
      this.weatherData = null;
      document.getElementById('weather')!.innerHTML = `<p>Fehler beim Abrufen der Wetterdaten!</p>`;
    });
  }

  displayWeatherData() {
    if (this.weatherData) {
      const weatherIcon = this.getWeatherIcon(this.weatherData.weather[0].main);
      document.getElementById('weather')!.innerHTML = `
      <div class="weather-box">
        <h2>${this.weatherData.name}, ${this.weatherData.sys.country}</h2>
        <div class="weather-icon"><img src="${weatherIcon}" alt="Wetter Icon"></div>
        <div class="temperature">${this.weatherData.main.temp}°C</div>
        <p>${this.weatherData.weather[0].description}</p>
      </div>
    `;
    }
  }

  getWeatherIcon(main: string) {
    switch (main.toLowerCase()) {
      case 'clear':
        return '/assets/sun.png'; // Pfad zum Sonnen-Icon
      case 'clouds':
        return '/assets/cloudy.png'; // Pfad zum bewölkt-Icon
      case 'drizzle':
        return '/assets/rain.png'; // Pfad zum Schauerregen-Icon
      case 'rain':
        return '/assets/rain.png'; // Pfad zum Regen-Icon
      case 'thunderstorm':
        return '/assets/thunderstorm.png'; // Pfad zum Gewitter-Icon
      case 'snow':
        return '/assets/snow.png'; // Pfad zum Schnee-Icon
      case 'mist':
      case 'smoke':
      case 'haze':
      case 'dust':
      case 'fog':
      case 'sand':
      case 'ash':
      case 'squall':
      case 'tornado':
        return '/assets/mist.png'; // Pfad zum Nebel-Icon
      default:
        return '/assets/unknown.png'; // Pfad zum Unbekannt-Icon
    }
  }
}
