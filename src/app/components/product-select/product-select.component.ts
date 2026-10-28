import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Product } from '../../models';
import { ProductService } from '../../services/product.service';
import { fmtMoney } from '../../shared/format.util';

/**
 * Searchable replacement for the plain <select> used to pick a product on a
 * bill row. Typing filters the customer's products by name, count number,
 * type or pack size. While typing, matches are also requested from the API
 * (debounced) so the list always reflects what is in the database; the
 * already-loaded catalogue is used meanwhile so the list never flickers empty.
 *
 * It emits only the chosen product's id, so the bill row keeps exactly the
 * same data it had with the <select> (price, qty per packet, etc. are still
 * looked up from the product by the parent).
 */
@Component({
  selector: 'app-product-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [
    `
      :host {
        display: block;
        position: relative;
        min-width: 0;
      }
      .ps-input {
        width: 100%;
        min-width: 0;
        padding: 7px 28px 7px 9px;
        border: 1.5px solid var(--line);
        border-radius: var(--radius);
        background: var(--white);
        text-overflow: ellipsis;
      }
      .ps-caret {
        position: absolute;
        right: 9px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        font-size: 10px;
        color: var(--ink-faint, #888);
      }
      .ps-list {
        position: fixed;
        z-index: 1000;
        max-height: 260px;
        overflow-y: auto;
        background: var(--white, #fff);
        border: 1.5px solid var(--line);
        border-radius: var(--radius);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
      }
      .ps-opt {
        padding: 8px 10px;
        cursor: pointer;
        border-bottom: 1px solid var(--line-soft, #eee);
        font-size: 13px;
        line-height: 1.3;
      }
      .ps-opt:last-child {
        border-bottom: none;
      }
      .ps-opt.active,
      .ps-opt:hover {
        background: var(--paper-2, #f4f1ea);
      }
      .ps-opt.selected {
        font-weight: 700;
      }
      .ps-sub {
        font-size: 11.5px;
        color: var(--ink-faint, #777);
        margin-top: 2px;
      }
      .ps-msg {
        padding: 10px;
        font-size: 12.5px;
        color: var(--ink-faint, #777);
      }
    `,
  ],
  template: `
    <input
      #box
      class="ps-input"
      type="text"
      autocomplete="off"
      role="combobox"
      [attr.aria-expanded]="open"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [ngModel]="open ? query : selectedLabel()"
      (ngModelChange)="onType($event)"
      (focus)="openList()"
      (click)="openList()"
      (keydown)="onKey($event)"
    />
    <i class="fa-solid fa-chevron-down ps-caret"></i>

    <div
      *ngIf="open"
      class="ps-list"
      role="listbox"
      [style.top.px]="pos.top"
      [style.left.px]="pos.left"
      [style.width.px]="pos.width"
      (mousedown)="$event.preventDefault()"
    >
      <div class="ps-msg" *ngIf="searching && !results.length">Searching…</div>
      <div class="ps-msg" *ngIf="!searching && !results.length">
        {{ query ? 'No products match “' + query + '”.' : 'No products available.' }}
      </div>
      <div
        class="ps-opt"
        role="option"
        *ngFor="let p of results; let i = index"
        [class.active]="i === activeIndex"
        [class.selected]="p._id === value"
        (mouseenter)="activeIndex = i"
        (click)="choose(p)"
      >
        <div>{{ p.description }} <span *ngIf="p.countNumber">({{ p.countNumber }})</span></div>
        <div class="ps-sub">
          {{ p.type }}<span *ngIf="p.qtyPerPacket"> · {{ p.qtyPerPacket }} / packet</span> · Rate
          {{ fmtMoney(p.rate) }}
        </div>
      </div>
    </div>
  `,
})
export class ProductSelectComponent implements OnChanges, OnDestroy {
  /** The customer's product catalogue (already loaded by the parent). */
  @Input() products: Product[] = [];
  @Input() customerId = '';
  /** Currently selected product id ('' when none). */
  @Input() value = '';
  @Input() disabled = false;
  @Input() placeholder = '— search / select product —';
  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('box') box?: ElementRef<HTMLInputElement>;

  open = false;
  query = '';
  results: Product[] = [];
  activeIndex = 0;
  searching = false;
  pos = { top: 0, left: 0, width: 240 };
  fmtMoney = fmtMoney;

  private debounce: any;
  /** Capture-phase listener: also fires when an inner scroll container (not just the window) scrolls. */
  private scrollHandler = () => {
    if (this.open) this.place();
  };
  private sub?: Subscription;
  /** Guards against an older, slower response overwriting a newer search. */
  private searchSeq = 0;

  constructor(
    private host: ElementRef<HTMLElement>,
    private productService: ProductService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products'] && this.open) {
      this.results = this.filterLocal(this.query);
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollHandler, true);
    clearTimeout(this.debounce);
    this.sub?.unsubscribe();
  }

  selectedLabel(): string {
    const p = this.products.find((x) => x._id === this.value);
    if (!p) return '';
    return p.countNumber ? `${p.description} (${p.countNumber})` : p.description;
  }

  openList(): void {
    if (this.disabled || this.open) return;
    this.open = true;
    this.query = '';
    this.results = this.filterLocal('');
    this.activeIndex = Math.max(
      0,
      this.results.findIndex((p) => p._id === this.value),
    );
    this.place();
    window.addEventListener('scroll', this.scrollHandler, true);
    // Select the box's text so the user can start typing immediately.
    setTimeout(() => this.box?.nativeElement.select());
  }

  onType(text: string): void {
    this.query = text ?? '';
    this.activeIndex = 0;
    // Instant feedback from the loaded catalogue...
    this.results = this.filterLocal(this.query);
    // ...then confirm against the database.
    clearTimeout(this.debounce);
    const q = this.query.trim();
    if (!q || !this.customerId) {
      this.searching = false;
      this.sub?.unsubscribe();
      return;
    }
    this.searching = true;
    this.debounce = setTimeout(() => this.searchServer(q), 250);
  }

  private searchServer(q: string): void {
    const seq = ++this.searchSeq;
    this.sub?.unsubscribe();
    this.sub = this.productService.list(this.customerId, q).subscribe({
      next: (res) => {
        if (seq !== this.searchSeq || !this.open) return;
        this.searching = false;
        const fromServer = Array.isArray(res.data) ? res.data : [];
        // Products the bill still references but that were since removed from
        // the live catalogue only exist locally, so keep any local matches too.
        const ids = new Set(fromServer.map((p) => p._id));
        const localOnly = this.filterLocal(q).filter((p) => !ids.has(p._id));
        this.results = [...fromServer, ...localOnly];
        this.activeIndex = 0;
      },
      error: () => {
        // Search request failed — the locally filtered list stays usable.
        if (seq === this.searchSeq) this.searching = false;
      },
    });
  }

  private filterLocal(q: string): Product[] {
    const terms = q
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    if (!terms.length) return [...this.products];
    return this.products.filter((p) => {
      const hay = [p.description, p.countNumber, p.type, p.qtyPerPacket, String(p.rate)]
        .join(' ')
        .toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }

  choose(p: Product): void {
    this.close();
    if (p._id !== this.value) this.valueChange.emit(p._id);
  }

  close(): void {
    window.removeEventListener('scroll', this.scrollHandler, true);
    this.open = false;
    this.searching = false;
    clearTimeout(this.debounce);
    this.sub?.unsubscribe();
    this.searchSeq++;
  }

  onKey(e: KeyboardEvent): void {
    if (!this.open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      this.openList();
      e.preventDefault();
      return;
    }
    if (!this.open) return;
    if (e.key === 'ArrowDown') {
      this.activeIndex = Math.min(this.activeIndex + 1, this.results.length - 1);
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      this.activeIndex = Math.max(this.activeIndex - 1, 0);
      e.preventDefault();
    } else if (e.key === 'Enter') {
      const p = this.results[this.activeIndex];
      if (p) this.choose(p);
      e.preventDefault();
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      this.close();
    }
  }

  /** Positions the (fixed) list under the input so table scroll containers can't clip it. */
  private place(): void {
    const r = this.host.nativeElement.getBoundingClientRect();
    const width = Math.max(r.width, 260);
    const left = Math.min(r.left, Math.max(8, window.innerWidth - width - 8));
    const below = window.innerHeight - r.bottom;
    const top = below < 200 && r.top > below ? Math.max(8, r.top - 262) : r.bottom + 2;
    this.pos = { top, left, width };
  }

  @HostListener('document:mousedown', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (this.open && !this.host.nativeElement.contains(e.target as Node)) this.close();
  }

  @HostListener('window:resize')
  onViewportChange(): void {
    if (this.open) this.place();
  }
}
