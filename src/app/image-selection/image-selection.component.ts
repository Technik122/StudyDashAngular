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
    'assets/leafs_standard.jpg',
    'assets/grass_standard.jpg',
    'assets/moon_standard.jpg',
    'assets/puddle_standard.jpg',
    'assets/sea_standard.jpg',
    'assets/elbphilharmonie_standard.jpg',
  ];

  constructor(private dialogRef: MatDialogRef<ImageSelectionComponent>) {}

  selectImage(image: string) {
    this.imageSelected.emit(image);
    this.dialogRef.close(image);
  }

  closeImageSelection() {
    this.dialogRef.close();
  }
}
