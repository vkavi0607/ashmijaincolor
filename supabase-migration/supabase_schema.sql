-- ============================================================
-- ashmijaincolor — Supabase (PostgreSQL) Schema
-- Run this in Supabase Dashboard → SQL Editor
-- Migrated from MySQL (database/schema/mysql_schema.sql)
-- ============================================================

-- Enable UUID/crypto helpers (usually already on in Supabase)
create extension if not exists pgcrypto;

-- ============================================================
-- 1. Portfolio
-- ============================================================
create table if not exists portfolio (
  id            bigint generated always as identity primary key,
  title         text not null,
  artist_name   text,
  year          int,
  client        text,
  art_type      text,
  location      text,
  area          text,
  image_url     text,
  category      text,
  description   text,
  is_featured   boolean not null default false,
  is_hidden     boolean not null default false,
  display_order int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_portfolio_display_order on portfolio (display_order);
create index if not exists idx_portfolio_featured_hidden on portfolio (is_featured, is_hidden);

-- ============================================================
-- 2. Artists
-- ============================================================
create table if not exists artists (
  id            bigint generated always as identity primary key,
  name          text not null,
  role          text,
  city          text,
  bio           text,
  quote         text,
  stats         text,
  image_url     text,
  fb_url        text,
  tw_url        text,
  ln_url        text,
  is_available  boolean not null default true,
  display_order int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_artists_display_order on artists (display_order);

-- ============================================================
-- 3. Reviews
-- ============================================================
create table if not exists reviews (
  id              bigint generated always as identity primary key,
  name            text not null,
  company         text,
  location        text,
  avatar_url      text,
  rating          smallint not null default 5 check (rating between 1 and 5),
  review_text     text,
  reply_text      text,
  is_approved     boolean not null default false,
  is_pinned       boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_reviews_approved_pinned on reviews (is_approved, is_pinned);
create index if not exists idx_reviews_created_at on reviews (created_at);

-- ============================================================
-- 4. FAQs
-- ============================================================
create table if not exists faqs (
  id            bigint generated always as identity primary key,
  question      text not null,
  answer        text not null,
  category      text default 'General',
  is_visible    boolean not null default true,
  display_order int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_faqs_display_order on faqs (display_order);

-- ============================================================
-- 5. Site Config (key-value)
-- ============================================================
-- NOTE: columns named `key`/`value` (not config_key/config_value) to match
-- the existing frontend code (admin/js/config-admin.js) exactly, so it needs
-- zero changes.
create table if not exists site_config (
  id            bigint generated always as identity primary key,
  key           text not null unique,
  value         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- 6. Inquiries (contact form)
-- ============================================================
create table if not exists inquiries (
  id          bigint generated always as identity primary key,
  name        text,
  email       text,
  phone       text,
  message     text,
  status      text not null default 'new',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_inquiries_status on inquiries (status);

-- ============================================================
-- 7. Audit Log
-- ============================================================
create table if not exists audit_log (
  id          bigint generated always as identity primary key,
  module      text,
  action      text,
  details     jsonb,
  user_id     text,
  created_at  timestamptz not null default now()
);
create index if not exists idx_audit_log_module on audit_log (module);
create index if not exists idx_audit_log_created_at on audit_log (created_at);

-- NOTE: no separate `users` table needed — Supabase Auth (auth.users)
-- replaces the old JWT + bcrypt custom login system entirely.

-- ============================================================
-- Auto-update `updated_at` on row changes
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_portfolio_updated before update on portfolio
  for each row execute function set_updated_at();
create trigger trg_artists_updated before update on artists
  for each row execute function set_updated_at();
create trigger trg_reviews_updated before update on reviews
  for each row execute function set_updated_at();
create trigger trg_faqs_updated before update on faqs
  for each row execute function set_updated_at();
create trigger trg_site_config_updated before update on site_config
  for each row execute function set_updated_at();
create trigger trg_inquiries_updated before update on inquiries
  for each row execute function set_updated_at();

-- ============================================================
-- Seed default site_config values
-- ============================================================
insert into site_config (key, value) values
  ('hero_tagline', 'Curating Walls,<br><em>Crafting<br>Ambience.</em>'),
  ('hero_sub', 'We transform blank walls into immersive art experiences — connecting brands and spaces with South Asia''s finest mural artists.'),
  ('stat_sqft', '750k+'),
  ('stat_projects', '2,900+'),
  ('stat_cities', '38+'),
  ('contact_phone', '+91 8870120750'),
  ('contact_email', 'ashmijaincolor@gmail.com'),
  ('contact_whatsapp', '918870120750')
on conflict (key) do update set value = excluded.value;

-- ============================================================
-- Row Level Security
-- ============================================================
alter table portfolio    enable row level security;
alter table artists      enable row level security;
alter table reviews      enable row level security;
alter table faqs         enable row level security;
alter table site_config  enable row level security;
alter table inquiries    enable row level security;
alter table audit_log    enable row level security;

-- Public (anon) read access — only non-hidden / visible / approved rows
create policy "public read portfolio" on portfolio
  for select using (is_hidden = false);

create policy "public read artists" on artists
  for select using (true);

create policy "public read approved reviews" on reviews
  for select using (is_approved = true);

create policy "public insert reviews" on reviews
  for insert with check (true);

create policy "public read visible faqs" on faqs
  for select using (is_visible = true);

create policy "public read site_config" on site_config
  for select using (true);

-- Anyone (including anonymous visitors) can submit an inquiry, but not read others'
create policy "public insert inquiries" on inquiries
  for insert with check (true);

-- Authenticated admin (any logged-in Supabase Auth user) — full access.
-- Since this is a single-admin site, "authenticated" = admin here.
-- If you later add non-admin logins, swap these for a role check instead.
create policy "admin full access portfolio" on portfolio
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin full access artists" on artists
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin full access reviews" on reviews
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin full access faqs" on faqs
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin full access site_config" on site_config
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin full access inquiries" on inquiries
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin read audit_log" on audit_log
  for select using (auth.role() = 'authenticated');

create policy "admin insert audit_log" on audit_log
  for insert with check (auth.role() = 'authenticated');

-- ============================================================
-- Storage bucket for portfolio/artist images (run once)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('ashmija-in-color-media', 'ashmija-in-color-media', true)
on conflict (id) do nothing;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'public read media'
      AND n.nspname = 'storage'
      AND c.relname = 'objects'
  ) THEN
    CREATE POLICY "public read media" ON storage.objects
      FOR SELECT USING (bucket_id = 'ashmija-in-color-media');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'admin upload media'
      AND n.nspname = 'storage'
      AND c.relname = 'objects'
  ) THEN
    CREATE POLICY "admin upload media" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'ashmija-in-color-media' AND auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'admin update media'
      AND n.nspname = 'storage'
      AND c.relname = 'objects'
  ) THEN
    CREATE POLICY "admin update media" ON storage.objects
      FOR UPDATE USING (bucket_id = 'ashmija-in-color-media' AND auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'admin delete media'
      AND n.nspname = 'storage'
      AND c.relname = 'objects'
  ) THEN
    CREATE POLICY "admin delete media" ON storage.objects
      FOR DELETE USING (bucket_id = 'ashmija-in-color-media' AND auth.role() = 'authenticated');
  END IF;
END;
$$ LANGUAGE plpgsql;
