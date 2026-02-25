import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PaymentsTable } from './payments-table/payments-table';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, RouterModule, PaymentsTable],
  templateUrl: './payments.html',
  styleUrl: './payments.css',
})
export class Payments {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly flow = signal<'outward' | 'inward' | 'all'>('all');

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((map) => {
      const flow = map.get('flow');
      if (flow === 'outward' || flow === 'inward') this.flow.set(flow);
      else this.flow.set('all');
    });
  }
}
