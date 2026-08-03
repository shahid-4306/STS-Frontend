import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { SearchService, SearchResults } from '../../services/search.service';
import { LayoutService } from '../../services/layout.service';
import { AppNotification } from '../../models';
import { fmtDateTime, fmtMoney } from '../../shared/format.util';

const PAGE_META: Record<string, { title: string; crumb: string }> = {
  '/dashboard': { title: 'Dashboard', crumb: 'Overview of your factory ledger' },
  '/customers': { title: 'Customers', crumb: 'Manage customer records' },
  '/products': { title: 'Products & Price', crumb: 'Manage products and pricing policy' },
  '/newbill': { title: 'Create Bill', crumb: 'Generate a new customer invoice' },
  '/advances': { title: 'Advance Payments', crumb: 'Track pre-paid customer balances' },
  '/arrears': { title: 'Arrears', crumb: 'Customers with outstanding dues' },
  '/payments': { title: 'Payment History', crumb: 'All received payments' },
  '/billinghistory': { title: 'Billing History', crumb: 'Every bill ever generated' },
  '/reports': { title: 'Reports', crumb: 'Sales, ledger & outstanding reports' },
};

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [
    `
      .topbar {
        background: var(--white);
        border-bottom: 1px solid var(--line);
        padding: 14px 26px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        position: sticky;
        top: 0;
        z-index: 20;
      }
      .topbar h2 {
        font-family: var(--font-display);
        font-size: 19px;
        font-weight: 600;
      }
      .topbar .crumbs {
        font-size: 11.5px;
        color: var(--ink-faint);
        margin-top: 2px;
      }
      .topbar-left {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }
      .hamburger {
        display: none;
        width: 36px;
        height: 36px;
        border-radius: var(--radius);
        background: var(--paper);
        border: 1.5px solid var(--line);
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 15px;
        flex-shrink: 0;
      }
      .topbar-right {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .search-box {
        position: relative;
        width: 280px;
      }
      .search-box input {
        width: 100%;
        padding: 8px 12px 8px 32px;
        border: 1.5px solid var(--line);
        border-radius: 20px;
        background: var(--paper);
        outline: none;
        font-size: 13px;
      }
      .search-box input:focus {
        border-color: var(--amber);
        background: var(--white);
      }
      .search-box .sic {
        position: absolute;
        left: 11px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--ink-faint);
        font-size: 13px;
      }
      .bell {
        position: relative;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--paper);
        border: 1.5px solid var(--line);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
        flex-shrink: 0;
      }
      .bell:hover {
        border-color: var(--amber);
      }
      .bell .dot {
        position: absolute;
        top: 5px;
        right: 6px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--rust);
        border: 1.5px solid var(--white);
      }

      @media (max-width: 900px) {
        .hamburger {
          display: flex;
        }
        .search-box {
          width: 100%;
        }
      }
      @media (max-width: 640px) {
        .topbar {
          padding: 12px 14px;
          flex-wrap: wrap;
        }
        .topbar h2 {
          font-size: 16px;
        }
        .topbar-right {
          width: 100%;
          order: 3;
        }
        .search-box {
          flex: 1;
        }
      }
    `,
  ],
  template: `
    <div class="topbar">
      <div class="topbar-left">
        <button class="hamburger" (click)="layout.toggleSidebar()" aria-label="Toggle menu">
          <i class="fa-solid fa-bars"></i>
        </button>
        <div>
          <h2>{{ meta.title }}</h2>
          <div class="crumbs">{{ meta.crumb }}</div>
        </div>
      </div>
      <div class="topbar-right">
        <div class="search-box">
          <span class="sic"><i class="fa-solid fa-magnifying-glass"></i></span>
          <input
            type="text"
            placeholder="Search customers, bills, products, bilti #…"
            [(ngModel)]="query"
            (keydown.enter)="runSearch()"
          />
        </div>
        <div class="bell" (click)="toggleDropdown()">
          <i class="fa-solid fa-bell"></i><span class="dot" *ngIf="hasUnread"></span>
        </div>
      </div>
    </div>

    <div class="dropdown" *ngIf="showDropdown" style="position:absolute;right:26px;top:60px;width:320px;max-width:90vw;background:var(--white);border:1px solid var(--line);border-radius:6px;box-shadow:0 20px 50px rgba(0,0,0,.18);z-index:60;overflow:hidden;">
      <div class="dropdown-head">
        <span>Notifications</span>
        <button class="link-btn" (click)="markAllRead()">Mark all read</button>
      </div>
      <div class="notif-list">
        <div class="notif-item" *ngFor="let n of notifications">
          {{ n.message }}
          <div class="t">{{ fmtDateTime(n.createdAt) }}</div>
        </div>
        <div class="notif-item muted" *ngIf="!notifications.length">No notifications yet.</div>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showSearchModal" (click)="closeSearchOnBackdrop($event)">
      <div class="modal wide">
        <div class="modal-head">
          <h3>Search Results — "{{ query }}"</h3>
          <button class="modal-close" (click)="showSearchModal = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body" *ngIf="results">
          <div class="section-title">Customers ({{ results.customers.length }})</div>
          <div class="notif-item" *ngFor="let c of results.customers">
            <strong>{{ c.fullName }}</strong> — {{ c.city }}, {{ c.phone }}
          </div>
          <div class="muted" style="font-size:12.5px" *ngIf="!results.customers.length">No matches.</div>

          <div class="section-title">Products ({{ results.products.length }})</div>
          <div class="notif-item" *ngFor="let p of results.products">
            {{ p.description }} — {{ fmtMoney(p.rate) }}
          </div>
          <div class="muted" style="font-size:12.5px" *ngIf="!results.products.length">No matches.</div>

          <div class="section-title">Bills ({{ results.bills.length }})</div>
          <div class="notif-item" *ngFor="let b of results.bills">
            {{ b.displayId }} — Bilti {{ b.biltiNumber || '—' }}, Driver {{ b.driverName || '—' }}
          </div>
          <div class="muted" style="font-size:12.5px" *ngIf="!results.bills.length">No matches.</div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-outline" (click)="showSearchModal = false">Close</button>
        </div>
      </div>
    </div>
  `,
})
export class TopbarComponent implements OnInit {
  meta = PAGE_META['/dashboard'];
  query = '';
  showDropdown = false;
  showSearchModal = false;
  notifications: AppNotification[] = [];
  hasUnread = false;
  results: SearchResults | null = null;
  fmtDateTime = fmtDateTime;
  fmtMoney = fmtMoney;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private searchService: SearchService,
    public layout: LayoutService,
  ) {}

  ngOnInit(): void {
    this.updateMeta(this.router.url);
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
      this.updateMeta(e.urlAfterRedirects || this.router.url);
    });
    this.loadNotifications();
  }

  private updateMeta(url: string): void {
    const path = '/' + url.split('/').filter(Boolean)[0];
    this.meta = PAGE_META[path] || PAGE_META['/dashboard'];
  }

  loadNotifications(): void {
    this.notificationService.list().subscribe((res) => {
      this.notifications = res.data;
      this.hasUnread = res.data.some((n) => !n.read);
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  markAllRead(): void {
    this.notificationService.markAllRead().subscribe(() => {
      this.notifications.forEach((n) => (n.read = true));
      this.hasUnread = false;
      this.showDropdown = false;
    });
  }

  runSearch(): void {
    if (!this.query.trim()) return;
    this.searchService.search(this.query.trim()).subscribe((res) => {
      this.results = res.data;
      this.showSearchModal = true;
    });
  }

  closeSearchOnBackdrop(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.showSearchModal = false;
    }
  }
}
