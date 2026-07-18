import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private token: string | null = null;

  constructor() {
    // Check for existing session on initialization
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('authToken');
    if (savedUser && savedToken) {
      try {
        this.currentUser = JSON.parse(savedUser);
        this.token = savedToken;
      } catch (e) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
      }
    }
  }

  login(user: User): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  loginWithToken(user: User, token: string): void {
    this.currentUser = user;
    this.token = token;
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('authToken', token);
  }

  logout(): void {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getToken(): string | null {
    return this.token;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null && this.token !== null;
  }

  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }
}
