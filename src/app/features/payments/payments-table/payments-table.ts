import { CommonModule } from '@angular/common';
import { Component, Input, computed, signal } from '@angular/core';

type CurrencyTab = 'All' | 'USD' | 'AUD' | 'NGN' | 'GBP';
type PaymentStatus = 'Success' | 'Pending' | 'Failed';

type PaymentRow = {
  initials: string;
  name: string;
  email: string;
  dateTime: string;
  country: string;
  amount: string;
  status: PaymentStatus;
  currency: Exclude<CurrencyTab, 'All'>;
  flow: 'outward' | 'inward';
};

const BASE_ROWS: readonly PaymentRow[] = [
  {
    initials: 'TA',
    name: 'Temitope Aiyegbusi',
    email: 'ttaiyegbusi@gmail.com',
    dateTime: 'Apr 12, 2023 | 09:32AM',
    country: 'Nigeria',
    amount: '$40,000',
    status: 'Success',
    currency: 'USD',
    flow: 'outward',
  },
  {
    initials: 'TA',
    name: 'Temitope Aiyegbusi',
    email: 'ttaiyegbusi@gmail.com',
    dateTime: 'Apr 12, 2023 | 09:32AM',
    country: 'United Kingdom',
    amount: '$40,000',
    status: 'Success',
    currency: 'GBP',
    flow: 'outward',
  },
  {
    initials: 'TA',
    name: 'Temitope Aiyegbusi',
    email: 'ttaiyegbusi@gmail.com',
    dateTime: 'Apr 12, 2023 | 09:32AM',
    country: 'Australia',
    amount: '$40,000',
    status: 'Success',
    currency: 'AUD',
    flow: 'inward',
  },
  {
    initials: 'TA',
    name: 'Temitope Aiyegbusi',
    email: 'ttaiyegbusi@gmail.com',
    dateTime: 'Apr 12, 2023 | 09:32AM',
    country: 'Canada',
    amount: '$40,000',
    status: 'Pending',
    currency: 'USD',
    flow: 'inward',
  },
  {
    initials: 'TA',
    name: 'Temitope Aiyegbusi',
    email: 'ttaiyegbusi@gmail.com',
    dateTime: 'Apr 12, 2023 | 09:32AM',
    country: 'Nigeria',
    amount: '$40,000',
    status: 'Failed',
    currency: 'NGN',
    flow: 'outward',
  },
] as const;

function makeMoreRows(): PaymentRow[] {
  const extra: PaymentRow[] = [];
  const base = [...BASE_ROWS];
  for (let i = 0; i < 35; i++) {
    const pick = base[i % base.length]!;
    extra.push({
      ...pick,
      dateTime: pick.dateTime.replace('09:32AM', i % 2 === 0 ? '10:42AM' : '02:15PM'),
      status: (i % 7 === 0 ? 'Failed' : i % 5 === 0 ? 'Pending' : 'Success') as PaymentStatus,
    });
  }
  return extra;
}

@Component({
  selector: 'app-payments-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments-table.html',
  styleUrl: './payments-table.css',
})
export class PaymentsTable {
  readonly Math = Math;

  @Input() set flow(value: 'outward' | 'inward' | 'all') {
    this._flow.set(value);
    this.page.set(1);
  }
  get flow(): 'outward' | 'inward' | 'all' {
    return this._flow();
  }

  @Input() embedded = false;

  private readonly _flow = signal<'outward' | 'inward' | 'all'>('all');

  readonly activeTab = signal<CurrencyTab>('All');
  readonly statusFilter = signal<'All Transactions' | 'Success' | 'Pending' | 'Failed'>('All Transactions');
  readonly query = signal('');

  readonly page = signal(1);
  readonly pageSize = signal(10);

  readonly rows = signal<readonly PaymentRow[]>([...BASE_ROWS, ...makeMoreRows()]);

  readonly filtered = computed(() => {
    const tab = this.activeTab();
    const q = this.query().trim().toLowerCase();
    const status = this.statusFilter();
    const flow = this._flow();

    return this.rows().filter((row) => {
      if (flow !== 'all' && row.flow !== flow) return false;
      if (tab !== 'All' && row.currency !== tab) return false;
      if (status !== 'All Transactions' && row.status !== status) return false;

      if (!q) return true;
      return (
        row.name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.country.toLowerCase().includes(q) ||
        row.amount.toLowerCase().includes(q)
      );
    });
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize())));

  readonly pageRows = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  setTab(tab: CurrencyTab): void {
    this.activeTab.set(tab);
    this.page.set(1);
  }

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

