-- FaceUp.AI — Supabase Schema
-- Run this in your Supabase SQL Editor

-- ─── Orders table ─────────────────────────────────────────────────────────────
create table if not exists orders (
  id                    uuid default gen_random_uuid() primary key,
  user_id               uuid references auth.users(id) on delete set null,
  stripe_session_id     text unique,
  stripe_payment_intent text,

  plan                  text not null check (plan in ('essential', 'professional', 'premium')),
  pack_key              text not null default 'corporate-headshots',

  status                text not null default 'pending'
                          check (status in ('pending', 'paid', 'training', 'generating', 'done', 'failed')),

  photo_urls            jsonb not null default '[]',
  wizard_data           jsonb not null default '{}',
  tune_id               text,
  result_images         jsonb not null default '[]',

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ─── Auto-update updated_at ────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- ─── RLS ─────────────────────────────────────────────────────────────────────
alter table orders enable row level security;

-- Users can read their own orders (when user_id is set)
create policy "Users read own orders"
  on orders for select
  using (auth.uid() = user_id);

-- Service role bypasses RLS (used by API routes)
-- No insert/update policies needed for users since we use admin client

-- ─── Storage Buckets ─────────────────────────────────────────────────────────
-- Run these in Supabase Storage or via API:
-- 1. Create bucket "uploads" (public: true, file size limit: 15MB)
-- 2. Create bucket "results" (public: true)

-- ─── Indexes ──────────────────────────────────────────────────────────────────
create index if not exists orders_user_id_idx on orders(user_id);
create index if not exists orders_stripe_session_idx on orders(stripe_session_id);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_tune_id_idx on orders(tune_id);
