import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';

export const routes: Routes = [

  // ✅ AUTH ROUTES
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

  // ✅ HOME / LANDING (OUTSIDE AUTH)
  {
    path: 'home',
    loadComponent: () =>
      import('./features/auth/home/home')
        .then(m => m.Home)
  }

];
