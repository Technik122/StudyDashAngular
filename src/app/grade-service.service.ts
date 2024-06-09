import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GradeServiceService {
  constructor() { }

  grandeChanged = new Subject<void>();
}
