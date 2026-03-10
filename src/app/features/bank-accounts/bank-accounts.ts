import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardApi } from '../../core/api/dashboard-api';
import { formatWhen } from '../../core/api/time';

type AccountRow = {
  name: string;
  bank: string;
  country: string;
  currency: string;
  masked: string;
  status: 'Active' | 'Pending' | 'Disabled';
  updated: string;
};

@Component({
  selector: 'app-bank-accounts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bank-accounts.html',
  styleUrl: './bank-accounts.css',
})
export class BankAccounts {
  private readonly api = inject(DashboardApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly Math = Math;

  readonly query = signal('');
  readonly statusFilter = signal<'All' | AccountRow['status']>('All');
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly rows = signal<readonly AccountRow[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.api
      .listBankAccounts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.rows.set(
            items.map((a) => ({
              name: a.name,
              bank: a.bank,
              country: a.country,
              currency: a.currency,
              masked: a.masked,
              status: a.status === 'ACTIVE' ? 'Active' : a.status === 'PENDING' ? 'Pending' : 'Disabled',
              updated: formatWhen(a.updatedAt),
            })),
          );
          this.loading.set(false);
          this.error.set(null);
        },
        error: (e: unknown) => {
          this.loading.set(false);
          this.error.set(e instanceof Error ? e.message : 'Failed to load bank accounts');
        },
      });
  }

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const status = this.statusFilter();

    return this.rows().filter((row) => {
      if (status !== 'All' && row.status !== status) return false;
      if (!q) return true;
      return (
        row.name.toLowerCase().includes(q) ||
        row.bank.toLowerCase().includes(q) ||
        row.country.toLowerCase().includes(q) ||
        row.currency.toLowerCase().includes(q) ||
        row.masked.toLowerCase().includes(q)
      );
    });
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize())));

  readonly pageRows = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
  }

  prev(): void {
    this.page.set(Math.max(1, this.page() - 1));
  }

  next(): void {
    this.page.set(Math.min(this.totalPages(), this.page() + 1));
  }
}
