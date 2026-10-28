import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Admin, ApiResponse } from '../models';

const TOKEN_KEY = 'millstone_token';
const ADMIN_KEY = 'millstone_admin';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;
  currentAdmin = signal<Admin | null>(this.readAdmin());

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<ApiResponse<{ token: string; admin: Admin }>> {
    return this.http.post<ApiResponse<{ token: string; admin: Admin }>>(`${this.baseUrl}/login`, {
      email,
      password,
    }).pipe(
      tap((res) => {
        if (res.success) {
          localStorage.setItem(TOKEN_KEY, res.data.token);
          localStorage.setItem(ADMIN_KEY, JSON.stringify(res.data.admin));
          this.currentAdmin.set(res.data.admin);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
    this.currentAdmin.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private readAdmin(): Admin | null {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
