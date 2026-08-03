import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { CustomerService } from '../../services/customer.service';
import { Bill, Customer, Payment, Advance } from '../../models';
import { fmtDate, fmtMoney } from '../../shared/format.util';

type TabKey = 'sales' | 'ledger' | 'outstanding' | 'products' | 'payments' | 'advances' | 'arrears';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pill-tabs">
      <div class="pill" *ngFor="let t of tabs" [class.active]="tab === t.key" (click)="switchTab(t.key)">{{ t.label }}</div>
    </div>

    <!-- SALES -->
    <ng-container *ngIf="tab === 'sales'">
      <div class="toolbar">
        <div class="left">
          <select [(ngModel)]="salesPeriod" (ngModelChange)="loadSales()">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <div class="left">
          <button class="btn btn-outline btn-sm" (click)="exportSalesCsv()">Export Excel (CSV)</button>
          <button class="btn btn-outline btn-sm" (click)="print()">Print</button>
        </div>
      </div>
      <div class="panel">
        <div class="panel-body">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Bill #</th><th>Date</th><th>Customer</th><th class="right">Grand Total</th></tr></thead>
              <tbody>
                <tr *ngFor="let b of salesBills">
                  <td class="num muted">{{ b.displayId }}</td>
                  <td>{{ fmtDate(b.date) }}</td>
                  <td>{{ custName(b.customerId) }}</td>
                  <td class="right num">{{ fmtMoney(b.grandTotal) }}</td>
                </tr>
                <tr class="empty-row" *ngIf="!salesBills.length"><td colspan="4">No sales in this period.</td></tr>
                <tr *ngIf="salesBills.length">
                  <td colspan="3" style="text-align:right;font-weight:700;">Total</td>
                  <td class="right num" style="font-weight:700;">{{ fmtMoney(salesTotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ng-container>

    <!-- LEDGER -->
    <ng-container *ngIf="tab === 'ledger'">
      <div class="toolbar">
        <div class="left">
          <select [(ngModel)]="ledgerCustomerId" (ngModelChange)="loadLedger()">
            <option value="" *ngIf="!customers.length">No customers</option>
            <option *ngFor="let c of customers" [value]="c._id">{{ c.fullName }}</option>
          </select>
        </div>
      </div>
      <div class="panel">
        <div class="panel-body">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Date</th><th>Type</th><th>Reference</th><th class="right">Debit</th><th class="right">Credit</th></tr></thead>
              <tbody>
                <tr *ngFor="let r of ledgerRows">
                  <td>{{ fmtDate(r.date) }}</td>
                  <td>{{ r.type }}</td>
                  <td class="muted num">{{ r.ref }}</td>
                  <td class="right num">{{ r.debit ? fmtMoney(r.debit) : '—' }}</td>
                  <td class="right num">{{ r.credit ? fmtMoney(r.credit) : '—' }}</td>
                </tr>
                <tr class="empty-row" *ngIf="!ledgerRows.length"><td colspan="5">No ledger entries for this customer.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ng-container>

    <!-- OUTSTANDING / ARREARS (same view) -->
    <ng-container *ngIf="tab === 'outstanding' || tab === 'arrears'">
      <div class="panel">
        <div class="panel-body">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Customer</th><th>City</th><th>Phone</th><th class="right">Outstanding</th></tr></thead>
              <tbody>
                <tr *ngFor="let o of outstandingRows">
                  <td>{{ o.customer.fullName }}</td>
                  <td>{{ o.customer.city }}</td>
                  <td class="num">{{ o.customer.phone }}</td>
                  <td class="right num" style="color:var(--rust)">{{ fmtMoney(o.due) }}</td>
                </tr>
                <tr class="empty-row" *ngIf="!outstandingRows.length"><td colspan="4">No outstanding balances.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ng-container>

    <!-- PRODUCTS -->
    <ng-container *ngIf="tab === 'products'">
      <div class="panel">
        <div class="panel-body">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Product</th><th class="right">Packets Sold</th><th class="right">Revenue</th></tr></thead>
              <tbody>
                <tr *ngFor="let r of productRows">
                  <td>{{ r.name }}</td>
                  <td class="right num">{{ r.packets }}</td>
                  <td class="right num">{{ fmtMoney(r.total) }}</td>
                </tr>
                <tr class="empty-row" *ngIf="!productRows.length"><td colspan="3">No product sales yet.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ng-container>

    <!-- PAYMENTS -->
    <ng-container *ngIf="tab === 'payments'">
      <div class="panel">
        <div class="panel-body">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Date</th><th>Bill</th><th>Customer</th><th>Method</th><th class="right">Amount</th></tr></thead>
              <tbody>
                <tr *ngFor="let p of paymentRows">
                  <td>{{ fmtDate(p.paymentDate) }}</td>
                  <td class="num muted">{{ billLabel(p) }}</td>
                  <td>{{ custName(p.customerId) }}</td>
                  <td>{{ p.method }}</td>
                  <td class="right num">{{ fmtMoney(p.receivedAmount) }}</td>
                </tr>
                <tr class="empty-row" *ngIf="!paymentRows.length"><td colspan="5">No payments recorded.</td></tr>
                <tr *ngIf="paymentRows.length">
                  <td colspan="4" style="text-align:right;font-weight:700;">Total</td>
                  <td class="right num" style="font-weight:700;">{{ fmtMoney(paymentsTotal) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ng-container>

    <!-- ADVANCES -->
    <ng-container *ngIf="tab === 'advances'">
      <div class="panel">
        <div class="panel-body">
          <div class="table-wrap">
            <table>
              <thead><tr><th>Date</th><th>Customer</th><th class="right">Deposited</th><th class="right">Remaining</th></tr></thead>
              <tbody>
                <tr *ngFor="let a of advanceRows">
                  <td>{{ fmtDate(a.date) }}</td>
                  <td>{{ custName(a.customerId) }}</td>
                  <td class="right num">{{ fmtMoney(a.amount) }}</td>
                  <td class="right num">{{ fmtMoney(a.remainingAdvance) }}</td>
                </tr>
                <tr class="empty-row" *ngIf="!advanceRows.length"><td colspan="4">No advances recorded.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
export class ReportsComponent implements OnInit {
  tab: TabKey = 'sales';
  tabs: { key: TabKey; label: string }[] = [
    { key: 'sales', label: 'Sales' },
    { key: 'ledger', label: 'Customer Ledger' },
    { key: 'outstanding', label: 'Outstanding' },
    { key: 'products', label: 'Product Sales' },
    { key: 'payments', label: 'Payment Report' },
    { key: 'advances', label: 'Advance Report' },
    { key: 'arrears', label: 'Arrears Report' },
  ];

  customers: Customer[] = [];

  salesPeriod = 'monthly';
  salesBills: Bill[] = [];
  salesTotal = 0;

  ledgerCustomerId = '';
  ledgerRows: { date: string; type: string; ref: string; debit: number; credit: number }[] = [];

  outstandingRows: { customer: Customer; due: number }[] = [];
  productRows: { name: string; packets: number; total: number }[] = [];

  paymentRows: Payment[] = [];
  paymentsTotal = 0;

  advanceRows: Advance[] = [];

  fmtDate = fmtDate;
  fmtMoney = fmtMoney;

  constructor(private reportService: ReportService, private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customerService.list().subscribe((res) => {
      this.customers = res.data;
      if (this.customers.length) this.ledgerCustomerId = this.customers[0]._id;
      this.loadForTab();
    });
  }

  switchTab(key: TabKey): void {
    this.tab = key;
    this.loadForTab();
  }

  loadForTab(): void {
    if (this.tab === 'sales') this.loadSales();
    if (this.tab === 'ledger') this.loadLedger();
    if (this.tab === 'outstanding' || this.tab === 'arrears') this.loadOutstanding();
    if (this.tab === 'products') this.loadProducts();
    if (this.tab === 'payments') this.loadPayments();
    if (this.tab === 'advances') this.loadAdvances();
  }

  loadSales(): void {
    this.reportService.sales(this.salesPeriod).subscribe((res) => {
      this.salesBills = res.data.bills;
      this.salesTotal = res.data.total;
    });
  }

  loadLedger(): void {
    if (!this.ledgerCustomerId) return;
    this.reportService.ledger(this.ledgerCustomerId).subscribe((res) => (this.ledgerRows = res.data));
  }

  loadOutstanding(): void {
    this.reportService.outstanding().subscribe((res) => (this.outstandingRows = res.data));
  }

  loadProducts(): void {
    this.reportService.products().subscribe((res) => (this.productRows = res.data));
  }

  loadPayments(): void {
    this.reportService.payments().subscribe((res) => {
      this.paymentRows = res.data.payments;
      this.paymentsTotal = res.data.total;
    });
  }

  loadAdvances(): void {
    this.reportService.advances().subscribe((res) => (this.advanceRows = res.data));
  }

  custName(ref: Customer | string | undefined): string {
    if (!ref) return '—';
    return typeof ref === 'string' ? '—' : ref.fullName || '—';
  }

  billLabel(p: Payment): string {
    return typeof p.billId === 'string' ? p.billId : p.billId?.displayId || '—';
  }

  print(): void {
    window.print();
  }

  exportSalesCsv(): void {
    const rows = [
      ['Bill', 'Date', 'Customer', 'Grand Total'],
      ...this.salesBills.map((b) => [b.displayId, fmtDate(b.date), this.custName(b.customerId), String(b.grandTotal)]),
    ];
    const csv = rows
      .map((r) => r.map((cell) => (/[",\n]/.test(cell) ? '"' + cell.replace(/"/g, '""') + '"' : cell)).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales-report.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}
