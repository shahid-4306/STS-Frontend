// // // import { Component, OnInit } from '@angular/core';
// // // import { CommonModule } from '@angular/common';
// // // import { FormsModule } from '@angular/forms';
// // // import { ActivatedRoute, Router } from '@angular/router';
// // // import { forkJoin } from 'rxjs';
// // // import { CustomerService } from '../../services/customer.service';
// // // import { ProductService } from '../../services/product.service';
// // // import { BillService } from '../../services/bill.service';
// // // import { ToastService } from '../../services/toast.service';
// // // import { Customer, Product, Bill, BillItem, BillGroup } from '../../models';
// // // import { fmtMoney, todayIso } from '../../shared/format.util';
// // // import { InvoicePreviewComponent } from '../../components/invoice-preview/invoice-preview.component';
// // // import { ProductSelectComponent } from '../../components/product-select/product-select.component';
// // // import { calcTotalQty, fmtQty } from '../../shared/bill-groups.util';

// // // interface DraftItem {
// // //   rowId: string;
// // //   productId: string;
// // //   packets: number;
// // //   groupId: string;
// // //   savedSnapshot?: {
// // //     productName: string;
// // //     qtyPerPacket: string;
// // //     type: string;
// // //     unitPrice: number;
// // //   };
// // // }

// // // function newRequestId(): string {
// // //   const c: any = (globalThis as any).crypto;
// // //   if (c && typeof c.randomUUID === 'function') return c.randomUUID();
// // //   return (
// // //     'req-' +
// // //     Date.now().toString(36) +
// // //     '-' +
// // //     Math.random().toString(36).slice(2, 10)
// // //   );
// // // }

// // // @Component({
// // //   selector: 'app-new-bill',
// // //   standalone: true,
// // //   imports: [
// // //     CommonModule,
// // //     FormsModule,
// // //     InvoicePreviewComponent,
// // //     ProductSelectComponent,
// // //   ],
// // //   template: `
// // //     <div *ngIf="loadingBill" class="empty-state">
// // //       <div class="ic"><i class="fa-solid fa-spinner fa-spin"></i></div>
// // //       Loading bill…
// // //     </div>

// // //     <ng-container *ngIf="!loadingBill">
// // //       <div class="steps">
// // //         <div class="step" [class.active]="step === 1" [class.done]="step > 1">
// // //           <span class="n">1</span>Order Header
// // //         </div>
// // //         <div class="step" [class.active]="step === 2" [class.done]="step > 2">
// // //           <span class="n">2</span>Products
// // //         </div>
// // //         <div class="step" [class.active]="step === 3">
// // //           <span class="n">3</span>Billing Summary
// // //         </div>
// // //       </div>

// // //       <!-- STEP 1: ORDER HEADER -->
// // //       <ng-container *ngIf="step === 1">
// // //         <div class="panel">
// // //           <div class="panel-head"><h3>Order Header</h3></div>
// // //           <div class="panel-body pad">
// // //             <div class="form-grid">
// // //               <div class="field full">
// // //                 <label>Select Customer</label>
// // //                 <select
// // //                   [(ngModel)]="customerId"
// // //                   (ngModelChange)="onCustomerChange()"
// // //                   [disabled]="editMode"
// // //                 >
// // //                   <option value="" *ngIf="customers.length">
// // //                     — Choose customer —
// // //                   </option>
// // //                   <option value="" *ngIf="!customers.length" disabled>
// // //                     No customers found — add one first
// // //                   </option>
// // //                   <option *ngFor="let c of customers" [value]="c._id">
// // //                     {{ c.fullName }} — {{ c.city }}
// // //                   </option>
// // //                 </select>
// // //               </div>
// // //             </div>
// // //             <div class="grid-3" style="margin-top:4px;">
// // //               <div class="field">
// // //                 <label>Customer Name</label
// // //                 ><input disabled [value]="selectedCustomer()?.fullName || ''" />
// // //               </div>
// // //               <div class="field">
// // //                 <label>Phone Number</label
// // //                 ><input disabled [value]="selectedCustomer()?.phone || ''" />
// // //               </div>
// // //               <div class="field">
// // //                 <label>City</label
// // //                 ><input disabled [value]="selectedCustomer()?.city || ''" />
// // //               </div>
// // //             </div>
// // //             <div
// // //               class="field"
// // //               *ngIf="customerId"
// // //               style="max-width:280px;margin-top:4px;"
// // //             >
// // //               <label
// // //                 >Existing Arrears
// // //                 <span class="badge badge-due" *ngIf="loadingArrears"
// // //                   >checking…</span
// // //                 ></label
// // //               >
// // //               <input
// // //                 disabled
// // //                 [value]="fmtMoney(previousArrears)"
// // //                 style="font-family:var(--font-mono);font-weight:600;"
// // //               />
// // //               <div class="hint">
// // //                 Fetched automatically for this customer — carried forward into
// // //                 this bill's summary.
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //         <div class="panel">
// // //           <div class="panel-head"><h3>Delivery Information</h3></div>
// // //           <div class="panel-body pad">
// // //             <div class="grid-3">
// // //               <div class="field">
// // //                 <label>Bilti Number</label
// // //                 ><input [(ngModel)]="biltiNumber" placeholder="e.g. BL-4471" />
// // //               </div>
// // //               <div class="field">
// // //                 <label>Driver Name</label
// // //                 ><input
// // //                   [(ngModel)]="driverName"
// // //                   placeholder="e.g. Naseer Ahmed"
// // //                 />
// // //               </div>
// // //               <div class="field">
// // //                 <label>Driver Phone Number</label
// // //                 ><input [(ngModel)]="driverPhone" placeholder="03xx-xxxxxxx" />
// // //               </div>
// // //             </div>
// // //             <div class="field" style="margin-top:14px;max-width:220px;">
// // //               <label>Bill Date</label><input type="date" [(ngModel)]="date" />
// // //             </div>
// // //           </div>
// // //         </div>
// // //         <div style="display:flex;justify-content:flex-end;gap:10px;">
// // //           <button class="btn btn-outline" (click)="cancel()">Cancel</button>
// // //           <button class="btn btn-primary" (click)="goToItems()">
// // //             Next: Add Products&nbsp;<i class="fa-solid fa-arrow-right"></i>
// // //           </button>
// // //         </div>
// // //       </ng-container>

// // //       <!-- STEP 2: PRODUCTS -->
// // //       <ng-container *ngIf="step === 2">
// // //         <ng-template #rowsTpl let-gid="gid">
// // //           <div
// // //             class="item-row"
// // //             *ngFor="
// // //               let item of rowsOf(gid);
// // //               let idx = index;
// // //               trackBy: trackByRowId
// // //             "
// // //           >
// // //             <div class="num muted">{{ idx + 1 }}</div>
// // //             <app-product-select
// // //               [products]="products"
// // //               [customerId]="customerId"
// // //               [value]="item.productId"
// // //               (valueChange)="onProductPicked(item, $event)"
// // //             ></app-product-select>
// // //             <input disabled [value]="fmtMoney(unitPriceOf(item))" />
// // //             <input
// // //               type="number"
// // //               min="1"
// // //               step="1"
// // //               placeholder="Enter qty"
// // //               autocomplete="off"
// // //               [(ngModel)]="item.packets"
// // //               (ngModelChange)="onPacketsChange(item)"
// // //               (focus)="selectOnFocus($event)"
// // //             />
// // //             <div class="right num">{{ fmtMoney(lineTotal(item)) }}</div>
// // //             <button
// // //               class="icon-btn danger"
// // //               title="Remove row"
// // //               (click)="removeRow(item.rowId)"
// // //             >
// // //               <i class="fa-solid fa-xmark"></i>
// // //             </button>
// // //           </div>
// // //         </ng-template>

// // //         <div class="panel">
// // //           <div class="panel-head"><h3>Bill Items</h3></div>
// // //           <div class="panel-body pad">
// // //             <div class="table-wrap">
// // //               <div class="item-row head">
// // //                 <div>#</div>
// // //                 <div>Product</div>
// // //                 <div>Unit Price</div>
// // //                 <div>Packets</div>
// // //                 <div class="right">Total</div>
// // //                 <div></div>
// // //               </div>
// // //               <div
// // //                 *ngIf="!items.length && !groups.length"
// // //                 class="empty-state"
// // //                 style="padding:26px;"
// // //               >
// // //                 <div class="ic"><i class="fa-solid fa-table-list"></i></div>
// // //                 Click "Add Row" to select products for this bill.
// // //               </div>
// // //               <ng-container
// // //                 *ngTemplateOutlet="rowsTpl; context: { gid: '' }"
// // //               ></ng-container>
// // //             </div>

// // //             <div
// // //               class="group-block"
// // //               *ngFor="let g of groups; let gi = index; trackBy: trackByGroupId"
// // //             >
// // //               <div class="group-head">
// // //                 <i class="fa-solid fa-user muted"></i>
// // //                 <input
// // //                   class="group-name"
// // //                   [(ngModel)]="g.personName"
// // //                   maxlength="100"
// // //                   placeholder="Person name (e.g. Ahmed)"
// // //                   autocomplete="off"
// // //                 />
// // //                 <button
// // //                   class="icon-btn danger"
// // //                   title="Remove this person and their rows"
// // //                   (click)="removeGroup(g.groupId)"
// // //                 >
// // //                   <i class="fa-solid fa-trash"></i>
// // //                 </button>
// // //               </div>
// // //               <div class="table-wrap">
// // //                 <div class="item-row head">
// // //                   <div>#</div>
// // //                   <div>Product</div>
// // //                   <div>Unit Price</div>
// // //                   <div>Packets</div>
// // //                   <div class="right">Total</div>
// // //                   <div></div>
// // //                 </div>
// // //                 <div
// // //                   *ngIf="!rowsOf(g.groupId).length"
// // //                   class="empty-state"
// // //                   style="padding:14px;"
// // //                 >
// // //                   No rows yet for this person.
// // //                 </div>
// // //                 <ng-container
// // //                   *ngTemplateOutlet="rowsTpl; context: { gid: g.groupId }"
// // //                 ></ng-container>
// // //               </div>
// // //               <div class="group-foot">
// // //                 <button
// // //                   class="btn btn-sm btn-outline"
// // //                   (click)="addRow(g.groupId)"
// // //                 >
// // //                   <i class="fa-solid fa-plus"></i>&nbsp;Add Row
// // //                 </button>
// // //                 <div>
// // //                   Total{{
// // //                     g.personName.trim() ? ' — ' + g.personName.trim() : ''
// // //                   }}:
// // //                   <strong class="num">{{
// // //                     fmtMoney(groupTotal(g.groupId))
// // //                   }}</strong>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             <div class="bill-items-actions" style="margin-top:14px;">
// // //               <div style="display:flex;gap:8px;flex-wrap:wrap;">
// // //                 <button class="btn btn-sm btn-dark" (click)="addRow('')">
// // //                   <i class="fa-solid fa-plus"></i>&nbsp;Add Row
// // //                 </button>
// // //                 <button class="btn btn-sm btn-outline" (click)="addGroup()">
// // //                   <i class="fa-solid fa-user-plus"></i>&nbsp;Add Person Name
// // //                 </button>
// // //               </div>
// // //               <div style="font-size:15px;">
// // //                 Items Subtotal:
// // //                 <strong class="num">{{ fmtMoney(itemsSubtotal()) }}</strong>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //         <div style="display:flex;justify-content:space-between;gap:10px;">
// // //           <button class="btn btn-outline" (click)="step = 1">
// // //             <i class="fa-solid fa-arrow-left"></i>&nbsp;Back
// // //           </button>
// // //           <button class="btn btn-primary" (click)="goToSummary()">
// // //             Next: Billing Summary&nbsp;<i class="fa-solid fa-arrow-right"></i>
// // //           </button>
// // //         </div>
// // //       </ng-container>

// // //       <!-- STEP 3: BILLING SUMMARY -->
// // //       <ng-container *ngIf="step === 3">
// // //         <div class="grid-2">
// // //           <div class="panel">
// // //             <div class="panel-head">
// // //               <h3>Billing Summary — {{ selectedCustomer()?.fullName }}</h3>
// // //             </div>
// // //             <div class="panel-body pad">
// // //               <div class="summary-line">
// // //                 <span>Subtotal</span
// // //                 ><span class="v">{{ fmtMoney(itemsSubtotal()) }}</span>
// // //               </div>
// // //               <div class="summary-line">
// // //                 <span>Discount</span
// // //                 ><input
// // //                   type="number"
// // //                   autocomplete="off"
// // //                   [(ngModel)]="discount"
// // //                   (ngModelChange)="recalc()"
// // //                   (focus)="selectOnFocus($event)"
// // //                 />
// // //               </div>
// // //               <div class="summary-line">
// // //                 <span>Delivery Charges</span
// // //                 ><input
// // //                   type="number"
// // //                   autocomplete="off"
// // //                   [(ngModel)]="deliveryCharges"
// // //                   (ngModelChange)="recalc()"
// // //                   (focus)="selectOnFocus($event)"
// // //                 />
// // //               </div>
// // //               <div class="summary-line">
// // //                 <span>Rent Charges</span
// // //                 ><input
// // //                   type="number"
// // //                   autocomplete="off"
// // //                   [(ngModel)]="rentCharges"
// // //                   (ngModelChange)="recalc()"
// // //                   (focus)="selectOnFocus($event)"
// // //                 />
// // //               </div>
// // //               <div class="summary-line">
// // //                 <span>Extra Charges</span
// // //                 ><input
// // //                   type="number"
// // //                   autocomplete="off"
// // //                   [(ngModel)]="extraCharges"
// // //                   (ngModelChange)="recalc()"
// // //                   (focus)="selectOnFocus($event)"
// // //                 />
// // //               </div>
// // //               <div class="summary-line">
// // //                 <span
// // //                   >Previous Arrears
// // //                   <span class="badge badge-due" *ngIf="previousArrears > 0"
// // //                     >auto</span
// // //                   ></span
// // //                 ><span class="v">{{ fmtMoney(previousArrears) }}</span>
// // //               </div>
// // //               <div class="summary-line">
// // //                 <span
// // //                   >Advance Adjustment
// // //                   <span class="muted"
// // //                     >(available {{ fmtMoney(availableAdvance) }})</span
// // //                   ></span
// // //                 >
// // //                 <input
// // //                   type="number"
// // //                   autocomplete="off"
// // //                   [(ngModel)]="advanceUsed"
// // //                   [max]="availableAdvance"
// // //                   (ngModelChange)="recalc()"
// // //                   (focus)="selectOnFocus($event)"
// // //                 />
// // //               </div>
// // //               <div class="summary-line total">
// // //                 <span>Grand Total</span
// // //                 ><span class="v">{{ fmtMoney(grandTotal) }}</span>
// // //               </div>
// // //               <div class="summary-line" style="margin-top:10px;">
// // //                 <span>Received Amount</span
// // //                 ><input
// // //                   type="number"
// // //                   autocomplete="off"
// // //                   [(ngModel)]="receivedAmount"
// // //                   (ngModelChange)="recalc()"
// // //                   (focus)="selectOnFocus($event)"
// // //                 />
// // //               </div>
// // //               <div class="summary-line">
// // //                 <span>Payment Method</span>
// // //                 <select
// // //                   [(ngModel)]="paymentMethod"
// // //                   style="padding:6px 8px;border:1.5px solid var(--line);border-radius:var(--radius);"
// // //                 >
// // //                   <option>Bank Transfer</option>
// // //                   <option>Cash</option>
// // //                   <option>Cheque</option>
// // //                   <option>Online</option>
// // //                 </select>
// // //               </div>
// // //               <div class="summary-line total" style="border-top:none;">
// // //                 <span>Remaining Balance</span>
// // //                 <span
// // //                   class="v"
// // //                   [style.color]="remaining > 0 ? 'var(--rust)' : 'var(--green)'"
// // //                   >{{ fmtMoney(remaining) }}</span
// // //                 >
// // //               </div>
// // //               <div class="field" style="margin-top:14px;">
// // //                 <label>Remarks</label>
// // //                 <textarea
// // //                   rows="2"
// // //                   [(ngModel)]="remarks"
// // //                   placeholder="Optional notes for this bill"
// // //                 ></textarea>
// // //               </div>
// // //             </div>
// // //           </div>
// // //           <div class="panel">
// // //             <div class="panel-head"><h3>Items in this Bill</h3></div>
// // //             <div class="panel-body pad">
// // //               <div class="table-wrap">
// // //                 <table>
// // //                   <thead>
// // //                     <tr>
// // //                       <th>#</th>
// // //                       <th>Person</th>
// // //                       <th>Product</th>
// // //                       <th class="right">Packets</th>
// // //                       <th class="right">Rate</th>
// // //                       <th class="right">Total</th>
// // //                     </tr>
// // //                   </thead>
// // //                   <tbody *ngFor="let sec of draftSections()">
// // //                     <tr *ngFor="let i of sec.rows; let idx = index">
// // //                       <td class="num muted">{{ idx + 1 }}</td>
// // //                       <!-- Yahan dash nahi hai, sirf name aayega. Agar name blank hoga to column khali rahega -->
// // //                       <td style="font-weight: 600;">{{ sec.personName }}</td>
// // //                       <td>{{ productNameOf(i) }}</td>
// // //                       <td class="right num">{{ i.packets }}</td>
// // //                       <td class="right num">{{ fmtMoney(unitPriceOf(i)) }}</td>
// // //                       <td class="right num">{{ fmtMoney(lineTotal(i)) }}</td>
// // //                     </tr>
// // //                   </tbody>
// // //                   <tfoot>
// // //                     <tr class="total-row">
// // //                       <td colspan="2" style="vertical-align: top;">Total</td>
// // //                       <td
// // //                         colspan="2"
// // //                         style="vertical-align: top; padding-left: 10px;"
// // //                       >
// // //                         <div
// // //                           *ngFor="let p of namedPersons()"
// // //                           style="font-size: 11px; font-weight: normal; color: var(--ink-faint);"
// // //                         >
// // //                           {{ p.name }}: {{ fmtMoney(p.total) }}
// // //                         </div>
// // //                       </td>
// // //                       <td class="right num" style="vertical-align: bottom;">
// // //                         {{ totalPackets() }}
// // //                       </td>
// // //                       <td class="right num" style="vertical-align: bottom;">
// // //                         {{ fmtMoney(itemsSubtotal()) }}
// // //                       </td>
// // //                     </tr>
// // //                   </tfoot>
// // //                 </table>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //         <div style="display:flex;justify-content:space-between;gap:10px;">
// // //           <button class="btn btn-outline" (click)="step = 2">
// // //             <i class="fa-solid fa-arrow-left"></i>&nbsp;Back
// // //           </button>
// // //           <button
// // //             class="btn btn-primary"
// // //             [disabled]="saving"
// // //             (click)="submitBill()"
// // //           >
// // //             <i class="fa-solid fa-check"></i>&nbsp;{{
// // //               editMode ? 'Save Changes' : 'Save & Generate Invoice'
// // //             }}
// // //           </button>
// // //         </div>
// // //       </ng-container>
// // //     </ng-container>

// // //     <app-invoice-preview
// // //       [bill]="savedBill"
// // //       (close)="onInvoiceClosed()"
// // //     ></app-invoice-preview>
// // //   `,
// // // })
// // // export class NewBillComponent implements OnInit {
// // //   step = 1;
// // //   customers: Customer[] = [];
// // //   products: Product[] = [];
// // //   customerId = '';
// // //   biltiNumber = '';
// // //   driverName = '';
// // //   driverPhone = '';
// // //   date = todayIso();
// // //   items: DraftItem[] = [];
// // //   groups: { groupId: string; personName: string }[] = [];
// // //   private requestId = newRequestId();
// // //   private rowSeq = 0;
// // //   discount = 0;
// // //   deliveryCharges = 0;
// // //   rentCharges = 0;
// // //   extraCharges = 0;
// // //   advanceUsed = 0;
// // //   receivedAmount = 0;
// // //   paymentMethod = 'Bank Transfer';
// // //   remarks = '';
// // //   previousArrears = 0;
// // //   loadingArrears = false;
// // //   availableAdvance = 0;
// // //   grandTotal = 0;
// // //   remaining = 0;
// // //   saving = false;
// // //   savedBill: Bill | null = null;
// // //   editMode = false;
// // //   editingBillId: string | null = null;
// // //   loadingBill = false;
// // //   fmtMoney = fmtMoney;

// // //   constructor(
// // //     private customerService: CustomerService,
// // //     private productService: ProductService,
// // //     private billService: BillService,
// // //     private toast: ToastService,
// // //     private route: ActivatedRoute,
// // //     private router: Router,
// // //   ) {}

// // //   ngOnInit(): void {
// // //     this.customerService.list().subscribe({
// // //       next: (res) => (this.customers = res.data),
// // //       error: () => this.toast.error('Could not load the customer list.'),
// // //     });
// // //     const id = this.route.snapshot.paramMap.get('id');
// // //     if (id) {
// // //       this.editMode = true;
// // //       this.editingBillId = id;
// // //       this.loadBillForEdit(id);
// // //     }
// // //   }

// // //   private loadBillForEdit(id: string): void {
// // //     this.loadingBill = true;
// // //     this.loadingArrears = true;
// // //     this.billService.get(id).subscribe({
// // //       next: (res) => {
// // //         const bill = res.data;
// // //         const customer = bill.customerId as Customer;
// // //         this.customerId =
// // //           typeof customer === 'string' ? customer : customer?._id || '';
// // //         this.biltiNumber = bill.biltiNumber || '';
// // //         this.driverName = bill.driverName || '';
// // //         this.driverPhone = bill.driverPhone || '';
// // //         this.date = (bill.date || '').slice(0, 10) || todayIso();
// // //         const billItems = bill.items || [];
// // //         this.groups = (bill.groups || []).map((g: BillGroup) => ({
// // //           groupId: g.groupId,
// // //           personName: g.personName,
// // //         }));
// // //         const knownGroups = new Set(this.groups.map((g) => g.groupId));
// // //         this.items = billItems.map((i) => ({
// // //           rowId: this.nextRowId(),
// // //           groupId: i.groupId && knownGroups.has(i.groupId) ? i.groupId : '',
// // //           productId:
// // //             typeof i.productId === 'string' ? i.productId : String(i.productId),
// // //           packets: Number(i.packets) || 1,
// // //           savedSnapshot: {
// // //             productName: i.productName || '',
// // //             qtyPerPacket: i.qtyPerPacket || '',
// // //             type: i.type || '',
// // //             unitPrice: Number(i.unitPrice) || 0,
// // //           },
// // //         }));
// // //         this.discount = Number(bill.discount) || 0;
// // //         this.deliveryCharges = Number(bill.deliveryCharges) || 0;
// // //         this.rentCharges = Number(bill.rentCharges) || 0;
// // //         this.extraCharges = Number(bill.extraCharges) || 0;
// // //         this.advanceUsed = Number(bill.advanceUsed) || 0;
// // //         this.receivedAmount = Number(bill.receivedAmount) || 0;
// // //         this.paymentMethod = bill.paymentMethod || 'Bank Transfer';
// // //         this.remarks = bill.remarks || '';
// // //         if (!this.customerId) {
// // //           this.loadingBill = false;
// // //           this.loadingArrears = false;
// // //           this.toast.error(
// // //             'This bill has no valid customer on record and cannot be edited.',
// // //           );
// // //           this.router.navigate(['/billinghistory']);
// // //           return;
// // //         }
// // //         forkJoin({
// // //           products: this.productService.list(this.customerId),
// // //           context: this.billService.getBillingContext(
// // //             this.customerId,
// // //             this.editingBillId || undefined,
// // //           ),
// // //         }).subscribe({
// // //           next: ({ products, context }) => {
// // //             this.products = this.withMissingBillProducts(
// // //               products.data,
// // //               billItems,
// // //             );
// // //             this.previousArrears = context.data.previousArrears;
// // //             this.availableAdvance = context.data.availableAdvance;
// // //             this.loadingBill = false;
// // //             this.loadingArrears = false;
// // //           },
// // //           error: () => {
// // //             this.loadingBill = false;
// // //             this.loadingArrears = false;
// // //             this.toast.error(
// // //               "Bill loaded, but this customer's product catalogue or arrears could not be loaded.",
// // //             );
// // //           },
// // //         });
// // //       },
// // //       error: (err) => {
// // //         this.loadingBill = false;
// // //         this.loadingArrears = false;
// // //         this.toast.error(
// // //           err?.error?.message || 'Could not load this bill for editing.',
// // //         );
// // //         this.router.navigate(['/billinghistory']);
// // //       },
// // //     });
// // //   }

// // //   private withMissingBillProducts(
// // //     liveProducts: Product[],
// // //     billItems: BillItem[],
// // //   ): Product[] {
// // //     const known = new Set(liveProducts.map((p) => p._id));
// // //     const synthesized: Product[] = [];
// // //     const seen = new Set<string>();
// // //     for (const i of billItems) {
// // //       const id =
// // //         typeof i.productId === 'string' ? i.productId : String(i.productId);
// // //       if (!id || known.has(id) || seen.has(id)) continue;
// // //       seen.add(id);
// // //       synthesized.push({
// // //         _id: id,
// // //         customerId: this.customerId,
// // //         countNumber: '',
// // //         type: i.type || '',
// // //         description: i.productName
// // //           ? `${i.productName} (no longer in catalogue)`
// // //           : 'Unavailable product',
// // //         qtyPerPacket: i.qtyPerPacket || '',
// // //         rate: Number(i.unitPrice) || 0,
// // //         createdAt: '',
// // //       });
// // //     }
// // //     return synthesized.length
// // //       ? [...liveProducts, ...synthesized]
// // //       : liveProducts;
// // //   }

// // //   selectedCustomer(): Customer | undefined {
// // //     return this.customers.find((c) => c._id === this.customerId);
// // //   }

// // //   onCustomerChange(): void {
// // //     if (this.editMode) return;
// // //     this.products = [];
// // //     this.items = [];
// // //     this.groups = [];
// // //     this.previousArrears = 0;
// // //     if (this.customerId) this.fetchArrearsPreview(this.customerId);
// // //   }

// // //   private fetchArrearsPreview(customerId: string): void {
// // //     this.loadingArrears = true;
// // //     this.billService
// // //       .getBillingContext(
// // //         customerId,
// // //         this.editMode ? this.editingBillId || undefined : undefined,
// // //       )
// // //       .subscribe({
// // //         next: (res) => {
// // //           this.previousArrears = res.data.previousArrears;
// // //           this.availableAdvance = res.data.availableAdvance;
// // //           this.loadingArrears = false;
// // //         },
// // //         error: () => {
// // //           this.loadingArrears = false;
// // //         },
// // //       });
// // //   }

// // //   goToItems(): void {
// // //     if (!this.customerId) {
// // //       this.toast.error('Please select a customer first.');
// // //       return;
// // //     }
// // //     this.productService.list(this.customerId).subscribe({
// // //       next: (res) => {
// // //         this.products = res.data;
// // //         this.step = 2;
// // //       },
// // //       error: () =>
// // //         this.toast.error(
// // //           "Could not load this customer's products. Please try again.",
// // //         ),
// // //     });
// // //   }

// // //   private nextRowId(): string {
// // //     this.rowSeq += 1;
// // //     return 'row-' + this.rowSeq;
// // //   }
// // //   trackByRowId(_index: number, item: DraftItem): string {
// // //     return item.rowId;
// // //   }
// // //   addRow(groupId = ''): void {
// // //     if (!this.products.length) {
// // //       this.toast.error(
// // //         'This customer has no products yet — add their catalogue in Products & Price first.',
// // //       );
// // //       return;
// // //     }
// // //     this.items.push({
// // //       rowId: this.nextRowId(),
// // //       productId: '',
// // //       packets: 1,
// // //       groupId,
// // //     });
// // //   }
// // //   removeRow(rowId: string): void {
// // //     this.items = this.items.filter((i) => i.rowId !== rowId);
// // //   }
// // //   rowsOf(groupId: string): DraftItem[] {
// // //     return this.items.filter((i) => (i.groupId || '') === groupId);
// // //   }
// // //   trackByGroupId(_index: number, g: { groupId: string }): string {
// // //     return g.groupId;
// // //   }
// // //   addGroup(): void {
// // //     if (!this.products.length) {
// // //       this.toast.error(
// // //         'This customer has no products yet — add their catalogue in Products & Price first.',
// // //       );
// // //       return;
// // //     }
// // //     this.rowSeq += 1;
// // //     const groupId = 'grp-' + Date.now().toString(36) + '-' + this.rowSeq;
// // //     this.groups.push({ groupId, personName: '' });
// // //     this.addRow(groupId);
// // //   }
// // //   removeGroup(groupId: string): void {
// // //     const rows = this.rowsOf(groupId).length;
// // //     if (rows && !confirm(`Remove this person and their ${rows} row(s)?`))
// // //       return;
// // //     this.items = this.items.filter((i) => i.groupId !== groupId);
// // //     this.groups = this.groups.filter((g) => g.groupId !== groupId);
// // //   }
// // //   groupTotal(groupId: string): number {
// // //     return this.rowsOf(groupId).reduce((s, i) => s + this.lineTotal(i), 0);
// // //   }
// // //   onProductPicked(item: DraftItem, productId: string): void {
// // //     item.productId = productId;
// // //     this.onProductChange(item);
// // //   }
// // //   onProductChange(item: DraftItem): void {
// // //     item.packets = 1;
// // //   }
// // //   onPacketsChange(item: DraftItem): void {
// // //     const n = Number(item.packets);
// // //     item.packets = !n || n < 1 ? 1 : Math.floor(n);
// // //   }
// // //   productOf(item: DraftItem): Product | undefined {
// // //     return this.products.find((p) => p._id === item.productId);
// // //   }

// // //   unitPriceOf(item: DraftItem): number {
// // //     const live = this.productOf(item)?.rate;
// // //     if (live !== undefined) return live;
// // //     return item.savedSnapshot?.unitPrice ?? 0;
// // //   }
// // //   qtyPerPacketOf(item: DraftItem): string {
// // //     const live = this.productOf(item)?.qtyPerPacket;
// // //     if (live !== undefined) return live;
// // //     return item.savedSnapshot?.qtyPerPacket || '—';
// // //   }
// // //   totalQtyNum(item: DraftItem): number {
// // //     const q = this.qtyPerPacketOf(item);
// // //     return calcTotalQty(q === '—' ? '' : q, Number(item.packets) || 0);
// // //   }
// // //   qtyText(n: number): string {
// // //     return fmtQty(n);
// // //   }
// // //   totalPackets(): number {
// // //     return this.items.reduce((s, i) => s + (Number(i.packets) || 0), 0);
// // //   }
// // //   totalQtyAll(): number {
// // //     return this.items.reduce((s, i) => s + this.totalQtyNum(i), 0);
// // //   }

// // //   // yahan personName.trim() use kiya hai taake type karte waqt hi read ho jaye
// // //   draftSections(): {
// // //     groupId: string;
// // //     personName: string;
// // //     rows: DraftItem[];
// // //     packets: number;
// // //     totalQty: number;
// // //     total: number;
// // //   }[] {
// // //     const make = (groupId: string, personName: string) => {
// // //       const rows = this.rowsOf(groupId);
// // //       return {
// // //         groupId,
// // //         personName,
// // //         rows,
// // //         packets: rows.reduce((s, i) => s + (Number(i.packets) || 0), 0),
// // //         totalQty: rows.reduce((s, i) => s + this.totalQtyNum(i), 0),
// // //         total: rows.reduce((s, i) => s + this.lineTotal(i), 0),
// // //       };
// // //     };
// // //     const out = [];
// // //     const main = make('', '');
// // //     if (main.rows.length) out.push(main);
// // //     for (const g of this.groups) {
// // //       const sec = make(g.groupId, g.personName.trim());
// // //       if (sec.rows.length) out.push(sec);
// // //     }
// // //     return out;
// // //   }
// // //   productNameOf(item: DraftItem): string {
// // //     const live = this.productOf(item)?.description;
// // //     if (live) return live;
// // //     return item.savedSnapshot?.productName || '—';
// // //   }
// // //   lineTotal(item: DraftItem): number {
// // //     return this.unitPriceOf(item) * (Number(item.packets) || 0);
// // //   }
// // //   itemsSubtotal(): number {
// // //     return this.items.reduce((s, i) => s + this.lineTotal(i), 0);
// // //   }

// // //   namedPersons(): { name: string; total: number }[] {
// // //     return this.groups
// // //       .filter((g) => g.personName.trim())
// // //       .map((g) => ({
// // //         name: g.personName.trim(),
// // //         total: this.groupTotal(g.groupId),
// // //       }))
// // //       .filter((p) => p.total > 0);
// // //   }

// // //   private itemsProblem(): string {
// // //     if (!this.items.length || this.items.some((i) => !i.productId))
// // //       return 'Add at least one product row and select a product for each.';
// // //     for (const g of this.groups) {
// // //       if (!g.personName.trim())
// // //         return 'Enter a name for every person you added (or remove the empty one).';
// // //       if (!this.rowsOf(g.groupId).length)
// // //         return `Add at least one product row for ${g.personName.trim()}, or remove that person.`;
// // //     }
// // //     return '';
// // //   }

// // //   goToSummary(): void {
// // //     const problem = this.itemsProblem();
// // //     if (problem) {
// // //       this.toast.error(problem);
// // //       return;
// // //     }
// // //     this.billService
// // //       .getBillingContext(
// // //         this.customerId,
// // //         this.editMode ? this.editingBillId || undefined : undefined,
// // //       )
// // //       .subscribe({
// // //         next: (res) => {
// // //           this.previousArrears = res.data.previousArrears;
// // //           this.availableAdvance = res.data.availableAdvance;
// // //           if (!this.editMode) {
// // //             this.advanceUsed = 0;
// // //             this.receivedAmount = 0;
// // //           }
// // //           this.step = 3;
// // //           this.recalc();
// // //         },
// // //         error: () =>
// // //           this.toast.error(
// // //             'Could not calculate arrears/advance for this customer. Please try again.',
// // //           ),
// // //       });
// // //   }

// // //   selectOnFocus(event: Event): void {
// // //     const input = event.target as HTMLInputElement;
// // //     input.select();
// // //   }

// // //   recalc(): void {
// // //     const subtotal = this.itemsSubtotal();
// // //     const advanceUsed = Math.max(
// // //       0,
// // //       Math.min(Number(this.advanceUsed) || 0, this.availableAdvance),
// // //     );
// // //     this.grandTotal =
// // //       subtotal -
// // //       (Number(this.discount) || 0) +
// // //       (Number(this.deliveryCharges) || 0) +
// // //       (Number(this.rentCharges) || 0) +
// // //       (Number(this.extraCharges) || 0) +
// // //       this.previousArrears -
// // //       advanceUsed;
// // //     this.remaining = this.grandTotal - (Number(this.receivedAmount) || 0);
// // //   }

// // //   submitBill(): void {
// // //     if (this.saving) return;
// // //     const problem = this.itemsProblem();
// // //     if (problem) {
// // //       this.toast.error(problem);
// // //       return;
// // //     }
// // //     this.recalc();
// // //     this.saving = true;
// // //     const payload = {
// // //       customerId: this.customerId,
// // //       biltiNumber: this.biltiNumber,
// // //       driverName: this.driverName,
// // //       driverPhone: this.driverPhone,
// // //       date: this.date,
// // //       items: this.items.map((i) => ({
// // //         productId: i.productId,
// // //         packets: Number(i.packets) || 1,
// // //         groupId: i.groupId || '',
// // //       })),
// // //       groups: this.groups.map((g) => ({
// // //         groupId: g.groupId,
// // //         personName: g.personName.trim(),
// // //       })),
// // //       discount: Number(this.discount) || 0,
// // //       deliveryCharges: Number(this.deliveryCharges) || 0,
// // //       rentCharges: Number(this.rentCharges) || 0,
// // //       extraCharges: Number(this.extraCharges) || 0,
// // //       advanceUsed: Number(this.advanceUsed) || 0,
// // //       receivedAmount: Number(this.receivedAmount) || 0,
// // //       paymentMethod: this.paymentMethod,
// // //       remarks: this.remarks,
// // //       ...(this.editMode ? {} : { clientRequestId: this.requestId }),
// // //     };
// // //     const request =
// // //       this.editMode && this.editingBillId
// // //         ? this.billService.update(this.editingBillId, payload)
// // //         : this.billService.create(payload);
// // //     request.subscribe({
// // //       next: (res) => {
// // //         this.saving = false;
// // //         this.toast.success(
// // //           this.editMode
// // //             ? 'Bill updated successfully.'
// // //             : 'Bill saved successfully.',
// // //         );
// // //         this.savedBill = res.data;
// // //         if (!this.editMode) this.requestId = newRequestId();
// // //       },
// // //       error: (err) => {
// // //         this.saving = false;
// // //         this.toast.error(
// // //           err?.error?.message ||
// // //             'Could not save this bill. Please check the details and try again.',
// // //         );
// // //       },
// // //     });
// // //   }

// // //   onInvoiceClosed(): void {
// // //     this.savedBill = null;
// // //     if (this.editMode) this.router.navigate(['/billinghistory']);
// // //     else this.resetAll();
// // //   }

// // //   cancel(): void {
// // //     if (this.editMode) this.router.navigate(['/billinghistory']);
// // //     else this.resetAll();
// // //   }

// // //   resetAll(): void {
// // //     this.step = 1;
// // //     this.customerId = '';
// // //     this.biltiNumber = '';
// // //     this.driverName = '';
// // //     this.driverPhone = '';
// // //     this.date = todayIso();
// // //     this.items = [];
// // //     this.groups = [];
// // //     this.requestId = newRequestId();
// // //     this.discount = 0;
// // //     this.deliveryCharges = 0;
// // //     this.rentCharges = 0;
// // //     this.extraCharges = 0;
// // //     this.advanceUsed = 0;
// // //     this.receivedAmount = 0;
// // //     this.paymentMethod = 'Bank Transfer';
// // //     this.remarks = '';
// // //     this.previousArrears = 0;
// // //   }
// // // }

// // import { Component, OnInit } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { FormsModule } from '@angular/forms';
// // import { ActivatedRoute, Router } from '@angular/router';
// // import { forkJoin } from 'rxjs';
// // import { CustomerService } from '../../services/customer.service';
// // import { ProductService } from '../../services/product.service';
// // import { BillService } from '../../services/bill.service';
// // import { ToastService } from '../../services/toast.service';
// // import { Customer, Product, Bill, BillItem, BillGroup } from '../../models';
// // import { fmtMoney, todayIso } from '../../shared/format.util';
// // import { InvoicePreviewComponent } from '../../components/invoice-preview/invoice-preview.component';
// // import { ProductSelectComponent } from '../../components/product-select/product-select.component';
// // import { calcTotalQty, fmtQty } from '../../shared/bill-groups.util';

// // interface DraftItem {
// //   rowId: string;
// //   productId: string;
// //   packets: number;
// //   groupId: string;
// //   savedSnapshot?: {
// //     productName: string;
// //     qtyPerPacket: string;
// //     type: string;
// //     unitPrice: number;
// //   };
// // }

// // function newRequestId(): string {
// //   const c: any = (globalThis as any).crypto;
// //   if (c && typeof c.randomUUID === 'function') return c.randomUUID();
// //   return (
// //     'req-' +
// //     Date.now().toString(36) +
// //     '-' +
// //     Math.random().toString(36).slice(2, 10)
// //   );
// // }

// // @Component({
// //   selector: 'app-new-bill',
// //   standalone: true,
// //   imports: [
// //     CommonModule,
// //     FormsModule,
// //     InvoicePreviewComponent,
// //     ProductSelectComponent,
// //   ],
// //   template: `
// //     <div *ngIf="loadingBill" class="empty-state">
// //       <div class="ic"><i class="fa-solid fa-spinner fa-spin"></i></div>
// //       Loading bill…
// //     </div>

// //     <ng-container *ngIf="!loadingBill">
// //       <div class="steps">
// //         <div class="step" [class.active]="step === 1" [class.done]="step > 1">
// //           <span class="n">1</span>Order Header
// //         </div>
// //         <div class="step" [class.active]="step === 2" [class.done]="step > 2">
// //           <span class="n">2</span>Products
// //         </div>
// //         <div class="step" [class.active]="step === 3">
// //           <span class="n">3</span>Billing Summary
// //         </div>
// //       </div>

// //       <!-- STEP 1: ORDER HEADER -->
// //       <ng-container *ngIf="step === 1">
// //         <div class="panel">
// //           <div class="panel-head"><h3>Order Header</h3></div>
// //           <div class="panel-body pad">
// //             <div class="form-grid">
// //               <div class="field full">
// //                 <label>Select Customer</label>
// //                 <select
// //                   [(ngModel)]="customerId"
// //                   (ngModelChange)="onCustomerChange()"
// //                   [disabled]="editMode"
// //                 >
// //                   <option value="" *ngIf="customers.length">
// //                     — Choose customer —
// //                   </option>
// //                   <option value="" *ngIf="!customers.length" disabled>
// //                     No customers found — add one first
// //                   </option>
// //                   <option *ngFor="let c of customers" [value]="c._id">
// //                     {{ c.fullName }} — {{ c.city }}
// //                   </option>
// //                 </select>
// //               </div>
// //             </div>
// //             <div class="grid-3" style="margin-top:4px;">
// //               <div class="field">
// //                 <label>Customer Name</label
// //                 ><input disabled [value]="selectedCustomer()?.fullName || ''" />
// //               </div>
// //               <div class="field">
// //                 <label>Phone Number</label
// //                 ><input disabled [value]="selectedCustomer()?.phone || ''" />
// //               </div>
// //               <div class="field">
// //                 <label>City</label
// //                 ><input disabled [value]="selectedCustomer()?.city || ''" />
// //               </div>
// //             </div>
// //             <div
// //               class="field"
// //               *ngIf="customerId"
// //               style="max-width:280px;margin-top:4px;"
// //             >
// //               <label
// //                 >Existing Arrears
// //                 <span class="badge badge-due" *ngIf="loadingArrears"
// //                   >checking…</span
// //                 ></label
// //               >
// //               <input
// //                 disabled
// //                 [value]="fmtMoney(previousArrears)"
// //                 style="font-family:var(--font-mono);font-weight:600;"
// //               />
// //               <div class="hint">
// //                 Fetched automatically for this customer — carried forward into
// //                 this bill's summary.
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //         <div class="panel">
// //           <div class="panel-head"><h3>Delivery Information</h3></div>
// //           <div class="panel-body pad">
// //             <div class="grid-3">
// //               <div class="field">
// //                 <label>Bilti Number</label
// //                 ><input [(ngModel)]="biltiNumber" placeholder="e.g. BL-4471" />
// //               </div>
// //               <div class="field">
// //                 <label>Driver Name</label
// //                 ><input
// //                   [(ngModel)]="driverName"
// //                   placeholder="e.g. Naseer Ahmed"
// //                 />
// //               </div>
// //               <div class="field">
// //                 <label>Driver Phone Number</label
// //                 ><input [(ngModel)]="driverPhone" placeholder="03xx-xxxxxxx" />
// //               </div>
// //             </div>
// //             <div class="field" style="margin-top:14px;max-width:220px;">
// //               <label>Bill Date</label><input type="date" [(ngModel)]="date" />
// //             </div>
// //           </div>
// //         </div>
// //         <div style="display:flex;justify-content:flex-end;gap:10px;">
// //           <button class="btn btn-outline" (click)="cancel()">Cancel</button>
// //           <button class="btn btn-primary" (click)="goToItems()">
// //             Next: Add Products&nbsp;<i class="fa-solid fa-arrow-right"></i>
// //           </button>
// //         </div>
// //       </ng-container>

// //       <!-- STEP 2: PRODUCTS -->
// //       <ng-container *ngIf="step === 2">
// //         <ng-template #rowsTpl let-gid="gid">
// //           <div
// //             class="item-row"
// //             *ngFor="
// //               let item of rowsOf(gid);
// //               let idx = index;
// //               trackBy: trackByRowId
// //             "
// //           >
// //             <div class="num muted">{{ idx + 1 }}</div>
// //             <app-product-select
// //               [products]="products"
// //               [customerId]="customerId"
// //               [value]="item.productId"
// //               (valueChange)="onProductPicked(item, $event)"
// //             ></app-product-select>
// //             <input disabled [value]="fmtMoney(unitPriceOf(item))" />
// //             <input
// //               type="number"
// //               min="1"
// //               step="1"
// //               placeholder="Enter qty"
// //               autocomplete="off"
// //               [(ngModel)]="item.packets"
// //               (ngModelChange)="onPacketsChange(item)"
// //               (focus)="selectOnFocus($event)"
// //             />
// //             <div class="right num">{{ fmtMoney(lineTotal(item)) }}</div>
// //             <button
// //               class="icon-btn danger"
// //               title="Remove row"
// //               (click)="removeRow(item.rowId)"
// //             >
// //               <i class="fa-solid fa-xmark"></i>
// //             </button>
// //           </div>
// //         </ng-template>

// //         <div class="panel">
// //           <div class="panel-head"><h3>Bill Items</h3></div>
// //           <div class="panel-body pad">
// //             <div class="table-wrap">
// //               <div class="item-row head">
// //                 <div>#</div>
// //                 <div>Product</div>
// //                 <div>Unit Price</div>
// //                 <div>Packets</div>
// //                 <div class="right">Total</div>
// //                 <div></div>
// //               </div>
// //               <div
// //                 *ngIf="!items.length && !groups.length"
// //                 class="empty-state"
// //                 style="padding:26px;"
// //               >
// //                 <div class="ic"><i class="fa-solid fa-table-list"></i></div>
// //                 Click "Add Row" to select products for this bill.
// //               </div>
// //               <ng-container
// //                 *ngTemplateOutlet="rowsTpl; context: { gid: '' }"
// //               ></ng-container>
// //             </div>

// //             <div
// //               class="group-block"
// //               *ngFor="let g of groups; let gi = index; trackBy: trackByGroupId"
// //             >
// //               <div class="group-head">
// //                 <i class="fa-solid fa-user muted"></i>
// //                 <input
// //                   class="group-name"
// //                   [(ngModel)]="g.personName"
// //                   maxlength="100"
// //                   placeholder="Person name (e.g. Ahmed)"
// //                   autocomplete="off"
// //                 />
// //                 <button
// //                   class="icon-btn danger"
// //                   title="Remove this person and their rows"
// //                   (click)="removeGroup(g.groupId)"
// //                 >
// //                   <i class="fa-solid fa-trash"></i>
// //                 </button>
// //               </div>
// //               <div class="table-wrap">
// //                 <div class="item-row head">
// //                   <div>#</div>
// //                   <div>Product</div>
// //                   <div>Unit Price</div>
// //                   <div>Packets</div>
// //                   <div class="right">Total</div>
// //                   <div></div>
// //                 </div>
// //                 <div
// //                   *ngIf="!rowsOf(g.groupId).length"
// //                   class="empty-state"
// //                   style="padding:14px;"
// //                 >
// //                   No rows yet for this person.
// //                 </div>
// //                 <ng-container
// //                   *ngTemplateOutlet="rowsTpl; context: { gid: g.groupId }"
// //                 ></ng-container>
// //               </div>
// //               <div class="group-foot">
// //                 <button
// //                   class="btn btn-sm btn-outline"
// //                   (click)="addRow(g.groupId)"
// //                 >
// //                   <i class="fa-solid fa-plus"></i>&nbsp;Add Row
// //                 </button>
// //                 <div>
// //                   Total{{
// //                     g.personName.trim() ? ' — ' + g.personName.trim() : ''
// //                   }}:
// //                   <strong class="num">{{
// //                     fmtMoney(groupTotal(g.groupId))
// //                   }}</strong>
// //                 </div>
// //               </div>
// //             </div>

// //             <div class="bill-items-actions" style="margin-top:14px;">
// //               <div style="display:flex;gap:8px;flex-wrap:wrap;">
// //                 <button class="btn btn-sm btn-dark" (click)="addRow('')">
// //                   <i class="fa-solid fa-plus"></i>&nbsp;Add Row
// //                 </button>
// //                 <button class="btn btn-sm btn-outline" (click)="addGroup()">
// //                   <i class="fa-solid fa-user-plus"></i>&nbsp;Add Person Name
// //                 </button>
// //               </div>
// //               <div style="font-size:15px;">
// //                 Items Subtotal:
// //                 <strong class="num">{{ fmtMoney(itemsSubtotal()) }}</strong>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //         <div style="display:flex;justify-content:space-between;gap:10px;">
// //           <button class="btn btn-outline" (click)="step = 1">
// //             <i class="fa-solid fa-arrow-left"></i>&nbsp;Back
// //           </button>
// //           <button class="btn btn-primary" (click)="goToSummary()">
// //             Next: Billing Summary&nbsp;<i class="fa-solid fa-arrow-right"></i>
// //           </button>
// //         </div>
// //       </ng-container>

// //       <!-- STEP 3: BILLING SUMMARY -->
// //       <ng-container *ngIf="step === 3">
// //         <div class="grid-2">
// //           <div class="panel">
// //             <div class="panel-head">
// //               <h3>Billing Summary — {{ selectedCustomer()?.fullName }}</h3>
// //             </div>
// //             <div class="panel-body pad">
// //               <div class="summary-line">
// //                 <span>Subtotal</span
// //                 ><span class="v">{{ fmtMoney(itemsSubtotal()) }}</span>
// //               </div>
// //               <div class="summary-line">
// //                 <span>Discount</span
// //                 ><input
// //                   type="number"
// //                   autocomplete="off"
// //                   [(ngModel)]="discount"
// //                   (ngModelChange)="recalc()"
// //                   (focus)="selectOnFocus($event)"
// //                 />
// //               </div>
// //               <div class="summary-line">
// //                 <span>Delivery Charges</span
// //                 ><input
// //                   type="number"
// //                   autocomplete="off"
// //                   [(ngModel)]="deliveryCharges"
// //                   (ngModelChange)="recalc()"
// //                   (focus)="selectOnFocus($event)"
// //                 />
// //               </div>
// //               <div class="summary-line">
// //                 <span>Rent Charges</span
// //                 ><input
// //                   type="number"
// //                   autocomplete="off"
// //                   [(ngModel)]="rentCharges"
// //                   (ngModelChange)="recalc()"
// //                   (focus)="selectOnFocus($event)"
// //                 />
// //               </div>
// //               <div class="summary-line">
// //                 <span>Extra Charges</span
// //                 ><input
// //                   type="number"
// //                   autocomplete="off"
// //                   [(ngModel)]="extraCharges"
// //                   (ngModelChange)="recalc()"
// //                   (focus)="selectOnFocus($event)"
// //                 />
// //               </div>
// //               <div class="summary-line">
// //                 <span
// //                   >Previous Arrears
// //                   <span class="badge badge-due" *ngIf="previousArrears > 0"
// //                     >auto</span
// //                   ></span
// //                 ><span class="v">{{ fmtMoney(previousArrears) }}</span>
// //               </div>
// //               <div class="summary-line">
// //                 <span
// //                   >Advance Adjustment
// //                   <span class="muted"
// //                     >(available {{ fmtMoney(availableAdvance) }})</span
// //                   ></span
// //                 >
// //                 <input
// //                   type="number"
// //                   autocomplete="off"
// //                   [(ngModel)]="advanceUsed"
// //                   [max]="availableAdvance"
// //                   (ngModelChange)="recalc()"
// //                   (focus)="selectOnFocus($event)"
// //                 />
// //               </div>
// //               <div class="summary-line total">
// //                 <span>Grand Total</span
// //                 ><span class="v">{{ fmtMoney(grandTotal) }}</span>
// //               </div>
// //               <div class="summary-line" style="margin-top:10px;">
// //                 <span>Received Amount</span
// //                 ><input
// //                   type="number"
// //                   autocomplete="off"
// //                   [(ngModel)]="receivedAmount"
// //                   (ngModelChange)="recalc()"
// //                   (focus)="selectOnFocus($event)"
// //                 />
// //               </div>
// //               <div class="summary-line">
// //                 <span>Payment Method</span>
// //                 <select
// //                   [(ngModel)]="paymentMethod"
// //                   style="padding:6px 8px;border:1.5px solid var(--line);border-radius:var(--radius);"
// //                 >
// //                   <option>Bank Transfer</option>
// //                   <option>Cash</option>
// //                   <option>Cheque</option>
// //                   <option>Online</option>
// //                 </select>
// //               </div>
// //               <div class="summary-line total" style="border-top:none;">
// //                 <span>Remaining Balance</span>
// //                 <span
// //                   class="v"
// //                   [style.color]="remaining > 0 ? 'var(--rust)' : 'var(--green)'"
// //                   >{{ fmtMoney(remaining) }}</span
// //                 >
// //               </div>
// //               <div class="field" style="margin-top:14px;">
// //                 <label>Remarks</label>
// //                 <textarea
// //                   rows="2"
// //                   [(ngModel)]="remarks"
// //                   placeholder="Optional notes for this bill"
// //                 ></textarea>
// //               </div>
// //             </div>
// //           </div>
// //           <div class="panel">
// //             <div class="panel-head"><h3>Items in this Bill</h3></div>
// //             <div class="panel-body pad">
// //               <div class="table-wrap">
// //                 <table>
// //                   <thead>
// //                     <tr>
// //                       <th>#</th>
// //                       <th>Person</th>
// //                       <th>Product</th>
// //                       <th class="right">Packets</th>
// //                       <th class="right">Rate</th>
// //                       <th class="right">Total</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody *ngFor="let sec of draftSections()">
// //                     <tr *ngFor="let i of sec.rows; let idx = index">
// //                       <td class="num muted">{{ idx + 1 }}</td>
// //                       <!-- Yahan dash nahi hai, sirf name aayega. Agar name blank hoga to column khali rahega -->
// //                       <td style="font-weight: 600;">{{ sec.personName }}</td>
// //                       <td>{{ productNameOf(i) }}</td>
// //                       <td class="right num">{{ i.packets }}</td>
// //                       <td class="right num">{{ fmtMoney(unitPriceOf(i)) }}</td>
// //                       <td class="right num">{{ fmtMoney(lineTotal(i)) }}</td>
// //                     </tr>
// //                   </tbody>
// //                   <tfoot>
// //                     <tr class="total-row">
// //                       <td colspan="2" style="vertical-align: top;">Total</td>
// //                       <td
// //                         colspan="2"
// //                         style="vertical-align: top; padding-left: 10px;"
// //                       >
// //                         <div
// //                           *ngFor="let p of namedPersons()"
// //                           style="font-size: 11px; font-weight: normal; color: var(--ink-faint);"
// //                         >
// //                           {{ p.name }}: {{ fmtMoney(p.total) }}
// //                         </div>
// //                       </td>
// //                       <td class="right num" style="vertical-align: bottom;">
// //                         {{ totalPackets() }}
// //                       </td>
// //                       <td class="right num" style="vertical-align: bottom;">
// //                         {{ fmtMoney(itemsSubtotal()) }}
// //                       </td>
// //                     </tr>
// //                   </tfoot>
// //                 </table>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //         <div style="display:flex;justify-content:space-between;gap:10px;">
// //           <button class="btn btn-outline" (click)="step = 2">
// //             <i class="fa-solid fa-arrow-left"></i>&nbsp;Back
// //           </button>
// //           <button
// //             class="btn btn-primary"
// //             [disabled]="saving"
// //             (click)="submitBill()"
// //           >
// //             <i class="fa-solid fa-check"></i>&nbsp;{{
// //               editMode ? 'Save Changes' : 'Save & Generate Invoice'
// //             }}
// //           </button>
// //         </div>
// //       </ng-container>
// //     </ng-container>

// //     <app-invoice-preview
// //       [bill]="savedBill"
// //       (close)="onInvoiceClosed()"
// //     ></app-invoice-preview>
// //   `,
// // })
// // export class NewBillComponent implements OnInit {
// //   step = 1;
// //   customers: Customer[] = [];
// //   products: Product[] = [];
// //   customerId = '';
// //   biltiNumber = '';
// //   driverName = '';
// //   driverPhone = '';
// //   date = todayIso();
// //   items: DraftItem[] = [];
// //   groups: { groupId: string; personName: string }[] = [];
// //   private requestId = newRequestId();
// //   private rowSeq = 0;
// //   discount = 0;
// //   deliveryCharges = 0;
// //   rentCharges = 0;
// //   extraCharges = 0;
// //   advanceUsed = 0;
// //   receivedAmount = 0;
// //   paymentMethod = 'Bank Transfer';
// //   remarks = '';
// //   previousArrears = 0;
// //   loadingArrears = false;
// //   availableAdvance = 0;
// //   grandTotal = 0;
// //   remaining = 0;
// //   saving = false;
// //   savedBill: Bill | null = null;
// //   editMode = false;
// //   editingBillId: string | null = null;
// //   loadingBill = false;
// //   fmtMoney = fmtMoney;

// //   constructor(
// //     private customerService: CustomerService,
// //     private productService: ProductService,
// //     private billService: BillService,
// //     private toast: ToastService,
// //     private route: ActivatedRoute,
// //     private router: Router,
// //   ) {}

// //   ngOnInit(): void {
// //     this.customerService.list().subscribe({
// //       next: (res) => (this.customers = res.data),
// //       error: () => this.toast.error('Could not load the customer list.'),
// //     });
// //     const id = this.route.snapshot.paramMap.get('id');
// //     if (id) {
// //       this.editMode = true;
// //       this.editingBillId = id;
// //       this.loadBillForEdit(id);
// //     }
// //   }

// //   private loadBillForEdit(id: string): void {
// //     this.loadingBill = true;
// //     this.loadingArrears = true;
// //     this.billService.get(id).subscribe({
// //       next: (res) => {
// //         const bill = res.data;
// //         const customer = bill.customerId as Customer;
// //         this.customerId =
// //           typeof customer === 'string' ? customer : customer?._id || '';
// //         this.biltiNumber = bill.biltiNumber || '';
// //         this.driverName = bill.driverName || '';
// //         this.driverPhone = bill.driverPhone || '';
// //         this.date = (bill.date || '').slice(0, 10) || todayIso();
// //         const billItems = bill.items || [];
// //         this.groups = (bill.groups || []).map((g: BillGroup) => ({
// //           groupId: g.groupId,
// //           personName: g.personName,
// //         }));
// //         const knownGroups = new Set(this.groups.map((g) => g.groupId));
// //         this.items = billItems.map((i) => ({
// //           rowId: this.nextRowId(),
// //           groupId: i.groupId && knownGroups.has(i.groupId) ? i.groupId : '',
// //           productId:
// //             typeof i.productId === 'string' ? i.productId : String(i.productId),
// //           packets: Number(i.packets) || 1,
// //           savedSnapshot: {
// //             productName: i.productName || '',
// //             qtyPerPacket: i.qtyPerPacket || '',
// //             type: i.type || '',
// //             unitPrice: Number(i.unitPrice) || 0,
// //           },
// //         }));
// //         this.discount = Number(bill.discount) || 0;
// //         this.deliveryCharges = Number(bill.deliveryCharges) || 0;
// //         this.rentCharges = Number(bill.rentCharges) || 0;
// //         this.extraCharges = Number(bill.extraCharges) || 0;
// //         this.advanceUsed = Number(bill.advanceUsed) || 0;
// //         this.receivedAmount = Number(bill.receivedAmount) || 0;
// //         this.paymentMethod = bill.paymentMethod || 'Bank Transfer';
// //         this.remarks = bill.remarks || '';
// //         if (!this.customerId) {
// //           this.loadingBill = false;
// //           this.loadingArrears = false;
// //           this.toast.error(
// //             'This bill has no valid customer on record and cannot be edited.',
// //           );
// //           this.router.navigate(['/billinghistory']);
// //           return;
// //         }
// //         forkJoin({
// //           products: this.productService.list(this.customerId),
// //           context: this.billService.getBillingContext(
// //             this.customerId,
// //             this.editingBillId || undefined,
// //           ),
// //         }).subscribe({
// //           next: ({ products, context }) => {
// //             this.products = this.withMissingBillProducts(
// //               products.data,
// //               billItems,
// //             );
// //             this.previousArrears = context.data.previousArrears;
// //             this.availableAdvance = context.data.availableAdvance;
// //             this.loadingBill = false;
// //             this.loadingArrears = false;
// //           },
// //           error: () => {
// //             this.loadingBill = false;
// //             this.loadingArrears = false;
// //             this.toast.error(
// //               "Bill loaded, but this customer's product catalogue or arrears could not be loaded.",
// //             );
// //           },
// //         });
// //       },
// //       error: (err) => {
// //         this.loadingBill = false;
// //         this.loadingArrears = false;
// //         this.toast.error(
// //           err?.error?.message || 'Could not load this bill for editing.',
// //         );
// //         this.router.navigate(['/billinghistory']);
// //       },
// //     });
// //   }

// //   private withMissingBillProducts(
// //     liveProducts: Product[],
// //     billItems: BillItem[],
// //   ): Product[] {
// //     const known = new Set(liveProducts.map((p) => p._id));
// //     const synthesized: Product[] = [];
// //     const seen = new Set<string>();
// //     for (const i of billItems) {
// //       const id =
// //         typeof i.productId === 'string' ? i.productId : String(i.productId);
// //       if (!id || known.has(id) || seen.has(id)) continue;
// //       seen.add(id);
// //       synthesized.push({
// //         _id: id,
// //         customerId: this.customerId,
// //         countNumber: '',
// //         type: i.type || '',
// //         description: i.productName
// //           ? `${i.productName} (no longer in catalogue)`
// //           : 'Unavailable product',
// //         qtyPerPacket: i.qtyPerPacket || '',
// //         rate: Number(i.unitPrice) || 0,
// //         createdAt: '',
// //       });
// //     }
// //     return synthesized.length
// //       ? [...liveProducts, ...synthesized]
// //       : liveProducts;
// //   }

// //   selectedCustomer(): Customer | undefined {
// //     return this.customers.find((c) => c._id === this.customerId);
// //   }

// //   onCustomerChange(): void {
// //     if (this.editMode) return;
// //     this.products = [];
// //     this.items = [];
// //     this.groups = [];
// //     this.previousArrears = 0;
// //     if (this.customerId) this.fetchArrearsPreview(this.customerId);
// //   }

// //   private fetchArrearsPreview(customerId: string): void {
// //     this.loadingArrears = true;
// //     this.billService
// //       .getBillingContext(
// //         customerId,
// //         this.editMode ? this.editingBillId || undefined : undefined,
// //       )
// //       .subscribe({
// //         next: (res) => {
// //           this.previousArrears = res.data.previousArrears;
// //           this.availableAdvance = res.data.availableAdvance;
// //           this.loadingArrears = false;
// //         },
// //         error: () => {
// //           this.loadingArrears = false;
// //         },
// //       });
// //   }

// //   goToItems(): void {
// //     if (!this.customerId) {
// //       this.toast.error('Please select a customer first.');
// //       return;
// //     }
// //     this.productService.list(this.customerId).subscribe({
// //       next: (res) => {
// //         this.products = res.data;
// //         this.step = 2;
// //       },
// //       error: () =>
// //         this.toast.error(
// //           "Could not load this customer's products. Please try again.",
// //         ),
// //     });
// //   }

// //   private nextRowId(): string {
// //     this.rowSeq += 1;
// //     return 'row-' + this.rowSeq;
// //   }
// //   trackByRowId(_index: number, item: DraftItem): string {
// //     return item.rowId;
// //   }
// //   addRow(groupId = ''): void {
// //     if (!this.products.length) {
// //       this.toast.error(
// //         'This customer has no products yet — add their catalogue in Products & Price first.',
// //       );
// //       return;
// //     }
// //     this.items.push({
// //       rowId: this.nextRowId(),
// //       productId: '',
// //       packets: 1,
// //       groupId,
// //     });
// //   }
// //   removeRow(rowId: string): void {
// //     this.items = this.items.filter((i) => i.rowId !== rowId);
// //   }
// //   rowsOf(groupId: string): DraftItem[] {
// //     return this.items.filter((i) => (i.groupId || '') === groupId);
// //   }
// //   trackByGroupId(_index: number, g: { groupId: string }): string {
// //     return g.groupId;
// //   }
// //   addGroup(): void {
// //     if (!this.products.length) {
// //       this.toast.error(
// //         'This customer has no products yet — add their catalogue in Products & Price first.',
// //       );
// //       return;
// //     }
// //     this.rowSeq += 1;
// //     const groupId = 'grp-' + Date.now().toString(36) + '-' + this.rowSeq;
// //     this.groups.push({ groupId, personName: '' });
// //     this.addRow(groupId);
// //   }
// //   removeGroup(groupId: string): void {
// //     const rows = this.rowsOf(groupId).length;
// //     if (rows && !confirm(`Remove this person and their ${rows} row(s)?`))
// //       return;
// //     this.items = this.items.filter((i) => i.groupId !== groupId);
// //     this.groups = this.groups.filter((g) => g.groupId !== groupId);
// //   }
// //   groupTotal(groupId: string): number {
// //     return this.rowsOf(groupId).reduce((s, i) => s + this.lineTotal(i), 0);
// //   }
// //   onProductPicked(item: DraftItem, productId: string): void {
// //     item.productId = productId;
// //     this.onProductChange(item);
// //   }
// //   onProductChange(item: DraftItem): void {
// //     item.packets = 1;
// //   }
// //   onPacketsChange(item: DraftItem): void {
// //     const n = Number(item.packets);
// //     item.packets = !n || n < 1 ? 1 : Math.floor(n);
// //   }
// //   productOf(item: DraftItem): Product | undefined {
// //     return this.products.find((p) => p._id === item.productId);
// //   }

// //   unitPriceOf(item: DraftItem): number {
// //     const live = this.productOf(item)?.rate;
// //     if (live !== undefined) return live;
// //     return item.savedSnapshot?.unitPrice ?? 0;
// //   }
// //   qtyPerPacketOf(item: DraftItem): string {
// //     const live = this.productOf(item)?.qtyPerPacket;
// //     if (live !== undefined) return live;
// //     return item.savedSnapshot?.qtyPerPacket || '—';
// //   }
// //   totalQtyNum(item: DraftItem): number {
// //     const q = this.qtyPerPacketOf(item);
// //     return calcTotalQty(q === '—' ? '' : q, Number(item.packets) || 0);
// //   }
// //   qtyText(n: number): string {
// //     return fmtQty(n);
// //   }
// //   totalPackets(): number {
// //     return this.items.reduce((s, i) => s + (Number(i.packets) || 0), 0);
// //   }
// //   totalQtyAll(): number {
// //     return this.items.reduce((s, i) => s + this.totalQtyNum(i), 0);
// //   }

// //   // yahan personName.trim() use kiya hai taake type karte waqt hi read ho jaye
// //   draftSections(): {
// //     groupId: string;
// //     personName: string;
// //     rows: DraftItem[];
// //     packets: number;
// //     totalQty: number;
// //     total: number;
// //   }[] {
// //     const make = (groupId: string, personName: string) => {
// //       const rows = this.rowsOf(groupId);
// //       return {
// //         groupId,
// //         personName,
// //         rows,
// //         packets: rows.reduce((s, i) => s + (Number(i.packets) || 0), 0),
// //         totalQty: rows.reduce((s, i) => s + this.totalQtyNum(i), 0),
// //         total: rows.reduce((s, i) => s + this.lineTotal(i), 0),
// //       };
// //     };
// //     const out = [];
// //     const main = make('', '');
// //     if (main.rows.length) out.push(main);
// //     for (const g of this.groups) {
// //       const sec = make(g.groupId, g.personName.trim());
// //       if (sec.rows.length) out.push(sec);
// //     }
// //     return out;
// //   }
// //   productNameOf(item: DraftItem): string {
// //     const live = this.productOf(item)?.description;
// //     if (live) return live;
// //     return item.savedSnapshot?.productName || '—';
// //   }
// //   lineTotal(item: DraftItem): number {
// //     return this.unitPriceOf(item) * (Number(item.packets) || 0);
// //   }
// //   itemsSubtotal(): number {
// //     return this.items.reduce((s, i) => s + this.lineTotal(i), 0);
// //   }

// //   namedPersons(): { name: string; total: number }[] {
// //     return this.groups
// //       .filter((g) => g.personName.trim())
// //       .map((g) => ({
// //         name: g.personName.trim(),
// //         total: this.groupTotal(g.groupId),
// //       }))
// //       .filter((p) => p.total > 0);
// //   }

// //   private itemsProblem(): string {
// //     if (!this.items.length || this.items.some((i) => !i.productId))
// //       return 'Add at least one product row and select a product for each.';
// //     for (const g of this.groups) {
// //       if (!g.personName.trim())
// //         return 'Enter a name for every person you added (or remove the empty one).';
// //       if (!this.rowsOf(g.groupId).length)
// //         return `Add at least one product row for ${g.personName.trim()}, or remove that person.`;
// //     }
// //     return '';
// //   }

// //   goToSummary(): void {
// //     const problem = this.itemsProblem();
// //     if (problem) {
// //       this.toast.error(problem);
// //       return;
// //     }
// //     this.billService
// //       .getBillingContext(
// //         this.customerId,
// //         this.editMode ? this.editingBillId || undefined : undefined,
// //       )
// //       .subscribe({
// //         next: (res) => {
// //           this.previousArrears = res.data.previousArrears;
// //           this.availableAdvance = res.data.availableAdvance;
// //           if (!this.editMode) {
// //             this.advanceUsed = 0;
// //             this.receivedAmount = 0;
// //           }
// //           this.step = 3;
// //           this.recalc();
// //         },
// //         error: () =>
// //           this.toast.error(
// //             'Could not calculate arrears/advance for this customer. Please try again.',
// //           ),
// //       });
// //   }

// //   selectOnFocus(event: Event): void {
// //     const input = event.target as HTMLInputElement;
// //     input.select();
// //   }

// //   recalc(): void {
// //     const subtotal = this.itemsSubtotal();
// //     const advanceUsed = Math.max(
// //       0,
// //       Math.min(Number(this.advanceUsed) || 0, this.availableAdvance),
// //     );
// //     this.grandTotal =
// //       subtotal -
// //       (Number(this.discount) || 0) +
// //       (Number(this.deliveryCharges) || 0) +
// //       (Number(this.rentCharges) || 0) +
// //       (Number(this.extraCharges) || 0) +
// //       this.previousArrears -
// //       advanceUsed;
// //     this.remaining = this.grandTotal - (Number(this.receivedAmount) || 0);
// //   }

// //   submitBill(): void {
// //     if (this.saving) return;
// //     const problem = this.itemsProblem();
// //     if (problem) {
// //       this.toast.error(problem);
// //       return;
// //     }
// //     this.recalc();
// //     this.saving = true;
// //     const payload = {
// //       customerId: this.customerId,
// //       biltiNumber: this.biltiNumber,
// //       driverName: this.driverName,
// //       driverPhone: this.driverPhone,
// //       date: this.date,
// //       items: this.items.map((i) => ({
// //         productId: i.productId,
// //         packets: Number(i.packets) || 1,
// //         groupId: i.groupId || '',
// //       })),
// //       groups: this.groups.map((g) => ({
// //         groupId: g.groupId,
// //         personName: g.personName.trim(),
// //       })),
// //       discount: Number(this.discount) || 0,
// //       deliveryCharges: Number(this.deliveryCharges) || 0,
// //       rentCharges: Number(this.rentCharges) || 0,
// //       extraCharges: Number(this.extraCharges) || 0,
// //       advanceUsed: Number(this.advanceUsed) || 0,
// //       receivedAmount: Number(this.receivedAmount) || 0,
// //       paymentMethod: this.paymentMethod,
// //       remarks: this.remarks,
// //       ...(this.editMode ? {} : { clientRequestId: this.requestId }),
// //     };
// //     const request =
// //       this.editMode && this.editingBillId
// //         ? this.billService.update(this.editingBillId, payload)
// //         : this.billService.create(payload);
// //     request.subscribe({
// //       next: (res) => {
// //         this.saving = false;
// //         this.toast.success(
// //           this.editMode
// //             ? 'Bill updated successfully.'
// //             : 'Bill saved successfully.',
// //         );
// //         this.savedBill = this.withSubmittedPersons(res.data, payload);
// //         if (!this.editMode) this.requestId = newRequestId();
// //       },
// //       error: (err) => {
// //         this.saving = false;
// //         this.toast.error(
// //           err?.error?.message ||
// //             'Could not save this bill. Please check the details and try again.',
// //         );
// //       },
// //     });
// //   }

// //   /**
// //    * The invoice image is drawn from the bill returned by the server. If that
// //    * response comes back without the person groups (e.g. an older backend that
// //    * does not store them), fill in exactly the names/groupIds that were just
// //    * submitted so the invoice and saved image still show the Person column.
// //    * A response that already carries the groups is returned untouched, so
// //    * names are never duplicated.
// //    */
// //   private withSubmittedPersons(
// //     bill: Bill,
// //     payload: {
// //       items: { groupId: string }[];
// //       groups: { groupId: string; personName: string }[];
// //     },
// //   ): Bill {
// //     if (!bill || !payload.groups.length) return bill;
// //     if ((bill.groups || []).length) return bill;
// //     const items = (bill.items || []).map((it, idx) => ({
// //       ...it,
// //       groupId: it.groupId || payload.items[idx]?.groupId || '',
// //     }));
// //     return { ...bill, items, groups: payload.groups.map((g) => ({ ...g })) };
// //   }

// //   onInvoiceClosed(): void {
// //     this.savedBill = null;
// //     if (this.editMode) this.router.navigate(['/billinghistory']);
// //     else this.resetAll();
// //   }

// //   cancel(): void {
// //     if (this.editMode) this.router.navigate(['/billinghistory']);
// //     else this.resetAll();
// //   }

// //   resetAll(): void {
// //     this.step = 1;
// //     this.customerId = '';
// //     this.biltiNumber = '';
// //     this.driverName = '';
// //     this.driverPhone = '';
// //     this.date = todayIso();
// //     this.items = [];
// //     this.groups = [];
// //     this.requestId = newRequestId();
// //     this.discount = 0;
// //     this.deliveryCharges = 0;
// //     this.rentCharges = 0;
// //     this.extraCharges = 0;
// //     this.advanceUsed = 0;
// //     this.receivedAmount = 0;
// //     this.paymentMethod = 'Bank Transfer';
// //     this.remarks = '';
// //     this.previousArrears = 0;
// //   }
// // }
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { forkJoin } from 'rxjs';
// import { CustomerService } from '../../services/customer.service';
// import { ProductService } from '../../services/product.service';
// import { BillService } from '../../services/bill.service';
// import { ToastService } from '../../services/toast.service';
// import { Customer, Product, Bill, BillItem, BillGroup } from '../../models';
// import { fmtMoney, todayIso } from '../../shared/format.util';
// import { InvoicePreviewComponent } from '../../components/invoice-preview/invoice-preview.component';
// import { ProductSelectComponent } from '../../components/product-select/product-select.component';
// import { calcTotalQty, fmtQty } from '../../shared/bill-groups.util';

// interface DraftItem {
//   rowId: string;
//   productId: string;
//   packets: number;
//   groupId: string;
//   savedSnapshot?: {
//     productName: string;
//     qtyPerPacket: string;
//     type: string;
//     unitPrice: number;
//   };
// }

// function newRequestId(): string {
//   const c: any = (globalThis as any).crypto;
//   if (c && typeof c.randomUUID === 'function') return c.randomUUID();
//   return (
//     'req-' +
//     Date.now().toString(36) +
//     '-' +
//     Math.random().toString(36).slice(2, 10)
//   );
// }

// @Component({
//   selector: 'app-new-bill',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     InvoicePreviewComponent,
//     ProductSelectComponent,
//   ],
//   template: `
//     <div *ngIf="loadingBill" class="empty-state">
//       <div class="ic"><i class="fa-solid fa-spinner fa-spin"></i></div>
//       Loading bill…
//     </div>

//     <ng-container *ngIf="!loadingBill">
//       <div class="steps">
//         <div class="step" [class.active]="step === 1" [class.done]="step > 1">
//           <span class="n">1</span>Order Header
//         </div>
//         <div class="step" [class.active]="step === 2" [class.done]="step > 2">
//           <span class="n">2</span>Products
//         </div>
//         <div class="step" [class.active]="step === 3">
//           <span class="n">3</span>Billing Summary
//         </div>
//       </div>

//       <!-- STEP 1: ORDER HEADER -->
//       <ng-container *ngIf="step === 1">
//         <div class="panel">
//           <div class="panel-head"><h3>Order Header</h3></div>
//           <div class="panel-body pad">
//             <div class="form-grid">
//               <div class="field full">
//                 <label>Select Customer</label>
//                 <select
//                   [(ngModel)]="customerId"
//                   (ngModelChange)="onCustomerChange()"
//                   [disabled]="editMode"
//                 >
//                   <option value="" *ngIf="customers.length">
//                     — Choose customer —
//                   </option>
//                   <option value="" *ngIf="!customers.length" disabled>
//                     No customers found — add one first
//                   </option>
//                   <option *ngFor="let c of customers" [value]="c._id">
//                     {{ c.fullName }} — {{ c.city }}
//                   </option>
//                 </select>
//               </div>
//             </div>
//             <div class="grid-3" style="margin-top:4px;">
//               <div class="field">
//                 <label>Customer Name</label
//                 ><input disabled [value]="selectedCustomer()?.fullName || ''" />
//               </div>
//               <div class="field">
//                 <label>Phone Number</label
//                 ><input disabled [value]="selectedCustomer()?.phone || ''" />
//               </div>
//               <div class="field">
//                 <label>City</label
//                 ><input disabled [value]="selectedCustomer()?.city || ''" />
//               </div>
//             </div>
//             <div
//               class="field"
//               *ngIf="customerId"
//               style="max-width:280px;margin-top:4px;"
//             >
//               <label
//                 >Existing Arrears
//                 <span class="badge badge-due" *ngIf="loadingArrears"
//                   >checking…</span
//                 ></label
//               >
//               <input
//                 disabled
//                 [value]="fmtMoney(previousArrears)"
//                 style="font-family:var(--font-mono);font-weight:600;"
//               />
//               <div class="hint">
//                 Fetched automatically for this customer — carried forward into
//                 this bill's summary.
//               </div>
//             </div>
//           </div>
//         </div>
//         <div class="panel">
//           <div class="panel-head"><h3>Delivery Information</h3></div>
//           <div class="panel-body pad">
//             <div class="grid-3">
//               <div class="field">
//                 <label>Bilti Number</label
//                 ><input [(ngModel)]="biltiNumber" placeholder="e.g. BL-4471" />
//               </div>
//               <div class="field">
//                 <label>Driver Name</label
//                 ><input
//                   [(ngModel)]="driverName"
//                   placeholder="e.g. Naseer Ahmed"
//                 />
//               </div>
//               <div class="field">
//                 <label>Driver Phone Number</label
//                 ><input [(ngModel)]="driverPhone" placeholder="03xx-xxxxxxx" />
//               </div>
//             </div>
//             <div class="field" style="margin-top:14px;max-width:220px;">
//               <label>Bill Date</label><input type="date" [(ngModel)]="date" />
//             </div>
//           </div>
//         </div>
//         <div style="display:flex;justify-content:flex-end;gap:10px;">
//           <button class="btn btn-outline" (click)="cancel()">Cancel</button>
//           <button class="btn btn-primary" (click)="goToItems()">
//             Next: Add Products&nbsp;<i class="fa-solid fa-arrow-right"></i>
//           </button>
//         </div>
//       </ng-container>

//       <!-- STEP 2: PRODUCTS -->
//       <ng-container *ngIf="step === 2">
//         <ng-template #rowsTpl let-gid="gid">
//           <div
//             class="item-row"
//             *ngFor="
//               let item of rowsOf(gid);
//               let idx = index;
//               trackBy: trackByRowId
//             "
//           >
//             <div class="num muted">{{ idx + 1 }}</div>
//             <app-product-select
//               [products]="products"
//               [customerId]="customerId"
//               [value]="item.productId"
//               (valueChange)="onProductPicked(item, $event)"
//             ></app-product-select>
//             <input disabled [value]="fmtMoney(unitPriceOf(item))" />
//             <input
//               type="number"
//               min="1"
//               step="1"
//               placeholder="Enter qty"
//               autocomplete="off"
//               [(ngModel)]="item.packets"
//               (ngModelChange)="onPacketsChange(item)"
//               (focus)="selectOnFocus($event)"
//             />
//             <div class="right num">{{ fmtMoney(lineTotal(item)) }}</div>
//             <button
//               class="icon-btn danger"
//               title="Remove row"
//               (click)="removeRow(item.rowId)"
//             >
//               <i class="fa-solid fa-xmark"></i>
//             </button>
//           </div>
//         </ng-template>

//         <div class="panel">
//           <div class="panel-head"><h3>Bill Items</h3></div>
//           <div class="panel-body pad">
//             <div class="table-wrap">
//               <div class="item-row head">
//                 <div>#</div>
//                 <div>Product</div>
//                 <div>Unit Price</div>
//                 <div>Packets</div>
//                 <div class="right">Total</div>
//                 <div></div>
//               </div>
//               <div
//                 *ngIf="!items.length && !groups.length"
//                 class="empty-state"
//                 style="padding:26px;"
//               >
//                 <div class="ic"><i class="fa-solid fa-table-list"></i></div>
//                 Click "Add Row" to select products for this bill.
//               </div>
//               <ng-container
//                 *ngTemplateOutlet="rowsTpl; context: { gid: '' }"
//               ></ng-container>
//             </div>

//             <div
//               class="group-block"
//               *ngFor="let g of groups; let gi = index; trackBy: trackByGroupId"
//             >
//               <div class="group-head">
//                 <i class="fa-solid fa-user muted"></i>
//                 <input
//                   class="group-name"
//                   [(ngModel)]="g.personName"
//                   maxlength="100"
//                   placeholder="Person name (e.g. Ahmed)"
//                   autocomplete="off"
//                 />
//                 <button
//                   class="icon-btn danger"
//                   title="Remove this person and their rows"
//                   (click)="removeGroup(g.groupId)"
//                 >
//                   <i class="fa-solid fa-trash"></i>
//                 </button>
//               </div>
//               <div class="table-wrap">
//                 <div class="item-row head">
//                   <div>#</div>
//                   <div>Product</div>
//                   <div>Unit Price</div>
//                   <div>Packets</div>
//                   <div class="right">Total</div>
//                   <div></div>
//                 </div>
//                 <div
//                   *ngIf="!rowsOf(g.groupId).length"
//                   class="empty-state"
//                   style="padding:14px;"
//                 >
//                   No rows yet for this person.
//                 </div>
//                 <ng-container
//                   *ngTemplateOutlet="rowsTpl; context: { gid: g.groupId }"
//                 ></ng-container>
//               </div>
//               <div class="group-foot">
//                 <button
//                   class="btn btn-sm btn-outline"
//                   (click)="addRow(g.groupId)"
//                 >
//                   <i class="fa-solid fa-plus"></i>&nbsp;Add Row
//                 </button>
//                 <div>
//                   Total{{
//                     g.personName.trim() ? ' — ' + g.personName.trim() : ''
//                   }}:
//                   <strong class="num">{{
//                     fmtMoney(groupTotal(g.groupId))
//                   }}</strong>
//                 </div>
//               </div>
//             </div>

//             <div class="bill-items-actions" style="margin-top:14px;">
//               <div style="display:flex;gap:8px;flex-wrap:wrap;">
//                 <button class="btn btn-sm btn-dark" (click)="addRow('')">
//                   <i class="fa-solid fa-plus"></i>&nbsp;Add Row
//                 </button>
//                 <button class="btn btn-sm btn-outline" (click)="addGroup()">
//                   <i class="fa-solid fa-user-plus"></i>&nbsp;Add Person Name
//                 </button>
//               </div>
//               <div style="font-size:15px;">
//                 Items Subtotal:
//                 <strong class="num">{{ fmtMoney(itemsSubtotal()) }}</strong>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div style="display:flex;justify-content:space-between;gap:10px;">
//           <button class="btn btn-outline" (click)="step = 1">
//             <i class="fa-solid fa-arrow-left"></i>&nbsp;Back
//           </button>
//           <button class="btn btn-primary" (click)="goToSummary()">
//             Next: Billing Summary&nbsp;<i class="fa-solid fa-arrow-right"></i>
//           </button>
//         </div>
//       </ng-container>

//       <!-- STEP 3: BILLING SUMMARY -->
//       <ng-container *ngIf="step === 3">
//         <div class="grid-2">
//           <div class="panel">
//             <div class="panel-head">
//               <h3>Billing Summary — {{ selectedCustomer()?.fullName }}</h3>
//             </div>
//             <div class="panel-body pad">
//               <div class="summary-line">
//                 <span>Subtotal</span
//                 ><span class="v">{{ fmtMoney(itemsSubtotal()) }}</span>
//               </div>
//               <div class="summary-line">
//                 <span>Discount</span
//                 ><input
//                   type="number"
//                   autocomplete="off"
//                   [(ngModel)]="discount"
//                   (ngModelChange)="recalc()"
//                   (focus)="selectOnFocus($event)"
//                 />
//               </div>
//               <div class="summary-line">
//                 <span>Delivery Charges</span
//                 ><input
//                   type="number"
//                   autocomplete="off"
//                   [(ngModel)]="deliveryCharges"
//                   (ngModelChange)="recalc()"
//                   (focus)="selectOnFocus($event)"
//                 />
//               </div>
//               <div class="summary-line">
//                 <span>Rent Charges</span
//                 ><input
//                   type="number"
//                   autocomplete="off"
//                   [(ngModel)]="rentCharges"
//                   (ngModelChange)="recalc()"
//                   (focus)="selectOnFocus($event)"
//                 />
//               </div>
//               <div class="summary-line">
//                 <span>Extra Charges</span
//                 ><input
//                   type="number"
//                   autocomplete="off"
//                   [(ngModel)]="extraCharges"
//                   (ngModelChange)="recalc()"
//                   (focus)="selectOnFocus($event)"
//                 />
//               </div>
//               <div class="summary-line">
//                 <span
//                   >Previous Arrears
//                   <span class="badge badge-due" *ngIf="previousArrears > 0"
//                     >auto</span
//                   ></span
//                 ><span class="v">{{ fmtMoney(previousArrears) }}</span>
//               </div>
//               <div class="summary-line">
//                 <span
//                   >Advance Adjustment
//                   <span class="muted"
//                     >(available {{ fmtMoney(availableAdvance) }})</span
//                   ></span
//                 >
//                 <input
//                   type="number"
//                   autocomplete="off"
//                   [(ngModel)]="advanceUsed"
//                   [max]="availableAdvance"
//                   (ngModelChange)="recalc()"
//                   (focus)="selectOnFocus($event)"
//                 />
//               </div>
//               <div class="summary-line total">
//                 <span>Grand Total</span
//                 ><span class="v">{{ fmtMoney(grandTotal) }}</span>
//               </div>
//               <div class="summary-line" style="margin-top:10px;">
//                 <span>Received Amount</span
//                 ><input
//                   type="number"
//                   autocomplete="off"
//                   [(ngModel)]="receivedAmount"
//                   (ngModelChange)="recalc()"
//                   (focus)="selectOnFocus($event)"
//                 />
//               </div>
//               <div class="summary-line">
//                 <span>Payment Method</span>
//                 <select
//                   [(ngModel)]="paymentMethod"
//                   style="padding:6px 8px;border:1.5px solid var(--line);border-radius:var(--radius);"
//                 >
//                   <option>Bank Transfer</option>
//                   <option>Cash</option>
//                   <option>Cheque</option>
//                   <option>Online</option>
//                 </select>
//               </div>
//               <div class="summary-line total" style="border-top:none;">
//                 <span>Remaining Balance</span>
//                 <span
//                   class="v"
//                   [style.color]="remaining > 0 ? 'var(--rust)' : 'var(--green)'"
//                   >{{ fmtMoney(remaining) }}</span
//                 >
//               </div>
//               <div class="field" style="margin-top:14px;">
//                 <label>Remarks</label>
//                 <textarea
//                   rows="2"
//                   [(ngModel)]="remarks"
//                   placeholder="Optional notes for this bill"
//                 ></textarea>
//               </div>
//             </div>
//           </div>
//           <div class="panel">
//             <div class="panel-head"><h3>Items in this Bill</h3></div>
//             <div class="panel-body pad">
//               <div class="table-wrap">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>#</th>
//                       <th>Person</th>
//                       <th>Product</th>
//                       <th class="right">Packets</th>
//                       <th class="right">Rate</th>
//                       <th class="right">Total</th>
//                     </tr>
//                   </thead>
//                   <tbody *ngFor="let sec of draftSections()">
//                     <tr *ngFor="let i of sec.rows; let idx = index">
//                       <td class="num muted">{{ idx + 1 }}</td>
//                       <!-- Yahan dash nahi hai, sirf name aayega. Agar name blank hoga to column khali rahega -->
//                       <td style="font-weight: 600;">
//                         {{ idx === 0 ? sec.personName : '' }}
//                       </td>
//                       <td>{{ productNameOf(i) }}</td>
//                       <td class="right num">{{ i.packets }}</td>
//                       <td class="right num">{{ fmtMoney(unitPriceOf(i)) }}</td>
//                       <td class="right num">{{ fmtMoney(lineTotal(i)) }}</td>
//                     </tr>
//                   </tbody>
//                   <tfoot>
//                     <tr class="total-row">
//                       <td colspan="2" style="vertical-align: top;">Total</td>
//                       <td
//                         colspan="2"
//                         style="vertical-align: top; padding-left: 10px;"
//                       >
//                         <div
//                           *ngFor="let p of namedPersons()"
//                           style="font-size: 11px; font-weight: normal; color: var(--ink-faint);"
//                         >
//                           {{ p.name }}: {{ fmtMoney(p.total) }}
//                         </div>
//                       </td>
//                       <td class="right num" style="vertical-align: bottom;">
//                         {{ totalPackets() }}
//                       </td>
//                       <td class="right num" style="vertical-align: bottom;">
//                         {{ fmtMoney(itemsSubtotal()) }}
//                       </td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div style="display:flex;justify-content:space-between;gap:10px;">
//           <button class="btn btn-outline" (click)="step = 2">
//             <i class="fa-solid fa-arrow-left"></i>&nbsp;Back
//           </button>
//           <button
//             class="btn btn-primary"
//             [disabled]="saving"
//             (click)="submitBill()"
//           >
//             <i class="fa-solid fa-check"></i>&nbsp;{{
//               editMode ? 'Save Changes' : 'Save & Generate Invoice'
//             }}
//           </button>
//         </div>
//       </ng-container>
//     </ng-container>

//     <app-invoice-preview
//       [bill]="savedBill"
//       (close)="onInvoiceClosed()"
//     ></app-invoice-preview>
//   `,
// })
// export class NewBillComponent implements OnInit {
//   step = 1;
//   customers: Customer[] = [];
//   products: Product[] = [];
//   customerId = '';
//   biltiNumber = '';
//   driverName = '';
//   driverPhone = '';
//   date = todayIso();
//   items: DraftItem[] = [];
//   groups: { groupId: string; personName: string }[] = [];
//   private requestId = newRequestId();
//   private rowSeq = 0;
//   discount = 0;
//   deliveryCharges = 0;
//   rentCharges = 0;
//   extraCharges = 0;
//   advanceUsed = 0;
//   receivedAmount = 0;
//   paymentMethod = 'Bank Transfer';
//   remarks = '';
//   previousArrears = 0;
//   loadingArrears = false;
//   availableAdvance = 0;
//   grandTotal = 0;
//   remaining = 0;
//   saving = false;
//   savedBill: Bill | null = null;
//   editMode = false;
//   editingBillId: string | null = null;
//   loadingBill = false;
//   fmtMoney = fmtMoney;

//   constructor(
//     private customerService: CustomerService,
//     private productService: ProductService,
//     private billService: BillService,
//     private toast: ToastService,
//     private route: ActivatedRoute,
//     private router: Router,
//   ) {}

//   ngOnInit(): void {
//     this.customerService.list().subscribe({
//       next: (res) => (this.customers = res.data),
//       error: () => this.toast.error('Could not load the customer list.'),
//     });
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id) {
//       this.editMode = true;
//       this.editingBillId = id;
//       this.loadBillForEdit(id);
//     }
//   }

//   private loadBillForEdit(id: string): void {
//     this.loadingBill = true;
//     this.loadingArrears = true;
//     this.billService.get(id).subscribe({
//       next: (res) => {
//         const bill = res.data;
//         const customer = bill.customerId as Customer;
//         this.customerId =
//           typeof customer === 'string' ? customer : customer?._id || '';
//         this.biltiNumber = bill.biltiNumber || '';
//         this.driverName = bill.driverName || '';
//         this.driverPhone = bill.driverPhone || '';
//         this.date = (bill.date || '').slice(0, 10) || todayIso();
//         const billItems = bill.items || [];
//         this.groups = (bill.groups || []).map((g: BillGroup) => ({
//           groupId: g.groupId,
//           personName: g.personName,
//         }));
//         const knownGroups = new Set(this.groups.map((g) => g.groupId));
//         this.items = billItems.map((i) => ({
//           rowId: this.nextRowId(),
//           groupId: i.groupId && knownGroups.has(i.groupId) ? i.groupId : '',
//           productId:
//             typeof i.productId === 'string' ? i.productId : String(i.productId),
//           packets: Number(i.packets) || 1,
//           savedSnapshot: {
//             productName: i.productName || '',
//             qtyPerPacket: i.qtyPerPacket || '',
//             type: i.type || '',
//             unitPrice: Number(i.unitPrice) || 0,
//           },
//         }));
//         this.discount = Number(bill.discount) || 0;
//         this.deliveryCharges = Number(bill.deliveryCharges) || 0;
//         this.rentCharges = Number(bill.rentCharges) || 0;
//         this.extraCharges = Number(bill.extraCharges) || 0;
//         this.advanceUsed = Number(bill.advanceUsed) || 0;
//         this.receivedAmount = Number(bill.receivedAmount) || 0;
//         this.paymentMethod = bill.paymentMethod || 'Bank Transfer';
//         this.remarks = bill.remarks || '';
//         if (!this.customerId) {
//           this.loadingBill = false;
//           this.loadingArrears = false;
//           this.toast.error(
//             'This bill has no valid customer on record and cannot be edited.',
//           );
//           this.router.navigate(['/billinghistory']);
//           return;
//         }
//         forkJoin({
//           products: this.productService.list(this.customerId),
//           context: this.billService.getBillingContext(
//             this.customerId,
//             this.editingBillId || undefined,
//           ),
//         }).subscribe({
//           next: ({ products, context }) => {
//             this.products = this.withMissingBillProducts(
//               products.data,
//               billItems,
//             );
//             this.previousArrears = context.data.previousArrears;
//             this.availableAdvance = context.data.availableAdvance;
//             this.loadingBill = false;
//             this.loadingArrears = false;
//           },
//           error: () => {
//             this.loadingBill = false;
//             this.loadingArrears = false;
//             this.toast.error(
//               "Bill loaded, but this customer's product catalogue or arrears could not be loaded.",
//             );
//           },
//         });
//       },
//       error: (err) => {
//         this.loadingBill = false;
//         this.loadingArrears = false;
//         this.toast.error(
//           err?.error?.message || 'Could not load this bill for editing.',
//         );
//         this.router.navigate(['/billinghistory']);
//       },
//     });
//   }

//   private withMissingBillProducts(
//     liveProducts: Product[],
//     billItems: BillItem[],
//   ): Product[] {
//     const known = new Set(liveProducts.map((p) => p._id));
//     const synthesized: Product[] = [];
//     const seen = new Set<string>();
//     for (const i of billItems) {
//       const id =
//         typeof i.productId === 'string' ? i.productId : String(i.productId);
//       if (!id || known.has(id) || seen.has(id)) continue;
//       seen.add(id);
//       synthesized.push({
//         _id: id,
//         customerId: this.customerId,
//         countNumber: '',
//         type: i.type || '',
//         description: i.productName
//           ? `${i.productName} (no longer in catalogue)`
//           : 'Unavailable product',
//         qtyPerPacket: i.qtyPerPacket || '',
//         rate: Number(i.unitPrice) || 0,
//         createdAt: '',
//       });
//     }
//     return synthesized.length
//       ? [...liveProducts, ...synthesized]
//       : liveProducts;
//   }

//   selectedCustomer(): Customer | undefined {
//     return this.customers.find((c) => c._id === this.customerId);
//   }

//   onCustomerChange(): void {
//     if (this.editMode) return;
//     this.products = [];
//     this.items = [];
//     this.groups = [];
//     this.previousArrears = 0;
//     if (this.customerId) this.fetchArrearsPreview(this.customerId);
//   }

//   private fetchArrearsPreview(customerId: string): void {
//     this.loadingArrears = true;
//     this.billService
//       .getBillingContext(
//         customerId,
//         this.editMode ? this.editingBillId || undefined : undefined,
//       )
//       .subscribe({
//         next: (res) => {
//           this.previousArrears = res.data.previousArrears;
//           this.availableAdvance = res.data.availableAdvance;
//           this.loadingArrears = false;
//         },
//         error: () => {
//           this.loadingArrears = false;
//         },
//       });
//   }

//   goToItems(): void {
//     if (!this.customerId) {
//       this.toast.error('Please select a customer first.');
//       return;
//     }
//     this.productService.list(this.customerId).subscribe({
//       next: (res) => {
//         this.products = res.data;
//         this.step = 2;
//       },
//       error: () =>
//         this.toast.error(
//           "Could not load this customer's products. Please try again.",
//         ),
//     });
//   }

//   private nextRowId(): string {
//     this.rowSeq += 1;
//     return 'row-' + this.rowSeq;
//   }
//   trackByRowId(_index: number, item: DraftItem): string {
//     return item.rowId;
//   }
//   addRow(groupId = ''): void {
//     if (!this.products.length) {
//       this.toast.error(
//         'This customer has no products yet — add their catalogue in Products & Price first.',
//       );
//       return;
//     }
//     this.items.push({
//       rowId: this.nextRowId(),
//       productId: '',
//       packets: 1,
//       groupId,
//     });
//   }
//   removeRow(rowId: string): void {
//     this.items = this.items.filter((i) => i.rowId !== rowId);
//   }
//   rowsOf(groupId: string): DraftItem[] {
//     return this.items.filter((i) => (i.groupId || '') === groupId);
//   }
//   trackByGroupId(_index: number, g: { groupId: string }): string {
//     return g.groupId;
//   }
//   addGroup(): void {
//     if (!this.products.length) {
//       this.toast.error(
//         'This customer has no products yet — add their catalogue in Products & Price first.',
//       );
//       return;
//     }
//     this.rowSeq += 1;
//     const groupId = 'grp-' + Date.now().toString(36) + '-' + this.rowSeq;
//     this.groups.push({ groupId, personName: '' });
//     this.addRow(groupId);
//   }
//   removeGroup(groupId: string): void {
//     const rows = this.rowsOf(groupId).length;
//     if (rows && !confirm(`Remove this person and their ${rows} row(s)?`))
//       return;
//     this.items = this.items.filter((i) => i.groupId !== groupId);
//     this.groups = this.groups.filter((g) => g.groupId !== groupId);
//   }
//   groupTotal(groupId: string): number {
//     return this.rowsOf(groupId).reduce((s, i) => s + this.lineTotal(i), 0);
//   }
//   onProductPicked(item: DraftItem, productId: string): void {
//     item.productId = productId;
//     this.onProductChange(item);
//   }
//   onProductChange(item: DraftItem): void {
//     item.packets = 1;
//   }
//   onPacketsChange(item: DraftItem): void {
//     const n = Number(item.packets);
//     item.packets = !n || n < 1 ? 1 : Math.floor(n);
//   }
//   productOf(item: DraftItem): Product | undefined {
//     return this.products.find((p) => p._id === item.productId);
//   }

//   unitPriceOf(item: DraftItem): number {
//     const live = this.productOf(item)?.rate;
//     if (live !== undefined) return live;
//     return item.savedSnapshot?.unitPrice ?? 0;
//   }
//   qtyPerPacketOf(item: DraftItem): string {
//     const live = this.productOf(item)?.qtyPerPacket;
//     if (live !== undefined) return live;
//     return item.savedSnapshot?.qtyPerPacket || '—';
//   }
//   totalQtyNum(item: DraftItem): number {
//     const q = this.qtyPerPacketOf(item);
//     return calcTotalQty(q === '—' ? '' : q, Number(item.packets) || 0);
//   }
//   qtyText(n: number): string {
//     return fmtQty(n);
//   }
//   totalPackets(): number {
//     return this.items.reduce((s, i) => s + (Number(i.packets) || 0), 0);
//   }
//   totalQtyAll(): number {
//     return this.items.reduce((s, i) => s + this.totalQtyNum(i), 0);
//   }

//   // yahan personName.trim() use kiya hai taake type karte waqt hi read ho jaye
//   draftSections(): {
//     groupId: string;
//     personName: string;
//     rows: DraftItem[];
//     packets: number;
//     totalQty: number;
//     total: number;
//   }[] {
//     const make = (groupId: string, personName: string) => {
//       const rows = this.rowsOf(groupId);
//       return {
//         groupId,
//         personName,
//         rows,
//         packets: rows.reduce((s, i) => s + (Number(i.packets) || 0), 0),
//         totalQty: rows.reduce((s, i) => s + this.totalQtyNum(i), 0),
//         total: rows.reduce((s, i) => s + this.lineTotal(i), 0),
//       };
//     };
//     const out = [];
//     const main = make('', '');
//     if (main.rows.length) out.push(main);
//     for (const g of this.groups) {
//       const sec = make(g.groupId, g.personName.trim());
//       if (sec.rows.length) out.push(sec);
//     }
//     return out;
//   }
//   productNameOf(item: DraftItem): string {
//     const live = this.productOf(item)?.description;
//     if (live) return live;
//     return item.savedSnapshot?.productName || '—';
//   }
//   lineTotal(item: DraftItem): number {
//     return this.unitPriceOf(item) * (Number(item.packets) || 0);
//   }
//   itemsSubtotal(): number {
//     return this.items.reduce((s, i) => s + this.lineTotal(i), 0);
//   }

//   namedPersons(): { name: string; total: number }[] {
//     return this.groups
//       .filter((g) => g.personName.trim())
//       .map((g) => ({
//         name: g.personName.trim(),
//         total: this.groupTotal(g.groupId),
//       }))
//       .filter((p) => p.total > 0);
//   }

//   private itemsProblem(): string {
//     if (!this.items.length || this.items.some((i) => !i.productId))
//       return 'Add at least one product row and select a product for each.';
//     for (const g of this.groups) {
//       if (!g.personName.trim())
//         return 'Enter a name for every person you added (or remove the empty one).';
//       if (!this.rowsOf(g.groupId).length)
//         return `Add at least one product row for ${g.personName.trim()}, or remove that person.`;
//     }
//     return '';
//   }

//   goToSummary(): void {
//     const problem = this.itemsProblem();
//     if (problem) {
//       this.toast.error(problem);
//       return;
//     }
//     this.billService
//       .getBillingContext(
//         this.customerId,
//         this.editMode ? this.editingBillId || undefined : undefined,
//       )
//       .subscribe({
//         next: (res) => {
//           this.previousArrears = res.data.previousArrears;
//           this.availableAdvance = res.data.availableAdvance;
//           if (!this.editMode) {
//             this.advanceUsed = 0;
//             this.receivedAmount = 0;
//           }
//           this.step = 3;
//           this.recalc();
//         },
//         error: () =>
//           this.toast.error(
//             'Could not calculate arrears/advance for this customer. Please try again.',
//           ),
//       });
//   }

//   selectOnFocus(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     input.select();
//   }

//   recalc(): void {
//     const subtotal = this.itemsSubtotal();
//     const advanceUsed = Math.max(
//       0,
//       Math.min(Number(this.advanceUsed) || 0, this.availableAdvance),
//     );
//     this.grandTotal =
//       subtotal -
//       (Number(this.discount) || 0) +
//       (Number(this.deliveryCharges) || 0) +
//       (Number(this.rentCharges) || 0) +
//       (Number(this.extraCharges) || 0) +
//       this.previousArrears -
//       advanceUsed;
//     this.remaining = this.grandTotal - (Number(this.receivedAmount) || 0);
//   }

//   submitBill(): void {
//     if (this.saving) return;
//     const problem = this.itemsProblem();
//     if (problem) {
//       this.toast.error(problem);
//       return;
//     }
//     this.recalc();
//     this.saving = true;
//     const payload = {
//       customerId: this.customerId,
//       biltiNumber: this.biltiNumber,
//       driverName: this.driverName,
//       driverPhone: this.driverPhone,
//       date: this.date,
//       items: this.items.map((i) => ({
//         productId: i.productId,
//         packets: Number(i.packets) || 1,
//         groupId: i.groupId || '',
//       })),
//       groups: this.groups.map((g) => ({
//         groupId: g.groupId,
//         personName: g.personName.trim(),
//       })),
//       discount: Number(this.discount) || 0,
//       deliveryCharges: Number(this.deliveryCharges) || 0,
//       rentCharges: Number(this.rentCharges) || 0,
//       extraCharges: Number(this.extraCharges) || 0,
//       advanceUsed: Number(this.advanceUsed) || 0,
//       receivedAmount: Number(this.receivedAmount) || 0,
//       paymentMethod: this.paymentMethod,
//       remarks: this.remarks,
//       ...(this.editMode ? {} : { clientRequestId: this.requestId }),
//     };
//     const request =
//       this.editMode && this.editingBillId
//         ? this.billService.update(this.editingBillId, payload)
//         : this.billService.create(payload);
//     request.subscribe({
//       next: (res) => {
//         this.saving = false;
//         this.toast.success(
//           this.editMode
//             ? 'Bill updated successfully.'
//             : 'Bill saved successfully.',
//         );
//         this.savedBill = this.withSubmittedPersons(res.data, payload);
//         if (!this.editMode) this.requestId = newRequestId();
//       },
//       error: (err) => {
//         this.saving = false;
//         this.toast.error(
//           err?.error?.message ||
//             'Could not save this bill. Please check the details and try again.',
//         );
//       },
//     });
//   }

//   /**
//    * The invoice image is drawn from the bill returned by the server. If that
//    * response comes back without the person groups (e.g. an older backend that
//    * does not store them), fill in exactly the names/groupIds that were just
//    * submitted so the invoice and saved image still show the Person column.
//    * A response that already carries the groups is returned untouched, so
//    * names are never duplicated.
//    */
//   private withSubmittedPersons(
//     bill: Bill,
//     payload: {
//       items: { groupId: string }[];
//       groups: { groupId: string; personName: string }[];
//     },
//   ): Bill {
//     if (!bill || !payload.groups.length) return bill;
//     if ((bill.groups || []).length) return bill;
//     const items = (bill.items || []).map((it, idx) => ({
//       ...it,
//       groupId: it.groupId || payload.items[idx]?.groupId || '',
//     }));
//     return { ...bill, items, groups: payload.groups.map((g) => ({ ...g })) };
//   }

//   onInvoiceClosed(): void {
//     this.savedBill = null;
//     if (this.editMode) this.router.navigate(['/billinghistory']);
//     else this.resetAll();
//   }

//   cancel(): void {
//     if (this.editMode) this.router.navigate(['/billinghistory']);
//     else this.resetAll();
//   }

//   resetAll(): void {
//     this.step = 1;
//     this.customerId = '';
//     this.biltiNumber = '';
//     this.driverName = '';
//     this.driverPhone = '';
//     this.date = todayIso();
//     this.items = [];
//     this.groups = [];
//     this.requestId = newRequestId();
//     this.discount = 0;
//     this.deliveryCharges = 0;
//     this.rentCharges = 0;
//     this.extraCharges = 0;
//     this.advanceUsed = 0;
//     this.receivedAmount = 0;
//     this.paymentMethod = 'Bank Transfer';
//     this.remarks = '';
//     this.previousArrears = 0;
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CustomerService } from '../../services/customer.service';
import { ProductService } from '../../services/product.service';
import { BillService } from '../../services/bill.service';
import { ToastService } from '../../services/toast.service';
import { Customer, Product, Bill, BillItem, BillGroup } from '../../models';
import { fmtMoney, todayIso } from '../../shared/format.util';
import { InvoicePreviewComponent } from '../../components/invoice-preview/invoice-preview.component';
import { ProductSelectComponent } from '../../components/product-select/product-select.component';
import { calcTotalQty, fmtQty } from '../../shared/bill-groups.util';

interface DraftItem {
  rowId: string;
  productId: string;
  packets: number;
  groupId: string;
  savedSnapshot?: {
    productName: string;
    qtyPerPacket: string;
    type: string;
    unitPrice: number;
  };
}

function newRequestId(): string {
  const c: any = (globalThis as any).crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return (
    'req-' +
    Date.now().toString(36) +
    '-' +
    Math.random().toString(36).slice(2, 10)
  );
}

@Component({
  selector: 'app-new-bill',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InvoicePreviewComponent,
    ProductSelectComponent,
  ],
  template: `
    <div *ngIf="loadingBill" class="empty-state">
      <div class="ic"><i class="fa-solid fa-spinner fa-spin"></i></div>
      Loading bill…
    </div>

    <ng-container *ngIf="!loadingBill">
      <div class="steps">
        <div class="step" [class.active]="step === 1" [class.done]="step > 1">
          <span class="n">1</span>Order Header
        </div>
        <div class="step" [class.active]="step === 2" [class.done]="step > 2">
          <span class="n">2</span>Products
        </div>
        <div class="step" [class.active]="step === 3">
          <span class="n">3</span>Billing Summary
        </div>
      </div>

      <!-- STEP 1: ORDER HEADER -->
      <ng-container *ngIf="step === 1">
        <div class="panel">
          <div class="panel-head"><h3>Order Header</h3></div>
          <div class="panel-body pad">
            <div class="form-grid">
              <div class="field full">
                <label>Select Customer</label>
                <select
                  [(ngModel)]="customerId"
                  (ngModelChange)="onCustomerChange()"
                  [disabled]="editMode"
                >
                  <option value="" *ngIf="customers.length">
                    — Choose customer —
                  </option>
                  <option value="" *ngIf="!customers.length" disabled>
                    No customers found — add one first
                  </option>
                  <option *ngFor="let c of customers" [value]="c._id">
                    {{ c.fullName }} — {{ c.city }}
                  </option>
                </select>
              </div>
            </div>
            <div class="grid-3" style="margin-top:4px;">
              <div class="field">
                <label>Customer Name</label
                ><input disabled [value]="selectedCustomer()?.fullName || ''" />
              </div>
              <div class="field">
                <label>Phone Number</label
                ><input disabled [value]="selectedCustomer()?.phone || ''" />
              </div>
              <div class="field">
                <label>City</label
                ><input disabled [value]="selectedCustomer()?.city || ''" />
              </div>
            </div>
            <div
              class="field"
              *ngIf="customerId"
              style="max-width:280px;margin-top:4px;"
            >
              <label
                >Existing Arrears
                <span class="badge badge-due" *ngIf="loadingArrears"
                  >checking…</span
                ></label
              >
              <input
                disabled
                [value]="fmtMoney(previousArrears)"
                style="font-family:var(--font-mono);font-weight:600;"
              />
              <div class="hint">
                Fetched automatically for this customer — carried forward into
                this bill's summary.
              </div>
            </div>
          </div>
        </div>
        <div class="panel">
          <div class="panel-head"><h3>Delivery Information</h3></div>
          <div class="panel-body pad">
            <div class="grid-3">
              <div class="field">
                <label>Bilti Number</label
                ><input [(ngModel)]="biltiNumber" placeholder="e.g. BL-4471" />
              </div>
              <div class="field">
                <label>Driver Name</label
                ><input
                  [(ngModel)]="driverName"
                  placeholder="e.g. Naseer Ahmed"
                />
              </div>
              <div class="field">
                <label>Driver Phone Number</label
                ><input [(ngModel)]="driverPhone" placeholder="03xx-xxxxxxx" />
              </div>
            </div>
            <div class="field" style="margin-top:14px;max-width:220px;">
              <label>Bill Date</label><input type="date" [(ngModel)]="date" />
            </div>
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:10px;">
          <button class="btn btn-outline" (click)="cancel()">Cancel</button>
          <button class="btn btn-primary" (click)="goToItems()">
            Next: Add Products&nbsp;<i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </ng-container>

      <!-- STEP 2: PRODUCTS -->
      <ng-container *ngIf="step === 2">
        <ng-template #rowsTpl let-gid="gid">
          <div
            class="item-row"
            *ngFor="
              let item of rowsOf(gid);
              let idx = index;
              trackBy: trackByRowId
            "
          >
            <div class="num muted">{{ idx + 1 }}</div>
            <app-product-select
              [products]="products"
              [customerId]="customerId"
              [value]="item.productId"
              (valueChange)="onProductPicked(item, $event)"
            ></app-product-select>
            <input disabled [value]="fmtMoney(unitPriceOf(item))" />
            <input
              type="number"
              min="1"
              step="1"
              placeholder="Enter qty"
              autocomplete="off"
              [(ngModel)]="item.packets"
              (ngModelChange)="onPacketsChange(item)"
              (focus)="selectOnFocus($event)"
            />
            <div class="right num">{{ fmtMoney(lineTotal(item)) }}</div>
            <button
              class="icon-btn danger"
              title="Remove row"
              (click)="removeRow(item.rowId)"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </ng-template>

        <div class="panel">
          <div class="panel-head"><h3>Bill Items</h3></div>
          <div class="panel-body pad">
            <div class="table-wrap">
              <div class="item-row head">
                <div>#</div>
                <div>Product</div>
                <div>Unit Price</div>
                <div>Packets</div>
                <div class="right">Total</div>
                <div></div>
              </div>
              <div
                *ngIf="!items.length && !groups.length"
                class="empty-state"
                style="padding:26px;"
              >
                <div class="ic"><i class="fa-solid fa-table-list"></i></div>
                Click "Add Row" to select products for this bill.
              </div>
              <ng-container
                *ngTemplateOutlet="rowsTpl; context: { gid: '' }"
              ></ng-container>
            </div>

            <div
              class="group-block"
              *ngFor="let g of groups; let gi = index; trackBy: trackByGroupId"
            >
              <div class="group-head">
                <i class="fa-solid fa-user muted"></i>
                <input
                  class="group-name"
                  [(ngModel)]="g.personName"
                  maxlength="100"
                  placeholder="Person name (e.g. Ahmed)"
                  autocomplete="off"
                />
                <button
                  class="icon-btn danger"
                  title="Remove this person and their rows"
                  (click)="removeGroup(g.groupId)"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
              <div class="table-wrap">
                <div class="item-row head">
                  <div>#</div>
                  <div>Product</div>
                  <div>Unit Price</div>
                  <div>Packets</div>
                  <div class="right">Total</div>
                  <div></div>
                </div>
                <div
                  *ngIf="!rowsOf(g.groupId).length"
                  class="empty-state"
                  style="padding:14px;"
                >
                  No rows yet for this person.
                </div>
                <ng-container
                  *ngTemplateOutlet="rowsTpl; context: { gid: g.groupId }"
                ></ng-container>
              </div>
              <div class="group-foot">
                <button
                  class="btn btn-sm btn-outline"
                  (click)="addRow(g.groupId)"
                >
                  <i class="fa-solid fa-plus"></i>&nbsp;Add Row
                </button>
                <div>
                  Total{{
                    g.personName.trim() ? ' — ' + g.personName.trim() : ''
                  }}:
                  <strong class="num">{{
                    fmtMoney(groupTotal(g.groupId))
                  }}</strong>
                </div>
              </div>
            </div>

            <div class="bill-items-actions" style="margin-top:14px;">
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button class="btn btn-sm btn-dark" (click)="addRow('')">
                  <i class="fa-solid fa-plus"></i>&nbsp;Add Row
                </button>
                <button class="btn btn-sm btn-outline" (click)="addGroup()">
                  <i class="fa-solid fa-user-plus"></i>&nbsp;Add Person Name
                </button>
              </div>
              <div style="font-size:15px;">
                Items Subtotal:
                <strong class="num">{{ fmtMoney(itemsSubtotal()) }}</strong>
              </div>
            </div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;gap:10px;">
          <button class="btn btn-outline" (click)="step = 1">
            <i class="fa-solid fa-arrow-left"></i>&nbsp;Back
          </button>
          <button class="btn btn-primary" (click)="goToSummary()">
            Next: Billing Summary&nbsp;<i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </ng-container>

      <!-- STEP 3: BILLING SUMMARY -->
      <ng-container *ngIf="step === 3">
        <div class="grid-2">
          <div class="panel">
            <div class="panel-head">
              <h3>Billing Summary — {{ selectedCustomer()?.fullName }}</h3>
            </div>
            <div class="panel-body pad">
              <div class="summary-line">
                <span>Subtotal</span
                ><span class="v">{{ fmtMoney(itemsSubtotal()) }}</span>
              </div>
              <div class="summary-line">
                <span>Discount</span
                ><input
                  type="number"
                  autocomplete="off"
                  [(ngModel)]="discount"
                  (ngModelChange)="recalc()"
                  (focus)="selectOnFocus($event)"
                />
              </div>
              <div class="summary-line">
                <span>Delivery Charges</span
                ><input
                  type="number"
                  autocomplete="off"
                  [(ngModel)]="deliveryCharges"
                  (ngModelChange)="recalc()"
                  (focus)="selectOnFocus($event)"
                />
              </div>
              <div class="summary-line">
                <span>Rent Charges</span
                ><input
                  type="number"
                  autocomplete="off"
                  [(ngModel)]="rentCharges"
                  (ngModelChange)="recalc()"
                  (focus)="selectOnFocus($event)"
                />
              </div>
              <div class="summary-line">
                <span>Extra Charges</span
                ><input
                  type="number"
                  autocomplete="off"
                  [(ngModel)]="extraCharges"
                  (ngModelChange)="recalc()"
                  (focus)="selectOnFocus($event)"
                />
              </div>
              <div class="summary-line">
                <span
                  >Previous Arrears
                  <span class="badge badge-due" *ngIf="previousArrears > 0"
                    >auto</span
                  ></span
                ><span class="v">{{ fmtMoney(previousArrears) }}</span>
              </div>
              <div class="summary-line">
                <span
                  >Advance Adjustment
                  <span class="muted"
                    >(available {{ fmtMoney(availableAdvance) }})</span
                  ></span
                >
                <input
                  type="number"
                  autocomplete="off"
                  [(ngModel)]="advanceUsed"
                  [max]="availableAdvance"
                  (ngModelChange)="recalc()"
                  (focus)="selectOnFocus($event)"
                />
              </div>
              <div class="summary-line total">
                <span>Grand Total</span
                ><span class="v">{{ fmtMoney(grandTotal) }}</span>
              </div>
              <div class="summary-line" style="margin-top:10px;">
                <span>Received Amount</span
                ><input
                  type="number"
                  autocomplete="off"
                  [(ngModel)]="receivedAmount"
                  (ngModelChange)="recalc()"
                  (focus)="selectOnFocus($event)"
                />
              </div>
              <div class="summary-line">
                <span>Payment Method</span>
                <select
                  [(ngModel)]="paymentMethod"
                  style="padding:6px 8px;border:1.5px solid var(--line);border-radius:var(--radius);"
                >
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                  <option>Cheque</option>
                  <option>Online</option>
                </select>
              </div>
              <div class="summary-line total" style="border-top:none;">
                <span>Remaining Balance</span>
                <span
                  class="v"
                  [style.color]="remaining > 0 ? 'var(--rust)' : 'var(--green)'"
                  >{{ fmtMoney(remaining) }}</span
                >
              </div>
              <div class="field" style="margin-top:14px;">
                <label>Remarks</label>
                <textarea
                  rows="2"
                  [(ngModel)]="remarks"
                  placeholder="Optional notes for this bill"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="panel">
            <div class="panel-head"><h3>Items in this Bill</h3></div>
            <div class="panel-body pad">
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th class="right">Packets</th>
                      <th class="right">Rate</th>
                      <th class="right">Total</th>
                      <th *ngIf="hasPersonColumn()">Person</th>
                    </tr>
                  </thead>
                  <tbody *ngFor="let sec of draftSections()">
                    <tr *ngFor="let i of sec.rows; let idx = index">
                      <td class="num muted">{{ idx + 1 }}</td>
                      <td>{{ productNameOf(i) }}</td>
                      <td class="right num">{{ i.packets }}</td>
                      <td class="right num">{{ fmtMoney(unitPriceOf(i)) }}</td>
                      <td class="right num">{{ fmtMoney(lineTotal(i)) }}</td>
                      <td *ngIf="hasPersonColumn()" style="font-weight: 600;">
                        {{ idx === 0 ? sec.personName : '' }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="total-row">
                      <td
                        colspan="2"
                        style="vertical-align: top; padding: 8px 16px;"
                      >
                        Total
                      </td>
                      <td
                        class="right num"
                        style="vertical-align: top; padding: 8px 16px;"
                      >
                        {{ totalPackets() }}
                      </td>
                      <td style="padding: 8px 16px;"></td>
                      <td
                        class="right num"
                        style="vertical-align: top; padding: 8px 16px;"
                      >
                        {{ fmtMoney(itemsSubtotal()) }}
                      </td>
                      <td
                        *ngIf="hasPersonColumn()"
                        style="vertical-align: top; padding: 8px 16px;"
                      >
                        <div
                          *ngFor="let p of namedPersons()"
                          style="font-size: 11px; font-weight: normal; color: var(--ink-faint);"
                        >
                          {{ p.name }}: {{ fmtMoney(p.total) }}
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;gap:10px;">
          <button class="btn btn-outline" (click)="step = 2">
            <i class="fa-solid fa-arrow-left"></i>&nbsp;Back
          </button>
          <button
            class="btn btn-primary"
            [disabled]="saving"
            (click)="submitBill()"
          >
            <i class="fa-solid fa-check"></i>&nbsp;{{
              editMode ? 'Save Changes' : 'Save & Generate Invoice'
            }}
          </button>
        </div>
      </ng-container>
    </ng-container>

    <app-invoice-preview
      [bill]="savedBill"
      (close)="onInvoiceClosed()"
    ></app-invoice-preview>
  `,
})
export class NewBillComponent implements OnInit {
  step = 1;
  customers: Customer[] = [];
  products: Product[] = [];
  customerId = '';
  biltiNumber = '';
  driverName = '';
  driverPhone = '';
  date = todayIso();
  items: DraftItem[] = [];
  groups: { groupId: string; personName: string }[] = [];
  private requestId = newRequestId();
  private rowSeq = 0;
  discount = 0;
  deliveryCharges = 0;
  rentCharges = 0;
  extraCharges = 0;
  advanceUsed = 0;
  receivedAmount = 0;
  paymentMethod = 'Bank Transfer';
  remarks = '';
  previousArrears = 0;
  loadingArrears = false;
  availableAdvance = 0;
  grandTotal = 0;
  remaining = 0;
  saving = false;
  savedBill: Bill | null = null;
  editMode = false;
  editingBillId: string | null = null;
  loadingBill = false;
  fmtMoney = fmtMoney;

  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
    private billService: BillService,
    private toast: ToastService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.customerService.list().subscribe({
      next: (res) => (this.customers = res.data),
      error: () => this.toast.error('Could not load the customer list.'),
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.editingBillId = id;
      this.loadBillForEdit(id);
    }
  }

  private loadBillForEdit(id: string): void {
    this.loadingBill = true;
    this.loadingArrears = true;
    this.billService.get(id).subscribe({
      next: (res) => {
        const bill = res.data;
        const customer = bill.customerId as Customer;
        this.customerId =
          typeof customer === 'string' ? customer : customer?._id || '';
        this.biltiNumber = bill.biltiNumber || '';
        this.driverName = bill.driverName || '';
        this.driverPhone = bill.driverPhone || '';
        this.date = (bill.date || '').slice(0, 10) || todayIso();
        const billItems = bill.items || [];
        this.groups = (bill.groups || []).map((g: BillGroup) => ({
          groupId: g.groupId,
          personName: g.personName,
        }));
        const knownGroups = new Set(this.groups.map((g) => g.groupId));
        this.items = billItems.map((i) => ({
          rowId: this.nextRowId(),
          groupId: i.groupId && knownGroups.has(i.groupId) ? i.groupId : '',
          productId:
            typeof i.productId === 'string' ? i.productId : String(i.productId),
          packets: Number(i.packets) || 1,
          savedSnapshot: {
            productName: i.productName || '',
            qtyPerPacket: i.qtyPerPacket || '',
            type: i.type || '',
            unitPrice: Number(i.unitPrice) || 0,
          },
        }));
        this.discount = Number(bill.discount) || 0;
        this.deliveryCharges = Number(bill.deliveryCharges) || 0;
        this.rentCharges = Number(bill.rentCharges) || 0;
        this.extraCharges = Number(bill.extraCharges) || 0;
        this.advanceUsed = Number(bill.advanceUsed) || 0;
        this.receivedAmount = Number(bill.receivedAmount) || 0;
        this.paymentMethod = bill.paymentMethod || 'Bank Transfer';
        this.remarks = bill.remarks || '';
        if (!this.customerId) {
          this.loadingBill = false;
          this.loadingArrears = false;
          this.toast.error(
            'This bill has no valid customer on record and cannot be edited.',
          );
          this.router.navigate(['/billinghistory']);
          return;
        }
        forkJoin({
          products: this.productService.list(this.customerId),
          context: this.billService.getBillingContext(
            this.customerId,
            this.editingBillId || undefined,
          ),
        }).subscribe({
          next: ({ products, context }) => {
            this.products = this.withMissingBillProducts(
              products.data,
              billItems,
            );
            this.previousArrears = context.data.previousArrears;
            this.availableAdvance = context.data.availableAdvance;
            this.loadingBill = false;
            this.loadingArrears = false;
          },
          error: () => {
            this.loadingBill = false;
            this.loadingArrears = false;
            this.toast.error(
              "Bill loaded, but this customer's product catalogue or arrears could not be loaded.",
            );
          },
        });
      },
      error: (err) => {
        this.loadingBill = false;
        this.loadingArrears = false;
        this.toast.error(
          err?.error?.message || 'Could not load this bill for editing.',
        );
        this.router.navigate(['/billinghistory']);
      },
    });
  }

  private withMissingBillProducts(
    liveProducts: Product[],
    billItems: BillItem[],
  ): Product[] {
    const known = new Set(liveProducts.map((p) => p._id));
    const synthesized: Product[] = [];
    const seen = new Set<string>();
    for (const i of billItems) {
      const id =
        typeof i.productId === 'string' ? i.productId : String(i.productId);
      if (!id || known.has(id) || seen.has(id)) continue;
      seen.add(id);
      synthesized.push({
        _id: id,
        customerId: this.customerId,
        countNumber: '',
        type: i.type || '',
        description: i.productName
          ? `${i.productName} (no longer in catalogue)`
          : 'Unavailable product',
        qtyPerPacket: i.qtyPerPacket || '',
        rate: Number(i.unitPrice) || 0,
        createdAt: '',
      });
    }
    return synthesized.length
      ? [...liveProducts, ...synthesized]
      : liveProducts;
  }

  selectedCustomer(): Customer | undefined {
    return this.customers.find((c) => c._id === this.customerId);
  }

  onCustomerChange(): void {
    if (this.editMode) return;
    this.products = [];
    this.items = [];
    this.groups = [];
    this.previousArrears = 0;
    if (this.customerId) this.fetchArrearsPreview(this.customerId);
  }

  private fetchArrearsPreview(customerId: string): void {
    this.loadingArrears = true;
    this.billService
      .getBillingContext(
        customerId,
        this.editMode ? this.editingBillId || undefined : undefined,
      )
      .subscribe({
        next: (res) => {
          this.previousArrears = res.data.previousArrears;
          this.availableAdvance = res.data.availableAdvance;
          this.loadingArrears = false;
        },
        error: () => {
          this.loadingArrears = false;
        },
      });
  }

  goToItems(): void {
    if (!this.customerId) {
      this.toast.error('Please select a customer first.');
      return;
    }
    this.productService.list(this.customerId).subscribe({
      next: (res) => {
        this.products = res.data;
        this.step = 2;
      },
      error: () =>
        this.toast.error(
          "Could not load this customer's products. Please try again.",
        ),
    });
  }

  private nextRowId(): string {
    this.rowSeq += 1;
    return 'row-' + this.rowSeq;
  }
  trackByRowId(_index: number, item: DraftItem): string {
    return item.rowId;
  }
  addRow(groupId = ''): void {
    if (!this.products.length) {
      this.toast.error(
        'This customer has no products yet — add their catalogue in Products & Price first.',
      );
      return;
    }
    this.items.push({
      rowId: this.nextRowId(),
      productId: '',
      packets: 1,
      groupId,
    });
  }
  removeRow(rowId: string): void {
    this.items = this.items.filter((i) => i.rowId !== rowId);
  }
  rowsOf(groupId: string): DraftItem[] {
    return this.items.filter((i) => (i.groupId || '') === groupId);
  }
  trackByGroupId(_index: number, g: { groupId: string }): string {
    return g.groupId;
  }
  addGroup(): void {
    if (!this.products.length) {
      this.toast.error(
        'This customer has no products yet — add their catalogue in Products & Price first.',
      );
      return;
    }
    this.rowSeq += 1;
    const groupId = 'grp-' + Date.now().toString(36) + '-' + this.rowSeq;
    this.groups.push({ groupId, personName: '' });
    this.addRow(groupId);
  }
  removeGroup(groupId: string): void {
    const rows = this.rowsOf(groupId).length;
    if (rows && !confirm(`Remove this person and their ${rows} row(s)?`))
      return;
    this.items = this.items.filter((i) => i.groupId !== groupId);
    this.groups = this.groups.filter((g) => g.groupId !== groupId);
  }
  groupTotal(groupId: string): number {
    return this.rowsOf(groupId).reduce((s, i) => s + this.lineTotal(i), 0);
  }
  onProductPicked(item: DraftItem, productId: string): void {
    item.productId = productId;
    this.onProductChange(item);
  }
  onProductChange(item: DraftItem): void {
    item.packets = 1;
  }
  onPacketsChange(item: DraftItem): void {
    const n = Number(item.packets);
    item.packets = !n || n < 1 ? 1 : Math.floor(n);
  }
  productOf(item: DraftItem): Product | undefined {
    return this.products.find((p) => p._id === item.productId);
  }

  unitPriceOf(item: DraftItem): number {
    const live = this.productOf(item)?.rate;
    if (live !== undefined) return live;
    return item.savedSnapshot?.unitPrice ?? 0;
  }
  qtyPerPacketOf(item: DraftItem): string {
    const live = this.productOf(item)?.qtyPerPacket;
    if (live !== undefined) return live;
    return item.savedSnapshot?.qtyPerPacket || '—';
  }
  totalQtyNum(item: DraftItem): number {
    const q = this.qtyPerPacketOf(item);
    return calcTotalQty(q === '—' ? '' : q, Number(item.packets) || 0);
  }
  qtyText(n: number): string {
    return fmtQty(n);
  }
  totalPackets(): number {
    return this.items.reduce((s, i) => s + (Number(i.packets) || 0), 0);
  }
  totalQtyAll(): number {
    return this.items.reduce((s, i) => s + this.totalQtyNum(i), 0);
  }

  // yahan personName.trim() use kiya hai taake type karte waqt hi read ho jaye
  draftSections(): {
    groupId: string;
    personName: string;
    rows: DraftItem[];
    packets: number;
    totalQty: number;
    total: number;
  }[] {
    const make = (groupId: string, personName: string) => {
      const rows = this.rowsOf(groupId);
      return {
        groupId,
        personName,
        rows,
        packets: rows.reduce((s, i) => s + (Number(i.packets) || 0), 0),
        totalQty: rows.reduce((s, i) => s + this.totalQtyNum(i), 0),
        total: rows.reduce((s, i) => s + this.lineTotal(i), 0),
      };
    };
    const out = [];
    const main = make('', '');
    if (main.rows.length) out.push(main);
    for (const g of this.groups) {
      const sec = make(g.groupId, g.personName.trim());
      if (sec.rows.length) out.push(sec);
    }
    return out;
  }
  productNameOf(item: DraftItem): string {
    const live = this.productOf(item)?.description;
    if (live) return live;
    return item.savedSnapshot?.productName || '—';
  }
  lineTotal(item: DraftItem): number {
    return this.unitPriceOf(item) * (Number(item.packets) || 0);
  }
  itemsSubtotal(): number {
    return this.items.reduce((s, i) => s + this.lineTotal(i), 0);
  }

  /** The Person column exists only when Add Person Name was used and a name is entered. */
  hasPersonColumn(): boolean {
    return this.groups.some(
      (g) => g.personName.trim() && this.rowsOf(g.groupId).length,
    );
  }

  namedPersons(): { name: string; total: number }[] {
    return this.groups
      .filter((g) => g.personName.trim())
      .map((g) => ({
        name: g.personName.trim(),
        total: this.groupTotal(g.groupId),
      }))
      .filter((p) => p.total > 0);
  }

  private itemsProblem(): string {
    if (!this.items.length || this.items.some((i) => !i.productId))
      return 'Add at least one product row and select a product for each.';
    for (const g of this.groups) {
      if (!g.personName.trim())
        return 'Enter a name for every person you added (or remove the empty one).';
      if (!this.rowsOf(g.groupId).length)
        return `Add at least one product row for ${g.personName.trim()}, or remove that person.`;
    }
    return '';
  }

  goToSummary(): void {
    const problem = this.itemsProblem();
    if (problem) {
      this.toast.error(problem);
      return;
    }
    this.billService
      .getBillingContext(
        this.customerId,
        this.editMode ? this.editingBillId || undefined : undefined,
      )
      .subscribe({
        next: (res) => {
          this.previousArrears = res.data.previousArrears;
          this.availableAdvance = res.data.availableAdvance;
          if (!this.editMode) {
            this.advanceUsed = 0;
            this.receivedAmount = 0;
          }
          this.step = 3;
          this.recalc();
        },
        error: () =>
          this.toast.error(
            'Could not calculate arrears/advance for this customer. Please try again.',
          ),
      });
  }

  selectOnFocus(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  recalc(): void {
    const subtotal = this.itemsSubtotal();
    const advanceUsed = Math.max(
      0,
      Math.min(Number(this.advanceUsed) || 0, this.availableAdvance),
    );
    this.grandTotal =
      subtotal -
      (Number(this.discount) || 0) +
      (Number(this.deliveryCharges) || 0) +
      (Number(this.rentCharges) || 0) +
      (Number(this.extraCharges) || 0) +
      this.previousArrears -
      advanceUsed;
    this.remaining = this.grandTotal - (Number(this.receivedAmount) || 0);
  }

  submitBill(): void {
    if (this.saving) return;
    const problem = this.itemsProblem();
    if (problem) {
      this.toast.error(problem);
      return;
    }
    this.recalc();
    this.saving = true;
    const payload = {
      customerId: this.customerId,
      biltiNumber: this.biltiNumber,
      driverName: this.driverName,
      driverPhone: this.driverPhone,
      date: this.date,
      items: this.items.map((i) => ({
        productId: i.productId,
        packets: Number(i.packets) || 1,
        groupId: i.groupId || '',
      })),
      groups: this.groups.map((g) => ({
        groupId: g.groupId,
        personName: g.personName.trim(),
      })),
      discount: Number(this.discount) || 0,
      deliveryCharges: Number(this.deliveryCharges) || 0,
      rentCharges: Number(this.rentCharges) || 0,
      extraCharges: Number(this.extraCharges) || 0,
      advanceUsed: Number(this.advanceUsed) || 0,
      receivedAmount: Number(this.receivedAmount) || 0,
      paymentMethod: this.paymentMethod,
      remarks: this.remarks,
      ...(this.editMode ? {} : { clientRequestId: this.requestId }),
    };
    const request =
      this.editMode && this.editingBillId
        ? this.billService.update(this.editingBillId, payload)
        : this.billService.create(payload);
    request.subscribe({
      next: (res) => {
        this.saving = false;
        this.toast.success(
          this.editMode
            ? 'Bill updated successfully.'
            : 'Bill saved successfully.',
        );
        this.savedBill = this.withSubmittedPersons(res.data, payload);
        if (!this.editMode) this.requestId = newRequestId();
      },
      error: (err) => {
        this.saving = false;
        this.toast.error(
          err?.error?.message ||
            'Could not save this bill. Please check the details and try again.',
        );
      },
    });
  }

  /**
   * The invoice image is drawn from the bill returned by the server. If that
   * response comes back without the person groups (e.g. an older backend that
   * does not store them), fill in exactly the names/groupIds that were just
   * submitted so the invoice and saved image still show the Person column.
   * A response that already carries the groups is returned untouched, so
   * names are never duplicated.
   */
  private withSubmittedPersons(
    bill: Bill,
    payload: {
      items: { groupId: string }[];
      groups: { groupId: string; personName: string }[];
    },
  ): Bill {
    if (!bill || !payload.groups.length) return bill;
    if ((bill.groups || []).length) return bill;
    const items = (bill.items || []).map((it, idx) => ({
      ...it,
      groupId: it.groupId || payload.items[idx]?.groupId || '',
    }));
    return { ...bill, items, groups: payload.groups.map((g) => ({ ...g })) };
  }

  onInvoiceClosed(): void {
    this.savedBill = null;
    if (this.editMode) this.router.navigate(['/billinghistory']);
    else this.resetAll();
  }

  cancel(): void {
    if (this.editMode) this.router.navigate(['/billinghistory']);
    else this.resetAll();
  }

  resetAll(): void {
    this.step = 1;
    this.customerId = '';
    this.biltiNumber = '';
    this.driverName = '';
    this.driverPhone = '';
    this.date = todayIso();
    this.items = [];
    this.groups = [];
    this.requestId = newRequestId();
    this.discount = 0;
    this.deliveryCharges = 0;
    this.rentCharges = 0;
    this.extraCharges = 0;
    this.advanceUsed = 0;
    this.receivedAmount = 0;
    this.paymentMethod = 'Bank Transfer';
    this.remarks = '';
    this.previousArrears = 0;
  }
}
