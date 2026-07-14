import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  private apiUrl = 'https://backend-xk4q.onrender.com/api/users';

  //private apiUrl = 'http://localhost:8080/api/users';
  

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}