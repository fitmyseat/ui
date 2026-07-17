import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserService } from '../../core/services/user';
import { ImageUploadComponent } from '../image-upload/image-upload';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ImageUploadComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private userService = inject(UserService);

  users: User[] = [];

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        console.log(data);
        this.users = data;
      },
      error: (err: any) => console.error(err)
    });
  }
}
