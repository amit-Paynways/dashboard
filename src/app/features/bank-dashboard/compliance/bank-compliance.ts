import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  activitySummary,
  blockedPayments,
  complianceKpis,
  complianceReviewQueue,
  highRiskCountries,
  investigations,
  maxHighRisk,
  providerStatus,
  screeningActivity,
  screeningTrendPoints,
} from '../bank-dashboard.data';

@Component({
  selector: 'app-bank-compliance-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bank-compliance.html',
  styleUrl: '../bank-dashboard.shared.css',
})
export class BankComplianceDashboard {
  readonly complianceKpis = complianceKpis;
  readonly screeningActivity = screeningActivity;
  readonly complianceReviewQueue = complianceReviewQueue;
  readonly blockedPayments = blockedPayments;
  readonly investigations = investigations;
  readonly highRiskCountries = highRiskCountries;
  readonly providerStatus = providerStatus;
  readonly activitySummary = activitySummary;

  readonly maxHighRisk = maxHighRisk;
  readonly screeningTrendPoints = screeningTrendPoints;
}

