import { Component, signal, inject, viewChild } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User, UserService } from './core/services/user';
import { AuthService } from './core/services/auth';
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
  private authService = inject(AuthService);
  private router = inject(Router);
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

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get currentUser(): User | null {
    return this.authService.getCurrentUser();
  }

  toggleMenu() {
    this.leftPanel()?.toggle();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
