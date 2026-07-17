import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: number;
  vehicle_name: string;
  model?: string;
  color?: string;
  stitch?: string;
  quantity: number;
  price?: number;
  image_url: string;
  cloudinary_public_id?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);

  // Using relative path for Angular proxy to handle CORS
  private apiUrl = '/api/products';
  
  // PROD API URL (use without proxy)
  // private apiUrl = 'https://backend-xk4q.onrender.com/api/products';
  
  // Local API URL (use without proxy)
  // private apiUrl = 'http://localhost:8080/api/products';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    console.log('Sending to backend:', JSON.stringify(product, null, 2));
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    console.log('Updating product:', JSON.stringify(product, null, 2));
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
