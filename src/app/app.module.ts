import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {TodoComponent} from './todo/todo.component';
import {NotesComponent} from './notes/notes.component';
import {CourseComponent} from './course/course.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {RegisterComponent} from './register/register.component';
import {TodoDialogComponent} from './todo-dialog/todo-dialog.component';

import {AxiosService} from './axios.service';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule} from '@angular/material/core';
import {NoteDialogComponent} from './note-dialog/note-dialog.component';
import {CourseDialogComponent} from "./course-dialog/course-dialog.component";
import {ConfirmDeleteDialogComponent} from './confirm-delete-dialog/confirm-delete-dialog.component';
import {SubtaskComponent} from './subtask/subtask.component';
import {TokenInterceptor} from "./TokenInterceptor";
import {SimpleNotificationsModule} from "angular2-notifications";
import {CompletedCoursesDialogComponent} from './completed-courses-dialog/completed-courses-dialog.component';
import {CompletedToDosDialogComponent} from './completed-to-dos-dialog/completed-to-dos-dialog.component';
import {CalendarComponent} from './calendar/calendar.component';
import {CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/moment";
import { GradeAverageComponent } from './grade-average/grade-average.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TodoComponent,
    NotesComponent,
    CourseComponent,
    DashboardComponent,
    RegisterComponent,
    TodoDialogComponent,
    NoteDialogComponent,
    CourseDialogComponent,
    ConfirmDeleteDialogComponent,
    SubtaskComponent,
    CompletedCoursesDialogComponent,
    CompletedToDosDialogComponent,
    CalendarComponent,
    GradeAverageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule,
    SimpleNotificationsModule.forRoot(),
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [AxiosService, provideAnimationsAsync(), {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
