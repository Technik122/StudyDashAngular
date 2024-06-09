import {Component, OnInit} from '@angular/core';
import {AxiosService} from "../axios.service";
import {NotificationsService} from "angular2-notifications";
import {GradeServiceService} from "../grade-service.service";

@Component({
  selector: 'app-grade-average',
  templateUrl: './grade-average.component.html',
  styleUrl: './grade-average.component.css'
})
export class GradeAverageComponent implements OnInit {
  averageGrade: number;
  message: string;

  constructor(private axiosService: AxiosService, private notificationsService: NotificationsService, private gradeService: GradeServiceService) {
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
    if (this.averageGrade < 3.0) {
      this.message = "Weiter so!";
    } else {
      this.message = "Du kannst es besser!";
    }
  }

}
