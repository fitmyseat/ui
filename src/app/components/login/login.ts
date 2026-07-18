import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User, LoginRequest } from '../../core/services/user';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  username: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  login() {
    if (!this.username || !this.password) {
      this.error = 'Please enter username and password';
      return;
    }

    this.loading = true;
    this.error = '';

    const credentials: LoginRequest = {
      username: this.username,
      password: this.password
    };

    this.userService.login(credentials).subscribe({
      next: (response) => {
        // Store user and token in AuthService
        this.authService.loginWithToken(response.user, response.token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error during login:', err);
        this.error = 'Invalid username or password';
        this.loading = false;
      }
    });
  }
}
