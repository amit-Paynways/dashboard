import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardApi, type ApiUser } from '../../../core/api/dashboard-api';
import { formatWhen } from '../../../core/api/time';

type UserDetail = {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: 'Admin' | 'Ops' | 'Treasury' | 'Compliance';
  status: 'Active' | 'Invited' | 'Suspended';
  lastSeen: string;
  team: string;
  phone: string;
  created: string;
  lastLoginIp: string;
};

function toDetail(u: ApiUser): UserDetail {
  const role =
    u.role === 'ADMIN'
      ? 'Admin'
      : u.role === 'TREASURY'
        ? 'Treasury'
        : u.role === 'COMPLIANCE'
          ? 'Compliance'
          : 'Ops';
  const status = u.status === 'ACTIVE' ? 'Active' : u.status === 'INVITED' ? 'Invited' : 'Suspended';

  const suffix = u.id.replace(/-/g, '').slice(-2);
  return {
    id: u.id,
    initials: u.initials,
    name: u.name,
    email: u.email,
    role,
    status,
    lastSeen: formatWhen(u.lastSeenAt ?? u.updatedAt),
    team: role === 'Admin' ? 'Platform' : role === 'Compliance' ? 'Risk' : role === 'Treasury' ? 'Treasury' : 'Operations',
    phone: '+1 (555) 013-24' + suffix,
    created: 'Feb 1, 2026',
    lastLoginIp: '10.24.18.' + (Number.parseInt(suffix, 16) % 200),
  };
}

@Component({
  selector: 'app-user-template',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-template.html',
  styleUrl: './user-template.css',
})
export class UserTemplate {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly api = inject(DashboardApi);
  private userRequest?: { unsubscribe(): void };

  readonly userId = signal<string>('');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly userDetail = signal<UserDetail | null>(null);

  readonly user = computed<UserDetail | null>(() => this.userDetail());

  readonly activity = computed(() => {
    const u = this.user();
    if (!u) return [];
    return [
      { event: 'Signed in', when: u.lastSeen, tone: 'ok' },
      { event: 'Viewed payments list', when: 'Today, 09:12', tone: 'ok' },
      { event: u.status === 'Suspended' ? 'Account suspended' : 'Role updated', when: 'Feb 10, 11:30', tone: u.status === 'Suspended' ? 'bad' : 'warn' },
      { event: 'Password reset requested', when: 'Feb 8, 14:15', tone: 'warn' },
    ] as const;
  });

  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((map) => {
        const id = map.get('id') ?? '';
        this.userId.set(id);

        if (!id) {
          this.userDetail.set(null);
          this.loading.set(false);
          this.error.set('Missing user id');
          return;
        }

        this.loading.set(true);
        this.error.set(null);
        this.userRequest?.unsubscribe();
        const sub = this.api.getUser(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (u) => {
              this.userDetail.set(toDetail(u));
              this.loading.set(false);
              this.error.set(null);
            },
            error: (e: unknown) => {
              this.userDetail.set(null);
              this.loading.set(false);
              this.error.set(e instanceof Error ? e.message : 'Failed to load user');
            },
          });
        this.userRequest = sub;
      });
  }
}
