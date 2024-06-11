import {Component, OnInit} from '@angular/core';
import {AxiosService} from "../axios.service";
import {NotificationsService} from "angular2-notifications";
import {CourseService} from "../course.service";

@Component({
  selector: 'app-grade-average',
  templateUrl: './grade-average.component.html',
  styleUrl: './grade-average.component.css'
})
export class GradeAverageComponent implements OnInit {
  averageGrade: number;
  message: string;

  constructor(private axiosService: AxiosService, private notificationsService: NotificationsService, private gradeService: CourseService) {
    this.averageGrade = 0;
    this.message = '';

    this.gradeService.grandeChanged.subscribe(() => {
      this.refreshGrade();
    })
  }

  async ngOnInit() {
    await this.calculateAverageGrade();
  }

  async calculateAverageGrade() {
    const response = await this.axiosService.getCoursesByUser();
    const courses = response.data;
    let totalGrade = 0;
    let count = 0;

    for (const course of courses) {
      if (course.grade) {
        totalGrade += course.grade;
        count++;
      }
    }
    this.averageGrade = parseFloat((totalGrade / count).toFixed(2));
    this.generateMessage();
  }

  refreshGrade() {
    this.calculateAverageGrade();
    this.generateMessage()
  }

  generateMessage() {
    if (this.averageGrade < 1.0) {
      this.message = "Ausgezeichnet! Weiter so!";
    } else if (this.averageGrade < 2.9) {
      this.message = "Sehr gut! Du machst das großartig!";
    } else if (this.averageGrade < 3.9) {
      this.message = "Gut gemacht! Aber es gibt immer Raum für Verbesserungen.";
    } else if (this.averageGrade < 4.9) {
      this.message = "Nicht schlecht, aber du kannst es besser!";
    } else if (this.averageGrade < 5.9) {
      this.message = "Es ist Zeit, sich mehr anzustrengen. Du kannst es schaffen!";
    } else {
      this.message = "Noch keine Noten vorhanden. Füge ein paar hinzu!";
    }
  }

}
