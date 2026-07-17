import { Component, signal, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User, UserService } from './core/services/user';
import { ImageUploadComponent } from './components/image-upload/image-upload';
import { LeftPanel } from './components/left-panel/left-panel';

@Component({
  selector: 'app-root',
   standalone: true,
  imports: [RouterOutlet, CommonModule, ImageUploadComponent, LeftPanel],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private userService = inject(UserService);
  leftPanel = viewChild(LeftPanel);

  protected readonly title = signal('seat-ui');
   users: User[] = [];

    ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        console.log(data);
        this.users = data;
      },
      error: (err) => console.error(err)
    });
  }

  toggleMenu() {
    this.leftPanel()?.toggle();
  }
}
