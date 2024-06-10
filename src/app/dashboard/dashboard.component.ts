import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '../image.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageSelectionComponent } from '../image-selection/image-selection.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  headerImage: string | null = null;

  constructor(private router: Router, private imageService: ImageService, private cdr: ChangeDetectorRef, private dialog: MatDialog) {
    const savedImage = this.imageService.getImage();
    if (savedImage) {
      this.headerImage = savedImage;
    } else {
      this.headerImage = 'assets/plants_standard.jpg';
    }
  }

  async logout() {
    await this.router.navigate(['/login']);
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result as string;
      this.imageService.saveImage(base64String);
      this.headerImage = base64String;
      this.cdr.detectChanges();
    };

    reader.readAsDataURL(file);
  }

  triggerFileInput() {
    document.getElementById('fileInput')?.click();
  }

  removeImage() {
    this.imageService.saveImage('');
    this.headerImage = 'assets/plants_standard.jpg';
    this.cdr.detectChanges();
  }

  openImageSelectionModal() {
    const dialogRef = this.dialog.open(ImageSelectionComponent);

    dialogRef.afterClosed().subscribe(image => {
      if (image) {
        this.imageService.saveImage(image);
        this.headerImage = image;
        this.cdr.detectChanges();
      } else {
        this.triggerFileInput();
      }
    });
  }
}
