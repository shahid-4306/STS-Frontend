import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Bill } from '../models';

export interface BillPayload {
  customerId: string;
  biltiNumber: string;
  driverName: string;
  driverPhone: string;
  date: string;
  items: { productId: string; packets: number }[];
  discount: number;
  deliveryCharges: number;
  rentCharges: number;
  extraCharges: number;
  advanceUsed: number;
  receivedAmount: number;
  paymentMethod: string;
  remarks: string;
}

export interface BillingContext {
  previousArrears: number;
  availableAdvance: number;
}

@Injectable({ providedIn: 'root' })
export class BillService {
  private baseUrl = `${environment.apiUrl}/bills`;

  constructor(private http: HttpClient) {}

  list(params: { customerId?: string; status?: string; q?: string } = {}): Observable<ApiResponse<Bill[]>> {
    const query: any = {};
    if (params.customerId) query.customerId = params.customerId;
    if (params.status) query.status = params.status;
    if (params.q) query.q = params.q;
    return this.http.get<ApiResponse<Bill[]>>(this.baseUrl, { params: query });
  }

  get(id: string): Observable<ApiResponse<Bill>> {
    return this.http.get<ApiResponse<Bill>>(`${this.baseUrl}/${id}`);
  }

  create(payload: BillPayload): Observable<ApiResponse<Bill>> {
    return this.http.post<ApiResponse<Bill>>(this.baseUrl, payload);
  }

  update(id: string, payload: BillPayload): Observable<ApiResponse<Bill>> {
    return this.http.put<ApiResponse<Bill>>(`${this.baseUrl}/${id}`, payload);
  }

  /**
   * @param excludeBillId When editing an existing bill, pass its id so the
   * returned previousArrears excludes it and availableAdvance includes what
   * it would refund — giving an accurate editable ceiling.
   */
  getBillingContext(customerId: string, excludeBillId?: string): Observable<ApiResponse<BillingContext>> {
    const params: any = {};
    if (excludeBillId) params.excludeBillId = excludeBillId;
    return this.http.get<ApiResponse<BillingContext>>(`${this.baseUrl}/context/${customerId}`, { params });
  }
}
