-- Sample seed data for H2 (jdbc:h2:mem:dashboarddb)
-- Note: Tables are created by Hibernate (spring.jpa.hibernate.ddl-auto=update).

-- USERS
INSERT INTO app_users (id, initials, name, email, role, status, last_seen_at, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'AS', 'Amit Singh', 'amit.singh@example.com', 'ADMIN', 'ACTIVE', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
  ('22222222-2222-2222-2222-222222222222', 'MR', 'Maria Rodriguez', 'maria.rodriguez@example.com', 'OPS', 'ACTIVE', DATEADD('HOUR', -1, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
  ('33333333-3333-3333-3333-333333333333', 'JM', 'Jorge Medina', 'jorge.medina@example.com', 'COMPLIANCE', 'INVITED', DATEADD('DAY', -1, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- RECIPIENTS
INSERT INTO recipients (id, initials, name, email, country, bank, status, created_at, updated_at) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'EG', 'Exportadora Global SA', 'ap@exportadora.example', 'Mexico', 'BBVA', 'ACTIVE', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'GF', 'Global Finance GmbH', 'finance@globalfinance.example', 'Germany', 'Deutsche Bank', 'PENDING', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'AC', 'Acme Corp UK', 'treasury@acme.example', 'United Kingdom', 'HSBC', 'BLOCKED', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- BANK ACCOUNTS
INSERT INTO bank_accounts (id, name, masked, bank, country, currency, status, created_at, updated_at) VALUES
  ('d0d0d0d0-d0d0-d0d0-d0d0-d0d0d0d0d0d0', 'Operating Account - MXN', '**** 2190', 'BBVA', 'Mexico', 'MXN', 'ACTIVE', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
  ('e0e0e0e0-e0e0-e0e0-e0e0-e0e0e0e0e0e0', 'Settlement Account - USD', '**** 0421', 'Citi', 'United States', 'USD', 'PENDING', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
  ('f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f0f0', 'Reserve Account - EUR', '**** 3880', 'Deutsche Bank', 'Germany', 'EUR', 'DISABLED', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- PAYMENTS
INSERT INTO payments (id, reference, flow, counterparty_name, counterparty_country, currency, amount, status, via, value_at, created_at, updated_at) VALUES
  ('44444444-4444-4444-4444-444444444444', 'REF-8821', 'OUTWARD', 'TechSupply Inc.', 'USA', 'USD', 14250.00, 'AWAITING_FUNDS', 'SWIFT', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
  ('55555555-5555-5555-5555-555555555555', 'REF-8830', 'INWARD', 'Grupo Distribuidora', 'Mexico', 'MXN', 180000.00, 'SETTLED', 'SPEI', DATEADD('DAY', -1, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
  ('66666666-6666-6666-6666-666666666666', 'REF-8815', 'OUTWARD', 'Muller Industrie', 'Germany', 'EUR', 8200.00, 'IN_TRANSIT', 'SWIFT', DATEADD('DAY', -2, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
  ('77777777-7777-7777-7777-777777777777', 'REF-8899', 'OUTWARD', 'Sharma Exports', 'India', 'USD', 6400.00, 'INFO_REQUESTED', 'SWIFT', DATEADD('DAY', -7, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- REPORTS
INSERT INTO reports (id, name, category, period, status, owner, created_at, updated_at) VALUES
  ('88888888-8888-8888-8888-888888888888', 'Payments Summary', 'PAYMENTS', 'This month', 'READY', 'Amit Singh', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
  ('99999999-9999-9999-9999-999999999999', 'OFAC Screening Activity', 'COMPLIANCE', 'Last 7 days', 'READY', 'Jorge Medina', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
  ('12121212-1212-1212-1212-121212121212', 'Liquidity Position Snapshot', 'TREASURY', 'Today', 'GENERATING', 'Maria Rodriguez', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- HISTORY
INSERT INTO history (id, event, subject, category, outcome, actor, occurred_at, created_at, updated_at) VALUES
  ('13131313-1313-1313-1313-131313131313', 'Payment Released', 'REF-8821 - Outward USD 14,250', 'PAYMENTS', 'SUCCESS', 'Amit Singh', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
  ('14141414-1414-1414-1414-141414141414', 'OFAC Review Requested', 'Global Finance GmbH - Potential Match', 'COMPLIANCE', 'WARNING', 'Jorge Medina', DATEADD('DAY', -1, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
  ('15151515-1515-1515-1515-151515151515', 'User Invited', 'maria.rodriguez@example.com', 'USERS', 'SUCCESS', 'Amit Singh', DATEADD('DAY', -2, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
  ('16161616-1616-1616-1616-161616161616', 'Bank Account Disabled', 'Operating Account - MXN (**** 2190)', 'BANK_ACCOUNTS', 'FAILED', 'Amit Singh', DATEADD('DAY', -4, CURRENT_TIMESTAMP()), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

