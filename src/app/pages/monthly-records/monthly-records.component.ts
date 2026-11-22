import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MonthlyRecordService,
  currentMonthKey,
  monthLabel,
} from '../../services/monthly-record.service';
import { ToastService } from '../../services/toast.service';
import {
  MonthlyRecordDetail,
  MonthlyRecordRow,
  MonthlyTotals,
} from '../../models';
import { fmtDate, fmtMoney } from '../../shared/format.util';

@Component({
  selector: 'app-monthly-records',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="toolbar">
      <div class="left" style="flex-wrap:wrap;gap:10px;">
        <select
          [(ngModel)]="month"
          (ngModelChange)="load()"
          style="min-width:190px;"
        >
          <option *ngFor="let m of months" [value]="m">{{ label(m) }}</option>
        </select>
        <input
          type="text"
          [(ngModel)]="query"
          placeholder="Search customer…"
          style="width:240px;"
        />
      </div>
      <button
        class="btn btn-primary"
        [disabled]="exporting || loading || !rows.length"
        (click)="exportExcel()"
      >
        <i class="fa-solid fa-file-excel" *ngIf="!exporting"></i>
        {{ exporting ? 'Preparing…' : ' Export to Excel' }}
      </button>
    </div>

    <div
      class="kpi-grid"
      *ngIf="totals"
      style="grid-template-columns:repeat(auto-fill,minmax(190px,1fr));"
    >
      <div class="kpi">
        <div class="lbl">Customers</div>
        <div class="val">{{ totals.customers }}</div>
        <div class="sub">{{ label(month) }}</div>
      </div>
      <div class="kpi alt">
        <div class="lbl">Total Purchases</div>
        <div class="val">{{ fmtMoney(totals.purchases) }}</div>
        <div class="sub">goods bought this month</div>
      </div>
      <div class="kpi good">
        <div class="lbl">Payments Received</div>
        <div class="val">{{ fmtMoney(totals.paymentsReceived) }}</div>
        <div class="sub">sent by customers</div>
      </div>
      <div class="kpi warn">
        <div class="lbl">Remaining Balance</div>
        <div class="val">{{ fmtMoney(totals.remainingBalance) }}</div>
        <div class="sub">incl. carried forward</div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head">
        <h3>Monthly Customer Records — {{ label(month) }}</h3>
      </div>
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th class="right">Opening Balance</th>
                <th class="right">Purchases</th>
                <th class="right">Arrears Added</th>
                <th class="right">Payments Received</th>
                <th class="right">Remaining Balance</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of filtered(); trackBy: trackByRecord">
                <td>
                  {{ r.customer.fullName }}
                  <span class="muted">— {{ r.customer.city }}</span>
                </td>
                <td class="right num">
                  {{ fmtMoney(r.figures.openingBalance) }}
                </td>
                <td class="right num">{{ fmtMoney(r.figures.purchases) }}</td>
                <td class="right num">
                  {{
                    r.figures.arrearsAdded
                      ? fmtMoney(r.figures.arrearsAdded)
                      : '—'
                  }}
                </td>
                <td class="right num" style="color:var(--green)">
                  {{ fmtMoney(r.figures.paymentsReceived) }}
                </td>
                <td
                  class="right num"
                  [style.color]="
                    r.figures.remainingBalance > 0
                      ? 'var(--rust)'
                      : 'var(--green)'
                  "
                >
                  {{ fmtMoney(r.figures.remainingBalance) }}
                  <span class="muted" *ngIf="r.figures.remainingBalance < 0"
                    >(advance)</span
                  >
                </td>
                <td>
                  <div class="row-actions">
                    <button class="icon-btn" title="View" (click)="view(r)">
                      <i class="fa-solid fa-eye"></i>
                    </button>
                    <button
                      class="icon-btn danger"
                      title="Delete"
                      [disabled]="deletingId === r.recordId"
                      (click)="remove(r)"
                    >
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr class="empty-row" *ngIf="loading">
                <td colspan="7">Loading monthly records…</td>
              </tr>
              <tr class="empty-row" *ngIf="!loading && loadError">
                <td colspan="7" style="color:var(--rust);">
                  {{ loadError }}
                  <button class="btn btn-sm btn-outline" (click)="load()">
                    Retry
                  </button>
                </td>
              </tr>
              <tr
                class="empty-row"
                *ngIf="!loading && !loadError && !filtered().length"
              >
                <td colspan="7">
                  {{
                    rows.length
                      ? 'No customer matches this search.'
                      : 'No monthly records for this month.'
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ============ VIEW ============ -->
    <div
      class="modal-backdrop"
      *ngIf="showDetail"
      (click)="closeOnBackdrop($event)"
    >
      <div class="modal wide">
        <div class="modal-head">
          <h3>
            {{ detail?.customer?.fullName || 'Monthly Record' }} —
            {{ label(detail?.month || month) }}
          </h3>
          <button class="modal-close" (click)="closeDetail()">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="modal-body">
          <div *ngIf="detailLoading" class="muted">Loading details…</div>
          <div *ngIf="!detailLoading && detailError" style="color:var(--rust);">
            {{ detailError }}
          </div>

          <ng-container *ngIf="detail as d">
            <p class="muted" style="margin-bottom:14px;">
              {{ d.customer.city }} · {{ d.customer.phone }}
            </p>
            <div
              class="kpi-grid"
              style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr));"
            >
              <div class="kpi">
                <div class="lbl">Opening Balance</div>
                <div class="val">{{ fmtMoney(d.summary.openingBalance) }}</div>
              </div>
              <div class="kpi alt">
                <div class="lbl">Total Purchases</div>
                <div class="val">{{ fmtMoney(d.summary.purchases) }}</div>
              </div>
              <div class="kpi good">
                <div class="lbl">Payments Received</div>
                <div class="val">
                  {{ fmtMoney(d.summary.paymentsReceived) }}
                </div>
              </div>
              <div class="kpi warn">
                <div class="lbl">Remaining Balance</div>
                <div class="val">
                  {{ fmtMoney(d.summary.remainingBalance) }}
                </div>
              </div>
            </div>

            <h4 style="margin:14px 0 6px;">Purchases</h4>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Bill #</th>
                    <th>Bilti #</th>
                    <th class="right">Bill Amount</th>
                    <th class="right">Bill Total (incl. previous balance)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let p of d.purchases">
                    <td>{{ fmtDate(p.date) }}</td>
                    <td class="num muted">{{ p.displayId }}</td>
                    <td>{{ p.biltiNumber || '—' }}</td>
                    <td class="right num">{{ fmtMoney(p.billAmount) }}</td>
                    <td class="right num">{{ fmtMoney(p.billTotal) }}</td>
                  </tr>
                  <tr class="empty-row" *ngIf="!d.purchases.length">
                    <td colspan="5">No purchases this month.</td>
                  </tr>
                  <tr *ngIf="d.purchases.length" style="font-weight:700;">
                    <td colspan="3">Total purchases</td>
                    <td class="right num">
                      {{ fmtMoney(d.summary.purchases) }}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 style="margin:16px 0 6px;">Payments Received</h4>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Bill #</th>
                    <th>Method</th>
                    <th class="right">Amount</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let p of d.payments">
                    <td>{{ fmtDate(p.date) }}</td>
                    <td>
                      <span class="badge badge-neutral">{{
                        p.kind === 'advance_deposit'
                          ? 'Advance deposit'
                          : 'Payment'
                      }}</span>
                    </td>
                    <td class="num muted">{{ p.billRef || '—' }}</td>
                    <td>{{ p.method || '—' }}</td>
                    <td class="right num" style="color:var(--green)">
                      {{ fmtMoney(p.amount) }}
                    </td>
                    <td class="muted">{{ p.remarks || '—' }}</td>
                  </tr>
                  <tr class="empty-row" *ngIf="!d.payments.length">
                    <td colspan="6">No payments received this month.</td>
                  </tr>
                  <tr *ngIf="d.payments.length" style="font-weight:700;">
                    <td colspan="4">Total payments received</td>
                    <td class="right num">
                      {{ fmtMoney(d.summary.paymentsReceived) }}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ng-container *ngIf="d.arrears.length">
              <h4 style="margin:16px 0 6px;">Arrears Added</h4>
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th class="right">Amount</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let a of d.arrears">
                      <td>{{ fmtDate(a.date) }}</td>
                      <td class="right num">{{ fmtMoney(a.amount) }}</td>
                      <td class="muted">{{ a.remarks || '—' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ng-container>

            <div style="max-width:340px;margin:18px 0 0 auto;">
              <div class="summary-line">
                <span>Opening balance</span
                ><span class="v">{{ fmtMoney(d.summary.openingBalance) }}</span>
              </div>
              <div class="summary-line">
                <span>+ Purchases</span
                ><span class="v">{{ fmtMoney(d.summary.purchases) }}</span>
              </div>
              <div class="summary-line" *ngIf="d.summary.arrearsAdded">
                <span>+ Arrears added</span
                ><span class="v">{{ fmtMoney(d.summary.arrearsAdded) }}</span>
              </div>
              <div class="summary-line">
                <span>− Payments received</span
                ><span class="v">{{
                  fmtMoney(d.summary.paymentsReceived)
                }}</span>
              </div>
              <div class="summary-line total">
                <span>Remaining balance</span>
                <span
                  class="v"
                  [style.color]="
                    d.summary.remainingBalance > 0
                      ? 'var(--rust)'
                      : 'var(--green)'
                  "
                  >{{ fmtMoney(d.summary.remainingBalance)
                  }}<span class="muted" *ngIf="d.summary.remainingBalance < 0">
                    (advance)</span
                  ></span
                >
              </div>
            </div>
          </ng-container>
        </div>
        <div class="modal-foot">
          <button class="btn btn-outline" (click)="closeDetail()">Close</button>
        </div>
      </div>
    </div>
  `,
})
export class MonthlyRecordsComponent implements OnInit {
  months: string[] = [];
  month = currentMonthKey();
  query = '';

  rows: MonthlyRecordRow[] = [];
  totals: MonthlyTotals | null = null;
  loading = false;
  loadError = '';
  exporting = false;
  deletingId = '';

  showDetail = false;
  detail: MonthlyRecordDetail | null = null;
  detailLoading = false;
  detailError = '';

  fmtMoney = fmtMoney;
  fmtDate = fmtDate;
  label = monthLabel;

  constructor(
    private service: MonthlyRecordService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.months = [this.month];
    this.service.months().subscribe({
      next: (res) => {
        const list = (res.data?.months || []).map((m) => m.key);
        if (list.length) this.months = list;
        if (!this.months.includes(this.month)) this.month = this.months[0];
      },
      error: () => {},
    });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.loadError = '';
    const requested = this.month;
    this.service.list(requested).subscribe({
      next: (res) => {
        if (requested !== this.month) return;
        this.rows = res.data?.rows || [];
        this.totals = res.data?.totals || null;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.rows = [];
        this.totals = null;
        this.loadError =
          err?.error?.message ||
          'Could not load the monthly records. Please try again.';
      },
    });
  }

  filtered(): MonthlyRecordRow[] {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.rows;
    return this.rows.filter(
      (r) =>
        r.customer.fullName.toLowerCase().includes(q) ||
        (r.customer.city || '').toLowerCase().includes(q) ||
        (r.customer.phone || '').includes(q),
    );
  }

  trackByRecord(_i: number, r: MonthlyRecordRow): string {
    return r.recordId;
  }

  view(r: MonthlyRecordRow): void {
    this.showDetail = true;
    this.detail = null;
    this.detailError = '';
    this.detailLoading = true;
    this.service.get(r.recordId).subscribe({
      next: (res) => {
        this.detail = res.data;
        this.detailLoading = false;
      },
      error: (err) => {
        this.detailLoading = false;
        this.detailError = err?.error?.message || 'Could not load this record.';
      },
    });
  }

  closeDetail(): void {
    this.showDetail = false;
    this.detail = null;
  }

  closeOnBackdrop(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop'))
      this.closeDetail();
  }

  remove(r: MonthlyRecordRow): void {
    const ok = confirm(
      `Delete ${r.customer.fullName}'s record for ${this.label(this.month)}?\n\n` +
        'Only this monthly record is removed. Bills, payments, advances and every other customer are not affected.',
    );
    if (!ok) return;
    this.deletingId = r.recordId;
    this.service.delete(r.recordId).subscribe({
      next: () => {
        this.deletingId = '';
        this.toast.success('Monthly record deleted.');
        if (this.detail?.recordId === r.recordId) this.closeDetail();
        this.load();
      },
      error: () => {
        this.deletingId = '';
      },
    });
  }

  exportExcel(): void {
    if (this.exporting) return;
    this.exporting = true;
    const month = this.month;
    this.service.exportExcel(month).subscribe({
      next: (res) => {
        this.exporting = false;
        const blob = res.body;
        if (!blob || !blob.size) {
          this.toast.error('The export came back empty.');
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Monthly_Customer_Report_${month}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
        this.toast.success('Excel report downloaded.');
      },
      error: () => {
        this.exporting = false;
      },
    });
  }
}
