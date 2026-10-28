import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CustomerService } from '../../services/customer.service';
import { ToastService } from '../../services/toast.service';
import { Product, Customer } from '../../models';
import { fmtMoney } from '../../shared/format.util';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="toolbar">
      <div class="left">
        <select [(ngModel)]="customerId" (ngModelChange)="onCustomerChange()">
          <option value="" *ngIf="!customers.length" disabled>
            Add a customer first
          </option>
          <option value="" *ngIf="customers.length" disabled>
            — Choose customer —
          </option>
          <option *ngFor="let c of customers" [value]="c._id">
            {{ c.fullName }} — {{ c.city }}
          </option>
        </select>
        <input
          type="text"
          [(ngModel)]="search"
          (ngModelChange)="onSearch()"
          placeholder="Search by description or type…"
          style="width:260px;"
          [disabled]="!customerId"
        />
      </div>
      <button
        class="btn btn-primary"
        (click)="openAdd()"
        [disabled]="!customerId"
      >
        + Add Product
      </button>
    </div>

    <div class="panel" *ngIf="!customerId">
      <div class="empty-state">
        <div class="ic"><i class="fa-solid fa-box"></i></div>
        <h4>Select a customer first</h4>
        Every customer has their own product catalogue and pricing — choose a
        customer above to view or add their products.
      </div>
    </div>

    <div class="panel" *ngIf="customerId">
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Count #</th>
                <th>Description</th>
                <th>Type</th>
                <th>Qty / Packet</th>
                <th class="right">Rate</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of products">
                <td class="num muted">{{ p.countNumber }}</td>
                <td>
                  <strong>{{ p.description }}</strong>
                </td>
                <td>{{ p.type }}</td>
                <td>{{ p.qtyPerPacket }}</td>
                <td class="right num">{{ fmtMoney(p.rate) }}</td>
                <td>
                  <div class="row-actions">
                    <button class="icon-btn" title="Edit" (click)="openEdit(p)">
                      <i class="fa-solid fa-pen"></i>
                    </button>
                    <button
                      class="icon-btn danger"
                      title="Delete"
                      (click)="remove(p)"
                    >
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr class="empty-row" *ngIf="!products.length && !loading">
                <td colspan="6">
                  No products yet for this customer — add their catalogue.
                </td>
              </tr>
              <tr class="empty-row" *ngIf="loading">
                <td colspan="6">Loading…</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      class="modal-backdrop"
      *ngIf="showModal"
      (click)="closeOnBackdrop($event)"
    >
      <div class="modal">
        <div class="modal-head">
          <h3>
            {{ editing ? 'Edit Product' : 'Add Product' }} —
            {{ selectedCustomer()?.fullName }}
          </h3>
          <button class="modal-close" (click)="showModal = false"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="field">
              <label>Product / Count Number</label>
              <input [(ngModel)]="form.countNumber" placeholder="e.g. 01" />
            </div>
            <div class="field">
              <label>Product Type</label>
              <input [(ngModel)]="form.type" placeholder="e.g. ABC" />
            </div>
            <div class="field full">
              <label>Product Description</label>
              <input
                [(ngModel)]="form.description"
                placeholder="e.g. Premium Rice"
              />
            </div>
            <div class="field">
              <label>Quantity per Packet</label>
              <input
                [(ngModel)]="form.qtyPerPacket"
                placeholder="e.g. 50 per packet"
              />
            </div>
            <div class="field">
              <label>Unit Price (Rate)</label>
              <input
                type="number"
                [(ngModel)]="form.rate"
                placeholder="e.g. 1000"
              />
            </div>
          </div>
          <div class="field hint" style="margin-top:6px;">
            This product and price only apply to
            <strong>{{ selectedCustomer()?.fullName }}</strong
            >. Other customers keep their own separate catalogue.
          </div>
          <div class="field hint" style="margin-top:6px;" *ngIf="editing">
            Price changes only apply to bills created after saving — existing
            bills keep their original price.
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-outline" (click)="showModal = false">
            Cancel
          </button>
          <button class="btn btn-primary" [disabled]="saving" (click)="save()">
            {{ editing ? 'Save Changes' : 'Add Product' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProductsComponent implements OnInit {
  customers: Customer[] = [];
  customerId = '';
  products: Product[] = [];
  search = '';
  loading = false;
  saving = false;
  showModal = false;
  editing: Product | null = null;
  form: {
    countNumber: string;
    type: string;
    description: string;
    qtyPerPacket: string;
    rate: number | null;
  } = {
    countNumber: '',
    type: '',
    description: '',
    qtyPerPacket: '',
    rate: null,
  };
  private searchTimeout: any;
  fmtMoney = fmtMoney;

  constructor(
    private productService: ProductService,
    private customerService: CustomerService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.customerService.list().subscribe((res) => {
      this.customers = res.data;
    });
  }

  selectedCustomer(): Customer | undefined {
    return this.customers.find((c) => c._id === this.customerId);
  }

  onCustomerChange(): void {
    this.search = '';
    if (this.customerId) {
      this.load();
    } else {
      this.products = [];
    }
  }

  load(): void {
    if (!this.customerId) return;
    this.loading = true;
    this.productService.list(this.customerId, this.search).subscribe({
      next: (res) => {
        this.products = res.data;
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
    if (!this.customerId) {
      this.toast.error('Select a customer first.');
      return;
    }
    this.editing = null;
    this.form = {
      countNumber: '',
      type: '',
      description: '',
      qtyPerPacket: '',
      rate: null,
    };
    this.showModal = true;
  }

  openEdit(p: Product): void {
    this.editing = p;
    this.form = {
      countNumber: p.countNumber,
      type: p.type,
      description: p.description,
      qtyPerPacket: p.qtyPerPacket,
      rate: p.rate,
    };
    this.showModal = true;
  }

  save(): void {
    const { countNumber, type, description, qtyPerPacket, rate } = this.form;
    if (
      !countNumber.trim() ||
      !type.trim() ||
      !description.trim() ||
      !qtyPerPacket.trim() ||
      rate === null ||
      isNaN(rate)
    ) {
      this.toast.error('Please fill in all fields correctly.');
      return;
    }
    this.saving = true;
    const payload = {
      ...this.form,
      rate: Number(rate),
      customerId: this.customerId,
    };
    const obs = this.editing
      ? this.productService.update(this.editing._id, payload)
      : this.productService.create(payload);

    obs.subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.toast.success(
          this.editing ? 'Product updated.' : 'Product added.',
        );
        this.load();
      },
      error: () => (this.saving = false),
    });
  }

  remove(p: Product): void {
    if (
      !confirm(
        'Delete this product? It will no longer be selectable in new bills.',
      )
    )
      return;
    this.productService.delete(p._id).subscribe({
      next: () => {
        this.toast.success('Product deleted.');
        this.load();
      },
    });
  }

  closeOnBackdrop(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop'))
      this.showModal = false;
  }
}
