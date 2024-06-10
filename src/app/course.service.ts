import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor() { }

  grandeChanged = new Subject<void>();
  colorChanged = new Subject<void>();
}
