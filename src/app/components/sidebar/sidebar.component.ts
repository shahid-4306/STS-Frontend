import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  styles: [
    `
      .sidebar-backdrop {
        display: none;
      }
      .sidebar {
        width: 230px;
        flex-shrink: 0;
        background: var(--navy);
        color: var(--paper);
        display: flex;
        flex-direction: column;
        position: sticky;
        top: 0;
        height: 100vh;
      }
      .sidebar-brand {
        padding: 22px 20px 18px;
        display: flex;
        align-items: center;
        gap: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .sidebar-brand .mark {
        width: 32px;
        height: 32px;
        border: 2px solid var(--amber-2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-display);
        font-weight: 700;
        color: var(--amber-2);
        font-size: 14px;
        flex-shrink: 0;
      }
      .sidebar-brand .name {
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 16.5px;
        line-height: 1.2;
      }
      .sidebar-brand .sub {
        font-size: 10px;
        color: #8890a6;
        text-transform: uppercase;
        letter-spacing: 0.6px;
      }
      .sidebar-close {
        display: none;
        margin-left: auto;
        background: none;
        border: none;
        color: var(--paper);
        font-size: 18px;
        cursor: pointer;
        padding: 4px;
      }
      .nav-group {
        padding: 14px 10px;
        overflow-y: auto;
        flex: 1;
      }
      .nav-label {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.8px;
        color: #6c7590;
        padding: 10px 10px 6px;
      }
      .nav-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 9px 12px;
        border-radius: var(--radius);
        color: #c7cbda;
        font-size: 13.5px;
        font-weight: 500;
        cursor: pointer;
        transition:
          background 0.12s,
          color 0.12s;
        position: relative;
      }
      .nav-item .ic {
        width: 16px;
        text-align: center;
        font-size: 14px;
        flex-shrink: 0;
      }
      .nav-item:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--paper);
      }
      .nav-item.active {
        background: rgba(193, 131, 43, 0.16);
        color: var(--amber-2);
      }
      .nav-item.active::before {
        content: '';
        position: absolute;
        left: -10px;
        top: 6px;
        bottom: 6px;
        width: 3px;
        background: var(--amber-2);
        border-radius: 0 3px 3px 0;
      }
      .sidebar-foot {
        margin-top: auto;
        padding: 14px 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        font-size: 11.5px;
        color: #7c84a0;
      }
      .sidebar-foot .who {
        color: var(--paper);
        font-weight: 600;
        font-size: 12.5px;
      }
      .sidebar-foot .logout {
        margin-top: 8px;
        color: var(--amber-2);
        cursor: pointer;
        font-weight: 600;
        font-size: 12px;
        display: inline-flex;
        align-items: center;
        gap: 5px;
      }
      .sidebar-foot .logout:hover {
        text-decoration: underline;
      }

      /* ---- Mobile / tablet: off-canvas sidebar ---- */
      @media (max-width: 900px) {
        .sidebar-backdrop {
          display: block;
          position: fixed;
          inset: 0;
          background: rgba(15, 18, 30, 0.45);
          z-index: 40;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.18s ease;
        }
        .sidebar-backdrop.open {
          opacity: 1;
          pointer-events: auto;
        }
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          z-index: 41;
          transform: translateX(-100%);
          transition: transform 0.2s ease;
          box-shadow: 2px 0 18px rgba(0, 0, 0, 0.25);
        }
        .sidebar.open {
          transform: translateX(0);
        }
        .sidebar-close {
          display: block;
        }
      }
    `,
  ],
  template: `
    <div
      class="sidebar-backdrop"
      [class.open]="layout.sidebarOpen$ | async"
      (click)="layout.closeSidebar()"
    ></div>
    <aside class="sidebar" [class.open]="layout.sidebarOpen$ | async">
      <div class="sidebar-brand">
        <div class="mark">STS</div>
        <div>
          <div class="name">Tanveer</div>
          <div class="sub">Factory Ledger</div>
        </div>
        <button class="sidebar-close" (click)="layout.closeSidebar()" aria-label="Close menu">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <nav class="nav-group" (click)="layout.closeSidebar()">
        <div class="nav-label">Overview</div>
        <div class="nav-item" routerLink="/dashboard" routerLinkActive="active">
          <span class="ic"><i class="fa-solid fa-gauge-high"></i></span>Dashboard
        </div>
        <div class="nav-label">Records</div>
        <div class="nav-item" routerLink="/customers" routerLinkActive="active">
          <span class="ic"><i class="fa-solid fa-users"></i></span>Customers
        </div>
        <div class="nav-item" routerLink="/products" routerLinkActive="active">
          <span class="ic"><i class="fa-solid fa-box"></i></span>Products &amp; Price
        </div>
        <div class="nav-label">Billing</div>
        <div class="nav-item" routerLink="/newbill" routerLinkActive="active">
          <span class="ic"><i class="fa-solid fa-file-pen"></i></span>Create Bill
        </div>
        <div class="nav-item" routerLink="/advances" routerLinkActive="active">
          <span class="ic"><i class="fa-solid fa-circle-plus"></i></span>Advance Payments
        </div>
        <div class="nav-item" routerLink="/arrears" routerLinkActive="active">
          <span class="ic"><i class="fa-solid fa-triangle-exclamation"></i></span>Arrears
        </div>
        <div class="nav-label">History</div>
        <div class="nav-item" routerLink="/payments" routerLinkActive="active">
          <span class="ic"><i class="fa-solid fa-clock-rotate-left"></i></span>Payment History
        </div>
        <div
          class="nav-item"
          routerLink="/billinghistory"
          routerLinkActive="active"
        >
          <span class="ic"><i class="fa-solid fa-file-invoice"></i></span>Billing History
        </div>
        <div class="nav-label">Insights</div>
        <div class="nav-item" routerLink="/reports" routerLinkActive="active">
          <span class="ic"><i class="fa-solid fa-chart-column"></i></span>Reports
        </div>
      </nav>
      <div class="sidebar-foot">
        <div class="who">Administrator</div>
        <div>{{ auth.currentAdmin()?.email }}</div>
        <div class="logout" (click)="auth.logout()">
          Log out<i class="fa-solid fa-arrow-right-from-bracket"></i>
        </div>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  constructor(
    public auth: AuthService,
    public layout: LayoutService,
  ) {}
}
