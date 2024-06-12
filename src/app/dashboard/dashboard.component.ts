import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '../image.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageSelectionComponent } from '../image-selection/image-selection.component';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  headerImage: string | null = null;

  constructor(
    private router: Router,
    private imageService: ImageService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    const savedImage = this.imageService.getImage();
    if (savedImage) {
      this.headerImage = savedImage;
    } else {
      this.headerImage = 'assets/leafs_standard.jpg';
    }
  }

  async logout() {
    await this.router.navigate(['/login']);
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      if (reader.error) {
        this.showErrorMessage('Fehler beim Laden des Bildes. Bitte versuche es erneut.');
        return;
      }

      const base64String = reader.result as string;

      try {
        this.imageService.saveImage(base64String);
        this.headerImage = base64String;
        this.cdr.detectChanges();
      } catch (e) {
        this.showErrorMessage('Das Bild ist zu groß, um im lokalen Speicher gespeichert zu werden. Bitte wähle ein kleineres Bild (bis zu 5MB).');
      }
    };

    reader.onerror = () => {
      this.showErrorMessage('Fehler beim Laden des Bildes. Bitte versuche es erneut.');
    };

    if (file.size > 5000000) { // 5MB limit
      this.showErrorMessage('Das Bild ist zu groß, um im lokalen Speicher gespeichert zu werden. Bitte wähle ein kleineres Bild (bis zu 5MB).');
      return;
    }

    reader.readAsDataURL(file);
  }

  triggerFileInput() {
    document.getElementById('fileInput')?.click();
  }

  openImageSelectionModal() {
    const dialogRef = this.dialog.open(ImageSelectionComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(image => {
      if (image) {
        this.imageService.saveImage(image);
        this.headerImage = image;
        this.cdr.detectChanges();
      }
    });
  }

  showErrorMessage(message: string) {
    this.snackBar.open(message, 'Schließen', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  async deleteAccount() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '600px'
    });

    const result = await dialogRef.afterClosed().toPromise();

    if (result) {
      try {
        //await this.accountService.deleteAccount();
        // Navigate to login or another appropriate page after successful deletion
        //this.router.navigate(['/login']);
      } catch (error) {
        // Handle error, e.g. show a message to the user
        console.error('Error deleting account', error);
      }
    }
  }
}
