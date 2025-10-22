-- extensions (for UUIDs)
create extension if not exists pgcrypto;

-- users
create table if not exists users (
                                     id              uuid primary key default gen_random_uuid(),
    email           text not null unique,
    password_hash   text not null,
    created_at      timestamptz not null default now()
    );

-- accounts
create table if not exists accounts (
                                        id                uuid primary key default gen_random_uuid(),
    user_id           uuid not null references users(id) on delete cascade,
    type              text not null check (type in ('CHECKING','SAVINGS','CREDIT','LOAN','MORTGAGE')),
    name              text not null,
    external_provider text,
    external_account_id text,
    currency          text not null default 'USD',
    created_at        timestamptz not null default now()
    );

-- transactions
create table if not exists transactions (
                                            id          uuid primary key default gen_random_uuid(),
    user_id     uuid not null references users(id) on delete cascade,
    account_id  uuid not null references accounts(id) on delete cascade,
    posted_at   timestamptz not null,
    amount      numeric(14,2) not null,            -- use numeric for money
    merchant    text,
    category    text,
    memo        text,
    raw_json    jsonb,
    created_at  timestamptz not null default now()
    );

-- debts
create table if not exists debts (
                                     id               uuid primary key default gen_random_uuid(),
    user_id          uuid not null references users(id) on delete cascade,
    name             text not null,
    principal        numeric(14,2) not null,
    apr              numeric(7,5) not null check (apr >= 0),  -- e.g. 0.1999 = 19.99%
    minimum_payment  numeric(14,2) not null default 0,
    due_day          int check (due_day between 1 and 28),
    created_at       timestamptz not null default now()
    );

-- budgets
create table if not exists budgets (
                                       id         uuid primary key default gen_random_uuid(),
    user_id    uuid not null references users(id) on delete cascade,
    month      date not null,                    -- first of month, UTC
    category   text not null,
    planned    numeric(14,2) not null default 0,
    notes      text,
    unique (user_id, month, category)
    );

-- budget_rules
create table if not exists budget_rules (
                                            id       uuid primary key default gen_random_uuid(),
    user_id  uuid not null references users(id) on delete cascade,
    matcher  jsonb not null,                     -- rule JSON
    category text not null,
    created_at timestamptz not null default now()
    );

-- helpful indexes
create index if not exists idx_txn_user_posted_at on transactions(user_id, posted_at desc);
create index if not exists idx_txn_user_category  on transactions(user_id, category);
create index if not exists idx_debts_user         on debts(user_id);
create index if not exists idx_accounts_user      on accounts(user_id);
