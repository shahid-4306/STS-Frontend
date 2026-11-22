// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { DashboardService } from '../../services/dashboard.service';
// import { DashboardSummary } from '../../models';
// import { fmtDate, fmtMoney } from '../../shared/format.util';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <div *ngIf="loading" class="empty-state"><div class="ic"><i class="fa-solid fa-gauge-high"></i></div>Loading dashboard…</div>

//     <ng-container *ngIf="!loading && summary as s">
//       <div class="kpi-grid">
//         <div class="kpi">
//           <div class="lbl">Total Customers</div>
//           <div class="val">{{ s.totalCustomers }}</div>
//           <div class="sub">registered accounts</div>
//         </div>
//         <div class="kpi alt">
//           <div class="lbl">Total Products</div>
//           <div class="val">{{ s.totalProducts }}</div>
//           <div class="sub">active catalogue items</div>
//         </div>
//         <div class="kpi">
//           <div class="lbl">Total Bills</div>
//           <div class="val">{{ s.totalBills }}</div>
//           <div class="sub">invoices generated</div>
//         </div>
//         <div class="kpi good">
//           <div class="lbl">Total Sales</div>
//           <div class="val">{{ fmtMoney(s.totalSales) }}</div>
//           <div class="sub">lifetime grand totals</div>
//         </div>
//         <div class="kpi warn">
//           <div class="lbl">Outstanding Balance</div>
//           <div class="val">{{ fmtMoney(s.totalOutstanding) }}</div>
//           <div class="sub">unpaid across all bills</div>
//         </div>
//         <div class="kpi">
//           <div class="lbl">Today's Sales</div>
//           <div class="val">{{ fmtMoney(s.todaySales) }}</div>
//           <div class="sub">{{ todayLabel }}</div>
//         </div>
//         <div class="kpi alt">
//           <div class="lbl">Monthly Sales</div>
//           <div class="val">{{ fmtMoney(s.monthlySales) }}</div>
//           <div class="sub">{{ monthLabel }}</div>
//         </div>
//       </div>

//       <div class="grid-2">
//         <div class="panel">
//           <div class="panel-head">
//             <h3>Recent Bills</h3>
//             <span class="link-btn" (click)="router.navigate(['/billinghistory'])">View all <i class="fa-solid fa-arrow-right"></i></span>
//           </div>
//           <div class="panel-body">
//             <div class="table-wrap">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Bill #</th>
//                     <th>Customer</th>
//                     <th>Date</th>
//                     <th class="right">Grand Total</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr *ngFor="let b of s.recentBills">
//                     <td class="num">{{ b.displayId }}</td>
//                     <td>{{ customerName(b) }}</td>
//                     <td>{{ fmtDate(b.date) }}</td>
//                     <td class="right num">{{ fmtMoney(b.grandTotal) }}</td>
//                     <td>
//                       <span class="badge badge-paid" *ngIf="b.remainingBalance <= 0">Paid</span>
//                       <span class="badge badge-partial" *ngIf="b.remainingBalance > 0 && b.receivedAmount > 0">Partial</span>
//                       <span class="badge badge-due" *ngIf="b.remainingBalance > 0 && b.receivedAmount <= 0">Due</span>
//                     </td>
//                   </tr>
//                   <tr class="empty-row" *ngIf="!s.recentBills.length">
//                     <td colspan="5">No bills yet — create your first invoice.</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         <div class="panel">
//           <div class="panel-head">
//             <h3>Recent Customers</h3>
//             <span class="link-btn" (click)="router.navigate(['/customers'])">View all <i class="fa-solid fa-arrow-right"></i></span>
//           </div>
//           <div class="panel-body">
//             <div class="table-wrap">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>City</th>
//                     <th>Added</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr *ngFor="let c of s.recentCustomers">
//                     <td>{{ c.fullName }}</td>
//                     <td>{{ c.city }}</td>
//                     <td>{{ fmtDate(c.createdAt) }}</td>
//                   </tr>
//                   <tr class="empty-row" *ngIf="!s.recentCustomers.length">
//                     <td colspan="3">No customers yet.</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </ng-container>
//   `,
// })
// export class DashboardComponent implements OnInit {
//   summary: DashboardSummary | null = null;
//   loading = true;
//   fmtMoney = fmtMoney;
//   fmtDate = fmtDate;
//   todayLabel = new Date().toLocaleDateString('en-GB', { weekday: 'long' });
//   monthLabel = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

//   constructor(private dashboardService: DashboardService, public router: Router) {}

//   ngOnInit(): void {
//     this.dashboardService.getSummary().subscribe({
//       next: (res) => {
//         this.summary = res.data;
//         this.loading = false;
//       },
//       error: () => {
//         this.loading = false;
//       },
//     });
//   }

//   customerName(bill: any): string {
//     return bill.customerId?.fullName || '—';
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import {
  MonthlyRecordService,
  currentMonthKey,
  monthLabel,
} from '../../services/monthly-record.service';
import { DashboardSummary, MonthlyTotals } from '../../models';
import { fmtDate, fmtMoney } from '../../shared/format.util';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loading" class="empty-state">
      <div class="ic"><i class="fa-solid fa-gauge-high"></i></div>
      Loading dashboard…
    </div>

    <ng-container *ngIf="!loading && summary as s">
      <div class="kpi-grid">
        <div class="kpi">
          <div class="lbl">Total Customers</div>
          <div class="val">{{ s.totalCustomers }}</div>
          <div class="sub">registered accounts</div>
        </div>
        <div class="kpi alt">
          <div class="lbl">Total Products</div>
          <div class="val">{{ s.totalProducts }}</div>
          <div class="sub">active catalogue items</div>
        </div>
        <div class="kpi">
          <div class="lbl">Total Bills</div>
          <div class="val">{{ s.totalBills }}</div>
          <div class="sub">invoices generated</div>
        </div>
        <div class="kpi good">
          <div class="lbl">Total Sales</div>
          <div class="val">{{ fmtMoney(s.totalSales) }}</div>
          <div class="sub">lifetime grand totals</div>
        </div>
        <div class="kpi warn">
          <div class="lbl">Outstanding Balance</div>
          <div class="val">{{ fmtMoney(s.totalOutstanding) }}</div>
          <div class="sub">unpaid across all bills</div>
        </div>
        <div class="kpi">
          <div class="lbl">Today's Sales</div>
          <div class="val">{{ fmtMoney(s.todaySales) }}</div>
          <div class="sub">{{ todayLabel }}</div>
        </div>
        <div class="kpi alt">
          <div class="lbl">Monthly Sales</div>
          <div class="val">{{ fmtMoney(s.monthlySales) }}</div>
          <div class="sub">{{ monthLabel }}</div>
        </div>
      </div>

      <div class="panel" *ngIf="monthly">
        <div class="panel-head">
          <h3>Monthly Customer Records — {{ monthlyLabel }}</h3>
          <span class="link-btn" (click)="router.navigate(['/monthly'])"
            >Open <i class="fa-solid fa-arrow-right"></i
          ></span>
        </div>
        <div class="panel-body pad">
          <div
            class="kpi-grid"
            style="margin-bottom:0;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));"
          >
            <div class="kpi">
              <div class="lbl">Customers</div>
              <div class="val">{{ monthly.customers }}</div>
              <div class="sub">records this month</div>
            </div>
            <div class="kpi alt">
              <div class="lbl">Purchases</div>
              <div class="val">{{ fmtMoney(monthly.purchases) }}</div>
              <div class="sub">goods bought</div>
            </div>
            <div class="kpi good">
              <div class="lbl">Payments Received</div>
              <div class="val">{{ fmtMoney(monthly.paymentsReceived) }}</div>
              <div class="sub">sent by customers</div>
            </div>
            <div class="kpi warn">
              <div class="lbl">Remaining Balance</div>
              <div class="val">{{ fmtMoney(monthly.remainingBalance) }}</div>
              <div class="sub">incl. carried forward</div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="panel">
          <div class="panel-head">
            <h3>Recent Bills</h3>
            <span
              class="link-btn"
              (click)="router.navigate(['/billinghistory'])"
              >View all <i class="fa-solid fa-arrow-right"></i
            ></span>
          </div>
          <div class="panel-body">
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Bill #</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th class="right">Grand Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let b of s.recentBills">
                    <td class="num">{{ b.displayId }}</td>
                    <td>{{ customerName(b) }}</td>
                    <td>{{ fmtDate(b.date) }}</td>
                    <td class="right num">{{ fmtMoney(b.grandTotal) }}</td>
                    <td>
                      <span
                        class="badge badge-paid"
                        *ngIf="b.remainingBalance <= 0"
                        >Paid</span
                      >
                      <span
                        class="badge badge-partial"
                        *ngIf="b.remainingBalance > 0 && b.receivedAmount > 0"
                        >Partial</span
                      >
                      <span
                        class="badge badge-due"
                        *ngIf="b.remainingBalance > 0 && b.receivedAmount <= 0"
                        >Due</span
                      >
                    </td>
                  </tr>
                  <tr class="empty-row" *ngIf="!s.recentBills.length">
                    <td colspan="5">
                      No bills yet — create your first invoice.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head">
            <h3>Recent Customers</h3>
            <span class="link-btn" (click)="router.navigate(['/customers'])"
              >View all <i class="fa-solid fa-arrow-right"></i
            ></span>
          </div>
          <div class="panel-body">
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>City</th>
                    <th>Added</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let c of s.recentCustomers">
                    <td>{{ c.fullName }}</td>
                    <td>{{ c.city }}</td>
                    <td>{{ fmtDate(c.createdAt) }}</td>
                  </tr>
                  <tr class="empty-row" *ngIf="!s.recentCustomers.length">
                    <td colspan="3">No customers yet.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ng-container>
  `,
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;
  monthly: MonthlyTotals | null = null;
  loading = true;
  fmtMoney = fmtMoney;
  fmtDate = fmtDate;
  todayLabel = new Date().toLocaleDateString('en-GB', { weekday: 'long' });
  monthLabel = new Date().toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
  monthlyLabel = monthLabel(currentMonthKey());

  constructor(
    private dashboardService: DashboardService,
    private monthlyService: MonthlyRecordService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.monthlyService.list(currentMonthKey()).subscribe({
      next: (res) => (this.monthly = res.data?.totals || null),
      error: () => (this.monthly = null),
    });
    this.dashboardService.getSummary().subscribe({
      next: (res) => {
        this.summary = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  customerName(bill: any): string {
    return bill.customerId?.fullName || '—';
  }
}
