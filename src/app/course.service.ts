import {EventEmitter, Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor() { }

  gradeChanged = new Subject<void>();
  colorChanged = new Subject<void>();

  courseAdded = new EventEmitter<void>();
  courseChanged = new EventEmitter<void>();
  courseDeleted = new EventEmitter<void>();
}
