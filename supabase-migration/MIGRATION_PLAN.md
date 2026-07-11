# ashmijaincolor → Supabase Migration Plan

## Status: frontend rewrite complete, awaiting your DB setup

## What's done

1. **`supabase_schema.sql`** — full Postgres schema converted from
   `database/schema/mysql_schema.sql`:
   - All 7 tables (portfolio, artists, reviews, faqs, site_config, inquiries, audit_log)
   - `site_config` uses `key`/`value` columns (not `config_key`/`config_value`) to
     exactly match the existing `admin/js/config-admin.js` — zero code changes needed there
   - `updated_at` auto-triggers
   - Row Level Security: public visitors get read-only access to non-hidden/
     visible/approved rows; only a logged-in Supabase Auth user gets write access
   - Storage bucket `ashmija-in-color-media` (matches the bucket name already
     hardcoded in `portfolio-admin.js` / `artists-admin.js`) + policies
   - No `users` table — Supabase Auth (`auth.users`) replaces the old JWT+bcrypt
     system entirely

2. **`edge-functions/generate-reply/`** — the Python ML review-reply engine
   fully ported to a Supabase Edge Function (TypeScript/Deno), same trained
   model data, same Tanglish keyword reply logic.

3. **Frontend rewrite** (see `frontend/` in the zip root) — done. Full details
   in the top-level `README.md`.

## What you still need to do

1. Run `supabase_schema.sql` in Supabase SQL Editor
2. (optional) run `seed_data_pg.sql` for demo data, or migrate your real
   MySQL data instead (export rows, convert 1/0 → true/false for boolean
   columns, then `INSERT`)
3. Create your admin user: Supabase Dashboard → Authentication → Users
4. Deploy the Edge Function via Supabase CLI
5. Host `frontend/` as a static site
6. Test: portfolio CRUD, artist CRUD, reviews + AI reply, FAQs, site config,
   inquiries, audit log, login/logout, password reset, image uploads
7. Once confirmed working, retire `backend/`, `database/`, `ml/`, `docker/`,
   `nginx/`, `infra/` from your original project

## Key decisions made (per your earlier answers)

- **Auth**: Supabase Auth, email + password
- **Contact form**: inquiries just land in the `inquiries` table — no email sending
- **ML review replies**: fully ported, no Python runtime needed anymore
