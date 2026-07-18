import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './left-panel.html',
  styleUrl: './left-panel.css'
})
export class LeftPanel {
  private router = inject(Router);
  private authService = inject(AuthService);
  isOpen = signal(false);

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggle() {
    this.isOpen.update(value => !value);
  }

  close() {
    this.isOpen.set(false);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.close();
  }
}
