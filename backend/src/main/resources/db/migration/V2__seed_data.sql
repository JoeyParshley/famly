-- ============================
-- Seed Users
-- ============================

INSERT INTO users (id, name, email, created_at)
VALUES
    (gen_random_uuid(), 'Homer Simpson', 'homer@famly.com', now()),
    (gen_random_uuid(), 'Marge Simpson', 'marge@famly.com', now());

-- ============================
-- Seed Household
-- ============================

INSERT INTO households (id, name, created_at)
VALUES (gen_random_uuid(), 'The Simpsons', now());


-- ============================
-- Seed Household Members
-- ============================

INSERT INTO household_members (id, household_id, user_id, created_at)
SELECT gen_random_uuid(), h.id, u.id, now()
FROM households h
         JOIN users u ON u.email = 'homer@famly.com'
WHERE h.name = 'The Simpsons';

INSERT INTO household_members (id, household_id, user_id, created_at)
SELECT gen_random_uuid(), h.id, u.id, now()
FROM households h
         JOIN users u ON u.email = 'marge@famly.com'
WHERE h.name = 'The Simpsons';


-- ============================
-- Seed Accounts
-- ============================

-- Checking
INSERT INTO accounts (id, household_id, name, type, balance, created_at)
SELECT gen_random_uuid(), h.id, 'Checking', 'bank', 2500.00, now()
FROM households h WHERE h.name = 'The Simpsons';

-- Savings
INSERT INTO accounts (id, household_id, name, type, balance, created_at)
SELECT gen_random_uuid(), h.id, 'Savings', 'bank', 7500.00, now()
FROM households h WHERE h.name = 'The Simpsons';

-- American Express
INSERT INTO accounts (id, household_id, name, type, balance, created_at)
SELECT gen_random_uuid(), h.id, 'American Express', 'credit', -450.00, now()
FROM households h WHERE h.name = 'The Simpsons';


-- ============================
-- Seed Transactions
-- ============================

-- Grocery purchase on AMEX
INSERT INTO transactions (id, account_id, description, amount, category, occurred_on, created_at)
SELECT
    gen_random_uuid(),
    a.id,
    'Grocery - Kwik-E-Mart',
    -85.20,
    'groceries',
    now() - interval '3 days',
    now()
FROM accounts a
    JOIN households h ON a.household_id = h.id
WHERE a.name = 'American Express'
  AND h.name = 'The Simpsons';

-- Direct Deposit to Checking
INSERT INTO transactions (id, account_id, description, amount, category, occurred_on, created_at)
SELECT
    gen_random_uuid(),
    a.id,
    'Direct Deposit - Power Plant',
    1800.00,
    'income',
    now() - interval '2 days',
    now()
FROM accounts a
    JOIN households h ON a.household_id = h.id
WHERE a.name = 'Checking'
  AND h.name = 'The Simpsons';

-- Mortgage payment from Checking
INSERT INTO transactions (id, account_id, description, amount, category, occurred_on, created_at)
SELECT
    gen_random_uuid(),
    a.id,
    'Monthly Mortgage Payment',
    -1200.00,
    'mortgage',
    now() - interval '1 month',
    now()
FROM accounts a
    JOIN households h ON a.household_id = h.id
WHERE a.name = 'Checking'
  AND h.name = 'The Simpsons';


-- ============================
-- Seed Assets
-- ============================

INSERT INTO assets (id, household_id, name, value, type, created_at)
SELECT gen_random_uuid(), h.id, 'Simpsons Home', 250000.00, 'real_estate', now()
FROM households h WHERE h.name = 'The Simpsons';


-- ============================
-- Seed Debts
-- ============================

INSERT INTO debts (id, household_id, name, amount, type, created_at)
SELECT gen_random_uuid(), h.id, 'Mortgage', 190000.00, 'real_estate', now()
FROM households h WHERE h.name = 'The Simpsons';


-- ============================
-- Seed Budgets
-- ============================d

INSERT INTO budgets (id, household_id, category, amount, created_at)
SELECT gen_random_uuid(), h.id, 'Groceries', 600.00, now()
FROM households h WHERE h.name = 'The Simpsons';

INSERT INTO budgets (id, household_id, category, amount, created_at)
SELECT gen_random_uuid(), h.id, 'Mortgage', 1200.00, now()
FROM households h WHERE h.name = 'The Simpsons';
