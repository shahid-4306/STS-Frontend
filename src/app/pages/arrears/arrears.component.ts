import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { BillService } from '../../services/bill.service';
import { PaymentService } from '../../services/payment.service';
import { ArrearsService } from '../../services/arrears.service';
import { ToastService } from '../../services/toast.service';
import { Customer, Bill, Arrears } from '../../models';
import { fmtDate, fmtMoney, todayIso } from '../../shared/format.util';

interface Owing {
  customer: Customer;
  due: number;
}

@Component({
  selector: 'app-arrears',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="toolbar">
      <div class="left">
        <input type="text" [(ngModel)]="search" placeholder="Search customer…" style="width:260px;" />
      </div>
      <button class="btn btn-primary" (click)="openAddModal()">
        <i class="fa-solid fa-circle-plus"></i>&nbsp;Add Arrears
      </button>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));">
      <div class="kpi warn">
        <div class="lbl">Total Outstanding</div>
        <div class="val">{{ fmtMoney(totalDue()) }}</div>
        <div class="sub">across {{ owing.length }} customer(s)</div>
      </div>
      <div class="kpi">
        <div class="lbl">Manually Recorded Arrears</div>
        <div class="val">{{ fmtMoney(totalManualArrears()) }}</div>
        <div class="sub">not yet folded into a bill</div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head"><h3>Customers with Outstanding Balance</h3></div>
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Customer</th><th>City</th><th>Phone</th><th class="right">Outstanding</th><th></th></tr></thead>
            <tbody>
              <tr *ngFor="let x of filteredOwing()">
                <td><strong>{{ x.customer.fullName }}</strong></td>
                <td>{{ x.customer.city }}</td>
                <td class="num">{{ x.customer.phone }}</td>
                <td class="right num" style="color:var(--rust);font-weight:600;">{{ fmtMoney(x.due) }}</td>
                <td><button class="btn btn-sm btn-dark" (click)="openCollect(x.customer)">Collect Payment</button></td>
              </tr>
              <tr class="empty-row" *ngIf="!filteredOwing().length">
                <td colspan="5">
                  <i class="fa-solid fa-circle-check" style="color:var(--green);margin-right:6px;"></i>
                  No outstanding balances — all customers are settled.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head">
        <h3>Manually Recorded Arrears</h3>
      </div>
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Arrears ID</th><th>Customer</th><th>Date</th><th class="right">Amount</th><th class="right">Remaining</th><th>Remarks</th><th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of filteredEntries()">
                <td class="num muted">{{ a.displayId }}</td>
                <td>{{ customerName(a) }}</td>
                <td>{{ fmtDate(a.date) }}</td>
                <td class="right num">{{ fmtMoney(a.amount) }}</td>
                <td class="right num" [style.color]="a.remainingArrears > 0 ? 'var(--rust)' : 'var(--ink-faint)'">
                  {{ fmtMoney(a.remainingArrears) }}
                </td>
                <td class="muted">{{ a.remarks || '—' }}</td>
                <td>
                  <div class="row-actions">
                    <button class="icon-btn" title="Edit" (click)="openEditModal(a)"><i class="fa-solid fa-pen"></i></button>
                    <button class="icon-btn danger" title="Delete" (click)="deleteEntry(a)"><i class="fa-solid fa-trash"></i></button>
                  </div>
                </td>
              </tr>
              <tr class="empty-row" *ngIf="!filteredEntries().length">
                <td colspan="7">No arrears entries recorded yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ADD / EDIT ARREARS MODAL -->
    <div class="modal-backdrop" *ngIf="showEntryModal" (click)="closeOnBackdrop($event)">
      <div class="modal">
        <div class="modal-head">
          <h3>{{ editingEntry ? 'Edit Arrears Entry' : 'Add Arrears' }}</h3>
          <button class="modal-close" (click)="showEntryModal = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="field">
            <label>Customer</label>
            <select [(ngModel)]="entryForm.customerId" [disabled]="!!editingEntry">
              <option value="" *ngIf="customers.length">— choose —</option>
              <option value="" *ngIf="!customers.length" disabled>Add a customer first</option>
              <option *ngFor="let c of customers" [value]="c._id">{{ c.fullName }}</option>
            </select>
          </div>
          <div class="field"><label>Arrears Amount</label><input type="number" min="0" [(ngModel)]="entryForm.amount" placeholder="e.g. 15000" /></div>
          <div class="field"><label>Date</label><input type="date" [(ngModel)]="entryForm.date" /></div>
          <div class="field"><label>Remarks</label><input [(ngModel)]="entryForm.remarks" placeholder="Optional — reason / reference" /></div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-outline" (click)="showEntryModal = false">Cancel</button>
          <button class="btn btn-primary" [disabled]="savingEntry" (click)="saveEntry()">
            {{ savingEntry ? 'Saving…' : (editingEntry ? 'Save Changes' : 'Save Arrears') }}
          </button>
        </div>
      </div>
    </div>

    <!-- COLLECT PAYMENT MODAL -->
    <div class="modal-backdrop" *ngIf="showModal" (click)="closeOnBackdrop($event)">
      <div class="modal">
        <div class="modal-head">
          <h3>Collect Payment — {{ activeCustomer?.fullName }}</h3>
          <button class="modal-close" (click)="showModal = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="field">
            <label>Select Unpaid Bill</label>
            <select [(ngModel)]="form.billId">
              <option *ngFor="let b of unpaidBills" [value]="b._id">
                {{ b.displayId }} — Due {{ fmtMoney(b.remainingBalance) }} ({{ fmtDate(b.date) }})
              </option>
            </select>
          </div>
          <div class="field"><label>Amount Received</label><input type="number" [(ngModel)]="form.amount" /></div>
          <div class="field">
            <label>Payment Method</label>
            <select [(ngModel)]="form.method">
              <option>Bank Transfer</option>
              <option>Cash</option>
              <option>Cheque</option>
              <option>Online</option>
            </select>
          </div>
          <div class="field"><label>Remarks</label><input [(ngModel)]="form.remarks" placeholder="Optional" /></div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-outline" (click)="showModal = false">Cancel</button>
          <button class="btn btn-primary" [disabled]="saving" (click)="save()">Record Payment</button>
        </div>
      </div>
    </div>
  `,
})
export class ArrearsComponent implements OnInit {
  owing: Owing[] = [];
  entries: Arrears[] = [];
  customers: Customer[] = [];
  search = '';

  showModal = false;
  saving = false;
  activeCustomer: Customer | null = null;
  unpaidBills: Bill[] = [];
  form: { billId: string; amount: number | null; method: string; remarks: string } = {
    billId: '',
    amount: null,
    method: 'Bank Transfer',
    remarks: '',
  };

  showEntryModal = false;
  savingEntry = false;
  editingEntry: Arrears | null = null;
  entryForm: { customerId: string; amount: number | null; date: string; remarks: string } = {
    customerId: '',
    amount: null,
    date: todayIso(),
    remarks: '',
  };

  fmtDate = fmtDate;
  fmtMoney = fmtMoney;

  constructor(
    private customerService: CustomerService,
    private billService: BillService,
    private paymentService: PaymentService,
    private arrearsService: ArrearsService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.load();
    this.customerService.list().subscribe((res) => (this.customers = res.data));
  }

  /** Reloads outstanding balances and manually-recorded arrears together, so the two stay in sync. */
  load(): void {
    this.customerService.list().subscribe((res) => {
      this.owing = res.data.filter((c) => (c.outstanding || 0) > 0).map((c) => ({ customer: c, due: c.outstanding || 0 }));
      this.owing.sort((a, b) => b.due - a.due);
    });
    this.arrearsService.list().subscribe((res) => (this.entries = res.data));
  }

  filteredOwing(): Owing[] {
    const q = this.search.toLowerCase();
    if (!q) return this.owing;
    return this.owing.filter((x) => x.customer.fullName.toLowerCase().includes(q));
  }

  filteredEntries(): Arrears[] {
    const q = this.search.toLowerCase();
    if (!q) return this.entries;
    return this.entries.filter((a) => this.customerName(a).toLowerCase().includes(q));
  }

  totalDue(): number {
    return this.owing.reduce((s, x) => s + x.due, 0);
  }

  totalManualArrears(): number {
    return this.entries.reduce((s, a) => s + (a.remainingArrears || 0), 0);
  }

  customerName(a: Arrears): string {
    return typeof a.customerId === 'string' ? '—' : a.customerId?.fullName || '—';
  }

  /* -------------------- Manual arrears CRUD -------------------- */

  openAddModal(): void {
    this.editingEntry = null;
    this.entryForm = { customerId: '', amount: null, date: todayIso(), remarks: '' };
    this.showEntryModal = true;
  }

  openEditModal(entry: Arrears): void {
    this.editingEntry = entry;
    this.entryForm = {
      customerId: typeof entry.customerId === 'string' ? entry.customerId : entry.customerId._id,
      amount: entry.amount,
      date: (entry.date || '').slice(0, 10) || todayIso(),
      remarks: entry.remarks || '',
    };
    this.showEntryModal = true;
  }

  saveEntry(): void {
    if (!this.entryForm.customerId || !this.entryForm.amount || this.entryForm.amount <= 0) {
      this.toast.error('Select a customer and enter a valid arrears amount.');
      return;
    }
    this.savingEntry = true;
    const request = this.editingEntry
      ? this.arrearsService.update(this.editingEntry._id, {
          amount: this.entryForm.amount,
          date: this.entryForm.date,
          remarks: this.entryForm.remarks,
        })
      : this.arrearsService.create({
          customerId: this.entryForm.customerId,
          amount: this.entryForm.amount,
          date: this.entryForm.date,
          remarks: this.entryForm.remarks,
        });

    request.subscribe({
      next: () => {
        this.savingEntry = false;
        this.showEntryModal = false;
        this.toast.success(this.editingEntry ? 'Arrears entry updated.' : 'Arrears recorded for customer.');
        this.load();
      },
      error: (err) => {
        this.savingEntry = false;
        this.toast.error(err?.error?.message || 'Could not save this arrears entry.');
      },
    });
  }

  deleteEntry(entry: Arrears): void {
    if (!confirm(`Delete arrears entry ${entry.displayId}? This cannot be undone.`)) return;
    this.arrearsService.delete(entry._id).subscribe({
      next: () => {
        this.toast.success('Arrears entry deleted.');
        this.load();
      },
      error: (err) => this.toast.error(err?.error?.message || 'Could not delete this arrears entry.'),
    });
  }

  /* -------------------- Collect payment against outstanding bills -------------------- */

  openCollect(customer: Customer): void {
    this.activeCustomer = customer;
    this.form = { billId: '', amount: null, method: 'Bank Transfer', remarks: '' };
    this.billService.list({ customerId: customer._id, status: 'due' }).subscribe((res) => {
      this.billService.list({ customerId: customer._id, status: 'partial' }).subscribe((res2) => {
        this.unpaidBills = [...res.data, ...res2.data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        if (this.unpaidBills.length) this.form.billId = this.unpaidBills[0]._id;
        this.showModal = true;
      });
    });
  }

  save(): void {
    if (!this.form.billId || !this.form.amount || this.form.amount <= 0) {
      this.toast.error('Enter a valid amount.');
      return;
    }
    this.saving = true;
    this.paymentService
      .collect({ billId: this.form.billId, amount: this.form.amount, method: this.form.method, remarks: this.form.remarks })
      .subscribe({
        next: () => {
          this.saving = false;
          this.showModal = false;
          this.toast.success('Payment recorded.');
          this.load();
        },
        error: () => (this.saving = false),
      });
  }

  closeOnBackdrop(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.showModal = false;
      this.showEntryModal = false;
    }
  }
}
