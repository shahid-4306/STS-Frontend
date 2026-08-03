import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Customer, Product, Bill } from '../models';

export interface SearchResults {
  customers: Customer[];
  products: Product[];
  bills: Bill[];
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private baseUrl = `${environment.apiUrl}/search`;

  constructor(private http: HttpClient) {}

  search(q: string): Observable<ApiResponse<SearchResults>> {
    return this.http.get<ApiResponse<SearchResults>>(this.baseUrl, { params: { q } });
  }
}
