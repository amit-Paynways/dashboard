function toSparkPoints(values: readonly number[], width = 72, height = 22, padding = 2): string {
  if (values.length === 0) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1e-6, max - min);
  const step = values.length === 1 ? 0 : (width - padding * 2) / (values.length - 1);
  return values
    .map((value, index) => {
      const x = padding + step * index;
      const y = padding + (1 - (value - min) / range) * (height - padding * 2);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

export const bankKpis = [
  { label: 'KYC pending review', value: '7', unit: 'apps', delta: '+3 since yesterday' },
  { label: 'Payment orders pending', value: '12', unit: 'orders', delta: '2 high value tagged' },
  { label: 'Expiring orders (48h)', value: '2', unit: 'orders', delta: 'Action required' },
  { label: 'Dispatched today', value: '18', unit: 'orders', delta: '+4 vs yesterday' },
] as const;

export const kycQueue = [
  { name: 'Comercial Torres SA de CV', tag: 'New' },
  { name: 'Logistica del Norte SC', tag: "Info Recv'd" },
  { name: 'Productora Azteca SRL', tag: 'OFAC Flag' },
  { name: 'Grupo Cervecero MX', tag: 'Pending' },
  { name: 'Importaciones Futura', tag: 'Ready' },
] as const;

export const paymentOrders = [
  { name: 'TechSupply Inc. - USD 8,500', status: 'OFAC Clear', pill: 'ok' },
  { name: 'Global Finance GmbH - EUR 42,000', status: 'Potential match', pill: 'warn' },
  { name: 'Sharma Exports - USD 6,400', status: 'Clear', pill: 'ok' },
  { name: 'Pacific Trade Ltd - GBP 9,200', status: 'Clear', pill: 'ok' },
  { name: 'Grupo Norte - Inward EUR 14,000', status: 'Clear', pill: 'ok' },
] as const;

export const expiringOrders = [
  { ref: 'REF-8821', amount: 'USD 14,250', expiresIn: '13h 16m' },
  { ref: 'REF-8817', amount: 'EUR 3,800', expiresIn: '3d 42m' },
] as const;

export const topCustomers = [
  { name: 'Exportadora Global SA', valueText: 'MXN 4.2M', value: 4.2 },
  { name: 'Grupo Cervecero MX', valueText: 'MXN 2.8M', value: 2.8 },
  { name: 'LogiNorte SC', valueText: 'MXN 1.9M', value: 1.9 },
  { name: 'Importaciones Futura', valueText: 'MXN 1.1M', value: 1.1 },
  { name: 'Productora Azteca', valueText: 'MXN 880K', value: 0.88 },
] as const;

export const maxTopCustomer = Math.max(...topCustomers.map((c) => c.value));

export const dispatch = [
  { label: 'Dispatched today', value: '18' },
  { label: 'Failed - retry', value: '2' },
  { label: 'This week', value: '94' },
  { label: 'Success rate', value: '99.4%' },
] as const;

export const complianceAlerts = [
  {
    title: 'Potential OFAC match - Global Finance GmbH on order REF-8829 (EUR 42,000)',
    meta: 'Score 82%. Manual review required.',
  },
  {
    title: 'KYC OFAC flag - Productora Azteca SRL',
    meta: 'Beneficial owner "R. Ramirez" partial match on SDN list.',
  },
  {
    title: 'Negative list match - Recipient "Al Rashid Trading" added by Importaciones Futura',
    meta: 'Auto-blocked. Review required.',
  },
] as const;

export const rails = [
  { label: 'SWIFT', valueText: 'MXN 6.4M', value: 6.4, color: '#3B82F6' },
  { label: 'SPEI (Domestic)', valueText: 'MXN 2.8M', value: 2.8, color: '#60A5FA' },
  { label: 'Visa Direct', valueText: 'MXN 1.1M', value: 1.1, color: '#F59E0B' },
  { label: 'Mastercard Send', valueText: 'MXN 770K', value: 0.77, color: '#41CB85' },
] as const;

export const maxRail = Math.max(...rails.map((r) => r.value));

export const treasuryKpis = [
  { label: 'Net MXN position', value: 'MX$ +42.8M', delta: '+3.2M vs yesterday' },
  { label: 'FX feed status', value: 'Live', delta: 'Updated 4 min ago' },
  { label: 'Open settlement today', value: 'MX$ 8.4M', delta: 'Due before 17:00 MX' },
  { label: 'Exposure limit alerts', value: '2', delta: 'USD at 87%, EUR at 72%' },
] as const;

export const liquidityRows = [
  { ccy: 'USD', balance: 'USD 2,840,000', inflow: '+USD 420,000', outflow: '-USD 680,000', net: '-USD 260,000', pct: '87%' },
  { ccy: 'EUR', balance: 'EUR 1,650,000', inflow: '+EUR 180,000', outflow: '-EUR 310,000', net: '-EUR 130,000', pct: '72%' },
  { ccy: 'GBP', balance: 'GBP 880,000', inflow: '+GBP 90,000', outflow: '-GBP 140,000', net: '-GBP 50,000', pct: '44%' },
  { ccy: 'CAD', balance: 'CAD 420,000', inflow: '+CAD 60,000', outflow: '-CAD 45,000', net: '+CAD 15,000', pct: '28%' },
  { ccy: 'JPY', balance: 'JPY 62,000,000', inflow: '+JPY 8,000,000', outflow: '-JPY 12,000,000', net: '-JPY 4,000,000', pct: '31%' },
] as const;

const fxRates = [
  { pair: 'USD/MXN', rate: 17.284, delta: '+0.12%', trend: [7, 8, 7.6, 8.4, 8.2, 9.1, 9.4] },
  { pair: 'EUR/MXN', rate: 18.721, delta: '-0.08%', trend: [9.4, 9.1, 9.2, 8.9, 8.7, 8.8, 8.6] },
  { pair: 'GBP/MXN', rate: 21.945, delta: '+0.31%', trend: [6.6, 6.7, 6.9, 6.8, 7.1, 7.4, 7.6] },
  { pair: 'CAD/MXN', rate: 12.663, delta: '+0.01%', trend: [8.2, 8.1, 8.05, 8.1, 8.12, 8.14, 8.16] },
  { pair: 'JPY/MXN', rate: 0.1142, delta: '+0.07%', trend: [3.6, 3.62, 3.58, 3.64, 3.66, 3.65, 3.68] },
] as const;

export const fxRows = fxRates.map((row) => ({
  ...row,
  sparkPoints: toSparkPoints(row.trend),
}));

export const settlementObligations = [
  { label: 'USD obligations (SWIFT)', detail: '8 orders, avg $420k', valueText: 'USD 3.4M' },
  { label: 'EUR obligations (SWIFT)', detail: '4 orders, avg EUR 1.25M', valueText: 'EUR 5.0M' },
  { label: 'Mon-Fri total obligations', detail: '', valueText: 'MXN 82.4M' },
  { label: 'Covered by inward receipts', detail: '', valueText: 'MXN 68.1M' },
  { label: 'Funding gap (to arrange)', detail: '', valueText: 'MXN 14.3M' },
] as const;

export const exposureLimits = [
  { ccy: 'USD', pct: 87, pill: 'warn', amount: '$2.18M', limit: '$2.5M' },
  { ccy: 'EUR', pct: 72, pill: 'warn', amount: 'EUR 1.44M', limit: 'EUR 2.0M' },
  { ccy: 'GBP', pct: 44, pill: 'ok', amount: 'GBP 440K', limit: 'GBP 1.0M' },
  { ccy: 'CAD', pct: 28, pill: 'ok', amount: 'CAD 280K', limit: 'CAD 1.0M' },
  { ccy: 'JPY', pct: 31, pill: 'ok', amount: 'JPY 620M', limit: 'JPY 2.0B' },
] as const;

export const complianceKpis = [
  { label: 'Open investigations', value: '4', delta: '2 escalated' },
  { label: 'Pending compliance reviews', value: '9', delta: '3 high priority' },
  { label: 'Screened today', value: '142', delta: '+18 vs yesterday' },
  { label: 'Blocked payments - MTD', value: '7', delta: 'MXN 2.1M blocked' },
] as const;

export const screeningActivity = [
  { label: 'Clear', value: '134', tone: 'ok' },
  { label: 'Potential match', value: '5', tone: 'warn' },
  { label: 'Definite match', value: '3', tone: 'bad' },
] as const;

export const complianceReviewQueue = [
  { name: 'Al Rashid Trading LLC', meta: 'Recipient - Negative list', pill: 'bad', action: 'Details' },
  { name: 'Meridian Capital FZCO', meta: 'Recipient - OFAC SDN', pill: 'bad', action: 'Details' },
  { name: 'Global Finance GmbH', meta: 'Payment REF-8829 - Score 82%', pill: 'warn', action: 'Review' },
  { name: 'J. Ramirez Solano', meta: 'KYC - Beneficial owner - Score 74%', pill: 'warn', action: 'Review' },
  { name: 'Eastern Bridge Corp.', meta: 'Recipient - Partial name match', pill: 'warn', action: 'Review' },
] as const;

export const blockedPayments = [
  { title: 'SWIFT - Sanctioned country (IR)', meta: 'REF-8752 - USD 85,000', pill: 'bad', tag: 'Country block' },
  { title: 'OFAC definite match', meta: 'REF-8794 - USD 24,000', pill: 'bad', tag: 'SDN match' },
  { title: 'Negative list - Recipient', meta: 'REF-8801 - EUR 18,200', pill: 'bad', tag: 'Neg. list' },
  { title: 'Al Rashid Trading', meta: 'REF-8832 - GBP 9,200', pill: 'bad', tag: 'Neg. list' },
] as const;

export const investigations = [
  { id: 'INV-2024-041', who: 'Productora Azteca', meta: 'KYC', pill: 'bad', status: 'Escalated' },
  { id: 'INV-2024-039', who: 'Global Finance', meta: 'REF-8829', pill: 'bad', status: 'Escalated' },
  { id: 'INV-2024-036', who: 'Inbound settlement', meta: 'large variance', pill: 'warn', status: 'In Review' },
  { id: 'INV-2024-031', who: 'Eastern Bridge', meta: 'partial name match', pill: 'info', status: 'Open' },
] as const;

export const highRiskCountries = [
  { label: 'Panama', valueText: 'MXN 4.2M', value: 4.2, color: '#F43F5E' },
  { label: 'UAE', valueText: 'MXN 2.8M', value: 2.8, color: '#F59E0B' },
  { label: 'Nigeria', valueText: 'MXN 1.1M', value: 1.1, color: '#3B82F6' },
  { label: 'Turkey', valueText: 'MXN 640K', value: 0.64, color: '#A78BFA' },
] as const;

export const maxHighRisk = Math.max(...highRiskCountries.map((c) => c.value));

const screeningTrend = [8, 9, 9.5, 9.0, 10.2, 10.8, 10.6] as const;
export const screeningTrendPoints = toSparkPoints(screeningTrend, 220, 64, 6);

export const providerStatus = [
  { name: 'OFAC SDN Feed', meta: 'Last sync: 4h ago', state: 'Online', pill: 'ok' },
  { name: 'Negative List', meta: 'Last sync: 12h ago', state: 'Online', pill: 'ok' },
  { name: 'World-Check', meta: 'Last sync: 4h ago', state: 'Degraded', pill: 'warn' },
] as const;

export const activitySummary = [
  { label: 'Entities screened', value: '1,842' },
  { label: 'Clear rate', value: '98.5%' },
  { label: 'Pot. matches', value: '21' },
  { label: 'Payments blocked', value: '7' },
] as const;

