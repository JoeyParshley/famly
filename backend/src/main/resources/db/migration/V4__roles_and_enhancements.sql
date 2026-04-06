-- V4: Role-based permissions and enhancements for Famly Budget App

-- Add role to household_members (view, edit, admin)
ALTER TABLE household_members ADD COLUMN role TEXT DEFAULT 'view'
  CHECK (role IN ('view', 'edit', 'admin'));

-- Add fields to debts for payoff calculations
ALTER TABLE debts ADD COLUMN interest_rate NUMERIC DEFAULT 0;
ALTER TABLE debts ADD COLUMN minimum_payment NUMERIC DEFAULT 0;
ALTER TABLE debts ADD COLUMN payment_due_day INTEGER;

-- Add fields to accounts for enhanced tracking
ALTER TABLE accounts ADD COLUMN interest_rate NUMERIC DEFAULT 0;
ALTER TABLE accounts ADD COLUMN institution TEXT;

-- User preferences for theme and alerts
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  balance_alert_threshold NUMERIC DEFAULT 500,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Paydays for purchase impact calculations
CREATE TABLE paydays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES households(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  frequency TEXT CHECK (frequency IN ('weekly', 'biweekly', 'monthly')),
  next_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Demo flag for users
ALTER TABLE users ADD COLUMN is_demo BOOLEAN DEFAULT false;

-- Update existing household_members with admin role for first member
UPDATE household_members
SET role = 'admin'
WHERE id IN (
  SELECT DISTINCT ON (household_id) id
  FROM household_members
  ORDER BY household_id, created_at ASC
);

-- Create index for faster payday lookups
CREATE INDEX idx_paydays_household_id ON paydays(household_id);
CREATE INDEX idx_paydays_next_date ON paydays(next_date);

-- Create index for user preferences lookup
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
