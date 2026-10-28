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
      .login-screen {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background:
          radial-gradient(
            circle at 20% 20%,
            rgba(193, 131, 43, 0.1),
            transparent 45%
          ),
          radial-gradient(
            circle at 80% 80%,
            rgba(46, 122, 86, 0.08),
            transparent 45%
          ),
          var(--navy);
        padding: 24px;
      }
      .login-card {
        width: 100%;
        max-width: 380px;
        background: var(--paper);
        border-radius: 6px;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);
        overflow: hidden;
      }
      .login-brand {
        background: var(--navy);
        color: var(--paper);
        padding: 32px;
        position: relative;
        /* Flexbox styling added here to align logo and text side-by-side */
        display: flex;
        align-items: center;
        gap: 16px;
      }
      .login-brand::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 4px;
        background: repeating-linear-gradient(
          90deg,
          var(--amber) 0 10px,
          transparent 10px 20px
        );
      }
      .login-brand .mark {
        width: 44px;
        height: 44px;
        border: 2px solid var(--amber-2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 16px;
        color: var(--amber-2);
        flex-shrink: 0; /* Prevents the circle from distorting */
      }
      /* Container to group the heading & tagline together */
      .login-brand-text {
        display: flex;
        flex-direction: column;
      }
      .login-brand h1 {
        font-family: var(--font-display);
        font-size: 22px;
        font-weight: 700;
        letter-spacing: 0.2px;
        margin: 0; /* Cleared margin to prevent alignment shifting */
        line-height: 1.2;
      }
      .login-brand p {
        color: #a9aec0;
        font-size: 11px;
        margin-top: 4px;
        margin-bottom: 0;
        letter-spacing: 0.3px;
        text-transform: uppercase;
        line-height: 1.3;
      }
      .login-body {
        padding: 28px 32px 32px;
      }
      .login-error {
        background: rgba(168, 67, 42, 0.1);
        border: 1px solid rgba(168, 67, 42, 0.35);
        color: var(--rust);
        padding: 10px 12px;
        border-radius: var(--radius);
        font-size: 12.5px;
        margin-bottom: 14px;
      }
      .login-demo {
        margin-top: 18px;
        padding-top: 16px;
        border-top: 1px dashed var(--line);
        font-size: 11.5px;
        color: var(--ink-faint);
      }
      .login-demo code {
        background: var(--paper-2);
        padding: 1px 5px;
        border-radius: 3px;
        font-family: var(--font-mono);
        color: var(--ink-soft);
      }
    `,
  ],
  template: `
    <div class="login-screen">
      <div class="login-card">
        <div class="login-brand">
          <div class="mark">STS</div>
          <div class="login-brand-text">
            <h1>Tanveer --- Ledger</h1>
            <p>Factory Billing &amp; Customer Management</p>
          </div>
        </div>
        <div class="login-body">
          <div class="login-error" *ngIf="error">{{ error }}</div>
          <form (ngSubmit)="submit()">
            <div class="field">
              <label>Admin Email</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="admin@factory.com"
                required
              />
            </div>
            <div class="field">
              <label>Password</label>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary btn-block"
              [disabled]="loading"
            >
              {{ loading ? 'Signing in…' : 'Sign In to Dashboard' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ToastService,
  ) {}

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
