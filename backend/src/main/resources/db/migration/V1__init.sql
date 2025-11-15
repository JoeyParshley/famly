-- ==========================================
-- V1 INITIAL DATABASE SCHEMA
-- ==========================================

-- Enable the pgcrypto extension for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================
-- USERS
-- ============================
CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       email TEXT UNIQUE NOT NULL,
                       name TEXT NOT NULL,
                       created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================
-- HOUSEHOLDS
-- ============================
CREATE TABLE households (
                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                            name TEXT NOT NULL,
                            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================
-- HOUSEHOLD MEMBERS
-- ============================
CREATE TABLE household_members (
                                   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                   household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
                                   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                   created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prevent duplicate household members
CREATE UNIQUE INDEX household_member_unique
    ON household_members (household_id, user_id);

-- ============================
-- ACCOUNTS
-- ============================
CREATE TABLE accounts (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
                          name TEXT NOT NULL,
                          type TEXT NOT NULL,              -- e.g. bank, credit, investment
                          balance NUMERIC NOT NULL DEFAULT 0,
                          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================
-- TRANSACTIONS
-- ============================
CREATE TABLE transactions (
                              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                              account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                              description TEXT NOT NULL,
                              amount NUMERIC NOT NULL,
                              category TEXT NOT NULL,
                              occurred_on TIMESTAMPTZ NOT NULL,
                              created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================
-- ASSETS
-- ============================
CREATE TABLE assets (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
                        name TEXT NOT NULL,
                        value NUMERIC NOT NULL,
                        type TEXT NOT NULL,
                        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================
-- DEBTS
-- ============================
CREATE TABLE debts (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
                       name TEXT NOT NULL,
                       amount NUMERIC NOT NULL,
                       type TEXT NOT NULL,
                       created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================
-- BUDGETS
-- ============================
CREATE TABLE budgets (
                         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                         household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
                         category TEXT NOT NULL,
                         amount NUMERIC NOT NULL,
                         created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
