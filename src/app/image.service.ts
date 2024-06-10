import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly IMAGE_KEY = 'selectedImage';

  saveImage(image: string) {
    localStorage.setItem(this.IMAGE_KEY, image);
  }

  getImage(): string | null {
    return localStorage.getItem(this.IMAGE_KEY);
  }
}
