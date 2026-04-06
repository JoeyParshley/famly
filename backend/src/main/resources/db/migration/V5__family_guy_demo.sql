-- V5: Family Guy Demo Data for Famly Budget App

-- Demo Users (passwords are all 'demo123' hashed with bcrypt)
-- Using $2b$10$rqKJq2VqZ7RJ8c6Xz1Y.pu6pE4VlqT2.u8QMW0t2Yr6vKv.fJ2FxW
INSERT INTO users (id, email, name, password_hash, is_demo, created_at) VALUES
  ('d0000001-0000-0000-0000-000000000001', 'peter@famly-demo.com', 'Peter Griffin', '$2b$10$rqKJq2VqZ7RJ8c6Xz1Y.pu6pE4VlqT2.u8QMW0t2Yr6vKv.fJ2FxW', true, now()),
  ('d0000001-0000-0000-0000-000000000002', 'lois@famly-demo.com', 'Lois Griffin', '$2b$10$rqKJq2VqZ7RJ8c6Xz1Y.pu6pE4VlqT2.u8QMW0t2Yr6vKv.fJ2FxW', true, now()),
  ('d0000001-0000-0000-0000-000000000003', 'chris@famly-demo.com', 'Chris Griffin', '$2b$10$rqKJq2VqZ7RJ8c6Xz1Y.pu6pE4VlqT2.u8QMW0t2Yr6vKv.fJ2FxW', true, now()),
  ('d0000001-0000-0000-0000-000000000004', 'meg@famly-demo.com', 'Meg Griffin', '$2b$10$rqKJq2VqZ7RJ8c6Xz1Y.pu6pE4VlqT2.u8QMW0t2Yr6vKv.fJ2FxW', true, now()),
  ('d0000001-0000-0000-0000-000000000005', 'stewie@famly-demo.com', 'Stewie Griffin', '$2b$10$rqKJq2VqZ7RJ8c6Xz1Y.pu6pE4VlqT2.u8QMW0t2Yr6vKv.fJ2FxW', true, now()),
  ('d0000001-0000-0000-0000-000000000006', 'brian@famly-demo.com', 'Brian Griffin', '$2b$10$rqKJq2VqZ7RJ8c6Xz1Y.pu6pE4VlqT2.u8QMW0t2Yr6vKv.fJ2FxW', true, now())
ON CONFLICT (email) DO NOTHING;

-- Demo Household
INSERT INTO households (id, name, created_at) VALUES
  ('d0000002-0000-0000-0000-000000000001', 'The Griffins', now())
ON CONFLICT DO NOTHING;

-- Household Members with Roles
INSERT INTO household_members (id, household_id, user_id, role, created_at) VALUES
  ('d0000003-0000-0000-0000-000000000001', 'd0000002-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'admin', now()),  -- Peter (admin)
  ('d0000003-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000002', 'admin', now()),  -- Lois (admin)
  ('d0000003-0000-0000-0000-000000000003', 'd0000002-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000003', 'edit', now()),   -- Chris (edit)
  ('d0000003-0000-0000-0000-000000000004', 'd0000002-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000004', 'view', now()),   -- Meg (view)
  ('d0000003-0000-0000-0000-000000000005', 'd0000002-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000005', 'view', now()),   -- Stewie (view)
  ('d0000003-0000-0000-0000-000000000006', 'd0000002-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000006', 'edit', now())    -- Brian (edit)
ON CONFLICT DO NOTHING;

-- Demo Accounts
INSERT INTO accounts (id, household_id, name, type, balance, interest_rate, institution, created_at) VALUES
  ('d0000004-0000-0000-0000-000000000001', 'd0000002-0000-0000-0000-000000000001', 'Family Checking', 'checking', 3250.00, 0.01, 'Quahog Bank', now()),
  ('d0000004-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000001', 'Emergency Savings', 'savings', 8500.00, 2.5, 'Quahog Bank', now()),
  ('d0000004-0000-0000-0000-000000000003', 'd0000002-0000-0000-0000-000000000001', 'Kids College Fund', 'savings', 4200.00, 3.0, 'Quahog Credit Union', now()),
  ('d0000004-0000-0000-0000-000000000004', 'd0000002-0000-0000-0000-000000000001', 'Visa Credit Card', 'credit', -1850.00, 19.99, 'Capital One', now()),
  ('d0000004-0000-0000-0000-000000000005', 'd0000002-0000-0000-0000-000000000001', 'Store Credit Card', 'credit', -425.00, 24.99, 'Target', now())
ON CONFLICT DO NOTHING;

-- Demo Debts
INSERT INTO debts (id, household_id, name, type, amount, interest_rate, minimum_payment, payment_due_day, created_at) VALUES
  ('d0000005-0000-0000-0000-000000000001', 'd0000002-0000-0000-0000-000000000001', 'Mortgage - 31 Spooner Street', 'mortgage', 185000.00, 4.5, 1250.00, 1, now()),
  ('d0000005-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000001', 'Car Loan - Station Wagon', 'auto_loan', 12500.00, 6.9, 285.00, 15, now()),
  ('d0000005-0000-0000-0000-000000000003', 'd0000002-0000-0000-0000-000000000001', 'Visa Credit Card', 'credit_card', 1850.00, 19.99, 55.00, 20, now()),
  ('d0000005-0000-0000-0000-000000000004', 'd0000002-0000-0000-0000-000000000001', 'Store Credit Card', 'credit_card', 425.00, 24.99, 25.00, 25, now()),
  ('d0000005-0000-0000-0000-000000000005', 'd0000002-0000-0000-0000-000000000001', 'Medical Bills', 'medical', 2200.00, 0, 100.00, 10, now())
ON CONFLICT DO NOTHING;

-- Demo Assets
INSERT INTO assets (id, household_id, name, type, value, created_at) VALUES
  ('d0000006-0000-0000-0000-000000000001', 'd0000002-0000-0000-0000-000000000001', '31 Spooner Street', 'real_estate', 285000.00, now()),
  ('d0000006-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000001', 'Station Wagon', 'vehicle', 15000.00, now()),
  ('d0000006-0000-0000-0000-000000000003', 'd0000002-0000-0000-0000-000000000001', 'Boat (The S.S. More Powerful Than Superman)', 'vehicle', 8500.00, now())
ON CONFLICT DO NOTHING;

-- Demo Budgets
INSERT INTO budgets (id, household_id, category, amount, period, created_at) VALUES
  ('d0000007-0000-0000-0000-000000000001', 'd0000002-0000-0000-0000-000000000001', 'Groceries', 800.00, 'monthly', now()),
  ('d0000007-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000001', 'Mortgage', 1250.00, 'monthly', now()),
  ('d0000007-0000-0000-0000-000000000003', 'd0000002-0000-0000-0000-000000000001', 'Utilities', 350.00, 'monthly', now()),
  ('d0000007-0000-0000-0000-000000000004', 'd0000002-0000-0000-0000-000000000001', 'Entertainment', 400.00, 'monthly', now()),
  ('d0000007-0000-0000-0000-000000000005', 'd0000002-0000-0000-0000-000000000001', 'Gas', 250.00, 'monthly', now()),
  ('d0000007-0000-0000-0000-000000000006', 'd0000002-0000-0000-0000-000000000001', 'Dining Out', 300.00, 'monthly', now()),
  ('d0000007-0000-0000-0000-000000000007', 'd0000002-0000-0000-0000-000000000001', 'Kids Activities', 200.00, 'monthly', now()),
  ('d0000007-0000-0000-0000-000000000008', 'd0000002-0000-0000-0000-000000000001', 'Pet Expenses', 150.00, 'monthly', now())
ON CONFLICT DO NOTHING;

-- Demo Transactions (past 30 days of activity)
INSERT INTO transactions (id, account_id, amount, category, description, occurred_on, created_at) VALUES
  -- Income
  ('d0000008-0000-0000-0000-000000000001', 'd0000004-0000-0000-0000-000000000001', 2800.00, 'Income', 'Pawtucket Brewery - Bi-weekly Pay', CURRENT_DATE - INTERVAL '14 days', now()),
  ('d0000008-0000-0000-0000-000000000002', 'd0000004-0000-0000-0000-000000000001', 2800.00, 'Income', 'Pawtucket Brewery - Bi-weekly Pay', CURRENT_DATE, now()),
  ('d0000008-0000-0000-0000-000000000003', 'd0000004-0000-0000-0000-000000000001', 850.00, 'Income', 'Lois Piano Lessons', CURRENT_DATE - INTERVAL '7 days', now()),

  -- Groceries
  ('d0000008-0000-0000-0000-000000000004', 'd0000004-0000-0000-0000-000000000001', -185.50, 'Groceries', 'Stop & Shop Weekly', CURRENT_DATE - INTERVAL '3 days', now()),
  ('d0000008-0000-0000-0000-000000000005', 'd0000004-0000-0000-0000-000000000001', -142.30, 'Groceries', 'Stop & Shop Weekly', CURRENT_DATE - INTERVAL '10 days', now()),
  ('d0000008-0000-0000-0000-000000000006', 'd0000004-0000-0000-0000-000000000001', -167.80, 'Groceries', 'Stop & Shop Weekly', CURRENT_DATE - INTERVAL '17 days', now()),
  ('d0000008-0000-0000-0000-000000000007', 'd0000004-0000-0000-0000-000000000001', -198.45, 'Groceries', 'Stop & Shop Weekly', CURRENT_DATE - INTERVAL '24 days', now()),

  -- Bills
  ('d0000008-0000-0000-0000-000000000008', 'd0000004-0000-0000-0000-000000000001', -1250.00, 'Mortgage', 'Monthly Mortgage Payment', CURRENT_DATE - INTERVAL '1 day', now()),
  ('d0000008-0000-0000-0000-000000000009', 'd0000004-0000-0000-0000-000000000001', -125.00, 'Utilities', 'Electric Bill', CURRENT_DATE - INTERVAL '5 days', now()),
  ('d0000008-0000-0000-0000-000000000010', 'd0000004-0000-0000-0000-000000000001', -85.00, 'Utilities', 'Gas Bill', CURRENT_DATE - INTERVAL '5 days', now()),
  ('d0000008-0000-0000-0000-000000000011', 'd0000004-0000-0000-0000-000000000001', -95.00, 'Utilities', 'Internet & Cable', CURRENT_DATE - INTERVAL '8 days', now()),
  ('d0000008-0000-0000-0000-000000000012', 'd0000004-0000-0000-0000-000000000001', -285.00, 'Auto', 'Car Loan Payment', CURRENT_DATE - INTERVAL '15 days', now()),

  -- Entertainment
  ('d0000008-0000-0000-0000-000000000013', 'd0000004-0000-0000-0000-000000000001', -45.00, 'Entertainment', 'The Drunken Clam', CURRENT_DATE - INTERVAL '2 days', now()),
  ('d0000008-0000-0000-0000-000000000014', 'd0000004-0000-0000-0000-000000000001', -38.50, 'Entertainment', 'The Drunken Clam', CURRENT_DATE - INTERVAL '9 days', now()),
  ('d0000008-0000-0000-0000-000000000015', 'd0000004-0000-0000-0000-000000000001', -52.00, 'Entertainment', 'The Drunken Clam', CURRENT_DATE - INTERVAL '16 days', now()),
  ('d0000008-0000-0000-0000-000000000016', 'd0000004-0000-0000-0000-000000000001', -65.00, 'Entertainment', 'Movie Night - Family', CURRENT_DATE - INTERVAL '6 days', now()),

  -- Dining
  ('d0000008-0000-0000-0000-000000000017', 'd0000004-0000-0000-0000-000000000001', -78.50, 'Dining Out', 'Dinner at Applebees', CURRENT_DATE - INTERVAL '4 days', now()),
  ('d0000008-0000-0000-0000-000000000018', 'd0000004-0000-0000-0000-000000000001', -35.00, 'Dining Out', 'Pizza Delivery', CURRENT_DATE - INTERVAL '11 days', now()),

  -- Gas
  ('d0000008-0000-0000-0000-000000000019', 'd0000004-0000-0000-0000-000000000001', -55.00, 'Gas', 'Shell Gas Station', CURRENT_DATE - INTERVAL '2 days', now()),
  ('d0000008-0000-0000-0000-000000000020', 'd0000004-0000-0000-0000-000000000001', -48.50, 'Gas', 'Shell Gas Station', CURRENT_DATE - INTERVAL '12 days', now()),

  -- Credit Card Transactions
  ('d0000008-0000-0000-0000-000000000021', 'd0000004-0000-0000-0000-000000000004', -125.00, 'Shopping', 'Amazon - Various', CURRENT_DATE - INTERVAL '7 days', now()),
  ('d0000008-0000-0000-0000-000000000022', 'd0000004-0000-0000-0000-000000000004', -89.99, 'Shopping', 'Best Buy - Electronics', CURRENT_DATE - INTERVAL '12 days', now()),
  ('d0000008-0000-0000-0000-000000000023', 'd0000004-0000-0000-0000-000000000005', -75.00, 'Shopping', 'Target - Household', CURRENT_DATE - INTERVAL '5 days', now()),

  -- Pet Expenses
  ('d0000008-0000-0000-0000-000000000024', 'd0000004-0000-0000-0000-000000000001', -85.00, 'Pet Expenses', 'Vet Visit - Brian', CURRENT_DATE - INTERVAL '8 days', now()),
  ('d0000008-0000-0000-0000-000000000025', 'd0000004-0000-0000-0000-000000000001', -45.00, 'Pet Expenses', 'Dog Food & Treats', CURRENT_DATE - INTERVAL '15 days', now()),

  -- Kids
  ('d0000008-0000-0000-0000-000000000026', 'd0000004-0000-0000-0000-000000000001', -50.00, 'Kids Activities', 'Chris Football Registration', CURRENT_DATE - INTERVAL '20 days', now()),
  ('d0000008-0000-0000-0000-000000000027', 'd0000004-0000-0000-0000-000000000001', -35.00, 'Kids Activities', 'Meg Art Supplies', CURRENT_DATE - INTERVAL '18 days', now()),

  -- Savings Transfer
  ('d0000008-0000-0000-0000-000000000028', 'd0000004-0000-0000-0000-000000000001', -200.00, 'Transfer', 'Transfer to Emergency Savings', CURRENT_DATE - INTERVAL '1 day', now()),
  ('d0000008-0000-0000-0000-000000000029', 'd0000004-0000-0000-0000-000000000002', 200.00, 'Transfer', 'Transfer from Checking', CURRENT_DATE - INTERVAL '1 day', now()),
  ('d0000008-0000-0000-0000-000000000030', 'd0000004-0000-0000-0000-000000000001', -100.00, 'Transfer', 'Transfer to College Fund', CURRENT_DATE - INTERVAL '1 day', now()),
  ('d0000008-0000-0000-0000-000000000031', 'd0000004-0000-0000-0000-000000000003', 100.00, 'Transfer', 'Transfer from Checking', CURRENT_DATE - INTERVAL '1 day', now())
ON CONFLICT DO NOTHING;

-- Demo Paydays
INSERT INTO paydays (id, household_id, name, amount, frequency, next_date, created_at) VALUES
  ('d0000009-0000-0000-0000-000000000001', 'd0000002-0000-0000-0000-000000000001', 'Peter Paycheck', 2800.00, 'biweekly', CURRENT_DATE + INTERVAL '14 days', now()),
  ('d0000009-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000001', 'Lois Piano Lessons', 850.00, 'monthly', CURRENT_DATE + INTERVAL '21 days', now())
ON CONFLICT DO NOTHING;

-- Demo User Preferences
INSERT INTO user_preferences (id, user_id, theme, balance_alert_threshold, created_at) VALUES
  ('d000000a-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001', 'light', 500.00, now()),
  ('d000000a-0000-0000-0000-000000000002', 'd0000001-0000-0000-0000-000000000002', 'light', 750.00, now()),
  ('d000000a-0000-0000-0000-000000000003', 'd0000001-0000-0000-0000-000000000003', 'dark', 200.00, now()),
  ('d000000a-0000-0000-0000-000000000004', 'd0000001-0000-0000-0000-000000000004', 'dark', 100.00, now()),
  ('d000000a-0000-0000-0000-000000000005', 'd0000001-0000-0000-0000-000000000005', 'dark', 1000000.00, now()),
  ('d000000a-0000-0000-0000-000000000006', 'd0000001-0000-0000-0000-000000000006', 'light', 300.00, now())
ON CONFLICT DO NOTHING;
