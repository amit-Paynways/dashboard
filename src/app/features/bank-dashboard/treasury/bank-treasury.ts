import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { exposureLimits, fxRows, liquidityRows, settlementObligations, treasuryKpis } from '../bank-dashboard.data';

@Component({
  selector: 'app-bank-treasury-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bank-treasury.html',
  styleUrl: '../bank-dashboard.shared.css',
})
export class BankTreasuryDashboard {
  readonly treasuryKpis = treasuryKpis;
  readonly liquidityRows = liquidityRows;
  readonly fxRows = fxRows;
  readonly settlementObligations = settlementObligations;
  readonly exposureLimits = exposureLimits;
}

