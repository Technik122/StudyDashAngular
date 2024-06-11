import {Component, OnInit} from '@angular/core';
import {AxiosService} from "./axios.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ConsentDialogComponent} from "./consent-dialog/consent-dialog.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private axiosService: AxiosService, private router: Router, public dialog: MatDialog) {}

  async ngOnInit() {
    this.dialog.open(ConsentDialogComponent, {
      width: '400px',
      data: {}
    });

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
