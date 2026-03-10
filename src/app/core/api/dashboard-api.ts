import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from './api-base-url';

export type ApiUser = {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'OPS' | 'TREASURY' | 'COMPLIANCE';
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  lastSeenAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiRecipient = {
  id: string;
  initials: string;
  name: string;
  email: string;
  country: string;
  bank: string;
  status: 'ACTIVE' | 'PENDING' | 'BLOCKED';
  createdAt: string;
  updatedAt: string;
};

export type ApiBankAccount = {
  id: string;
  name: string;
  masked: string;
  bank: string;
  country: string;
  currency: string;
  status: 'ACTIVE' | 'PENDING' | 'DISABLED';
  createdAt: string;
  updatedAt: string;
};

export type ApiPayment = {
  id: string;
  reference: string;
  flow: 'OUTWARD' | 'INWARD';
  counterpartyName: string;
  counterpartyCountry?: string | null;
  currency: string;
  amount: number;
  status: 'AWAITING_FUNDS' | 'SETTLED' | 'IN_TRANSIT' | 'INFO_REQUESTED' | 'REJECTED' | 'EXPIRED';
  via?: string | null;
  valueAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiReport = {
  id: string;
  name: string;
  category: 'PAYMENTS' | 'COMPLIANCE' | 'TREASURY' | 'OPERATIONS';
  period: string;
  status: 'READY' | 'GENERATING' | 'FAILED';
  owner: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiHistoryEvent = {
  id: string;
  event: string;
  subject: string;
  category: 'PAYMENTS' | 'COMPLIANCE' | 'USERS' | 'BANK_ACCOUNTS';
  outcome: 'SUCCESS' | 'WARNING' | 'FAILED';
  actor: string;
  occurredAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  listUsers(q?: string) {
    return this.http.get<ApiUser[]>(`${this.baseUrl}/api/users`, {
      params: q ? new HttpParams().set('q', q) : undefined,
    });
  }
  getUser(id: string) {
    return this.http.get<ApiUser>(`${this.baseUrl}/api/users/${encodeURIComponent(id)}`);
  }

  listRecipients(q?: string) {
    return this.http.get<ApiRecipient[]>(`${this.baseUrl}/api/recipients`, {
      params: q ? new HttpParams().set('q', q) : undefined,
    });
  }

  listBankAccounts(q?: string) {
    return this.http.get<ApiBankAccount[]>(`${this.baseUrl}/api/bank-accounts`, {
      params: q ? new HttpParams().set('q', q) : undefined,
    });
  }

  listPayments(opts?: { q?: string; flow?: 'OUTWARD' | 'INWARD' }) {
    let params = new HttpParams();
    if (opts?.q) params = params.set('q', opts.q);
    if (opts?.flow) params = params.set('flow', opts.flow);
    return this.http.get<ApiPayment[]>(`${this.baseUrl}/api/payments`, {
      params: params.keys().length ? params : undefined,
    });
  }

  listReports(q?: string) {
    return this.http.get<ApiReport[]>(`${this.baseUrl}/api/reports`, {
      params: q ? new HttpParams().set('q', q) : undefined,
    });
  }

  listHistory(q?: string) {
    return this.http.get<ApiHistoryEvent[]>(`${this.baseUrl}/api/history`, {
      params: q ? new HttpParams().set('q', q) : undefined,
    });
  }
}

