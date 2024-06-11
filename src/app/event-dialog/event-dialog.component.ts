// event-dialog.component.ts
import {Component, Inject, OnInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Event} from "../event";
import {AxiosService} from "../axios.service";

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent implements OnInit {
  eventForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      color: string;
      date: string, event: Event, isEdit: boolean},
    private formBuilder: FormBuilder,
    private axiosService: AxiosService
  ) {
    this.eventForm = this.formBuilder.group({
      date: [data.date, Validators.required],
      name: [data.event?.name, Validators.required],
      color: [data.color || '']
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.data.isEdit) {
      this.eventForm.patchValue({
        name: this.data.event.name,
        color: this.data.event.color
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async addUpdateEvent(): Promise<void> {
    if (this.eventForm.valid) {
      if (this.data.isEdit && this.data.event.id) {
        await this.axiosService.updateEvent(this.data.event.id, this.eventForm.value);
      } else {
        await this.axiosService.createEvent(this.eventForm.value);
      }
      this.dialogRef.close(this.eventForm.value);
    }
  }

  async deleteEvent(): Promise<void> {
    if (this.data.isEdit && this.data.event.id) {
      await this.axiosService.deleteEvent(this.data.event.id);
    }
    this.dialogRef.close({delete: true, event: this.data});
  }
}
