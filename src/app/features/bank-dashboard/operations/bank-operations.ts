import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  bankKpis,
  complianceAlerts,
  dispatch,
  expiringOrders,
  kycQueue,
  maxRail,
  maxTopCustomer,
  paymentOrders,
  rails,
  topCustomers,
} from '../bank-dashboard.data';

@Component({
  selector: 'app-bank-operations-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bank-operations.html',
  styleUrl: '../bank-dashboard.shared.css',
})
export class BankOperationsDashboard {
  readonly bankKpis = bankKpis;
  readonly kycQueue = kycQueue;
  readonly paymentOrders = paymentOrders;
  readonly expiringOrders = expiringOrders;
  readonly complianceAlerts = complianceAlerts;
  readonly topCustomers = topCustomers;
  readonly dispatch = dispatch;
  readonly rails = rails;

  readonly maxRail = maxRail;
  readonly maxTopCustomer = maxTopCustomer;
}

