import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [
    `
      :host {
        display: block;
        font-family:
          'Inter',
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          Roboto,
          Helvetica,
          Arial,
          sans-serif;
      }

      /* ===== Layout ===== */
      .login-screen {
        min-height: 100vh;
        display: grid;
        grid-template-columns: 1.1fr 1fr;
      }

      /* ===== LEFT: Brand Side (Kept as you liked it) ===== */
      .brand-side {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 56px 64px;
        color: #ffffff;
        overflow: hidden;
        background:
          linear-gradient(rgba(10, 20, 35, 0.88), rgba(10, 20, 35, 0.96)),
          url('https://cdn.salla.sa/dPpwa/301720f3-8a11-48a5-87ea-26347b1b9926-1000x1000-UGhkF1JPJPJi0T7TS6X6Y8C0rhq9LA8laF9bF9Vm.jpg')
            center / cover no-repeat;
      }

      .brand-top {
        display: flex;
        align-items: center;
        gap: 16px;
        z-index: 2;
      }

      .mark {
        width: 52px;
        height: 52px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #d4a84b;
        border-radius: 50%;
        font-family: var(--font-display, sans-serif);
        font-weight: 700;
        font-size: 18px;
        color: #d4a84b;
        background: rgba(0, 0, 0, 0.4);
      }

      .brand-name {
        margin: 0;
        font-family: var(--font-display, sans-serif);
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 0.2px;
        line-height: 1.2;
      }

      .brand-tag {
        margin: 6px 0 0;
        font-size: 11px;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        color: #9ca3af;
      }

      .brand-middle {
        margin: 48px 0;
        z-index: 2;
      }

      .headline {
        margin: 0 0 16px;
        max-width: 480px;
        font-family: var(--font-display, sans-serif);
        font-size: 38px;
        line-height: 1.2;
        font-weight: 700;
      }

      .headline em {
        font-style: normal;
        color: #d4a84b;
      }

      .lead {
        margin: 0 0 36px;
        max-width: 460px;
        font-size: 15px;
        line-height: 1.6;
        color: #d1d5db;
      }

      .features {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 14px;
        max-width: 480px;
      }

      .features li {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 18px;
        font-size: 14px;
        font-weight: 500;
        background: rgba(15, 25, 40, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-left: 3px solid #d4a84b;
        border-radius: 8px;
        backdrop-filter: blur(8px);
        opacity: 0;
        transform: translateX(-10px);
        animation: slide-in 0.55s ease forwards;
      }

      .features li:nth-child(2) {
        animation-delay: 0.1s;
        border-left-color: #4ade80;
      }
      .features li:nth-child(3) {
        animation-delay: 0.2s;
      }
      .features li:nth-child(4) {
        animation-delay: 0.3s;
        border-left-color: #4ade80;
      }

      .features svg {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        color: #d4a84b;
      }
      .features li:nth-child(even) svg {
        color: #4ade80;
      }

      @keyframes slide-in {
        to {
          opacity: 1;
          transform: none;
        }
      }

      .brand-bottom {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 12px;
        color: #9ca3af;
        z-index: 2;
      }

      .brand-bottom::before {
        content: '';
        width: 28px;
        height: 4px;
        background: repeating-linear-gradient(
          90deg,
          #d4a84b 0 7px,
          transparent 7px 12px
        );
      }

      /* ===== RIGHT: Modern Form Side (Based on your screenshot) ===== */
      .form-side {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        /* Subtle grid pattern background */
        background-color: #f4f6fb;
        background-image:
          linear-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.6) 1px, transparent 1px);
        background-size: 40px 40px;
        background-position: center;
      }

      .form-card {
        width: 100%;
        max-width: 460px;
        background: #ffffff;
        border-radius: 20px;
        box-shadow:
          0 20px 40px -10px rgba(0, 0, 0, 0.05),
          0 0 20px rgba(0, 0, 0, 0.02);
        overflow: hidden;
        border: 1px solid #eef2f6;
        animation: rise 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
      }

      /* Top gradient line */
      .card-top-bar {
        height: 6px;
        background: linear-gradient(90deg, #6366f1, #3b82f6, #10b981);
      }

      .card-content {
        padding: 40px 40px 32px;
      }

      @keyframes rise {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: none;
        }
      }

      /* Badge */
      .secure-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: #ecfdf5;
        color: #059669;
        font-size: 12px;
        font-weight: 600;
        border-radius: 20px;
        margin-bottom: 24px;
        border: 1px solid #d1fae5;
      }
      .secure-badge svg {
        width: 14px;
        height: 14px;
      }

      .card-content h2 {
        margin: 0 0 8px;
        font-size: 32px;
        font-weight: 800;
        color: #111827;
        letter-spacing: -0.5px;
      }

      .card-content .sub {
        margin: 0 0 32px;
        font-size: 14px;
        color: #6b7280;
        line-height: 1.5;
      }

      /* Error Message */
      .login-error {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        margin-bottom: 24px;
        padding: 14px;
        font-size: 13px;
        color: #b91c1c;
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 10px;
        animation: shake 0.4s;
      }
      @keyframes shake {
        20%,
        60% {
          transform: translateX(-5px);
        }
        40%,
        80% {
          transform: translateX(5px);
        }
      }

      /* Form Fields */
      .form-group {
        margin-bottom: 24px;
      }

      .label-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .form-group label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #111827;
      }

      .forgot-link {
        font-size: 13px;
        font-weight: 600;
        color: #6366f1;
        text-decoration: none;
        cursor: pointer;
        transition: color 0.2s;
      }
      .forgot-link:hover {
        color: #4f46e5;
        text-decoration: underline;
      }

      .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }

      .input-icon-box {
        position: absolute;
        left: 12px;
        width: 32px;
        height: 32px;
        background: #eef2ff;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6366f1;
        pointer-events: none;
        transition: all 0.2s;
      }
      .input-icon-box svg {
        width: 18px;
        height: 18px;
      }

      .input-wrapper input {
        width: 100%;
        padding: 14px 14px 14px 56px;
        border: 1.5px solid #e5e7eb;
        border-radius: 12px;
        background: #ffffff;
        color: #111827;
        font-size: 14px;
        font-weight: 500;
        outline: none;
        transition: all 0.2s ease;
      }

      .input-wrapper input::placeholder {
        color: #9ca3af;
        font-weight: 400;
      }

      /* Focus State */
      .input-wrapper input:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
      }

      .input-wrapper input:focus + .input-icon-box {
        background: #6366f1;
        color: #ffffff;
      }

      .eye-btn {
        position: absolute;
        right: 12px;
        background: transparent;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        transition: color 0.2s;
      }
      .eye-btn:hover {
        color: #4b5563;
      }
      .eye-btn svg {
        width: 20px;
        height: 20px;
      }

      .caps-warning {
        margin-top: 6px;
        font-size: 12px;
        color: #d97706;
        font-weight: 500;
      }

      /* Submit Button */
      .submit-btn {
        width: 100%;
        padding: 16px;
        background: #6366f1; /* Indigo */
        color: #ffffff;
        border: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        margin-top: 8px;
      }

      .submit-btn:hover:not(:disabled) {
        background: #4f46e5;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
      }

      .submit-btn:active:not(:disabled) {
        transform: translateY(0);
      }

      .submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        background: #9ca3af;
        box-shadow: none;
      }

      .submit-btn svg {
        width: 18px;
        height: 18px;
      }

      .spinner {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #ffffff;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* Bottom Features Footer */
      .card-footer {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        background: #f9fafb;
        border-top: 1px solid #eef2f6;
      }

      .footer-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px 10px;
        gap: 8px;
        text-align: center;
      }

      .footer-item:not(:last-child) {
        border-right: 1px solid #eef2f6;
      }

      .footer-item svg {
        width: 20px;
        height: 20px;
        color: #6366f1;
      }

      .footer-item span {
        font-size: 11px;
        font-weight: 500;
        color: #6b7280;
      }

      /* ===== Responsive ===== */
      @media (max-width: 900px) {
        .login-screen {
          grid-template-columns: 1fr;
          grid-template-rows: auto 1fr;
        }
        .brand-side {
          padding: 40px 24px;
          min-height: 220px;
        }
        .brand-middle,
        .brand-bottom {
          display: none;
        }
        .form-side {
          padding: 24px 16px;
          align-items: flex-start;
        }
        .card-content {
          padding: 32px 24px 24px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .features li,
        .form-card,
        .login-error {
          animation: none;
        }
      }
    `,
  ],
  template: `
    <div class="login-screen">
      <!-- LEFT: business brand panel -->
      <aside class="brand-side">
        <div class="brand-top">
          <div class="mark">STS</div>
          <div>
            <h1 class="brand-name">Tanveer --- Ledger</h1>
            <p class="brand-tag">Factory Billing &amp; Customer Management</p>
          </div>
        </div>

        <div class="brand-middle">
          <h2 class="headline">
            Every bill, payment and balance — <em>in one ledger.</em>
          </h2>
          <p class="lead">
            Manage customer accounts, create and track bills, record payments
            and keep your monthly statements accurate and up to date.
          </p>
          <ul class="features">
            <li>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M6 3h9l4 4v14H6z" />
                <path d="M14 3v5h5M9 13h7M9 17h7" />
              </svg>
              Bills &amp; invoices
            </li>
            <li>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="9" cy="8" r="3.5" />
                <path
                  d="M2.5 20a6.5 6.5 0 0 1 13 0M16 5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"
                />
              </svg>
              Customer accounts &amp; ledger
            </li>
            <li>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="2.5" y="6" width="19" height="13" rx="2" />
                <path d="M2.5 10.5h19M6.5 15h3" />
              </svg>
              Payments, arrears &amp; advances
            </li>
            <li>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
              </svg>
              Monthly statements &amp; reports
            </li>
          </ul>
        </div>

        <div class="brand-bottom">Authorised administrators only</div>
      </aside>

      <!-- RIGHT: Modern Form Side -->
      <main class="form-side">
        <div class="form-card">
          <!-- Top Gradient Border -->
          <div class="card-top-bar"></div>

          <div class="card-content">
            <!-- Secure Badge -->
            <div class="secure-badge">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Secure sign-in
            </div>

            <h2>Welcome back</h2>
            <p class="sub">Enter your credentials to access your workspace.</p>

            <div class="login-error" role="alert" *ngIf="error">
              <span>⚠</span><span>{{ error }}</span>
            </div>

            <form (ngSubmit)="submit()">
              <!-- Email Field -->
              <div class="form-group">
                <label for="login-email">Email address</label>
                <div class="input-wrapper">
                  <div class="input-icon-box">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    [(ngModel)]="email"
                    name="email"
                    placeholder="you@company.com"
                    autocomplete="username"
                    required
                  />
                </div>
              </div>

              <!-- Password Field -->
              <div class="form-group">
                <div class="label-row">
                  <label for="login-password">Password</label>
                  <a class="forgot-link" (click)="forgot()">Forgot password?</a>
                </div>
                <div class="input-wrapper">
                  <div class="input-icon-box">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <rect x="4" y="11" width="16" height="10" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                  </div>
                  <input
                    id="login-password"
                    [type]="showPassword ? 'text' : 'password'"
                    [(ngModel)]="password"
                    name="password"
                    placeholder="Enter your password"
                    autocomplete="current-password"
                    (keydown)="checkCaps($event)"
                    (keyup)="checkCaps($event)"
                    (blur)="capsLock = false"
                    required
                  />
                  <button
                    type="button"
                    class="eye-btn"
                    (click)="showPassword = !showPassword"
                    [attr.aria-label]="
                      showPassword ? 'Hide password' : 'Show password'
                    "
                  >
                    <svg
                      *ngIf="!showPassword"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <svg
                      *ngIf="showPassword"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M3 3l18 18" />
                      <path
                        d="M10.6 6.1A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.5 6.9C3.7 8.7 2 12 2 12s3.6 7 10 7a10 10 0 0 0 4-.8"
                      />
                      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                    </svg>
                  </button>
                </div>
                <div class="caps-warning" *ngIf="capsLock">Caps Lock is on</div>
              </div>

              <!-- Submit Button -->
              <button type="submit" class="submit-btn" [disabled]="loading">
                <span class="spinner" *ngIf="loading"></span>
                <ng-container *ngIf="!loading">
                  Sign in
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </ng-container>
                <span *ngIf="loading">Signing in...</span>
              </button>
            </form>
          </div>

          <!-- Bottom Feature Bar -->
          <div class="card-footer">
            <div class="footer-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Encrypted sign-in</span>
            </div>
            <div class="footer-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Role-based access</span>
            </div>
            <div class="footer-item">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                <path
                  d="M9 9h6v6H9zM4 9h2M18 9h2M4 15h2M18 15h2M9 4v2M15 4v2M9 18v2M15 18v2"
                />
              </svg>
              <span>Company-level data</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;
  showPassword = false;
  capsLock = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService,
  ) {}

  checkCaps(event: KeyboardEvent): void {
    this.capsLock =
      !!event.getModifierState && event.getModifierState('CapsLock');
  }

  submit(): void {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error =
          err?.error?.message || 'Invalid email or password. Please try again.';
      },
    });
  }

  forgot(): void {
    this.toast.error(
      'Password reset is not wired to email in this build. Use the demo credentials shown below.',
    );
  }
}
