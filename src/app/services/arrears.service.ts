import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Arrears } from '../models';

@Injectable({ providedIn: 'root' })
export class ArrearsService {
  private baseUrl = `${environment.apiUrl}/arrears`;

  constructor(private http: HttpClient) {}

  list(customerId?: string): Observable<ApiResponse<Arrears[]>> {
    return this.http.get<ApiResponse<Arrears[]>>(this.baseUrl, {
      params: customerId ? { customerId } : {},
    });
  }

  get(id: string): Observable<ApiResponse<Arrears>> {
    return this.http.get<ApiResponse<Arrears>>(`${this.baseUrl}/${id}`);
  }

  create(payload: { customerId: string; amount: number; date: string; remarks?: string }): Observable<ApiResponse<Arrears>> {
    return this.http.post<ApiResponse<Arrears>>(this.baseUrl, payload);
  }

  update(id: string, payload: { amount?: number; date?: string; remarks?: string }): Observable<ApiResponse<Arrears>> {
    return this.http.put<ApiResponse<Arrears>>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }
}
