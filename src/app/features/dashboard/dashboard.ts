import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PaymentsTable } from '../payments/payments-table/payments-table';

function toSparkPoints(values: readonly number[], width = 72, height = 22, padding = 2): string {
  if (values.length === 0) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1e-6, max - min);
  const step = values.length === 1 ? 0 : (width - padding * 2) / (values.length - 1);
  return values
    .map((value, index) => {
      const x = padding + step * index;
      const y = padding + (1 - (value - min) / range) * (height - padding * 2);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseChartDirective, PaymentsTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  host: {
    '(document:keydown.escape)': 'closePopups()',
  },
})
export class Dashboard implements OnDestroy {
  private readonly router = inject(Router);
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly dashboardMenuOpen = signal(false);
  readonly outwardPopupOpen = signal(false);
  readonly inwardPopupOpen = signal(false);

  private prevBodyOverflow: string | null = null;

  openMainDashboard(): void {
    this.dashboardMenuOpen.set(true);
    this.router.navigateByUrl('/dashboard');
  }

  openOutwardPopup(): void {
    this.outwardPopupOpen.set(true);
    this.inwardPopupOpen.set(false);
    this.lockBodyScroll(true);
  }

  openInwardPopup(): void {
    this.inwardPopupOpen.set(true);
    this.outwardPopupOpen.set(false);
    this.lockBodyScroll(true);
  }

  closePopups(): void {
    if (!this.outwardPopupOpen() && !this.inwardPopupOpen()) return;
    this.outwardPopupOpen.set(false);
    this.inwardPopupOpen.set(false);
    this.lockBodyScroll(false);
  }

  private lockBodyScroll(locked: boolean): void {
    if (!this.isBrowser) return;

    if (locked) {
      if (this.prevBodyOverflow === null) this.prevBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      if (this.prevBodyOverflow !== null) document.body.style.overflow = this.prevBodyOverflow;
      this.prevBodyOverflow = null;
    }
  }

  private readonly rateExpiryAt = Date.now() + 14 * 60 * 60 * 1000 + 32 * 60 * 1000;
  private readonly timer =
    typeof window === 'undefined'
      ? null
      : window.setInterval(() => {
          this._tick++;
        }, 60_000);
  private _tick = 0;

  private formatDuration(ms: number): string {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  get rateExpiresIn(): string {
    return this.formatDuration(this.rateExpiryAt - Date.now());
  }

  ngOnDestroy(): void {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.lockBodyScroll(false);
  }

  readonly kpis = [
    { label: 'Payments this month', value: '24', unit: 'orders', delta: '+8 vs last month', danger: false },
    { label: 'Total outward volume', value: 'MX$ 4.2M', unit: '', delta: '+12% vs last month', danger: false },
    { label: 'Total inward volume', value: 'MX$ 2.8M', unit: '', delta: '+5% vs last month', danger: false },
    { label: 'Pending actions', value: '3', unit: 'items', delta: '2 expiring soon', danger: true },
  ] as const;

  readonly volumeChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
      {
        label: 'Outward (MXN)',
        data: [1.1, 1.8, 2.1, 2.0, 2.4, 2.8],
        backgroundColor: 'rgba(59, 130, 246, 0.75)',
        borderRadius: 10,
      },
      {
        label: 'Inward (MXN)',
        data: [0.8, 1.1, 1.4, 1.6, 1.9, 2.2],
        backgroundColor: 'rgba(65, 203, 133, 0.75)',
        borderRadius: 10,
      },
    ],
  };

  readonly volumeChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: 'rgba(237, 242, 255, 0.65)' } },
      y: {
        grid: { color: 'rgba(237, 242, 255, 0.08)' },
        ticks: { color: 'rgba(237, 242, 255, 0.55)' },
      },
    },
  };

  readonly status = [
    { label: 'Settled', value: 44, color: '#41CB85' },
    { label: 'In Transit', value: 18, color: '#3B82F6' },
    { label: 'Pending', value: 11, color: '#F59E0B' },
    { label: 'Rejected', value: 7, color: '#F43F5E' },
    { label: 'Expired', value: 7, color: '#A78BFA' },
  ] as const;

  readonly statusTotal = this.status.reduce((sum, item) => sum + item.value, 0);

  readonly statusChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: this.status.map((s) => s.label),
    datasets: [
      {
        data: this.status.map((s) => s.value),
        backgroundColor: this.status.map((s) => s.color),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  readonly statusChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  readonly fxRates = [
    { pair: 'USD/MXN', rate: 17.284, delta: '+0.12%', trend: [7, 8, 7.6, 8.4, 8.2, 9.1, 9.4] },
    { pair: 'EUR/MXN', rate: 18.721, delta: '-0.08%', trend: [9.4, 9.1, 9.2, 8.9, 8.7, 8.8, 8.6] },
    { pair: 'GBP/MXN', rate: 21.945, delta: '+0.31%', trend: [6.6, 6.7, 6.9, 6.8, 7.1, 7.4, 7.6] },
    { pair: 'CAD/MXN', rate: 12.663, delta: '+0.01%', trend: [8.2, 8.1, 8.05, 8.1, 8.12, 8.14, 8.16] },
    { pair: 'JPY/MXN', rate: 0.1142, delta: '+0.07%', trend: [3.6, 3.62, 3.58, 3.64, 3.66, 3.65, 3.68] },
  ] as const;

  readonly fxRows = this.fxRates.map((row) => ({
    ...row,
    sparkPoints: toSparkPoints(row.trend),
  }));

  readonly quickActions = [
    { icon: 'up', label: 'New Outward Payment' },
    { icon: 'down', label: 'New Inward Instruction' },
    { icon: 'track', label: 'Track Payment' },
    { icon: 'add', label: 'Add Recipient' },
    { icon: 'report', label: 'View Reports' },
    { icon: 'pending', label: 'Pending Actions' },
  ] as const;

  readonly pending = [
    {
      title: 'Fund Transfer Required - REF-8821',
      detail: 'USD 14,250 -> MXN 245,894. Expiry in 14h 32m.',
      action: 'Transfer Now',
      tone: 'warn',
    },
    {
      title: 'Additional Info Requested - REF-8809',
      detail: 'Bank requested supporting documentation for EUR 8,000 payment.',
      action: 'Respond',
      tone: 'info',
    },
    {
      title: 'Recipient Validation Pending - Acme Corp UK',
      detail: 'OFAC screening in progress for newly added recipient.',
      action: 'Review',
      tone: 'neutral',
    },
  ] as const;

  readonly payments = [
    {
      name: 'TechSupply Inc. - USA',
      ref: 'REF-8821',
      via: 'Via SWIFT',
      direction: 'Outward',
      status: 'Awaiting Funds',
      amount: 'USD 14,250',
      date: 'Today, 09:44',
      icon: 'up',
      tone: 'warn',
    },
    {
      name: 'Grupo Distribuidora - MX',
      ref: 'REF-8830',
      via: 'Via SPEI',
      direction: 'Inward',
      status: 'Settled',
      amount: 'MXN 180,000',
      date: 'Yesterday, 10:42',
      icon: 'down',
      tone: 'ok',
    },
    {
      name: 'Muller Industrie - Germany',
      ref: 'REF-8815',
      via: 'Via SWIFT',
      direction: 'Outward',
      status: 'In Transit',
      amount: 'EUR 8,200',
      date: 'Feb 10, 11:30',
      icon: 'up',
      tone: 'info',
    },
    {
      name: 'Sharma Exports - India',
      ref: 'REF-8809',
      via: 'Via SWIFT',
      direction: 'Outward',
      status: 'Info Requested',
      amount: 'USD 6,400',
      date: 'Feb 8, 14:15',
      icon: 'up',
      tone: 'info',
    },
    {
      name: 'Pacific Rim Ltd. - Japan',
      ref: 'REF-8890',
      via: 'Via SWIFT',
      direction: 'Inward',
      status: 'Settled',
      amount: 'JPY 2,400,000',
      date: 'Feb 8, 09:00',
      icon: 'down',
      tone: 'ok',
    },
    {
      name: 'FrenchTrade SARL - France',
      ref: 'REF-8796',
      via: 'Via Visa Direct',
      direction: 'Outward',
      status: 'Settled',
      amount: 'EUR 3,800',
      date: 'Feb 7, 16:22',
      icon: 'up',
      tone: 'ok',
    },
    {
      name: 'Acme Corp - UK',
      ref: 'REF-8791',
      via: 'Via SWIFT',
      direction: 'Outward',
      status: 'Expired',
      amount: 'GBP 5,100',
      date: 'Feb 5, 10:00',
      icon: 'up',
      tone: 'bad',
    },
    {
      name: 'North Star Ventures - Canada',
      ref: 'REF-8782',
      via: 'Via SWIFT',
      direction: 'Inward',
      status: 'Settled',
      amount: 'CAD 22,000',
      date: 'Feb 3, 15:48',
      icon: 'down',
      tone: 'ok',
    },
  ] as const;

  readonly currencyVolumes = [
    { label: 'USD payments', valueText: 'MXN 2.1M', value: 2.1, color: '#3B82F6' },
    { label: 'EUR payments', valueText: 'MXN 1.4M', value: 1.4, color: '#60A5FA' },
    { label: 'GBP payments', valueText: 'MXN 700K', value: 0.7, color: '#F59E0B' },
    { label: 'Others', valueText: 'MXN 410K', value: 0.41, color: '#41CB85' },
  ] as const;

  readonly maxCurrencyVolume = Math.max(...this.currencyVolumes.map((c) => c.value));
}
