import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-left-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './left-panel.html',
  styleUrl: './left-panel.css'
})
export class LeftPanel {
  private router = inject(Router);
  isOpen = signal(false);

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
