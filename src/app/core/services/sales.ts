import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Sale {
  id?: number;
  sale_date?: string;
  party_name: string;
  vehicle_name: string;
  model?: string;
  color?: string;
  stitch?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  payment_mode: string;
  mobile_number?: string;
  address?: string;
  remarks?: string;
  product_id?: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/sales`;

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl);
  }

  getSaleById(id: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/${id}`);
  }

  getSalesByDateRange(startDate: string, endDate: string): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/date-range?start=${startDate}&end=${endDate}`);
  }

  createSale(sale: Sale): Observable<Sale> {
    console.log('Creating sale:', JSON.stringify(sale, null, 2));
    return this.http.post<Sale>(this.apiUrl, sale);
  }

  updateSale(id: number, sale: Sale): Observable<Sale> {
    console.log('Updating sale:', JSON.stringify(sale, null, 2));
    return this.http.put<Sale>(`${this.apiUrl}/${id}`, sale);
  }

  deleteSale(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
