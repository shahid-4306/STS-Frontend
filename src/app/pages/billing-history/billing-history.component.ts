import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BillService } from '../../services/bill.service';
import { CustomerService } from '../../services/customer.service';
import { ToastService } from '../../services/toast.service';
import { Bill, Customer } from '../../models';
import { fmtDate, fmtMoney } from '../../shared/format.util';
import { InvoicePreviewComponent } from '../../components/invoice-preview/invoice-preview.component';

/** Derives the same paid/partial/due status used elsewhere from a bill's balances. */
type BillStatus = 'paid' | 'partial' | 'due';

function billStatus(b: Bill): BillStatus {
  if (Number(b.remainingBalance) <= 0) return 'paid';
  if (Number(b.receivedAmount) > 0) return 'partial';
  return 'due';
}

@Component({
  selector: 'app-billing-history',
  standalone: true,
  imports: [CommonModule, FormsModule, InvoicePreviewComponent],
  template: `
    <div class="toolbar">
      <div class="left">
        <select [(ngModel)]="customerId" (ngModelChange)="load()">
          <option value="">All Customers</option>
          <option *ngFor="let c of customers" [value]="c._id">{{ c.fullName }}</option>
        </select>
        <select [(ngModel)]="status" (ngModelChange)="load()">
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="due">Due</option>
        </select>
      </div>
    </div>
    <div class="panel">
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Bill #</th><th>Date</th><th>Customer</th><th class="right">Total</th>
                <th class="right">Received</th><th class="right">Remaining</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of bills; trackBy: trackByBillId">
                <td class="num muted">{{ b.displayId }}</td>
                <td>{{ fmtDate(b.date) }}</td>
                <td>{{ customerName(b) }}</td>
                <td class="right num">{{ fmtMoney(b.grandTotal) }}</td>
                <td class="right num">{{ fmtMoney(b.receivedAmount) }}</td>
                <td class="right num" [style.color]="b.remainingBalance > 0 ? 'var(--rust)' : 'var(--green)'">
                  {{ fmtMoney(b.remainingBalance) }}
                </td>
                <td>
                  <span class="badge badge-paid" *ngIf="statusOf(b) === 'paid'">Paid</span>
                  <span class="badge badge-partial" *ngIf="statusOf(b) === 'partial'">Partial</span>
                  <span class="badge badge-due" *ngIf="statusOf(b) === 'due'">Due</span>
                </td>
                <td>
                  <div class="row-actions">
                    <button class="icon-btn" title="Edit Bill" (click)="editBill(b)"><i class="fa-solid fa-pen"></i></button>
                    <button class="icon-btn" title="View / Print" (click)="viewBill = b"><i class="fa-solid fa-print"></i></button>
                  </div>
                </td>
              </tr>
              <tr class="empty-row" *ngIf="!loading && !loadError && !bills.length">
                <td colspan="8">No bills match this filter.</td>
              </tr>
              <tr class="empty-row" *ngIf="loading">
                <td colspan="8">Loading bills…</td>
              </tr>
              <tr class="empty-row" *ngIf="!loading && loadError">
                <td colspan="8" style="color:var(--rust);">{{ loadError }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <app-invoice-preview [bill]="viewBill" (close)="viewBill = null"></app-invoice-preview>
  `,
})
export class BillingHistoryComponent implements OnInit {
  bills: Bill[] = [];
  customers: Customer[] = [];
  customerId = '';
  status = '';
  viewBill: Bill | null = null;

  loading = false;
  loadError = '';

  fmtDate = fmtDate;
  fmtMoney = fmtMoney;
  statusOf = billStatus;

  constructor(
    private billService: BillService,
    private customerService: CustomerService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerService.list().subscribe({
      next: (res) => (this.customers = res.data),
      error: () => this.toast.error('Could not load the customer list for filtering.'),
    });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.loadError = '';
    this.billService.list({ customerId: this.customerId, status: this.status }).subscribe({
      next: (res) => {
        this.bills = Array.isArray(res.data) ? res.data : [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.bills = [];
        this.loadError = err?.error?.message || 'Could not load bills. Please try again.';
      },
    });
  }

  trackByBillId(_index: number, b: Bill): string {
    return b._id;
  }

  customerName(b: Bill): string {
    return typeof b.customerId === 'string' ? '—' : b.customerId?.fullName || '—';
  }

  editBill(b: Bill): void {
    this.router.navigate(['/newbill', b._id]);
  }
}
