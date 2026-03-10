import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardApi } from '../../core/api/dashboard-api';
import { formatWhen } from '../../core/api/time';

type ReportRow = {
  name: string;
  category: 'Payments' | 'Compliance' | 'Treasury' | 'Operations';
  period: string;
  status: 'Ready' | 'Generating' | 'Failed';
  updated: string;
  owner: string;
};

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports {
  private readonly api = inject(DashboardApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly Math = Math;

  readonly query = signal('');
  readonly categoryFilter = signal<'All' | ReportRow['category']>('All');
  readonly statusFilter = signal<'All' | ReportRow['status']>('All');
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly rows = signal<readonly ReportRow[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.api
      .listReports()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.rows.set(
            items.map((r) => ({
              name: r.name,
              category:
                r.category === 'COMPLIANCE'
                  ? 'Compliance'
                  : r.category === 'TREASURY'
                    ? 'Treasury'
                    : r.category === 'OPERATIONS'
                      ? 'Operations'
                      : 'Payments',
              period: r.period,
              status: r.status === 'READY' ? 'Ready' : r.status === 'GENERATING' ? 'Generating' : 'Failed',
              updated: formatWhen(r.updatedAt),
              owner: r.owner,
            })),
          );
          this.loading.set(false);
          this.error.set(null);
        },
        error: (e: unknown) => {
          this.loading.set(false);
          this.error.set(e instanceof Error ? e.message : 'Failed to load reports');
        },
      });
  }

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const category = this.categoryFilter();
    const status = this.statusFilter();

    return this.rows().filter((row) => {
      if (category !== 'All' && row.category !== category) return false;
      if (status !== 'All' && row.status !== status) return false;
      if (!q) return true;
      return (
        row.name.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q) ||
        row.owner.toLowerCase().includes(q) ||
        row.period.toLowerCase().includes(q)
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
