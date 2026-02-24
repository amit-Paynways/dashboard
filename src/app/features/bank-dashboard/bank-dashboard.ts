import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

type BankNav =
  | 'dashboards'
  | 'kyc'
  | 'payment_orders'
  | 'dispatch'
  | 'fx_rates'
  | 'liquidity'
  | 'exposure'
  | 'ofac'
  | 'blocked_list'
  | 'config'
  | 'audit'
  | 'reports';

type BankPage = 'operations' | 'treasury' | 'compliance';

const NAV_TARGET: Record<BankNav, { page: BankPage; fragment?: string }> = {
  dashboards: { page: 'operations' },
  kyc: { page: 'operations', fragment: 'bank-kyc' },
  payment_orders: { page: 'operations', fragment: 'bank-orders' },
  dispatch: { page: 'operations', fragment: 'bank-rails' },
  fx_rates: { page: 'treasury', fragment: 'treasury-fx' },
  liquidity: { page: 'treasury', fragment: 'treasury-liquidity' },
  exposure: { page: 'treasury', fragment: 'treasury-exposure' },
  ofac: { page: 'compliance', fragment: 'comp-screening' },
  blocked_list: { page: 'compliance', fragment: 'comp-blocked' },
  config: { page: 'operations' },
  audit: { page: 'operations' },
  reports: { page: 'operations' },
};

@Component({
  selector: 'app-bank-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bank-dashboard.html',
  styleUrl: './bank-dashboard.shared.css',
  host: { class: 'bank-dashboard-shell' },
})
export class BankDashboard {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly bankNav = signal<BankNav>('dashboards');

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.syncNavFromUrl(this.router.url));

    this.syncNavFromUrl(this.router.url);
  }

  openBank(view: BankNav): void {
    this.bankNav.set(view);
    const target = NAV_TARGET[view];
    this.router.navigate(['/bank-dashboard', target.page], { fragment: target.fragment });
  }

  private syncNavFromUrl(url: string): void {
    const [path, fragment = ''] = url.split('#');

    if (path.includes('/bank-dashboard/treasury')) {
      if (fragment === 'treasury-liquidity') this.bankNav.set('liquidity');
      else if (fragment === 'treasury-exposure') this.bankNav.set('exposure');
      else this.bankNav.set('fx_rates');
      return;
    }

    if (path.includes('/bank-dashboard/compliance')) {
      if (fragment === 'comp-blocked') this.bankNav.set('blocked_list');
      else this.bankNav.set('ofac');
      return;
    }

    if (fragment === 'bank-kyc') this.bankNav.set('kyc');
    else if (fragment === 'bank-orders') this.bankNav.set('payment_orders');
    else if (fragment === 'bank-rails') this.bankNav.set('dispatch');
    else this.bankNav.set('dashboards');
  }
}

