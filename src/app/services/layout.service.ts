import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Tiny shared UI-state service so the topbar (hamburger button) and sidebar
 * (off-canvas panel) can coordinate on mobile/tablet without being coupled
 * to each other directly.
 */
@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly _sidebarOpen = new BehaviorSubject<boolean>(false);
  readonly sidebarOpen$ = this._sidebarOpen.asObservable();

  toggleSidebar(): void {
    this._sidebarOpen.next(!this._sidebarOpen.value);
  }

  closeSidebar(): void {
    if (this._sidebarOpen.value) this._sidebarOpen.next(false);
  }
}
