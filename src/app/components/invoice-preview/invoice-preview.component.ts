// // // import {
// // //   Component,
// // //   EventEmitter,
// // //   Input,
// // //   OnChanges,
// // //   Output,
// // //   SimpleChanges,
// // // } from '@angular/core';
// // // import { CommonModule } from '@angular/common';
// // // import html2canvas from 'html2canvas';
// // // import { Bill, Customer, InvoiceImage } from '../../models';
// // // import {
// // //   fmtDate,
// // //   fmtMoney,
// // //   sanitizeFileNamePart,
// // // } from '../../shared/format.util';
// // // import { InvoiceImageService } from '../../services/invoice-image.service';
// // // import { ToastService } from '../../services/toast.service';

// // // @Component({
// // //   selector: 'app-invoice-preview',
// // //   standalone: true,
// // //   imports: [CommonModule],
// // //   template: `
// // //     <div class="modal-backdrop" *ngIf="bill" (click)="closeOnBackdrop($event)">
// // //       <div class="modal wide">
// // //         <div class="modal-head">
// // //           <h3>Invoice — {{ bill.displayId }}</h3>
// // //           <button class="modal-close" (click)="close.emit()">
// // //             <i class="fa-solid fa-xmark"></i>
// // //           </button>
// // //         </div>
// // //         <div class="modal-body" style="background:var(--paper-2);">
// // //           <div class="invoice" id="invoiceContent">
// // //             <div
// // //               class="stamp paid"
// // //               data-html2canvas-ignore
// // //               *ngIf="bill.remainingBalance <= 0"
// // //             >
// // //               PAID
// // //             </div>
// // //             <div
// // //               class="stamp"
// // //               data-html2canvas-ignore
// // //               *ngIf="bill.remainingBalance > 0 && bill.receivedAmount > 0"
// // //             >
// // //               PARTIAL
// // //             </div>
// // //             <div
// // //               class="stamp"
// // //               data-html2canvas-ignore
// // //               *ngIf="bill.remainingBalance > 0 && bill.receivedAmount <= 0"
// // //             >
// // //               DUE
// // //             </div>

// // //             <div class="invoice-head">
// // //               <div class="invoice-brand">
// // //                 <div class="mark">STS</div>
// // //                 <div>
// // //                   <h2>Tanveer Factory</h2>
// // //                   <p>Factory Billing &amp; Customer Ledger</p>
// // //                 </div>
// // //               </div>
// // //               <div class="invoice-meta">
// // //                 <div class="big">{{ bill.displayId }}</div>
// // //                 <div>Date: {{ fmtDate(bill.date) }}</div>
// // //                 <div>Bilti #: {{ bill.biltiNumber || '—' }}</div>
// // //               </div>
// // //             </div>

// // //             <div class="invoice-grid">
// // //               <div class="invoice-box">
// // //                 <h4>Bill To</h4>
// // //                 <p>
// // //                   <strong>{{ customer()?.fullName || '—' }}</strong
// // //                   ><br />{{ customer()?.city }}<br />{{ customer()?.phone }}
// // //                 </p>
// // //               </div>
// // //               <div class="invoice-box">
// // //                 <h4>Delivery Details</h4>
// // //                 <p>
// // //                   Driver: {{ bill.driverName || '—' }}<br />Contact:
// // //                   {{ bill.driverPhone || '—' }}
// // //                 </p>
// // //               </div>
// // //             </div>

// // //             <table>
// // //               <thead>
// // //                 <tr>
// // //                   <th>#</th>
// // //                   <th>Person</th>
// // //                   <th>Product</th>
// // //                   <th>Type</th>
// // //                   <th class="right">Packets</th>
// // //                   <th class="right">Unit Price</th>
// // //                   <th class="right">Total</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 <tr *ngFor="let item of flattenedItems; let idx = index">
// // //                   <td class="num">{{ idx + 1 }}</td>
// // //                   <td style="font-weight: 600; color: var(--ink);">
// // //                     {{ item.personName }}
// // //                   </td>
// // //                   <td>{{ item.productName }}</td>
// // //                   <td>{{ item.type }}</td>
// // //                   <td class="right num">{{ item.packets }}</td>
// // //                   <td class="right num">{{ fmtMoney(item.unitPrice) }}</td>
// // //                   <td class="right num">{{ fmtMoney(item.total) }}</td>
// // //                 </tr>
// // //               </tbody>
// // //               <tfoot>
// // //                 <tr class="total-row">
// // //                   <td colspan="2" style="vertical-align: top;">Total</td>
// // //                   <td
// // //                     colspan="3"
// // //                     style="vertical-align: top; padding-left: 10px;"
// // //                   >
// // //                     <div
// // //                       *ngFor="let p of personTotals"
// // //                       style="font-size: 11px; font-weight: normal; color: var(--ink-faint);"
// // //                     >
// // //                       {{ p.name }}: {{ fmtMoney(p.total) }}
// // //                     </div>
// // //                   </td>
// // //                   <td class="right num" style="vertical-align: bottom;">
// // //                     {{ totals.packets }}
// // //                   </td>
// // //                   <td class="right num" style="vertical-align: bottom;">
// // //                     {{ fmtMoney(totals.total) }}
// // //                   </td>
// // //                 </tr>
// // //               </tfoot>
// // //             </table>

// // //             <div style="max-width:320px;margin-left:auto;">
// // //               <div class="summary-line">
// // //                 <span>Subtotal</span
// // //                 ><span class="v">{{ fmtMoney(bill.subtotal) }}</span>
// // //               </div>
// // //               <div class="summary-line">
// // //                 <span>Discount</span
// // //                 ><span class="v">- {{ fmtMoney(bill.discount) }}</span>
// // //               </div>
// // //               <div class="summary-line" *ngIf="bill.deliveryCharges > 0">
// // //                 <span>Delivery Charges</span
// // //                 ><span class="v">{{ fmtMoney(bill.deliveryCharges) }}</span>
// // //               </div>
// // //               <div class="summary-line" *ngIf="bill.rentCharges > 0">
// // //                 <span>Rent Charges</span
// // //                 ><span class="v">{{ fmtMoney(bill.rentCharges) }}</span>
// // //               </div>
// // //               <div class="summary-line" *ngIf="bill.extraCharges > 0">
// // //                 <span>Extra Charges</span
// // //                 ><span class="v">{{ fmtMoney(bill.extraCharges) }}</span>
// // //               </div>
// // //               <div class="summary-line" *ngIf="bill.previousArrears > 0">
// // //                 <span>Previous Arrears</span
// // //                 ><span class="v">{{ fmtMoney(bill.previousArrears) }}</span>
// // //               </div>
// // //               <div class="summary-line" *ngIf="bill.advanceUsed > 0">
// // //                 <span>Advance Used</span
// // //                 ><span class="v">- {{ fmtMoney(bill.advanceUsed) }}</span>
// // //               </div>
// // //               <div class="summary-line total">
// // //                 <span>Grand Total</span
// // //                 ><span class="v">{{ fmtMoney(bill.grandTotal) }}</span>
// // //               </div>
// // //               <div class="summary-line">
// // //                 <span>Received Amount</span
// // //                 ><span class="v">{{ fmtMoney(bill.receivedAmount) }}</span>
// // //               </div>
// // //               <div class="summary-line">
// // //                 <span>Remaining Balance</span>
// // //                 <span
// // //                   class="v"
// // //                   [style.color]="
// // //                     bill.remainingBalance > 0 ? 'var(--rust)' : 'var(--green)'
// // //                   "
// // //                   >{{ fmtMoney(bill.remainingBalance) }}</span
// // //                 >
// // //               </div>
// // //             </div>

// // //             <p
// // //               style="margin-top:14px;font-size:12.5px;"
// // //               class="muted"
// // //               *ngIf="bill.remarks"
// // //             >
// // //               Remarks: {{ bill.remarks }}
// // //             </p>

// // //             <div class="tear"></div>
// // //             <div class="sign-row">
// // //               <div>Received By</div>
// // //               <div>Authorized Signature</div>
// // //             </div>
// // //           </div>

// // //           <div
// // //             *ngIf="savedImages.length"
// // //             style="margin-top:14px;font-size:12.5px;"
// // //             class="muted"
// // //           >
// // //             Previously saved images:
// // //             <span *ngFor="let img of savedImages; let last = last">
// // //               <span
// // //                 class="link-btn"
// // //                 style="cursor:pointer"
// // //                 (click)="redownload(img)"
// // //                 >{{ img.fileName }}</span
// // //               >{{ last ? '' : ', ' }}
// // //             </span>
// // //           </div>
// // //         </div>
// // //         <div class="modal-foot">
// // //           <button class="btn btn-outline" (click)="close.emit()">Close</button>
// // //           <button class="btn btn-outline" (click)="exportCsv()">
// // //             <i class="fa-solid fa-file-csv"></i>&nbsp;Export CSV
// // //           </button>
// // //           <button
// // //             class="btn btn-outline"
// // //             [disabled]="downloadingImage"
// // //             (click)="downloadImage()"
// // //           >
// // //             <i class="fa-solid fa-image" *ngIf="!downloadingImage"></i>
// // //             {{ downloadingImage ? 'Preparing Image…' : ' Download as Image' }}
// // //           </button>
// // //           <button class="btn btn-primary" (click)="print()">
// // //             <i class="fa-solid fa-print"></i>&nbsp;Print / Save as PDF
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   `,
// // // })
// // // export class InvoicePreviewComponent implements OnChanges {
// // //   @Input() bill: Bill | null = null;
// // //   @Output() close = new EventEmitter<void>();

// // //   fmtDate = fmtDate;
// // //   fmtMoney = fmtMoney;

// // //   flattenedItems: any[] = [];
// // //   personTotals: { name: string; total: number }[] = [];
// // //   totals = { packets: 0, total: 0 };
// // //   downloadingImage = false;
// // //   savedImages: InvoiceImage[] = [];

// // //   constructor(
// // //     private invoiceImageService: InvoiceImageService,
// // //     private toast: ToastService,
// // //   ) {}

// // //   ngOnChanges(changes: SimpleChanges): void {
// // //     if (changes['bill'] && this.bill) {
// // //       this.buildSectionsAndFlattenItems();
// // //       this.savedImages = [];
// // //       this.invoiceImageService.listForBill(this.bill._id).subscribe({
// // //         next: (res) => (this.savedImages = res.data),
// // //         error: () => {},
// // //       });
// // //     }
// // //   }

// // //   // Ye method 'groups' (person names) ko 'items' ke sath map karta hai
// // //   private buildSectionsAndFlattenItems() {
// // //     if (!this.bill) return;

// // //     this.flattenedItems = [];
// // //     this.personTotals = [];
// // //     this.totals = { packets: 0, total: 0 };

// // //     // Person Names ki mapping banayein
// // //     const groupsMap = new Map<string, string>();
// // //     (this.bill.groups || []).forEach((g) => {
// // //       groupsMap.set(g.groupId, g.personName);
// // //     });

// // //     const personTotalsMap = new Map<string, number>();

// // //     // Items ko flatten karein aur person name attach karein
// // //     (this.bill.items || []).forEach((item) => {
// // //       const pName = item.groupId ? groupsMap.get(item.groupId) || '' : '';

// // //       this.flattenedItems.push({
// // //         ...item,
// // //         personName: pName, // Har item ke sath uska person name
// // //       });

// // //       this.totals.packets += Number(item.packets) || 0;
// // //       this.totals.total += Number(item.total) || 0;

// // //       if (pName) {
// // //         const currentTotal = personTotalsMap.get(pName) || 0;
// // //         personTotalsMap.set(pName, currentTotal + (Number(item.total) || 0));
// // //       }
// // //     });

// // //     this.personTotals = Array.from(personTotalsMap.entries()).map(
// // //       ([name, total]) => ({
// // //         name,
// // //         total,
// // //       }),
// // //     );
// // //   }

// // //   customer(): Customer | null {
// // //     if (!this.bill) return null;
// // //     return typeof this.bill.customerId === 'string'
// // //       ? null
// // //       : (this.bill.customerId as Customer);
// // //   }

// // //   closeOnBackdrop(e: MouseEvent): void {
// // //     if ((e.target as HTMLElement).classList.contains('modal-backdrop'))
// // //       this.close.emit();
// // //   }

// // //   print(): void {
// // //     const content = document.getElementById('invoiceContent');
// // //     const printArea = document.getElementById('printArea');
// // //     if (content && printArea) {
// // //       printArea.innerHTML = content.outerHTML;
// // //       window.print();
// // //     }
// // //   }

// // //   exportCsv(): void {
// // //     if (!this.bill) return;
// // //     const rows: string[][] = [
// // //       ['#', 'Bill', 'Person', 'Product', 'Packets', 'Unit Price', 'Total'],
// // //     ];
// // //     let n = 0;
// // //     for (const item of this.flattenedItems) {
// // //       n += 1;
// // //       rows.push([
// // //         String(n),
// // //         this.bill.displayId,
// // //         item.personName,
// // //         item.productName,
// // //         String(item.packets),
// // //         String(item.unitPrice),
// // //         String(item.total),
// // //       ]);
// // //     }
// // //     const csv = rows
// // //       .map((r) =>
// // //         r
// // //           .map((cell) =>
// // //             /[",\n]/.test(cell) ? '"' + cell.replace(/"/g, '""') + '"' : cell,
// // //           )
// // //           .join(','),
// // //       )
// // //       .join('\n');
// // //     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
// // //     const url = URL.createObjectURL(blob);
// // //     const a = document.createElement('a');
// // //     a.href = url;
// // //     a.download = `${this.bill.displayId}.csv`;
// // //     document.body.appendChild(a);
// // //     a.click();
// // //     a.remove();
// // //     URL.revokeObjectURL(url);
// // //   }

// // //   private buildImageFileName(): string {
// // //     if (!this.bill) return 'invoice.png';
// // //     const customerName = sanitizeFileNamePart(this.customer()?.fullName);
// // //     const bilti = sanitizeFileNamePart(this.bill.biltiNumber || 'NoBilti');
// // //     const date =
// // //       (this.bill.date || '').slice(0, 10) ||
// // //       new Date().toISOString().slice(0, 10);
// // //     return `${customerName}_${bilti}_${date}.png`;
// // //   }

// // //   private triggerDownload(url: string, fileName: string): void {
// // //     const a = document.createElement('a');
// // //     a.href = url;
// // //     a.download = fileName;
// // //     document.body.appendChild(a);
// // //     a.click();
// // //     a.remove();
// // //   }

// // //   downloadImage(): void {
// // //     if (!this.bill || this.downloadingImage) return;

// // //     this.downloadingImage = true;
// // //     const fileName = this.buildImageFileName();
// // //     const billId = this.bill._id;

// // //     // 🔥 SAB SE BADA FIX: 500ms ka delay (setTimeout)
// // //     // Ye delay html2canvas ko waqt deta hai ke wo DOM ko properly render kar le
// // //     // aur Person Name wali row blank na aaye.
// // //     setTimeout(() => {
// // //       const content = document.getElementById('invoiceContent');
// // //       if (!content) {
// // //         this.downloadingImage = false;
// // //         this.toast.error('Could not find the invoice content to capture.');
// // //         return;
// // //       }

// // //       html2canvas(content, {
// // //         backgroundColor: '#ffffff',
// // //         scale: 2,
// // //         useCORS: true,
// // //         logging: false,
// // //       })
// // //         .then((canvas) => {
// // //           if (!canvas || !canvas.width || !canvas.height)
// // //             throw new Error('The captured invoice image came out empty.');
// // //           let dataUrl: string;
// // //           try {
// // //             dataUrl = canvas.toDataURL('image/png');
// // //           } catch {
// // //             throw new Error('The invoice image could not be encoded.');
// // //           }

// // //           this.triggerDownload(dataUrl, fileName);
// // //           this.invoiceImageService.save(billId, fileName, dataUrl).subscribe({
// // //             next: (res) => {
// // //               this.downloadingImage = false;
// // //               this.savedImages = [res.data, ...this.savedImages];
// // //               this.toast.success('Invoice image downloaded and saved.');
// // //             },
// // //             error: (err) => {
// // //               this.downloadingImage = false;
// // //               this.toast.error(
// // //                 err?.error?.message ||
// // //                   'Image downloaded, but saving it to the server failed.',
// // //               );
// // //             },
// // //           });
// // //         })
// // //         .catch((err: Error) => {
// // //           this.downloadingImage = false;
// // //           this.toast.error(
// // //             err?.message || 'Could not generate the invoice image.',
// // //           );
// // //         });
// // //     }, 500);
// // //   }

// // //   redownload(img: InvoiceImage): void {
// // //     if (!img?.url) {
// // //       this.toast.error('This saved image has no file associated with it.');
// // //       return;
// // //     }
// // //     const url = this.invoiceImageService.toAbsoluteUrl(img.url);
// // //     fetch(url)
// // //       .then((r) => {
// // //         if (!r.ok) throw new Error('not ok');
// // //         return r.blob();
// // //       })
// // //       .then((blob) => {
// // //         const objectUrl = URL.createObjectURL(blob);
// // //         this.triggerDownload(objectUrl, img.fileName);
// // //         setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
// // //       })
// // //       .catch(() => {
// // //         this.toast.error(
// // //           'Could not download this saved image. It may no longer be available.',
// // //         );
// // //       });
// // //   }
// // // }

// // import {
// //   Component,
// //   EventEmitter,
// //   Input,
// //   OnChanges,
// //   Output,
// //   SimpleChanges,
// // } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import html2canvas from 'html2canvas';
// // import { Bill, Customer, InvoiceImage } from '../../models';
// // import {
// //   fmtDate,
// //   fmtMoney,
// //   sanitizeFileNamePart,
// // } from '../../shared/format.util';
// // import { InvoiceImageService } from '../../services/invoice-image.service';
// // import { ToastService } from '../../services/toast.service';

// // @Component({
// //   selector: 'app-invoice-preview',
// //   standalone: true,
// //   imports: [CommonModule],
// //   template: `
// //     <div class="modal-backdrop" *ngIf="bill" (click)="closeOnBackdrop($event)">
// //       <div class="modal wide">
// //         <div class="modal-head">
// //           <h3>Invoice — {{ bill.displayId }}</h3>
// //           <button class="modal-close" (click)="close.emit()">
// //             <i class="fa-solid fa-xmark"></i>
// //           </button>
// //         </div>
// //         <div class="modal-body" style="background:var(--paper-2);">
// //           <div class="invoice" id="invoiceContent">
// //             <div
// //               class="stamp paid"
// //               data-html2canvas-ignore
// //               *ngIf="bill.remainingBalance <= 0"
// //             >
// //               PAID
// //             </div>
// //             <div
// //               class="stamp"
// //               data-html2canvas-ignore
// //               *ngIf="bill.remainingBalance > 0 && bill.receivedAmount > 0"
// //             >
// //               PARTIAL
// //             </div>
// //             <div
// //               class="stamp"
// //               data-html2canvas-ignore
// //               *ngIf="bill.remainingBalance > 0 && bill.receivedAmount <= 0"
// //             >
// //               DUE
// //             </div>

// //             <div class="invoice-head">
// //               <div class="invoice-brand">
// //                 <div class="mark">STS</div>
// //                 <div>
// //                   <h2>Tanveer Factory</h2>
// //                   <p>Factory Billing &amp; Customer Ledger</p>
// //                 </div>
// //               </div>
// //               <div class="invoice-meta">
// //                 <div class="big">{{ bill.displayId }}</div>
// //                 <div>Date: {{ fmtDate(bill.date) }}</div>
// //                 <div>Bilti #: {{ bill.biltiNumber || '—' }}</div>
// //               </div>
// //             </div>

// //             <div class="invoice-grid">
// //               <div class="invoice-box">
// //                 <h4>Bill To</h4>
// //                 <p>
// //                   <strong>{{ customer()?.fullName || '—' }}</strong
// //                   ><br />{{ customer()?.city }}<br />{{ customer()?.phone }}
// //                 </p>
// //               </div>
// //               <div class="invoice-box">
// //                 <h4>Delivery Details</h4>
// //                 <p>
// //                   Driver: {{ bill.driverName || '—' }}<br />Contact:
// //                   {{ bill.driverPhone || '—' }}
// //                 </p>
// //               </div>
// //             </div>

// //             <table>
// //               <thead>
// //                 <tr>
// //                   <th>#</th>
// //                   <th>Person</th>
// //                   <th>Product</th>
// //                   <th>Type</th>
// //                   <th class="right">Packets</th>
// //                   <th class="right">Unit Price</th>
// //                   <th class="right">Total</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 <tr *ngFor="let item of flattenedItems; let idx = index">
// //                   <td class="num">{{ idx + 1 }}</td>
// //                   <td style="font-weight: 600; color: var(--ink);">
// //                     {{ item.showPerson ? item.personName : '' }}
// //                   </td>
// //                   <td>{{ item.productName }}</td>
// //                   <td>{{ item.type }}</td>
// //                   <td class="right num">{{ item.packets }}</td>
// //                   <td class="right num">{{ fmtMoney(item.unitPrice) }}</td>
// //                   <td class="right num">{{ fmtMoney(item.total) }}</td>
// //                 </tr>
// //               </tbody>
// //               <tfoot>
// //                 <tr class="total-row">
// //                   <td colspan="2" style="vertical-align: top;">Total</td>
// //                   <td
// //                     colspan="3"
// //                     style="vertical-align: top; padding-left: 10px;"
// //                   >
// //                     <div
// //                       *ngFor="let p of personTotals"
// //                       style="font-size: 11px; font-weight: normal; color: var(--ink-faint);"
// //                     >
// //                       {{ p.name }}: {{ fmtMoney(p.total) }}
// //                     </div>
// //                   </td>
// //                   <td class="right num" style="vertical-align: bottom;">
// //                     {{ totals.packets }}
// //                   </td>
// //                   <td class="right num" style="vertical-align: bottom;">
// //                     {{ fmtMoney(totals.total) }}
// //                   </td>
// //                 </tr>
// //               </tfoot>
// //             </table>

// //             <div style="max-width:320px;margin-left:auto;">
// //               <div class="summary-line">
// //                 <span>Subtotal</span
// //                 ><span class="v">{{ fmtMoney(bill.subtotal) }}</span>
// //               </div>
// //               <div class="summary-line">
// //                 <span>Discount</span
// //                 ><span class="v">- {{ fmtMoney(bill.discount) }}</span>
// //               </div>
// //               <div class="summary-line" *ngIf="bill.deliveryCharges > 0">
// //                 <span>Delivery Charges</span
// //                 ><span class="v">{{ fmtMoney(bill.deliveryCharges) }}</span>
// //               </div>
// //               <div class="summary-line" *ngIf="bill.rentCharges > 0">
// //                 <span>Rent Charges</span
// //                 ><span class="v">{{ fmtMoney(bill.rentCharges) }}</span>
// //               </div>
// //               <div class="summary-line" *ngIf="bill.extraCharges > 0">
// //                 <span>Extra Charges</span
// //                 ><span class="v">{{ fmtMoney(bill.extraCharges) }}</span>
// //               </div>
// //               <div class="summary-line" *ngIf="bill.previousArrears > 0">
// //                 <span>Previous Arrears</span
// //                 ><span class="v">{{ fmtMoney(bill.previousArrears) }}</span>
// //               </div>
// //               <div class="summary-line" *ngIf="bill.advanceUsed > 0">
// //                 <span>Advance Used</span
// //                 ><span class="v">- {{ fmtMoney(bill.advanceUsed) }}</span>
// //               </div>
// //               <div class="summary-line total">
// //                 <span>Grand Total</span
// //                 ><span class="v">{{ fmtMoney(bill.grandTotal) }}</span>
// //               </div>
// //               <div class="summary-line">
// //                 <span>Received Amount</span
// //                 ><span class="v">{{ fmtMoney(bill.receivedAmount) }}</span>
// //               </div>
// //               <div class="summary-line">
// //                 <span>Remaining Balance</span>
// //                 <span
// //                   class="v"
// //                   [style.color]="
// //                     bill.remainingBalance > 0 ? 'var(--rust)' : 'var(--green)'
// //                   "
// //                   >{{ fmtMoney(bill.remainingBalance) }}</span
// //                 >
// //               </div>
// //             </div>

// //             <p
// //               style="margin-top:14px;font-size:12.5px;"
// //               class="muted"
// //               *ngIf="bill.remarks"
// //             >
// //               Remarks: {{ bill.remarks }}
// //             </p>

// //             <div class="tear"></div>
// //             <div class="sign-row">
// //               <div>Received By</div>
// //               <div>Authorized Signature</div>
// //             </div>
// //           </div>

// //           <div
// //             *ngIf="savedImages.length"
// //             style="margin-top:14px;font-size:12.5px;"
// //             class="muted"
// //           >
// //             Previously saved images:
// //             <span *ngFor="let img of savedImages; let last = last">
// //               <span
// //                 class="link-btn"
// //                 style="cursor:pointer"
// //                 (click)="redownload(img)"
// //                 >{{ img.fileName }}</span
// //               >{{ last ? '' : ', ' }}
// //             </span>
// //           </div>
// //         </div>
// //         <div class="modal-foot">
// //           <button class="btn btn-outline" (click)="close.emit()">Close</button>
// //           <button class="btn btn-outline" (click)="exportCsv()">
// //             <i class="fa-solid fa-file-csv"></i>&nbsp;Export CSV
// //           </button>
// //           <button
// //             class="btn btn-outline"
// //             [disabled]="downloadingImage"
// //             (click)="downloadImage()"
// //           >
// //             <i class="fa-solid fa-image" *ngIf="!downloadingImage"></i>
// //             {{ downloadingImage ? 'Preparing Image…' : ' Download as Image' }}
// //           </button>
// //           <button class="btn btn-primary" (click)="print()">
// //             <i class="fa-solid fa-print"></i>&nbsp;Print / Save as PDF
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   `,
// // })
// // export class InvoicePreviewComponent implements OnChanges {
// //   @Input() bill: Bill | null = null;
// //   @Output() close = new EventEmitter<void>();

// //   fmtDate = fmtDate;
// //   fmtMoney = fmtMoney;

// //   flattenedItems: any[] = [];
// //   personTotals: { name: string; total: number }[] = [];
// //   totals = { packets: 0, total: 0 };
// //   downloadingImage = false;
// //   savedImages: InvoiceImage[] = [];

// //   constructor(
// //     private invoiceImageService: InvoiceImageService,
// //     private toast: ToastService,
// //   ) {}

// //   ngOnChanges(changes: SimpleChanges): void {
// //     if (changes['bill'] && this.bill) {
// //       this.buildSectionsAndFlattenItems();
// //       this.savedImages = [];
// //       this.invoiceImageService.listForBill(this.bill._id).subscribe({
// //         next: (res) => (this.savedImages = res.data),
// //         error: () => {},
// //       });
// //     }
// //   }

// //   // Ye method 'groups' (person names) ko 'items' ke sath map karta hai
// //   private buildSectionsAndFlattenItems() {
// //     if (!this.bill) return;

// //     this.flattenedItems = [];
// //     this.personTotals = [];
// //     this.totals = { packets: 0, total: 0 };

// //     // Person Names ki mapping banayein
// //     const groupsMap = new Map<string, string>();
// //     (this.bill.groups || []).forEach((g) => {
// //       groupsMap.set(g.groupId, g.personName);
// //     });

// //     const personTotalsMap = new Map<string, number>();

// //     // Same row order as the Bill Summary: lines without a person first, then
// //     // each person's lines together, in the order the names were added.
// //     const rank = new Map<string, number>();
// //     (this.bill.groups || []).forEach((g, i) => rank.set(g.groupId, i + 1));
// //     const ordered = (this.bill.items || [])
// //       .map((item, idx) => ({ item, idx }))
// //       .sort(
// //         (a, b) =>
// //           (rank.get(a.item.groupId || '') || 0) -
// //             (rank.get(b.item.groupId || '') || 0) || a.idx - b.idx,
// //       )
// //       .map((x) => x.item);

// //     let prevPerson = '';
// //     // Items ko flatten karein aur person name attach karein
// //     ordered.forEach((item) => {
// //       const pName = item.groupId ? groupsMap.get(item.groupId) || '' : '';

// //       this.flattenedItems.push({
// //         ...item,
// //         personName: pName, // Har item ke sath uska person name (CSV ke liye)
// //         // Name sirf us person ki pehli line par dikhta hai.
// //         showPerson: !!pName && pName !== prevPerson,
// //       });
// //       prevPerson = pName;

// //       this.totals.packets += Number(item.packets) || 0;
// //       this.totals.total += Number(item.total) || 0;

// //       if (pName) {
// //         const currentTotal = personTotalsMap.get(pName) || 0;
// //         personTotalsMap.set(pName, currentTotal + (Number(item.total) || 0));
// //       }
// //     });

// //     this.personTotals = Array.from(personTotalsMap.entries()).map(
// //       ([name, total]) => ({
// //         name,
// //         total,
// //       }),
// //     );
// //   }

// //   customer(): Customer | null {
// //     if (!this.bill) return null;
// //     return typeof this.bill.customerId === 'string'
// //       ? null
// //       : (this.bill.customerId as Customer);
// //   }

// //   closeOnBackdrop(e: MouseEvent): void {
// //     if ((e.target as HTMLElement).classList.contains('modal-backdrop'))
// //       this.close.emit();
// //   }

// //   print(): void {
// //     const content = document.getElementById('invoiceContent');
// //     const printArea = document.getElementById('printArea');
// //     if (content && printArea) {
// //       printArea.innerHTML = content.outerHTML;
// //       window.print();
// //     }
// //   }

// //   exportCsv(): void {
// //     if (!this.bill) return;
// //     const rows: string[][] = [
// //       ['#', 'Bill', 'Person', 'Product', 'Packets', 'Unit Price', 'Total'],
// //     ];
// //     let n = 0;
// //     for (const item of this.flattenedItems) {
// //       n += 1;
// //       rows.push([
// //         String(n),
// //         this.bill.displayId,
// //         item.personName,
// //         item.productName,
// //         String(item.packets),
// //         String(item.unitPrice),
// //         String(item.total),
// //       ]);
// //     }
// //     const csv = rows
// //       .map((r) =>
// //         r
// //           .map((cell) =>
// //             /[",\n]/.test(cell) ? '"' + cell.replace(/"/g, '""') + '"' : cell,
// //           )
// //           .join(','),
// //       )
// //       .join('\n');
// //     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = `${this.bill.displayId}.csv`;
// //     document.body.appendChild(a);
// //     a.click();
// //     a.remove();
// //     URL.revokeObjectURL(url);
// //   }

// //   private buildImageFileName(): string {
// //     if (!this.bill) return 'invoice.png';
// //     const customerName = sanitizeFileNamePart(this.customer()?.fullName);
// //     const bilti = sanitizeFileNamePart(this.bill.biltiNumber || 'NoBilti');
// //     const date =
// //       (this.bill.date || '').slice(0, 10) ||
// //       new Date().toISOString().slice(0, 10);
// //     return `${customerName}_${bilti}_${date}.png`;
// //   }

// //   private triggerDownload(url: string, fileName: string): void {
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = fileName;
// //     document.body.appendChild(a);
// //     a.click();
// //     a.remove();
// //   }

// //   downloadImage(): void {
// //     if (!this.bill || this.downloadingImage) return;

// //     this.downloadingImage = true;
// //     const fileName = this.buildImageFileName();
// //     const billId = this.bill._id;

// //     // 🔥 SAB SE BADA FIX: 500ms ka delay (setTimeout)
// //     // Ye delay html2canvas ko waqt deta hai ke wo DOM ko properly render kar le
// //     // aur Person Name wali row blank na aaye.
// //     setTimeout(() => {
// //       const content = document.getElementById('invoiceContent');
// //       if (!content) {
// //         this.downloadingImage = false;
// //         this.toast.error('Could not find the invoice content to capture.');
// //         return;
// //       }

// //       html2canvas(content, {
// //         backgroundColor: '#ffffff',
// //         scale: 2,
// //         useCORS: true,
// //         logging: false,
// //       })
// //         .then((canvas) => {
// //           if (!canvas || !canvas.width || !canvas.height)
// //             throw new Error('The captured invoice image came out empty.');
// //           let dataUrl: string;
// //           try {
// //             dataUrl = canvas.toDataURL('image/png');
// //           } catch {
// //             throw new Error('The invoice image could not be encoded.');
// //           }

// //           this.triggerDownload(dataUrl, fileName);
// //           this.invoiceImageService.save(billId, fileName, dataUrl).subscribe({
// //             next: (res) => {
// //               this.downloadingImage = false;
// //               this.savedImages = [res.data, ...this.savedImages];
// //               this.toast.success('Invoice image downloaded and saved.');
// //             },
// //             error: (err) => {
// //               this.downloadingImage = false;
// //               this.toast.error(
// //                 err?.error?.message ||
// //                   'Image downloaded, but saving it to the server failed.',
// //               );
// //             },
// //           });
// //         })
// //         .catch((err: Error) => {
// //           this.downloadingImage = false;
// //           this.toast.error(
// //             err?.message || 'Could not generate the invoice image.',
// //           );
// //         });
// //     }, 500);
// //   }

// //   redownload(img: InvoiceImage): void {
// //     if (!img?.url) {
// //       this.toast.error('This saved image has no file associated with it.');
// //       return;
// //     }
// //     const url = this.invoiceImageService.toAbsoluteUrl(img.url);
// //     fetch(url)
// //       .then((r) => {
// //         if (!r.ok) throw new Error('not ok');
// //         return r.blob();
// //       })
// //       .then((blob) => {
// //         const objectUrl = URL.createObjectURL(blob);
// //         this.triggerDownload(objectUrl, img.fileName);
// //         setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
// //       })
// //       .catch(() => {
// //         this.toast.error(
// //           'Could not download this saved image. It may no longer be available.',
// //         );
// //       });
// //   }
// // }

// import {
//   Component,
//   EventEmitter,
//   Input,
//   OnChanges,
//   Output,
//   SimpleChanges,
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import html2canvas from 'html2canvas';
// import { Bill, Customer, InvoiceImage } from '../../models';
// import {
//   fmtDate,
//   fmtMoney,
//   sanitizeFileNamePart,
// } from '../../shared/format.util';
// import { InvoiceImageService } from '../../services/invoice-image.service';
// import { ToastService } from '../../services/toast.service';

// @Component({
//   selector: 'app-invoice-preview',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <div class="modal-backdrop" *ngIf="bill" (click)="closeOnBackdrop($event)">
//       <div class="modal wide">
//         <div class="modal-head">
//           <h3>Invoice — {{ bill.displayId }}</h3>
//           <button class="modal-close" (click)="close.emit()">
//             <i class="fa-solid fa-xmark"></i>
//           </button>
//         </div>
//         <div class="modal-body" style="background:var(--paper-2);">
//           <div class="invoice" id="invoiceContent">
//             <div
//               class="stamp paid"
//               data-html2canvas-ignore
//               *ngIf="bill.remainingBalance <= 0"
//             >
//               PAID
//             </div>
//             <div
//               class="stamp"
//               data-html2canvas-ignore
//               *ngIf="bill.remainingBalance > 0 && bill.receivedAmount > 0"
//             >
//               PARTIAL
//             </div>
//             <div
//               class="stamp"
//               data-html2canvas-ignore
//               *ngIf="bill.remainingBalance > 0 && bill.receivedAmount <= 0"
//             >
//               DUE
//             </div>

//             <div class="invoice-head">
//               <div class="invoice-brand">
//                 <div class="mark">STS</div>
//                 <div>
//                   <h2>Tanveer Factory</h2>
//                   <p>Factory Billing &amp; Customer Ledger</p>
//                 </div>
//               </div>
//               <div class="invoice-meta">
//                 <div class="big">{{ bill.displayId }}</div>
//                 <div>Date: {{ fmtDate(bill.date) }}</div>
//                 <div>Bilti #: {{ bill.biltiNumber || '—' }}</div>
//               </div>
//             </div>

//             <div class="invoice-grid">
//               <div class="invoice-box">
//                 <h4>Bill To</h4>
//                 <p>
//                   <strong>{{ customer()?.fullName || '—' }}</strong
//                   ><br />{{ customer()?.city }}<br />{{ customer()?.phone }}
//                 </p>
//               </div>
//               <div class="invoice-box">
//                 <h4>Delivery Details</h4>
//                 <p>
//                   Driver: {{ bill.driverName || '—' }}<br />Contact:
//                   {{ bill.driverPhone || '—' }}
//                 </p>
//               </div>
//             </div>

//             <table>
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Product</th>
//                   <th>Type</th>
//                   <th class="right">Packets</th>
//                   <th class="right">Unit Price</th>
//                   <th class="right">Total</th>
//                   <th *ngIf="hasPersons">Person</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr *ngFor="let item of flattenedItems; let idx = index">
//                   <td class="num">{{ idx + 1 }}</td>
//                   <td>{{ item.productName }}</td>
//                   <td>{{ item.type }}</td>
//                   <td class="right num">{{ item.packets }}</td>
//                   <td class="right num">{{ fmtMoney(item.unitPrice) }}</td>
//                   <td class="right num">{{ fmtMoney(item.total) }}</td>
//                   <td
//                     *ngIf="hasPersons"
//                     style="font-weight: 600; color: var(--ink);"
//                   >
//                     {{ item.showPerson ? item.personName : '' }}
//                   </td>
//                 </tr>
//               </tbody>
//               <tfoot>
//                 <tr class="total-row">
//                   <td
//                     colspan="3"
//                     style="vertical-align: top; padding: 8px 16px;"
//                   >
//                     Total
//                   </td>
//                   <td
//                     class="right num"
//                     style="vertical-align: top; padding: 8px 16px;"
//                   >
//                     {{ totals.packets }}
//                   </td>
//                   <td style="padding: 8px 16px;"></td>
//                   <td
//                     class="right num"
//                     style="vertical-align: top; padding: 8px 16px;"
//                   >
//                     {{ fmtMoney(totals.total) }}
//                   </td>
//                   <td
//                     *ngIf="hasPersons"
//                     style="vertical-align: top; padding: 8px 16px;"
//                   >
//                     <div
//                       *ngFor="let p of personTotals"
//                       style="font-size: 11px; font-weight: normal; color: var(--ink-faint);"
//                     >
//                       {{ p.name }}: {{ fmtMoney(p.total) }}
//                     </div>
//                   </td>
//                 </tr>
//               </tfoot>
//             </table>

//             <div style="max-width:320px;margin-left:auto;">
//               <div class="summary-line">
//                 <span>Subtotal</span
//                 ><span class="v">{{ fmtMoney(bill.subtotal) }}</span>
//               </div>
//               <div class="summary-line">
//                 <span>Discount</span
//                 ><span class="v">- {{ fmtMoney(bill.discount) }}</span>
//               </div>
//               <div class="summary-line" *ngIf="bill.deliveryCharges > 0">
//                 <span>Delivery Charges</span
//                 ><span class="v">{{ fmtMoney(bill.deliveryCharges) }}</span>
//               </div>
//               <div class="summary-line" *ngIf="bill.rentCharges > 0">
//                 <span>Rent Charges</span
//                 ><span class="v">{{ fmtMoney(bill.rentCharges) }}</span>
//               </div>
//               <div class="summary-line" *ngIf="bill.extraCharges > 0">
//                 <span>Extra Charges</span
//                 ><span class="v">{{ fmtMoney(bill.extraCharges) }}</span>
//               </div>
//               <div class="summary-line" *ngIf="bill.previousArrears > 0">
//                 <span>Previous Arrears</span
//                 ><span class="v">{{ fmtMoney(bill.previousArrears) }}</span>
//               </div>
//               <div class="summary-line" *ngIf="bill.advanceUsed > 0">
//                 <span>Advance Used</span
//                 ><span class="v">- {{ fmtMoney(bill.advanceUsed) }}</span>
//               </div>
//               <div class="summary-line total">
//                 <span>Grand Total</span
//                 ><span class="v">{{ fmtMoney(bill.grandTotal) }}</span>
//               </div>
//               <div class="summary-line">
//                 <span>Received Amount</span
//                 ><span class="v">{{ fmtMoney(bill.receivedAmount) }}</span>
//               </div>
//               <div class="summary-line">
//                 <span>Remaining Balance</span>
//                 <span
//                   class="v"
//                   [style.color]="
//                     bill.remainingBalance > 0 ? 'var(--rust)' : 'var(--green)'
//                   "
//                   >{{ fmtMoney(bill.remainingBalance) }}</span
//                 >
//               </div>
//             </div>

//             <p
//               style="margin-top:14px;font-size:12.5px;"
//               class="muted"
//               *ngIf="bill.remarks"
//             >
//               Remarks: {{ bill.remarks }}
//             </p>

//             <div class="tear"></div>
//             <div class="sign-row">
//               <div>Received By</div>
//               <div>Authorized Signature</div>
//             </div>
//           </div>

//           <div
//             *ngIf="savedImages.length"
//             style="margin-top:14px;font-size:12.5px;"
//             class="muted"
//           >
//             Previously saved images:
//             <span *ngFor="let img of savedImages; let last = last">
//               <span
//                 class="link-btn"
//                 style="cursor:pointer"
//                 (click)="redownload(img)"
//                 >{{ img.fileName }}</span
//               >{{ last ? '' : ', ' }}
//             </span>
//           </div>
//         </div>
//         <div class="modal-foot">
//           <button class="btn btn-outline" (click)="close.emit()">Close</button>
//           <button class="btn btn-outline" (click)="exportCsv()">
//             <i class="fa-solid fa-file-csv"></i>&nbsp;Export CSV
//           </button>
//           <button
//             class="btn btn-outline"
//             [disabled]="downloadingImage"
//             (click)="downloadImage()"
//           >
//             <i class="fa-solid fa-image" *ngIf="!downloadingImage"></i>
//             {{ downloadingImage ? 'Preparing Image…' : ' Download as Image' }}
//           </button>
//           <button class="btn btn-primary" (click)="print()">
//             <i class="fa-solid fa-print"></i>&nbsp;Print / Save as PDF
//           </button>
//         </div>
//       </div>
//     </div>
//   `,
// })
// export class InvoicePreviewComponent implements OnChanges {
//   @Input() bill: Bill | null = null;
//   @Output() close = new EventEmitter<void>();

//   fmtDate = fmtDate;
//   fmtMoney = fmtMoney;

//   flattenedItems: any[] = [];
//   personTotals: { name: string; total: number }[] = [];
//   totals = { packets: 0, total: 0 };
//   /** true only when at least one line belongs to a named person (Add Person Name was used). */
//   hasPersons = false;
//   downloadingImage = false;
//   savedImages: InvoiceImage[] = [];

//   constructor(
//     private invoiceImageService: InvoiceImageService,
//     private toast: ToastService,
//   ) {}

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['bill'] && this.bill) {
//       this.buildSectionsAndFlattenItems();
//       this.savedImages = [];
//       this.invoiceImageService.listForBill(this.bill._id).subscribe({
//         next: (res) => (this.savedImages = res.data),
//         error: () => {},
//       });
//     }
//   }

//   // Ye method 'groups' (person names) ko 'items' ke sath map karta hai
//   private buildSectionsAndFlattenItems() {
//     if (!this.bill) return;

//     this.flattenedItems = [];
//     this.personTotals = [];
//     this.hasPersons = false;
//     this.totals = { packets: 0, total: 0 };

//     // Person Names ki mapping banayein
//     const groupsMap = new Map<string, string>();
//     (this.bill.groups || []).forEach((g) => {
//       groupsMap.set(g.groupId, g.personName);
//     });

//     const personTotalsMap = new Map<string, number>();

//     // Same row order as the Bill Summary: lines without a person first, then
//     // each person's lines together, in the order the names were added.
//     const rank = new Map<string, number>();
//     (this.bill.groups || []).forEach((g, i) => rank.set(g.groupId, i + 1));
//     const ordered = (this.bill.items || [])
//       .map((item, idx) => ({ item, idx }))
//       .sort(
//         (a, b) =>
//           (rank.get(a.item.groupId || '') || 0) -
//             (rank.get(b.item.groupId || '') || 0) || a.idx - b.idx,
//       )
//       .map((x) => x.item);

//     let prevPerson = '';
//     // Items ko flatten karein aur person name attach karein
//     ordered.forEach((item) => {
//       const pName = item.groupId ? groupsMap.get(item.groupId) || '' : '';

//       this.flattenedItems.push({
//         ...item,
//         personName: pName, // Har item ke sath uska person name (CSV ke liye)
//         // Name sirf us person ki pehli line par dikhta hai.
//         showPerson: !!pName && pName !== prevPerson,
//       });
//       prevPerson = pName;

//       this.totals.packets += Number(item.packets) || 0;
//       this.totals.total += Number(item.total) || 0;

//       if (pName) {
//         const currentTotal = personTotalsMap.get(pName) || 0;
//         personTotalsMap.set(pName, currentTotal + (Number(item.total) || 0));
//       }
//     });

//     this.hasPersons = this.flattenedItems.some((i) => !!i.personName);
//     this.personTotals = Array.from(personTotalsMap.entries()).map(
//       ([name, total]) => ({
//         name,
//         total,
//       }),
//     );
//   }

//   customer(): Customer | null {
//     if (!this.bill) return null;
//     return typeof this.bill.customerId === 'string'
//       ? null
//       : (this.bill.customerId as Customer);
//   }

//   closeOnBackdrop(e: MouseEvent): void {
//     if ((e.target as HTMLElement).classList.contains('modal-backdrop'))
//       this.close.emit();
//   }

//   print(): void {
//     const content = document.getElementById('invoiceContent');
//     const printArea = document.getElementById('printArea');
//     if (content && printArea) {
//       printArea.innerHTML = content.outerHTML;
//       window.print();
//     }
//   }

//   exportCsv(): void {
//     if (!this.bill) return;
//     const rows: string[][] = [
//       ['#', 'Bill', 'Person', 'Product', 'Packets', 'Unit Price', 'Total'],
//     ];
//     let n = 0;
//     for (const item of this.flattenedItems) {
//       n += 1;
//       rows.push([
//         String(n),
//         this.bill.displayId,
//         item.personName,
//         item.productName,
//         String(item.packets),
//         String(item.unitPrice),
//         String(item.total),
//       ]);
//     }
//     const csv = rows
//       .map((r) =>
//         r
//           .map((cell) =>
//             /[",\n]/.test(cell) ? '"' + cell.replace(/"/g, '""') + '"' : cell,
//           )
//           .join(','),
//       )
//       .join('\n');
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${this.bill.displayId}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     URL.revokeObjectURL(url);
//   }

//   private buildImageFileName(): string {
//     if (!this.bill) return 'invoice.png';
//     const customerName = sanitizeFileNamePart(this.customer()?.fullName);
//     const bilti = sanitizeFileNamePart(this.bill.biltiNumber || 'NoBilti');
//     const date =
//       (this.bill.date || '').slice(0, 10) ||
//       new Date().toISOString().slice(0, 10);
//     return `${customerName}_${bilti}_${date}.png`;
//   }

//   private triggerDownload(url: string, fileName: string): void {
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = fileName;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   }

//   downloadImage(): void {
//     if (!this.bill || this.downloadingImage) return;

//     this.downloadingImage = true;
//     const fileName = this.buildImageFileName();
//     const billId = this.bill._id;

//     // 🔥 SAB SE BADA FIX: 500ms ka delay (setTimeout)
//     // Ye delay html2canvas ko waqt deta hai ke wo DOM ko properly render kar le
//     // aur Person Name wali row blank na aaye.
//     setTimeout(() => {
//       const content = document.getElementById('invoiceContent');
//       if (!content) {
//         this.downloadingImage = false;
//         this.toast.error('Could not find the invoice content to capture.');
//         return;
//       }

//       html2canvas(content, {
//         backgroundColor: '#ffffff',
//         scale: 2,
//         useCORS: true,
//         logging: false,
//       })
//         .then((canvas) => {
//           if (!canvas || !canvas.width || !canvas.height)
//             throw new Error('The captured invoice image came out empty.');
//           let dataUrl: string;
//           try {
//             dataUrl = canvas.toDataURL('image/png');
//           } catch {
//             throw new Error('The invoice image could not be encoded.');
//           }

//           this.triggerDownload(dataUrl, fileName);
//           this.invoiceImageService.save(billId, fileName, dataUrl).subscribe({
//             next: (res) => {
//               this.downloadingImage = false;
//               this.savedImages = [res.data, ...this.savedImages];
//               this.toast.success('Invoice image downloaded and saved.');
//             },
//             error: (err) => {
//               this.downloadingImage = false;
//               this.toast.error(
//                 err?.error?.message ||
//                   'Image downloaded, but saving it to the server failed.',
//               );
//             },
//           });
//         })
//         .catch((err: Error) => {
//           this.downloadingImage = false;
//           this.toast.error(
//             err?.message || 'Could not generate the invoice image.',
//           );
//         });
//     }, 500);
//   }

//   redownload(img: InvoiceImage): void {
//     if (!img?.url) {
//       this.toast.error('This saved image has no file associated with it.');
//       return;
//     }
//     const url = this.invoiceImageService.toAbsoluteUrl(img.url);
//     fetch(url)
//       .then((r) => {
//         if (!r.ok) throw new Error('not ok');
//         return r.blob();
//       })
//       .then((blob) => {
//         const objectUrl = URL.createObjectURL(blob);
//         this.triggerDownload(objectUrl, img.fileName);
//         setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
//       })
//       .catch(() => {
//         this.toast.error(
//           'Could not download this saved image. It may no longer be available.',
//         );
//       });
//   }
// }

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import { Bill, Customer, InvoiceImage } from '../../models';
import {
  fmtDate,
  fmtMoney,
  sanitizeFileNamePart,
} from '../../shared/format.util';
import { InvoiceImageService } from '../../services/invoice-image.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-invoice-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" *ngIf="bill" (click)="closeOnBackdrop($event)">
      <div class="modal wide">
        <div class="modal-head">
          <h3>Invoice — {{ bill.displayId }}</h3>
          <button class="modal-close" (click)="close.emit()">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="modal-body" style="background:var(--paper-2);">
          <div class="invoice" id="invoiceContent">
            <div
              class="stamp paid"
              data-html2canvas-ignore
              *ngIf="bill.remainingBalance <= 0"
            >
              PAID
            </div>
            <div
              class="stamp"
              data-html2canvas-ignore
              *ngIf="bill.remainingBalance > 0 && bill.receivedAmount > 0"
            >
              PARTIAL
            </div>
            <div
              class="stamp"
              data-html2canvas-ignore
              *ngIf="bill.remainingBalance > 0 && bill.receivedAmount <= 0"
            >
              DUE
            </div>

            <div class="invoice-head">
              <div class="invoice-brand">
                <div class="mark">STS</div>
                <div>
                  <h2>Tanveer Factory</h2>
                  <p>Factory Billing &amp; Customer Ledger</p>
                </div>
              </div>
              <div class="invoice-meta">
                <div class="big">{{ bill.displayId }}</div>
                <div>Date: {{ fmtDate(bill.date) }}</div>
                <div>Bilti #: {{ bill.biltiNumber || '—' }}</div>
              </div>
            </div>

            <div class="invoice-grid">
              <div class="invoice-box">
                <h4>Bill To</h4>
                <p>
                  <strong>{{ customer()?.fullName || '—' }}</strong
                  ><br />{{ customer()?.city }}<br />{{ customer()?.phone }}
                </p>
              </div>
              <div class="invoice-box">
                <h4>Delivery Details</h4>
                <p>
                  Driver: {{ bill.driverName || '—' }}<br />Contact:
                  {{ bill.driverPhone || '—' }}
                </p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Type</th>
                  <th class="right">Packets</th>
                  <th class="right">Unit Price</th>
                  <th class="right">Total</th>
                  <th *ngIf="hasPersons">Person</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of flattenedItems; let idx = index">
                  <td class="num">{{ idx + 1 }}</td>
                  <td>{{ item.productName }}</td>
                  <td>{{ item.type }}</td>
                  <td class="right num">{{ item.packets }}</td>
                  <td class="right num">{{ fmtMoney(item.unitPrice) }}</td>
                  <td class="right num">{{ fmtMoney(item.total) }}</td>
                  <td
                    *ngIf="hasPersons"
                    style="font-weight: 600; color: var(--ink);"
                  >
                    {{ item.showPerson ? item.personName : '' }}
                  </td>
                </tr>
              </tbody>
            </table>

            <div style="max-width:320px;margin-left:auto;">
              <div class="summary-line">
                <span>Subtotal</span
                ><span class="v">{{ fmtMoney(bill.subtotal) }}</span>
              </div>
              <div class="summary-line">
                <span>Discount</span
                ><span class="v">- {{ fmtMoney(bill.discount) }}</span>
              </div>
              <div class="summary-line" *ngIf="bill.deliveryCharges > 0">
                <span>Delivery Charges</span
                ><span class="v">{{ fmtMoney(bill.deliveryCharges) }}</span>
              </div>
              <div class="summary-line" *ngIf="bill.rentCharges > 0">
                <span>Rent Charges</span
                ><span class="v">{{ fmtMoney(bill.rentCharges) }}</span>
              </div>
              <div class="summary-line" *ngIf="bill.extraCharges > 0">
                <span>Extra Charges</span
                ><span class="v">{{ fmtMoney(bill.extraCharges) }}</span>
              </div>
              <div class="summary-line" *ngIf="bill.previousArrears > 0">
                <span>Previous Arrears</span
                ><span class="v">{{ fmtMoney(bill.previousArrears) }}</span>
              </div>
              <div class="summary-line" *ngIf="bill.advanceUsed > 0">
                <span>Advance Used</span
                ><span class="v">- {{ fmtMoney(bill.advanceUsed) }}</span>
              </div>
              <div class="summary-line total">
                <span>Grand Total</span
                ><span class="v">{{ fmtMoney(bill.grandTotal) }}</span>
              </div>
              <div class="summary-line">
                <span>Received Amount</span
                ><span class="v">{{ fmtMoney(bill.receivedAmount) }}</span>
              </div>
              <div class="summary-line">
                <span>Remaining Balance</span>
                <span
                  class="v"
                  [style.color]="
                    bill.remainingBalance > 0 ? 'var(--rust)' : 'var(--green)'
                  "
                  >{{ fmtMoney(bill.remainingBalance) }}</span
                >
              </div>
            </div>

            <p
              style="margin-top:14px;font-size:12.5px;"
              class="muted"
              *ngIf="bill.remarks"
            >
              Remarks: {{ bill.remarks }}
            </p>

            <div class="tear"></div>
            <div class="sign-row">
              <div>Received By</div>
              <div>Authorized Signature</div>
            </div>
          </div>

          <div
            *ngIf="savedImages.length"
            style="margin-top:14px;font-size:12.5px;"
            class="muted"
          >
            Previously saved images:
            <span *ngFor="let img of savedImages; let last = last">
              <span
                class="link-btn"
                style="cursor:pointer"
                (click)="redownload(img)"
                >{{ img.fileName }}</span
              >{{ last ? '' : ', ' }}
            </span>
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-outline" (click)="close.emit()">Close</button>
          <button class="btn btn-outline" (click)="exportCsv()">
            <i class="fa-solid fa-file-csv"></i>&nbsp;Export CSV
          </button>
          <button
            class="btn btn-outline"
            [disabled]="downloadingImage"
            (click)="downloadImage()"
          >
            <i class="fa-solid fa-image" *ngIf="!downloadingImage"></i>
            {{ downloadingImage ? 'Preparing Image…' : ' Download as Image' }}
          </button>
          <button class="btn btn-primary" (click)="print()">
            <i class="fa-solid fa-print"></i>&nbsp;Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  `,
})
export class InvoicePreviewComponent implements OnChanges {
  @Input() bill: Bill | null = null;
  @Output() close = new EventEmitter<void>();

  fmtDate = fmtDate;
  fmtMoney = fmtMoney;

  flattenedItems: any[] = [];
  personTotals: { name: string; total: number }[] = [];
  totals = { packets: 0, total: 0 };
  /** true only when at least one line belongs to a named person (Add Person Name was used). */
  hasPersons = false;
  downloadingImage = false;
  savedImages: InvoiceImage[] = [];

  constructor(
    private invoiceImageService: InvoiceImageService,
    private toast: ToastService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bill'] && this.bill) {
      this.buildSectionsAndFlattenItems();
      this.savedImages = [];
      this.invoiceImageService.listForBill(this.bill._id).subscribe({
        next: (res) => (this.savedImages = res.data),
        error: () => {},
      });
    }
  }

  // Ye method 'groups' (person names) ko 'items' ke sath map karta hai
  private buildSectionsAndFlattenItems() {
    if (!this.bill) return;

    this.flattenedItems = [];
    this.personTotals = [];
    this.hasPersons = false;
    this.totals = { packets: 0, total: 0 };

    // Person Names ki mapping banayein
    const groupsMap = new Map<string, string>();
    (this.bill.groups || []).forEach((g) => {
      groupsMap.set(g.groupId, g.personName);
    });

    const personTotalsMap = new Map<string, number>();

    // Same row order as the Bill Summary: lines without a person first, then
    // each person's lines together, in the order the names were added.
    const rank = new Map<string, number>();
    (this.bill.groups || []).forEach((g, i) => rank.set(g.groupId, i + 1));
    const ordered = (this.bill.items || [])
      .map((item, idx) => ({ item, idx }))
      .sort(
        (a, b) =>
          (rank.get(a.item.groupId || '') || 0) -
            (rank.get(b.item.groupId || '') || 0) || a.idx - b.idx,
      )
      .map((x) => x.item);

    let prevPerson = '';
    // Items ko flatten karein aur person name attach karein
    ordered.forEach((item) => {
      const pName = item.groupId ? groupsMap.get(item.groupId) || '' : '';

      this.flattenedItems.push({
        ...item,
        personName: pName, // Har item ke sath uska person name (CSV ke liye)
        // Name sirf us person ki pehli line par dikhta hai.
        showPerson: !!pName && pName !== prevPerson,
      });
      prevPerson = pName;

      this.totals.packets += Number(item.packets) || 0;
      this.totals.total += Number(item.total) || 0;

      if (pName) {
        const currentTotal = personTotalsMap.get(pName) || 0;
        personTotalsMap.set(pName, currentTotal + (Number(item.total) || 0));
      }
    });

    this.hasPersons = this.flattenedItems.some((i) => !!i.personName);
    this.personTotals = Array.from(personTotalsMap.entries()).map(
      ([name, total]) => ({
        name,
        total,
      }),
    );
  }

  customer(): Customer | null {
    if (!this.bill) return null;
    return typeof this.bill.customerId === 'string'
      ? null
      : (this.bill.customerId as Customer);
  }

  closeOnBackdrop(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop'))
      this.close.emit();
  }

  print(): void {
    const content = document.getElementById('invoiceContent');
    const printArea = document.getElementById('printArea');
    if (content && printArea) {
      printArea.innerHTML = content.outerHTML;
      window.print();
    }
  }

  exportCsv(): void {
    if (!this.bill) return;
    const rows: string[][] = [
      ['#', 'Bill', 'Person', 'Product', 'Packets', 'Unit Price', 'Total'],
    ];
    let n = 0;
    for (const item of this.flattenedItems) {
      n += 1;
      rows.push([
        String(n),
        this.bill.displayId,
        item.personName,
        item.productName,
        String(item.packets),
        String(item.unitPrice),
        String(item.total),
      ]);
    }
    const csv = rows
      .map((r) =>
        r
          .map((cell) =>
            /[",\n]/.test(cell) ? '"' + cell.replace(/"/g, '""') + '"' : cell,
          )
          .join(','),
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.bill.displayId}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  private buildImageFileName(): string {
    if (!this.bill) return 'invoice.png';
    const customerName = sanitizeFileNamePart(this.customer()?.fullName);
    const bilti = sanitizeFileNamePart(this.bill.biltiNumber || 'NoBilti');
    const date =
      (this.bill.date || '').slice(0, 10) ||
      new Date().toISOString().slice(0, 10);
    return `${customerName}_${bilti}_${date}.png`;
  }

  private triggerDownload(url: string, fileName: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  downloadImage(): void {
    if (!this.bill || this.downloadingImage) return;

    this.downloadingImage = true;
    const fileName = this.buildImageFileName();
    const billId = this.bill._id;

    // 🔥 SAB SE BADA FIX: 500ms ka delay (setTimeout)
    // Ye delay html2canvas ko waqt deta hai ke wo DOM ko properly render kar le
    // aur Person Name wali row blank na aaye.
    setTimeout(() => {
      const content = document.getElementById('invoiceContent');
      if (!content) {
        this.downloadingImage = false;
        this.toast.error('Could not find the invoice content to capture.');
        return;
      }

      html2canvas(content, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      })
        .then((canvas) => {
          if (!canvas || !canvas.width || !canvas.height)
            throw new Error('The captured invoice image came out empty.');
          let dataUrl: string;
          try {
            dataUrl = canvas.toDataURL('image/png');
          } catch {
            throw new Error('The invoice image could not be encoded.');
          }

          this.triggerDownload(dataUrl, fileName);
          this.invoiceImageService.save(billId, fileName, dataUrl).subscribe({
            next: (res) => {
              this.downloadingImage = false;
              this.savedImages = [res.data, ...this.savedImages];
              this.toast.success('Invoice image downloaded and saved.');
            },
            error: (err) => {
              this.downloadingImage = false;
              this.toast.error(
                err?.error?.message ||
                  'Image downloaded, but saving it to the server failed.',
              );
            },
          });
        })
        .catch((err: Error) => {
          this.downloadingImage = false;
          this.toast.error(
            err?.message || 'Could not generate the invoice image.',
          );
        });
    }, 500);
  }

  redownload(img: InvoiceImage): void {
    if (!img?.url) {
      this.toast.error('This saved image has no file associated with it.');
      return;
    }
    const url = this.invoiceImageService.toAbsoluteUrl(img.url);
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error('not ok');
        return r.blob();
      })
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        this.triggerDownload(objectUrl, img.fileName);
        setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
      })
      .catch(() => {
        this.toast.error(
          'Could not download this saved image. It may no longer be available.',
        );
      });
  }
}
