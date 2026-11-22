// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { BillService } from '../../services/bill.service';
// import { CustomerService } from '../../services/customer.service';
// import { ToastService } from '../../services/toast.service';
// import { Bill, Customer } from '../../models';
// import { fmtDate, fmtMoney } from '../../shared/format.util';
// import { InvoicePreviewComponent } from '../../components/invoice-preview/invoice-preview.component';

// /** Derives the same paid/partial/due status used elsewhere from a bill's balances. */
// type BillStatus = 'paid' | 'partial' | 'due';

// function billStatus(b: Bill): BillStatus {
//   if (Number(b.remainingBalance) <= 0) return 'paid';
//   if (Number(b.receivedAmount) > 0) return 'partial';
//   return 'due';
// }

// @Component({
//   selector: 'app-billing-history',
//   standalone: true,
//   imports: [CommonModule, FormsModule, InvoicePreviewComponent],
//   template: `
//     <div class="toolbar">
//       <div class="left">
//         <select [(ngModel)]="customerId" (ngModelChange)="load()">
//           <option value="">All Customers</option>
//           <option *ngFor="let c of customers" [value]="c._id">{{ c.fullName }}</option>
//         </select>
//         <select [(ngModel)]="status" (ngModelChange)="load()">
//           <option value="">All Status</option>
//           <option value="paid">Paid</option>
//           <option value="partial">Partial</option>
//           <option value="due">Due</option>
//         </select>
//       </div>
//     </div>
//     <div class="panel">
//       <div class="panel-body">
//         <div class="table-wrap">
//           <table>
//             <thead>
//               <tr>
//                 <th>Bill #</th><th>Date</th><th>Customer</th><th class="right">Total</th>
//                 <th class="right">Received</th><th class="right">Remaining</th><th>Status</th><th></th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr *ngFor="let b of bills; trackBy: trackByBillId">
//                 <td class="num muted">{{ b.displayId }}</td>
//                 <td>{{ fmtDate(b.date) }}</td>
//                 <td>{{ customerName(b) }}</td>
//                 <td class="right num">{{ fmtMoney(b.grandTotal) }}</td>
//                 <td class="right num">{{ fmtMoney(b.receivedAmount) }}</td>
//                 <td class="right num" [style.color]="b.remainingBalance > 0 ? 'var(--rust)' : 'var(--green)'">
//                   {{ fmtMoney(b.remainingBalance) }}
//                 </td>
//                 <td>
//                   <span class="badge badge-paid" *ngIf="statusOf(b) === 'paid'">Paid</span>
//                   <span class="badge badge-partial" *ngIf="statusOf(b) === 'partial'">Partial</span>
//                   <span class="badge badge-due" *ngIf="statusOf(b) === 'due'">Due</span>
//                 </td>
//                 <td>
//                   <div class="row-actions">
//                     <button class="icon-btn" title="Edit Bill" (click)="editBill(b)"><i class="fa-solid fa-pen"></i></button>
//                     <button class="icon-btn" title="View / Print" (click)="viewBill = b"><i class="fa-solid fa-print"></i></button>
//                   </div>
//                 </td>
//               </tr>
//               <tr class="empty-row" *ngIf="!loading && !loadError && !bills.length">
//                 <td colspan="8">No bills match this filter.</td>
//               </tr>
//               <tr class="empty-row" *ngIf="loading">
//                 <td colspan="8">Loading bills…</td>
//               </tr>
//               <tr class="empty-row" *ngIf="!loading && loadError">
//                 <td colspan="8" style="color:var(--rust);">{{ loadError }}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>

//     <app-invoice-preview [bill]="viewBill" (close)="viewBill = null"></app-invoice-preview>
//   `,
// })
// export class BillingHistoryComponent implements OnInit {
//   bills: Bill[] = [];
//   customers: Customer[] = [];
//   customerId = '';
//   status = '';
//   viewBill: Bill | null = null;

//   loading = false;
//   loadError = '';

//   fmtDate = fmtDate;
//   fmtMoney = fmtMoney;
//   statusOf = billStatus;

//   constructor(
//     private billService: BillService,
//     private customerService: CustomerService,
//     private toast: ToastService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.customerService.list().subscribe({
//       next: (res) => (this.customers = res.data),
//       error: () => this.toast.error('Could not load the customer list for filtering.'),
//     });
//     this.load();
//   }

//   load(): void {
//     this.loading = true;
//     this.loadError = '';
//     this.billService.list({ customerId: this.customerId, status: this.status }).subscribe({
//       next: (res) => {
//         this.bills = Array.isArray(res.data) ? res.data : [];
//         this.loading = false;
//       },
//       error: (err) => {
//         this.loading = false;
//         this.bills = [];
//         this.loadError = err?.error?.message || 'Could not load bills. Please try again.';
//       },
//     });
//   }

//   trackByBillId(_index: number, b: Bill): string {
//     return b._id;
//   }

//   customerName(b: Bill): string {
//     return typeof b.customerId === 'string' ? '—' : b.customerId?.fullName || '—';
//   }

//   editBill(b: Bill): void {
//     this.router.navigate(['/newbill', b._id]);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BillService } from '../../services/bill.service';
import { CustomerService } from '../../services/customer.service';
import { InvoiceImageService } from '../../services/invoice-image.service';
import { ToastService } from '../../services/toast.service';
import { Bill, Customer, InvoiceImage } from '../../models';
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
          <option value="">Select Customer *</option>
          <option *ngFor="let c of customers" [value]="c._id">
            {{ c.fullName }}
          </option>
        </select>
        <select [(ngModel)]="status" (ngModelChange)="load()">
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="partial">Partial</option>
          <option value="due">Due</option>
        </select>
        <label
          class="muted"
          style="display:flex;align-items:center;gap:6px;font-size:13px;"
          >Starting Date
          <input
            type="date"
            [(ngModel)]="startDate"
            [max]="endDate || ''"
            (ngModelChange)="load()"
        /></label>
        <label
          class="muted"
          style="display:flex;align-items:center;gap:6px;font-size:13px;"
          >Ending Date
          <input
            type="date"
            [(ngModel)]="endDate"
            [min]="startDate || ''"
            (ngModelChange)="load()"
        /></label>
        <button
          class="btn btn-sm btn-outline"
          *ngIf="startDate || endDate"
          (click)="clearDates()"
        >
          Clear dates
        </button>
      </div>
    </div>
    <div class="panel">
      <div class="panel-body">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Bill #</th>
                <th>Date</th>
                <th>Customer</th>
                <th class="right">Total</th>
                <th class="right">Received</th>
                <th class="right">Remaining</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of bills; trackBy: trackByBillId">
                <td class="num muted">{{ b.displayId }}</td>
                <td>{{ fmtDate(b.date) }}</td>
                <td>{{ customerName(b) }}</td>
                <td class="right num">{{ fmtMoney(b.grandTotal) }}</td>
                <td class="right num">{{ fmtMoney(b.receivedAmount) }}</td>
                <td
                  class="right num"
                  [style.color]="
                    b.remainingBalance > 0 ? 'var(--rust)' : 'var(--green)'
                  "
                >
                  {{ fmtMoney(b.remainingBalance) }}
                </td>
                <td>
                  <span class="badge badge-paid" *ngIf="statusOf(b) === 'paid'"
                    >Paid</span
                  >
                  <span
                    class="badge badge-partial"
                    *ngIf="statusOf(b) === 'partial'"
                    >Partial</span
                  >
                  <span class="badge badge-due" *ngIf="statusOf(b) === 'due'"
                    >Due</span
                  >
                </td>
                <td>
                  <div class="row-actions">
                    <button
                      class="icon-btn"
                      title="Edit Bill"
                      (click)="editBill(b)"
                    >
                      <i class="fa-solid fa-pen"></i>
                    </button>
                    <button
                      class="icon-btn"
                      title="View / Print"
                      (click)="viewBill = b"
                    >
                      <i class="fa-solid fa-print"></i>
                    </button>
                    <button
                      class="icon-btn"
                      title="View saved bill image"
                      [disabled]="busyBillId === b._id"
                      (click)="viewImage(b)"
                    >
                      <i class="fa-solid fa-eye"></i>
                    </button>
                    <button
                      class="icon-btn danger"
                      title="Delete Bill"
                      [disabled]="busyBillId === b._id"
                      (click)="deleteBill(b)"
                    >
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr class="empty-row" *ngIf="!customerId">
                <td colspan="8">
                  Please select a customer to view bill history.
                </td>
              </tr>
              <tr
                class="empty-row"
                *ngIf="customerId && !loading && !loadError && !bills.length"
              >
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

    <app-invoice-preview
      [bill]="viewBill"
      (close)="viewBill = null"
    ></app-invoice-preview>

    <div
      class="modal-backdrop"
      *ngIf="imageBill"
      (click)="onImageBackdrop($event)"
    >
      <div class="modal wide">
        <div class="modal-head">
          <h3>Saved Bill Image — {{ imageBill.displayId }}</h3>
          <button class="modal-close" (click)="closeImage()">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="modal-body" style="text-align:center;">
          <div *ngIf="savedImages.length > 1" style="margin-bottom:12px;">
            <select [(ngModel)]="selectedImageId">
              <option
                *ngFor="let im of savedImages; let i = index"
                [value]="im._id"
              >
                {{ i === 0 ? 'Latest — ' : '' }}{{ im.fileName }} ({{
                  fmtDate(im.createdAt)
                }})
              </option>
            </select>
          </div>
          <img
            *ngIf="selectedImageUrl() as src"
            [src]="src"
            [alt]="'Saved image of bill ' + imageBill.displayId"
            style="max-width:100%;height:auto;border:1px solid var(--line);background:#fff;"
          />
        </div>
        <div class="modal-foot">
          <a
            *ngIf="selectedImageUrl() as src"
            class="btn btn-outline"
            [href]="src"
            target="_blank"
            rel="noopener"
            >Open in new tab</a
          >
          <button class="btn btn-outline" (click)="closeImage()">Close</button>
        </div>
      </div>
    </div>
  `,
})
export class BillingHistoryComponent implements OnInit {
  bills: Bill[] = [];
  customers: Customer[] = [];
  customerId = '';
  status = '';
  viewBill: Bill | null = null;

  startDate = '';
  endDate = '';
  imageBill: Bill | null = null;
  savedImages: InvoiceImage[] = [];
  selectedImageId = '';
  busyBillId = '';

  loading = false;
  loadError = '';

  fmtDate = fmtDate;
  fmtMoney = fmtMoney;
  statusOf = billStatus;

  constructor(
    private billService: BillService,
    private customerService: CustomerService,
    private invoiceImageService: InvoiceImageService,
    private toast: ToastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.customerService.list().subscribe({
      next: (res) => (this.customers = res.data),
      error: () =>
        this.toast.error('Could not load the customer list for filtering.'),
    });
    this.load();
  }

  load(): void {
    if (!this.customerId) {
      this.bills = [];
      this.loading = false;
      this.loadError = '';
      return;
    }
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      this.bills = [];
      this.loading = false;
      this.loadError = 'Starting Date cannot be after Ending Date.';
      return;
    }
    this.loading = true;
    this.loadError = '';
    this.billService
      .list({
        customerId: this.customerId,
        status: this.status,
        startDate: this.startDate,
        endDate: this.endDate,
      })
      .subscribe({
        next: (res) => {
          this.bills = Array.isArray(res.data) ? res.data : [];
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.bills = [];
          this.loadError =
            err?.error?.message || 'Could not load bills. Please try again.';
        },
      });
  }

  clearDates(): void {
    this.startDate = '';
    this.endDate = '';
    this.load();
  }

  trackByBillId(_index: number, b: Bill): string {
    return b._id;
  }

  customerName(b: Bill): string {
    return typeof b.customerId === 'string'
      ? '—'
      : b.customerId?.fullName || '—';
  }

  editBill(b: Bill): void {
    this.router.navigate(['/newbill', b._id]);
  }

  viewImage(b: Bill): void {
    this.busyBillId = b._id;
    this.invoiceImageService.listForBill(b._id).subscribe({
      next: (res) => {
        this.busyBillId = '';
        const images = res.data || [];
        if (!images.length) {
          this.toast.error(
            'No saved image exists for this bill yet. Open it with the print button and use "Download as Image" to save one.',
          );
          return;
        }
        this.savedImages = images;
        this.selectedImageId = images[0]._id;
        this.imageBill = b;
      },
      error: () => {
        this.busyBillId = '';
      },
    });
  }

  selectedImageUrl(): string {
    const img = this.savedImages.find((i) => i._id === this.selectedImageId);
    return img ? this.invoiceImageService.toAbsoluteUrl(img.url) : '';
  }

  closeImage(): void {
    this.imageBill = null;
    this.savedImages = [];
    this.selectedImageId = '';
  }

  onImageBackdrop(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop'))
      this.closeImage();
  }

  deleteBill(b: Bill): void {
    const ok = confirm(
      `Delete bill ${b.displayId}?\n\nThis permanently removes the bill, its payment records and its saved images, gives back any advance it used, and corrects the balances of this customer's other bills. This cannot be undone.`,
    );
    if (!ok) return;
    this.busyBillId = b._id;
    this.billService.delete(b._id).subscribe({
      next: () => {
        this.busyBillId = '';
        this.toast.success(`Bill ${b.displayId} deleted.`);
        if (this.viewBill?._id === b._id) this.viewBill = null;
        this.load();
      },
      error: () => {
        this.busyBillId = '';
      },
    });
  }
}
