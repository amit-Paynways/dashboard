import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';

export const routes: Routes = [

  // COMPAT: /home/dashboard -> /dashboard
  {
    path: 'home/dashboard',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  // AUTH ROUTES
  {
    path: '',
    component: AuthLayout,
    children: [

      {
        path: '',
        loadComponent: () =>
          import('./features/auth/login/login')
            .then(m => m.LoginComponent)
      },

      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register')
            .then(m => m.Register)
      },

      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/auth/forgot-password/forgot-password')
            .then(m => m.ForgotPassword)
      }

    ]
  },

  // HOME / LANDING (OUTSIDE AUTH)
  {
    path: 'home',
    loadComponent: () =>
      import('./features/auth/home/home')
        .then(m => m.Home)
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  {
    path: 'payments',
    loadComponent: () =>
      import('./features/payments/payments')
        .then(m => m.Payments)
  },

  {
    path: 'bank-dashboard',
    loadComponent: () =>
      import('./features/bank-dashboard/bank-dashboard')
        .then(m => m.BankDashboard),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'operations',
      },
      {
        path: 'operations',
        loadComponent: () =>
          import('./features/bank-dashboard/operations/bank-operations')
            .then(m => m.BankOperationsDashboard),
      },
      {
        path: 'treasury',
        loadComponent: () =>
          import('./features/bank-dashboard/treasury/bank-treasury')
            .then(m => m.BankTreasuryDashboard),
      },
      {
        path: 'compliance',
        loadComponent: () =>
          import('./features/bank-dashboard/compliance/bank-compliance')
            .then(m => m.BankComplianceDashboard),
      },
    ],
  }

];
