# ashmijaincolor → Supabase Migration Package

## What's in this zip

- **`frontend/`** — your full frontend + admin panel, updated to talk to
  Supabase directly instead of the Java/MySQL backend. Deploy this as your
  static site (Vercel, Netlify, GitHub Pages, or any static host).
- **`supabase-migration/supabase_schema.sql`** — run this FIRST in Supabase
  SQL Editor. Creates all tables, RLS policies, storage bucket.
- **`supabase-migration/seed_data_pg.sql`** — optional demo data (same
  sample rows as your old `database/seeds/seed_data.sql`, converted for
  Postgres). Skip this if you're importing your real production data instead.
- **`supabase-migration/edge-functions/generate-reply/`** — the ML
  review-reply engine, ported to a Supabase Edge Function. Deploy with the
  Supabase CLI: `supabase functions deploy generate-reply`.
- **`supabase-migration/MIGRATION_PLAN.md`** — full write-up of what changed
  and why.

## Setup order

1. Supabase Dashboard → SQL Editor → run `supabase_schema.sql`
2. (optional) run `seed_data_pg.sql` for demo data
3. Supabase Dashboard → Authentication → Users → create your admin user
   (email: `admin@ashmijaincolor.com`, choose your own password)
4. Deploy the Edge Function (needs Supabase CLI installed locally):
   ```
   supabase login
   supabase link --project-ref mkbbcxukwqdostbldbmv
   supabase functions deploy generate-reply
   ```
5. Host the `frontend/` folder anywhere static (Vercel/Netlify/GitHub Pages).
   No backend server, no MySQL, no Java needed anymore.

## What changed in the frontend code

- `js/shared/config.js` — now holds your Supabase Project URL + anon key
  (replaces `API_BASE_URL`)
- `js/shared/api.js` + `api-client.js` — **deleted**, replaced by
  `js/shared/supabase-client.js` (a real `@supabase/supabase-js` client)
- `admin/js/auth.js` — rewritten for real Supabase Auth (email + password).
  The old passcode/OTP system and the insecure dev auto-login are both gone.
- `admin/js/audit.js` — fixed to read from the `audit_log` table (was
  pointing at a `/api/audit` alias that no longer exists)
- `admin/js/reviews.js` — the "Generate AI Reply" button now calls the new
  Edge Function URL instead of the old local ML server
- `admin/index.html` — login form simplified to email + password; Security
  Settings section trimmed to just "change password" (account lock/enable/
  disable was custom backend logic that Supabase Auth doesn't need — manage
  the user directly from the Supabase Dashboard if ever required)
- Everything else (`portfolio-admin.js`, `artists-admin.js`, `faqs-admin.js`,
  `config-admin.js`, `inquiries.js`, `dashboard.js`, all of `js/public/*.js`)
  — **untouched**. They were already written against a Supabase-shaped
  `window.db` API, so they work as-is against the real client.

## Not migrated (left in your original project, no longer used)

`backend/` (Spring Boot), `database/` (MySQL schema + old seed file),
`ml/` (Python — logic now lives in the Edge Function), `docker/`, `nginx/`,
`infra/` — safe to delete once you've verified the Supabase version works.
