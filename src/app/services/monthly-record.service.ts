import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, MonthlyRecordDetail, MonthlyRecordList } from '../models';

export function currentMonthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
export function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  if (!y || !m) return key;
  return new Date(y, m - 1, 1).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
}

@Injectable({ providedIn: 'root' })
export class MonthlyRecordService {
  private baseUrl = `${environment.apiUrl}/monthly-records`;
  constructor(private http: HttpClient) {}
  private tz(): string {
    return String(new Date().getTimezoneOffset());
  }

  months(): Observable<
    ApiResponse<{ currentMonth: string; months: { key: string }[] }>
  > {
    return this.http.get<
      ApiResponse<{ currentMonth: string; months: { key: string }[] }>
    >(`${this.baseUrl}/months`, { params: { tzOffset: this.tz() } });
  }
  list(month: string): Observable<ApiResponse<MonthlyRecordList>> {
    return this.http.get<ApiResponse<MonthlyRecordList>>(this.baseUrl, {
      params: { month, tzOffset: this.tz() },
    });
  }
  get(id: string): Observable<ApiResponse<MonthlyRecordDetail>> {
    return this.http.get<ApiResponse<MonthlyRecordDetail>>(
      `${this.baseUrl}/${id}`,
      { params: { tzOffset: this.tz() } },
    );
  }
  delete(
    id: string,
  ): Observable<ApiResponse<{ id: string; monthKey: string }>> {
    return this.http.delete<ApiResponse<{ id: string; monthKey: string }>>(
      `${this.baseUrl}/${id}`,
    );
  }
  exportExcel(month: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.baseUrl}/export`, {
      params: { month, tzOffset: this.tz() },
      responseType: 'blob',
      observe: 'response',
    });
  }
}
