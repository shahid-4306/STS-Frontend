import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Payment } from '../models';

export interface CollectPaymentPayload {
  billId: string;
  amount: number;
  method: string;
  remarks: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private baseUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  list(params: { q?: string; date?: string; customerId?: string } = {}): Observable<ApiResponse<Payment[]>> {
    const query: any = {};
    if (params.q) query.q = params.q;
    if (params.date) query.date = params.date;
    if (params.customerId) query.customerId = params.customerId;
    return this.http.get<ApiResponse<Payment[]>>(this.baseUrl, { params: query });
  }

  collect(payload: CollectPaymentPayload): Observable<ApiResponse<{ payment: Payment; bill: any }>> {
    return this.http.post<ApiResponse<{ payment: Payment; bill: any }>>(`${this.baseUrl}/collect`, payload);
  }
}
