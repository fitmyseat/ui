import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private api = 'https://backend-xk4q.onrender.com/api/images';

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<any> {

    const formData = new FormData();

    formData.append('file', file);

    return this.http.post(`${this.api}/upload`, formData);
  }
}