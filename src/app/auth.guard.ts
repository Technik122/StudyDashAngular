import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AxiosService } from "./axios.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private axiosService: AxiosService, private router: Router) {}

  canActivate(): boolean {
    if (this.axiosService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
