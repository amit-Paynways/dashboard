import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, delay, of, tap, throwError } from 'rxjs';

export type AuthUser = {
  email: string;
  name: string;
  role: 'Admin' | 'Ops' | 'Treasury' | 'Compliance';
};

type StoredAuthState = {
  token: string;
  user: AuthUser;
};

const STORAGE_KEY = 'auth_state_v1';

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function looksLikeStoredAuthState(value: unknown): value is StoredAuthState {
  if (!value || typeof value !== 'object') return false;
  const v = value as Partial<StoredAuthState>;
  return (
    typeof v.token === 'string' &&
    !!v.user &&
    typeof v.user === 'object' &&
    typeof (v.user as AuthUser).email === 'string' &&
    typeof (v.user as AuthUser).name === 'string'
  );
}

function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? '';
  const cleaned = local.replace(/[._-]+/g, ' ').trim();
  if (!cleaned) return 'User';
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _token = signal<string | null>(null);
  private readonly _user = signal<AuthUser | null>(null);

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token() && !!this._user());

  constructor() {
    if (!this.isBrowser) return;

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed = safeJsonParse(raw);
    if (!looksLikeStoredAuthState(parsed)) return;

    this._token.set(parsed.token);
    this._user.set(parsed.user);
  }

  login(email: string, password: string): Observable<void> {
    if (!email.trim() || !password) return throwError(() => new Error('Email and password are required'));

    const token = `mock.${btoa(email)}.${Date.now()}`;
    const user: AuthUser = { email, name: nameFromEmail(email), role: 'Admin' };

    return of(void 0).pipe(
      delay(700),
      tap(() => {
        this._token.set(token);
        this._user.set(user);
        this.persist();
      }),
    );
  }

  logout(redirectToLogin = true): void {
    this._token.set(null);
    this._user.set(null);
    this.clearPersisted();
    if (redirectToLogin) this.router.navigateByUrl('/');
  }

  bypass(email = 'demo@example.com'): void {
    const token = `bypass.${btoa(email)}.${Date.now()}`;
    const user: AuthUser = { email, name: nameFromEmail(email), role: 'Admin' };
    this._token.set(token);
    this._user.set(user);
    this.persist();
  }

  private persist(): void {
    if (!this.isBrowser) return;
    const token = this._token();
    const user = this._user();
    if (!token || !user) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user } satisfies StoredAuthState));
  }

  private clearPersisted(): void {
    if (!this.isBrowser) return;
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
