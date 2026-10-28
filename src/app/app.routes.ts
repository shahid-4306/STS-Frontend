import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { AppShellComponent } from './components/app-shell/app-shell.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'customers',
        loadComponent: () => import('./pages/customers/customers.component').then((m) => m.CustomersComponent),
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/products/products.component').then((m) => m.ProductsComponent),
      },
      {
        path: 'newbill',
        loadComponent: () => import('./pages/new-bill/new-bill.component').then((m) => m.NewBillComponent),
      },
      {
        path: 'newbill/:id',
        loadComponent: () => import('./pages/new-bill/new-bill.component').then((m) => m.NewBillComponent),
      },
      {
        path: 'advances',
        loadComponent: () => import('./pages/advances/advances.component').then((m) => m.AdvancesComponent),
      },
      {
        path: 'arrears',
        loadComponent: () => import('./pages/arrears/arrears.component').then((m) => m.ArrearsComponent),
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./pages/payment-history/payment-history.component').then((m) => m.PaymentHistoryComponent),
      },
      {
        path: 'billinghistory',
        loadComponent: () =>
          import('./pages/billing-history/billing-history.component').then((m) => m.BillingHistoryComponent),
      },
      {
        path: 'reports',
        loadComponent: () => import('./pages/reports/reports.component').then((m) => m.ReportsComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
