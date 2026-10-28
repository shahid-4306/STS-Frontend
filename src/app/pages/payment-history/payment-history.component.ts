import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PaymentService } from '../../services/payment.service';
import { CustomerService } from '../../services/customer.service';
import { ToastService } from '../../services/toast.service';
import { Customer, CustomerPaymentHistory, LedgerEntry, Payment } from '../../models';
import { fmtDate, fmtMoney } from '../../shared/format.util';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="toolbar">
      <div class="left" style="flex-wrap:wrap;gap:10px;">
        <select [(ngModel)]="customerId" (ngModelChange)="onCustomerChange()" style="min-width:200px;">
          <option value="">All Customers</option>
          <option *ngFor="let c of customers" [value]="c._id">{{ c.fullName }} — {{ c.city }}</option>
        </select>

        <!-- Overall list filters (no customer selected) -->
        <ng-container *ngIf="!customerId">
          <input type="text" [(ngModel)]="query" (ngModelChange)="onFilter()" placeholder="Search customer, phone or bill #…" style="width:280px;" />
          <input type="date" [(ngModel)]="dateFilter" (ngModelChange)="onFilter()" />
        </ng-container>

        <!-- Customer history range filters -->
        <ng-container *ngIf="customerId">
          <label class="muted" style="display:flex;align-items:center;gap:6px;font-size:13px;">
            Start Date <input type="date" [(ngModel)]="startDate" [max]="endDate || ''" (ngModelChange)="onRangeChange()" />
          </label>
          <label class="muted" style="display:flex;align-items:center;gap:6px;font-size:13px;">
            End Date <input type="date" [(ngModel)]="endDate" [min]="startDate || ''" (ngModelChange)="onRangeChange()" />
          </label>
          <button class="btn btn-sm btn-outline" *ngIf="startDate || endDate" (click)="clearRange()">Clear dates</button>
        </ng-container>
      </div>
    </div>

    <!-- ============ CUSTOMER LEDGER ============ -->
    <ng-container *ngIf="customerId">
      <div *ngIf="rangeError" class="panel" style="border-color:var(--rust);">
        <div class="panel-body pad" style="color:var(--rust);">{{ rangeError }}</div>
      </div>

      <div class="kpi-grid" *ngIf="history" style="grid-template-columns:repeat(auto-fill,minmax(190px,1fr));">
        <div class="kpi"><div class="lbl">Payments{{ rangeLabel() }}</div><div class="val">{{ fmtMoney(history.summary.payments) }}</div></div>
        <div class="kpi"><div class="lbl">Advance Deposited</div><div class="val">{{ fmtMoney(history.summary.advancesDeposited) }}</div></div>
        <div class="kpi"><div class="lbl">Advance Applied</div><div class="val">{{ fmtMoney(history.summary.advancesApplied) }}</div></div>
        <div class="kpi"><div class="lbl">Adjustments (Arrears)</div><div class="val">{{ fmtMoney(history.summary.adjustments) }}</div></div>
        <div class="kpi warn"><div class="lbl">Outstanding Now</div><div class="val">{{ fmtMoney(history.summary.currentOutstanding) }}</div></div>
        <div class="kpi"><div class="lbl">Advance Balance Now</div><div class="val">{{ fmtMoney(history.summary.currentAdvanceBalance) }}</div></div>
      </div>

      <div class="panel">
        <div class="panel-head"><h3>Payment History — {{ history?.customer?.fullName || selectedName() }}</h3></div>
        <div class="panel-body">
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th><th>Type</th><th>Bill #</th>
                  <th class="right">Payment</th><th class="right">Advance</th><th class="right">Adjustment</th>
                  <th>Method</th><th class="right">Remaining Balance</th><th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let e of entries; trackBy: trackByEntry">
                  <td>{{ fmtDate(e.date) }}</td>
                  <td><span class="badge badge-neutral">{{ kindLabel(e) }}</span></td>
                  <td class="num muted">{{ e.billRef || '—' }}</td>
                  <td class="right num" style="color:var(--green)">{{ e.paymentAmount ? fmtMoney(e.paymentAmount) : '—' }}</td>
                  <td class="right num">{{ e.advanceAmount ? fmtMoney(e.advanceAmount) : '—' }}</td>
                  <td class="right num">{{ e.adjustmentAmount ? fmtMoney(e.adjustmentAmount) : '—' }}</td>
                  <td>{{ e.method || '—' }}</td>
                  <td class="right num" [style.color]="(e.remainingBalance || 0) > 0 ? 'var(--rust)' : 'inherit'">
                    {{ e.remainingBalance === null ? '—' : fmtMoney(e.remainingBalance) }}
                  </td>
                  <td class="muted">{{ e.remarks || '—' }}</td>
                </tr>
                <tr class="empty-row" *ngIf="loadingHistory"><td colspan="9">Loading payment history…</td></tr>
                <tr class="empty-row" *ngIf="!loadingHistory && historyError">
                  <td colspan="9" style="color:var(--rust);">
                    {{ historyError }} <button class="btn btn-sm btn-outline" (click)="loadHistory()">Retry</button>
                  </td>
                </tr>
                <tr class="empty-row" *ngIf="!loadingHistory && !historyError && !rangeError && !entries.length">
                  <td colspan="9">{{ startDate || endDate ? 'No transactions for this customer in the selected dates.' : 'No transactions recorded for this customer yet.' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ng-container>

    <!-- ============ ALL PAYMENTS (unchanged) ============ -->
    <div class="panel" *ngIf="!customerId">
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Bill #</th><th>Date</th><th>Customer</th><th class="right">Received</th><th>Method</th><th>Remarks</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of payments">
                <td class="num muted">{{ billLabel(p) }}</td>
                <td>{{ fmtDate(p.paymentDate) }}</td>
                <td>{{ customerName(p) }}</td>
                <td class="right num" style="color:var(--green)">{{ fmtMoney(p.receivedAmount) }}</td>
                <td><span class="badge badge-neutral">{{ p.method }}</span></td>
                <td class="muted">{{ p.remarks || '—' }}</td>
              </tr>
              <tr class="empty-row" *ngIf="loadingList"><td colspan="6">Loading payments…</td></tr>
              <tr class="empty-row" *ngIf="!loadingList && listError">
                <td colspan="6" style="color:var(--rust);">{{ listError }}</td>
              </tr>
              <tr class="empty-row" *ngIf="!loadingList && !listError && !payments.length">
                <td colspan="6">No payments match your filters.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class PaymentHistoryComponent implements OnInit, OnDestroy {
  customers: Customer[] = [];
  customerId = '';

  /* all-payments list */
  payments: Payment[] = [];
  query = '';
  dateFilter = '';
  loadingList = false;
  listError = '';
  private filterTimeout: any;
  private listSub?: Subscription;

  /* customer ledger */
  startDate = '';
  endDate = '';
  history: CustomerPaymentHistory | null = null;
  entries: LedgerEntry[] = [];
  loadingHistory = false;
  historyError = '';
  rangeError = '';
  private historySub?: Subscription;

  fmtDate = fmtDate;
  fmtMoney = fmtMoney;

  constructor(
    private paymentService: PaymentService,
    private customerService: CustomerService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.customerService.list().subscribe({
      next: (res) => (this.customers = res.data),
      error: () => this.toast.error('Could not load the customer list.'),
    });
    this.load();
  }

  ngOnDestroy(): void {
    clearTimeout(this.filterTimeout);
    this.listSub?.unsubscribe();
    this.historySub?.unsubscribe();
  }

  /* -------------------- all payments -------------------- */

  load(): void {
    this.loadingList = true;
    this.listError = '';
    this.listSub?.unsubscribe();
    this.listSub = this.paymentService.list({ q: this.query, date: this.dateFilter }).subscribe({
      next: (res) => {
        this.payments = Array.isArray(res.data) ? res.data : [];
        this.loadingList = false;
      },
      error: (err) => {
        this.payments = [];
        this.loadingList = false;
        this.listError = err?.error?.message || 'Could not load payments. Please try again.';
      },
    });
  }

  onFilter(): void {
    clearTimeout(this.filterTimeout);
    this.filterTimeout = setTimeout(() => this.load(), 300);
  }

  customerName(p: Payment): string {
    return typeof p.customerId === 'string' ? '—' : p.customerId?.fullName || '—';
  }
  billLabel(p: Payment): string {
    return typeof p.billId === 'string' ? p.billId : p.billId?.displayId || '—';
  }

  /* -------------------- customer ledger -------------------- */

  onCustomerChange(): void {
    this.history = null;
    this.entries = [];
    this.historyError = '';
    this.rangeError = '';
    if (this.customerId) {
      this.loadHistory();
    } else {
      this.historySub?.unsubscribe();
      this.load();
    }
  }

  onRangeChange(): void {
    this.loadHistory();
  }

  clearRange(): void {
    this.startDate = '';
    this.endDate = '';
    this.loadHistory();
  }

  selectedName(): string {
    return this.customers.find((c) => c._id === this.customerId)?.fullName || '';
  }

  rangeLabel(): string {
    if (!this.startDate && !this.endDate) return '';
    return ' (selected dates)';
  }

  kindLabel(e: LedgerEntry): string {
    switch (e.kind) {
      case 'payment': return 'Payment';
      case 'advance_deposit': return 'Advance';
      case 'advance_applied': return 'Advance applied';
      case 'arrears_adjustment': return 'Adjustment';
      default: return e.kind;
    }
  }

  trackByEntry(_i: number, e: LedgerEntry): string {
    return e.kind + e.id;
  }

  loadHistory(): void {
    if (!this.customerId) return;
    this.rangeError = '';
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      this.historySub?.unsubscribe();
      this.loadingHistory = false;
      this.entries = [];
      this.history = null;
      this.rangeError = 'Start Date cannot be after End Date.';
      return;
    }
    this.loadingHistory = true;
    this.historyError = '';
    this.historySub?.unsubscribe(); // a newer request supersedes an older, slower one
    this.historySub = this.paymentService
      .customerHistory(this.customerId, { startDate: this.startDate, endDate: this.endDate })
      .subscribe({
        next: (res) => {
          this.history = res.data;
          this.entries = res.data.entries || [];
          this.loadingHistory = false;
        },
        error: (err) => {
          this.history = null;
          this.entries = [];
          this.loadingHistory = false;
          this.historyError = err?.error?.message || 'Could not load this customer\'s payment history.';
        },
      });
  }
}
