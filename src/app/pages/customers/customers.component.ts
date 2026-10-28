import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { ToastService } from '../../services/toast.service';
import { Customer } from '../../models';
import { fmtDate, fmtMoney } from '../../shared/format.util';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="toolbar">
      <div class="left">
        <input type="text" [(ngModel)]="search" (ngModelChange)="onSearch()" placeholder="Search by name, city or phone…" style="width:280px;" />
      </div>
      <button class="btn btn-primary" (click)="openAdd()">+ Add Customer</button>
    </div>

    <div class="panel">
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Full Name</th>
                <th>City</th>
                <th>Phone</th>
                <th>Added</th>
                <th class="right">Outstanding</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of customers">
                <td class="num muted">{{ c.displayId }}</td>
                <td><strong>{{ c.fullName }}</strong></td>
                <td>{{ c.city }}</td>
                <td class="num">{{ c.phone }}</td>
                <td>{{ fmtDate(c.createdAt) }}</td>
                <td class="right num" [style.color]="(c.outstanding || 0) > 0 ? 'var(--rust)' : 'var(--green)'">
                  {{ fmtMoney(c.outstanding) }}
                </td>
                <td>
                  <div class="row-actions">
                    <button class="icon-btn" title="Edit" (click)="openEdit(c)"><i class="fa-solid fa-pen"></i></button>
                    <button class="icon-btn danger" title="Delete" (click)="remove(c)"><i class="fa-solid fa-trash"></i></button>
                  </div>
                </td>
              </tr>
              <tr class="empty-row" *ngIf="!customers.length && !loading">
                <td colspan="7">No customers found.</td>
              </tr>
              <tr class="empty-row" *ngIf="loading">
                <td colspan="7">Loading…</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="modal-backdrop" *ngIf="showModal" (click)="closeOnBackdrop($event)">
      <div class="modal">
        <div class="modal-head">
          <h3>{{ editing ? 'Edit Customer' : 'Add Customer' }}</h3>
          <button class="modal-close" (click)="showModal = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="field full">
              <label>Full Name</label>
              <input [(ngModel)]="form.fullName" placeholder="e.g. Waqas Traders" />
            </div>
            <div class="field">
              <label>City</label>
              <input [(ngModel)]="form.city" placeholder="e.g. Lahore" />
            </div>
            <div class="field">
              <label>Phone Number</label>
              <input [(ngModel)]="form.phone" placeholder="03xx-xxxxxxx" />
            </div>
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-outline" (click)="showModal = false">Cancel</button>
          <button class="btn btn-primary" [disabled]="saving" (click)="save()">
            {{ editing ? 'Save Changes' : 'Add Customer' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  search = '';
  loading = true;
  saving = false;
  showModal = false;
  editing: Customer | null = null;
  form: { fullName: string; city: string; phone: string } = { fullName: '', city: '', phone: '' };
  private searchTimeout: any;

  fmtDate = fmtDate;
  fmtMoney = fmtMoney;

  constructor(private customerService: CustomerService, private toast: ToastService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.customerService.list(this.search).subscribe({
      next: (res) => {
        this.customers = res.data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.load(), 300);
  }

  openAdd(): void {
    this.editing = null;
    this.form = { fullName: '', city: '', phone: '' };
    this.showModal = true;
  }

  openEdit(c: Customer): void {
    this.editing = c;
    this.form = { fullName: c.fullName, city: c.city, phone: c.phone };
    this.showModal = true;
  }

  save(): void {
    if (!this.form.fullName.trim() || !this.form.city.trim() || !this.form.phone.trim()) {
      this.toast.error('Please fill in all fields.');
      return;
    }
    this.saving = true;
    const obs = this.editing
      ? this.customerService.update(this.editing._id, this.form)
      : this.customerService.create(this.form);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.toast.success(this.editing ? 'Customer updated.' : 'Customer added.');
        this.load();
      },
      error: () => (this.saving = false),
    });
  }

  remove(c: Customer): void {
    if (!confirm('Delete this customer? Their bill history will remain but will no longer link to an active account.')) return;
    this.customerService.delete(c._id).subscribe({
      next: () => {
        this.toast.success('Customer deleted.');
        this.load();
      },
    });
  }

  closeOnBackdrop(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) this.showModal = false;
  }
}
