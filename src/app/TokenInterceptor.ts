import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AxiosService} from "./axios.service";
import {catchError, from, Observable, switchMap, throwError} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private axiosService: AxiosService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    return from(this.axiosService.refreshToken()).pipe(
      switchMap((token: string) => {
        const newRequest = request.clone({setHeaders: {Authorization: `Bearer ${token}`}});
        return next.handle(newRequest);
      })
    );
  }
}
