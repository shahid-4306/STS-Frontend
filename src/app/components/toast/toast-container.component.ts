import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="toastRoot">
      <div class="toast" [ngClass]="t.type" *ngFor="let t of toast.toasts()">
        {{ t.text }}
      </div>
    </div>
  `,
})
export class ToastContainerComponent {
  constructor(public toast: ToastService) {}
}
