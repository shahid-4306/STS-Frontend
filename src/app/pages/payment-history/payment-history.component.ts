import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models';
import { fmtDate, fmtMoney } from '../../shared/format.util';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="toolbar">
      <div class="left">
        <input type="text" [(ngModel)]="query" (ngModelChange)="onFilter()" placeholder="Search customer, phone or bill #…" style="width:280px;" />
        <input type="date" [(ngModel)]="dateFilter" (ngModelChange)="onFilter()" />
      </div>
    </div>
    <div class="panel">
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
              <tr class="empty-row" *ngIf="!payments.length">
                <td colspan="6">No payments match your filters.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class PaymentHistoryComponent implements OnInit {
  payments: Payment[] = [];
  query = '';
  dateFilter = '';
  private filterTimeout: any;

  fmtDate = fmtDate;
  fmtMoney = fmtMoney;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.paymentService.list({ q: this.query, date: this.dateFilter }).subscribe((res) => (this.payments = res.data));
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
}
