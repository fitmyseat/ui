import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserService } from '../../core/services/user';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
  private userService = inject(UserService);
  
  users: User[] = [];

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        console.log('Users:', data);
        this.users = data;
      },
      error: (err: any) => console.error('Error loading users:', err)
    });
  }
}
