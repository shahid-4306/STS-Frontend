import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, InvoiceImage } from '../models';

@Injectable({ providedIn: 'root' })
export class InvoiceImageService {
  private billsUrl = `${environment.apiUrl}/bills`;
  private imagesUrl = `${environment.apiUrl}/invoice-images`;

  constructor(private http: HttpClient) {}

  /** Persists a downloaded invoice snapshot (base64 PNG/JPEG data URI) against its bill. */
  save(billId: string, fileName: string, imageBase64: string): Observable<ApiResponse<InvoiceImage>> {
    return this.http.post<ApiResponse<InvoiceImage>>(`${this.billsUrl}/${billId}/invoice-images`, {
      fileName,
      imageBase64,
      contentType: 'image/png',
    });
  }

  /** Lightweight metadata list (with download URL) of images saved for a bill. */
  listForBill(billId: string): Observable<ApiResponse<InvoiceImage[]>> {
    return this.http.get<ApiResponse<InvoiceImage[]>>(`${this.billsUrl}/${billId}/invoice-images`);
  }

  /** Fetches one saved image's metadata (including its download URL). */
  get(imageId: string): Observable<ApiResponse<InvoiceImage>> {
    return this.http.get<ApiResponse<InvoiceImage>>(`${this.imagesUrl}/${imageId}`);
  }

  /** Resolves a relative /uploads/... URL returned by the API into an absolute, fetchable URL. */
  toAbsoluteUrl(relativeUrl: string): string {
    if (!relativeUrl) return '';
    if (/^https?:\/\//i.test(relativeUrl)) return relativeUrl;
    return `${environment.assetsOrigin}${relativeUrl}`;
  }
}
