import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-consent-dialog',
  templateUrl: './consent-dialog.component.html',
})
export class ConsentDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConsentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

}
