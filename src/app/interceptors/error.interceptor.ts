import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);
  const auth = inject(AuthService);

  const isLoginRequest = req.url.includes('/auth/login');

  return next(req).pipe(
    catchError((err) => {
      const message = err?.error?.message || 'Something went wrong. Please try again.';
      if (err.status === 401 && isLoginRequest) {
        // Let the login component surface its own inline error message.
      } else if (err.status === 401) {
        toast.error('Session expired. Please log in again.');
        auth.logout();
        router.navigate(['/login']);
      } else if (err.status === 0) {
        toast.error('Cannot reach the server. Check your connection and API URL.');
      } else {
        toast.error(message);
      }
      return throwError(() => err);
    })
  );
};
