import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {EventDialogComponent} from '../event-dialog/event-dialog.component';
import {MatCalendar, MatCalendarCellCssClasses} from "@angular/material/datepicker";
import {AxiosService} from "../axios.service";
import {Event} from "../event";
import {Course} from "../course";
import {CourseService} from "../course.service";
import {BehaviorSubject, combineLatest, map} from "rxjs";

@Component({
  selector: 'app-calendar-widget',
  templateUrl: './calendar-widget.component.html',
  styleUrl: './calendar-widget.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CalendarWidgetComponent implements OnInit {
  selectedDate: Date | null = null;
  events: Event[] = [];
  courses: Course[] = [];
  private courseColorClasses = new Map<string, string>();
  private eventColorClasses = new Map<string, string>();
  events$ = new BehaviorSubject<Event[]>([]);
  courses$ = new BehaviorSubject<Course[]>([]);

  generateCourseColorClasses() {
    this.courses.forEach(course => {
      const colorClass = `event-color-${course.id}`;
      this.courseColorClasses.set(course.id, colorClass);

      const styleElement = document.createElement('style');
      styleElement.textContent = `
      .${colorClass} .mat-calendar-body-cell-content {
        background-color: ${course.color} !important;
      }`;
      document.head.appendChild(styleElement);
    });
  }

  generateEventColorClasses() {
    this.events.forEach(event => {
      const colorClass = `event-color-${event.id}`;
      if (event.id) {
        this.eventColorClasses.set(event.id, colorClass);
      }
      const styleElement = document.createElement('style');
      styleElement.textContent = `
      .${colorClass} .mat-calendar-body-cell-content {
        background-color: ${event.color} !important;
      }
    `;
      document.head.appendChild(styleElement);
    });
  }

  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;

  constructor(public dialog: MatDialog, private axiosService: AxiosService, private courseService: CourseService) {
  }

  async ngOnInit() {
    await this.fetchEvents();



    this.courseService.courseAdded.subscribe(async () => {
      await this.fetchEvents();
    });

    this.courseService.courseChanged.subscribe(async () => {
      await this.fetchEvents();
    });

    this.courseService.courseDeleted.subscribe(async () => {
      await this.fetchEvents();
    });
  }

  async createCourseEvent(course: Course): Promise<void> {
    const event: Event = {
      name: `Prüfung: ${course.name}`,
      date: course.examDate,
      color: course.color
    };
    await this.axiosService.createEvent(event);
  }

  async fetchEvents() {
    // Events
    const eventResponse = await this.axiosService.getEventsByUser();
    this.events = eventResponse.data.map((event: Event) => {
      if (event.date) {
        return {
          ...event,
          date: event.date
        };
      }
      return event;
    });
    this.generateEventColorClasses();
    this.events$.next(this.events);

    // Courses
    const courseResponse = await this.axiosService.getCoursesByUser();
    this.courses = courseResponse.data.filter((course: Course) => !course.completed);
    this.generateCourseColorClasses();
    const courses = this.courses.map((course: Course) => {
      if (course.examDate) {
        this.createCourseEvent(course); // Create an event for the course's examDate
        return {
          id: course.id,
          name: `Prüfung: ${course.name}`,
          date: new Date(course.examDate).toISOString(),
          color: course.color
        };
      }
      return course;
    });

    this.courses$.next(this.courses);
    this.events = [...this.events, ...courses];
    this.calendar.updateTodaysDate();
  }

  openDialog(date: Date | null): void {
    if (date) {
      const event = this.events.find(event => {
        if (event.date) {
          const eventDate = new Date(event.date);
          return eventDate.getDate() === date.getDate() &&
            eventDate.getMonth() === date.getMonth() &&
            eventDate.getFullYear() === date.getFullYear();
        }
        return false;
      });

      const dialogRef = this.dialog.open(EventDialogComponent, {
        width: '400px',
        data: {date, event: event || new Event(undefined, undefined, date.toISOString()), isEdit: !!event}
      });

      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          await this.fetchEvents();
        }
      });
    }
  }

  dateClass() {
    return combineLatest([this.events$, this.courses$]).pipe(
      map(([events, courses]) => {
        const dateColors = new Map<string, string>();

        // Set color for course exams
        courses.forEach(course => {
          if (course.examDate) {
            const examDate = new Date(course.examDate).toISOString().split('T')[0];
            dateColors.set(examDate, this.courseColorClasses.get(course.id) || '');
          }
        });

        // Set color for events
        events.forEach(event => {
          if (event.date) {
            const eventDate = new Date(event.date).toISOString().split('T')[0];
            if (event.id) {
              dateColors.set(eventDate, this.eventColorClasses.get(event.id) || '');
            }
          }
        });

        return (date: Date, view: 'month' | 'year' | 'multi-year'): MatCalendarCellCssClasses => {
          if (view === 'month') {
            const colorDate = date.toISOString().split('T')[0];
            const colorClass = dateColors.get(colorDate);
            return colorClass || '';
          }
          return '';
        };
      })
    );
  }

  defaultDateClass = (date: Date, view: 'month' | 'year' | 'multi-year'): MatCalendarCellCssClasses => {
    return '';
  };
}
