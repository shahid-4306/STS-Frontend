import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Advance } from '../models';

@Injectable({ providedIn: 'root' })
export class AdvanceService {
  private baseUrl = `${environment.apiUrl}/advances`;

  constructor(private http: HttpClient) {}

  list(customerId?: string): Observable<ApiResponse<Advance[]>> {
    return this.http.get<ApiResponse<Advance[]>>(this.baseUrl, {
      params: customerId ? { customerId } : {},
    });
  }

  create(payload: { customerId: string; amount: number; date: string }): Observable<ApiResponse<Advance>> {
    return this.http.post<ApiResponse<Advance>>(this.baseUrl, payload);
  }
}
