-- Enable UUID generation id not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE households (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE household_members (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    household_id UUID REFERENCES households(id) ON DELETE  CASCADE,
    role TEXT DEFAULT 'member',
    PRIMARY KEY (user_id, household_id)
);

CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID REFERENCES households(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    description TEXT,
    occurred_at DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    value NUMERIC NOT NULL,
    household_id UUID NOT NULL REFERENCES households(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE debts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    interest_rate NUMERIC,
    minimum_payment NUMERIC,
    due_date DATE,
    household_id UUID NOT NULL REFERENCES households(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    start_date DATE NOT NULL ,
    end_date DATE,
    household_id UUID NOT NULL REFERENCES households(id),
    created_at TIMESTAMPTZ DEFAULT now()
);


