import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Bill, Payment, Advance, Customer } from '../models';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private baseUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  sales(period: string): Observable<ApiResponse<{ bills: Bill[]; total: number }>> {
    return this.http.get<ApiResponse<{ bills: Bill[]; total: number }>>(`${this.baseUrl}/sales`, {
      params: { period },
    });
  }

  ledger(customerId: string): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/ledger`, { params: { customerId } });
  }

  outstanding(): Observable<ApiResponse<{ customer: Customer; due: number }[]>> {
    return this.http.get<ApiResponse<{ customer: Customer; due: number }[]>>(`${this.baseUrl}/outstanding`);
  }

  products(): Observable<ApiResponse<{ name: string; packets: number; total: number }[]>> {
    return this.http.get<ApiResponse<{ name: string; packets: number; total: number }[]>>(
      `${this.baseUrl}/products`
    );
  }

  payments(): Observable<ApiResponse<{ payments: Payment[]; total: number }>> {
    return this.http.get<ApiResponse<{ payments: Payment[]; total: number }>>(`${this.baseUrl}/payments`);
  }

  advances(): Observable<ApiResponse<Advance[]>> {
    return this.http.get<ApiResponse<Advance[]>>(`${this.baseUrl}/advances`);
  }
}
