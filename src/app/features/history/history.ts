import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardApi } from '../../core/api/dashboard-api';
import { formatWhen } from '../../core/api/time';

type HistoryRow = {
  event: string;
  subject: string;
  category: 'Payments' | 'Compliance' | 'Users' | 'Bank Accounts';
  outcome: 'Success' | 'Warning' | 'Failed';
  actor: string;
  at: string;
};

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History {
  private readonly api = inject(DashboardApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly Math = Math;

  readonly query = signal('');
  readonly categoryFilter = signal<'All' | HistoryRow['category']>('All');
  readonly outcomeFilter = signal<'All' | HistoryRow['outcome']>('All');
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly rows = signal<readonly HistoryRow[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.api
      .listHistory()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.rows.set(
            items.map((e) => ({
              event: e.event,
              subject: e.subject,
              category:
                e.category === 'COMPLIANCE'
                  ? 'Compliance'
                  : e.category === 'USERS'
                    ? 'Users'
                    : e.category === 'BANK_ACCOUNTS'
                      ? 'Bank Accounts'
                      : 'Payments',
              outcome: e.outcome === 'SUCCESS' ? 'Success' : e.outcome === 'WARNING' ? 'Warning' : 'Failed',
              actor: e.actor,
              at: formatWhen(e.occurredAt ?? e.updatedAt),
            })),
          );
          this.loading.set(false);
          this.error.set(null);
        },
        error: (er: unknown) => {
          this.loading.set(false);
          this.error.set(er instanceof Error ? er.message : 'Failed to load history');
        },
      });
  }

  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const category = this.categoryFilter();
    const outcome = this.outcomeFilter();

    return this.rows().filter((row) => {
      if (category !== 'All' && row.category !== category) return false;
      if (outcome !== 'All' && row.outcome !== outcome) return false;
      if (!q) return true;
      return (
        row.event.toLowerCase().includes(q) ||
        row.subject.toLowerCase().includes(q) ||
        row.category.toLowerCase().includes(q) ||
        row.actor.toLowerCase().includes(q)
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
