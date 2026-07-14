import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User, UserService } from './core/services/user';

@Component({
  selector: 'app-root',
   standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private userService = inject(UserService);

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
}
