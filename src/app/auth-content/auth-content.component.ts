import { Component, OnInit } from '@angular/core';
import { AxiosService } from "../axios.service";

@Component({
  selector: 'app-auth-content',
  templateUrl: './auth-content.component.html',
  styleUrl: './auth-content.component.css'
})
export class AuthContentComponent implements OnInit {
  data: string[] = [];

  constructor(private axiosService: AxiosService) { }

  ngOnInit(): void {
    this.axiosService.request(
      "GET",
      "/messages",
      {}
    ).then(
      (response) => this.data = response.data
    );
  }



}
