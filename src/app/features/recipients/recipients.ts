import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardApi } from '../../core/api/dashboard-api';
import { formatWhen } from '../../core/api/time';

type RecipientRow = {
  initials: string;
  name: string;
  email: string;
  country: string;
  bank: string;
  status: 'Active' | 'Pending' | 'Blocked';
  updated: string;
};

@Component({
  selector: 'app-recipients',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipients.html',
  styleUrl: './recipients.css',
})
export class Recipients {
  private readonly api = inject(DashboardApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly Math = Math;

  readonly query = signal('');
  readonly statusFilter = signal<'All' | RecipientRow['status']>('All');
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly rows = signal<readonly RecipientRow[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.api
      .listRecipients()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.rows.set(
            items.map((r) => ({
              initials: r.initials,
              name: r.name,
              email: r.email,
              country: r.country,
              bank: r.bank,
              status: r.status === 'ACTIVE' ? 'Active' : r.status === 'PENDING' ? 'Pending' : 'Blocked',
              updated: formatWhen(r.updatedAt),
            })),
          );
          this.loading.set(false);
          this.error.set(null);
        },
        error: (e: unknown) => {
          this.loading.set(false);
          this.error.set(e instanceof Error ? e.message : 'Failed to load recipients');
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
        row.email.toLowerCase().includes(q) ||
        row.country.toLowerCase().includes(q) ||
        row.bank.toLowerCase().includes(q)
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
