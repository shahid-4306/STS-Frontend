import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdvanceService } from '../../services/advance.service';
import { CustomerService } from '../../services/customer.service';
import { ToastService } from '../../services/toast.service';
import { Advance, Customer } from '../../models';
import { fmtDate, fmtMoney, todayIso } from '../../shared/format.util';

@Component({
  selector: 'app-advances',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="toolbar">
      <div class="left">
        <input type="text" [(ngModel)]="search" placeholder="Search customer…" style="width:260px;" />
      </div>
      <button class="btn btn-primary" (click)="openModal()">+ Record Advance Deposit</button>
    </div>

    <div class="panel">
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Advance ID</th><th>Customer</th><th>Deposited</th><th class="right">Amount</th><th class="right">Remaining</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of filtered()">
                <td class="num muted">{{ a.displayId }}</td>
                <td>{{ customerName(a) }}</td>
                <td>{{ fmtDate(a.date) }}</td>
                <td class="right num">{{ fmtMoney(a.amount) }}</td>
                <td class="right num" [style.color]="a.remainingAdvance > 0 ? 'var(--green)' : 'var(--ink-faint)'">
                  {{ fmtMoney(a.remainingAdvance) }}
                </td>
              </tr>
              <tr class="empty-row" *ngIf="!filtered().length">
                <td colspan="5">No advance deposits recorded yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showModal" (click)="closeOnBackdrop($event)">
      <div class="modal">
        <div class="modal-head">
          <h3>Record Advance Deposit</h3>
          <button class="modal-close" (click)="showModal = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="field">
            <label>Customer</label>
            <select [(ngModel)]="form.customerId">
              <option value="" *ngIf="customers.length">— choose —</option>
              <option value="" *ngIf="!customers.length" disabled>Add a customer first</option>
              <option *ngFor="let c of customers" [value]="c._id">{{ c.fullName }}</option>
            </select>
          </div>
          <div class="field"><label>Amount Deposited</label><input type="number" [(ngModel)]="form.amount" placeholder="e.g. 50000" /></div>
          <div class="field"><label>Date</label><input type="date" [(ngModel)]="form.date" /></div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-outline" (click)="showModal = false">Cancel</button>
          <button class="btn btn-primary" [disabled]="saving" (click)="save()">Save Deposit</button>
        </div>
      </div>
    </div>
  `,
})
export class AdvancesComponent implements OnInit {
  advances: Advance[] = [];
  customers: Customer[] = [];
  search = '';
  showModal = false;
  saving = false;
  form: { customerId: string; amount: number | null; date: string } = {
    customerId: '',
    amount: null,
    date: todayIso(),
  };

  fmtDate = fmtDate;
  fmtMoney = fmtMoney;

  constructor(private advanceService: AdvanceService, private customerService: CustomerService, private toast: ToastService) {}

  ngOnInit(): void {
    this.load();
    this.customerService.list().subscribe((res) => (this.customers = res.data));
  }

  load(): void {
    this.advanceService.list().subscribe((res) => (this.advances = res.data));
  }

  filtered(): Advance[] {
    const q = this.search.toLowerCase();
    if (!q) return this.advances;
    return this.advances.filter((a) => this.customerName(a).toLowerCase().includes(q));
  }

  customerName(a: Advance): string {
    return typeof a.customerId === 'string' ? '—' : a.customerId?.fullName || '—';
  }

  openModal(): void {
    this.form = { customerId: '', amount: null, date: todayIso() };
    this.showModal = true;
  }

  save(): void {
    if (!this.form.customerId || !this.form.amount || this.form.amount <= 0) {
      this.toast.error('Select a customer and enter a valid amount.');
      return;
    }
    this.saving = true;
    this.advanceService
      .create({ customerId: this.form.customerId, amount: this.form.amount, date: this.form.date })
      .subscribe({
        next: () => {
          this.saving = false;
          this.showModal = false;
          this.toast.success('Advance deposit recorded.');
          this.load();
        },
        error: () => (this.saving = false),
      });
  }

  closeOnBackdrop(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) this.showModal = false;
  }
}
