import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css'
})
export class ImageUploadComponent {

  selectedFile!: File;

  imageUrl = '';

  @ViewChild('cameraInput') cameraInput!: ElementRef<HTMLInputElement>;

  constructor(private imageService: ImageService) {}

  triggerCamera() {
    if (this.cameraInput) {
      this.cameraInput.nativeElement.click();
    }
  }

  onFileSelected(event: Event) {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }

  }

  upload() {

    this.imageService.upload(this.selectedFile).subscribe({

      next: (response: any) => {

        console.log(response);

        this.imageUrl = response.secure_url;

      },

      error: (error) => {

        console.error(error);

      }

    });

  }

}