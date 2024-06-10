import { Component, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-selection',
  templateUrl: './image-selection.component.html',
  styleUrls: ['./image-selection.component.css']
})
export class ImageSelectionComponent {
  @Output() imageSelected = new EventEmitter<string>();

  images = [
    'assets/plants_standard.jpg',
    'assets/plants_standard2.jpg',
  ];

  constructor(private dialogRef: MatDialogRef<ImageSelectionComponent>) {}

  selectImage(image: string) {
    this.imageSelected.emit(image);
    this.dialogRef.close(image);
  }
}
