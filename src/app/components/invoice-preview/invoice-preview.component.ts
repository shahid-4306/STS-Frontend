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
          <button class="modal-close" (click)="close.emit()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body" style="background:var(--paper-2);">
          <div class="invoice" id="invoiceContent">
            <!--
              data-html2canvas-ignore: html2canvas skips any element carrying this
              attribute, so the Payment Status stamp is excluded from the downloaded
              invoice image only. It still renders normally here on screen and in
              the Print / Save as PDF output — nothing else changes about it.
            -->
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
                  ><br />
                  {{ customer()?.city }}<br />
                  {{ customer()?.phone }}
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
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let i of bill.items; let idx = index">
                  <td class="num">{{ idx + 1 }}</td>
                  <td>{{ i.productName }}</td>
                  <td>{{ i.type }}</td>
                  <td class="right num">{{ i.packets }}</td>
                  <td class="right num">{{ fmtMoney(i.unitPrice) }}</td>
                  <td class="right num">{{ fmtMoney(i.total) }}</td>
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
              <!--
                Delivery / Rent / Extra Charges are now shown as individual rows,
                each hidden completely when its value is missing or 0, instead of
                always rendering one combined row. This keeps the underlying
                calculations (bill.grandTotal etc.) untouched — only the display
                of these three fields is now conditional.
              -->
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
  downloadingImage = false;
  savedImages: InvoiceImage[] = [];

  constructor(
    private invoiceImageService: InvoiceImageService,
    private toast: ToastService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bill']) {
      this.savedImages = [];
      if (this.bill) {
        this.invoiceImageService.listForBill(this.bill._id).subscribe({
          next: (res) => (this.savedImages = res.data),
          error: () => {
            // Non-fatal — the invoice itself still displays fine without its saved-image history.
          },
        });
      }
    }
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
    const rows = [
      ['#', 'Bill', 'Product', 'Packets', 'Unit Price', 'Total'],
      ...this.bill.items.map((i, idx) => [
        String(idx + 1),
        this.bill!.displayId,
        i.productName,
        String(i.packets),
        String(i.unitPrice),
        String(i.total),
      ]),
    ];
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

  /** Builds "CustomerName_BiltiNumber_Date.png", sanitized for use as a file name. */
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

  /**
   * Captures the invoice as a PNG, downloads it locally, and uploads it to
   * the backend so it's saved to disk + the database for later access.
   * Every failure mode is caught and surfaced with a specific toast message
   * rather than failing silently.
   */
  downloadImage(): void {
    if (!this.bill) return;
    if (this.downloadingImage) return; // guards against double-clicks firing duplicate captures/uploads

    const content = document.getElementById('invoiceContent');
    if (!content) {
      this.toast.error('Could not find the invoice content to capture.');
      return;
    }

    this.downloadingImage = true;
    const fileName = this.buildImageFileName();
    const billId = this.bill._id;

    html2canvas(content, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
    })
      .then((canvas) => {
        if (!canvas || !canvas.width || !canvas.height) {
          throw new Error('The captured invoice image came out empty.');
        }

        let dataUrl: string;
        try {
          dataUrl = canvas.toDataURL('image/png');
        } catch {
          throw new Error(
            'The invoice image could not be encoded — this can happen if a resource on the page is blocked by the browser.',
          );
        }
        if (!dataUrl || !dataUrl.startsWith('data:image/png;base64,')) {
          throw new Error('The invoice image was not generated correctly.');
        }

        // Give the user their file immediately, independent of the upload outcome.
        this.triggerDownload(dataUrl, fileName);

        this.invoiceImageService.save(billId, fileName, dataUrl).subscribe({
          next: (res) => {
            this.downloadingImage = false;
            this.savedImages = [res.data, ...this.savedImages];
            this.toast.success('Invoice image downloaded and saved.');
          },
          error: (err) => {
            this.downloadingImage = false;
            const message =
              err?.error?.message ||
              'Image downloaded, but saving it to the server failed.';
            this.toast.error(message);
          },
        });
      })
      .catch((err: Error) => {
        this.downloadingImage = false;
        this.toast.error(
          err?.message || 'Could not generate the invoice image.',
        );
      });
  }

  /** Re-downloads a previously saved invoice image from the server. */
  redownload(img: InvoiceImage): void {
    if (!img?.url) {
      this.toast.error('This saved image has no file associated with it.');
      return;
    }
    this.triggerDownload(
      this.invoiceImageService.toAbsoluteUrl(img.url),
      img.fileName,
    );
  }
}
