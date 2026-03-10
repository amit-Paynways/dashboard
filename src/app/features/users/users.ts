import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardApi } from '../../core/api/dashboard-api';
import { formatWhen } from '../../core/api/time';

type UserRow = {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: 'Admin' | 'Ops' | 'Treasury' | 'Compliance';
  status: 'Active' | 'Invited' | 'Suspended';
  lastSeen: string;
};

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  private readonly api = inject(DashboardApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly Math = Math;

  readonly query = signal('');
  readonly statusFilter = signal<'All' | UserRow['status']>('All');
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly rows = signal<readonly UserRow[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.api
      .listUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.rows.set(
            items.map((u) => ({
              id: u.id,
              initials: u.initials,
              name: u.name,
              email: u.email,
              role:
                u.role === 'ADMIN'
                  ? 'Admin'
                  : u.role === 'TREASURY'
                    ? 'Treasury'
                    : u.role === 'COMPLIANCE'
                      ? 'Compliance'
                      : 'Ops',
              status: u.status === 'ACTIVE' ? 'Active' : u.status === 'INVITED' ? 'Invited' : 'Suspended',
              lastSeen: formatWhen(u.lastSeenAt ?? u.updatedAt),
            })),
          );
          this.loading.set(false);
          this.error.set(null);
        },
        error: (e: unknown) => {
          this.loading.set(false);
          this.error.set(e instanceof Error ? e.message : 'Failed to load users');
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
        row.role.toLowerCase().includes(q)
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
