import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AxiosService} from "./axios.service";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private axiosService: AxiosService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    if (!this.axiosService.isLoggedIn()) {
      await this.router.navigate(['/login']);
      return false;
    }

    const isValid = await this.axiosService.isTokenValid();
    if (!isValid) {
      await this.router.navigate(['/login']);
    }
    return isValid;
  }
}
