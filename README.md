# Announcements Board

A simple announcements board. Admin posts announcements; people view them on a public page and get email notifications.

## Stack

- React + Vite + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth + Edge Functions)
- Resend for transactional email

## Setup

### 1. Environment variables

Copy `.env.example` to `.env` and fill in:

- `VITE_SUPABASE_URL` -- your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` -- your Supabase anon/public key
- `VITE_APP_URL` -- your app URL (http://localhost:5173 for dev)

### 2. Database

Run the SQL in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL Editor. This creates:

- `announcements` table with RLS (public reads published, admin reads/writes all)
- `subscribers` table with RLS (public can subscribe, admin manages)
- `unsubscribe()` RPC function
- Auto-updating `updated_at` trigger

### 3. Create admin user

In Supabase Dashboard > Authentication > Users > Add User. Enter email + password.

### 4. Deploy Edge Function

Set these secrets in Supabase Edge Function settings:

- `RESEND_API_KEY` -- your Resend API key
- `APP_URL` -- your deployed app URL
- `FROM_EMAIL` -- your verified Resend sender address

Deploy:

```bash
supabase functions deploy send-announcement-email --project-ref YOUR_REF
```

### 5. Configure Resend

- Sign up at resend.com
- Add and verify your sending domain
- Create an API key
- Set the `FROM_EMAIL` to match your verified domain (e.g., `announcements@yourdomain.com`)

### 6. Run locally

```bash
bun install
bun run dev
```

### 7. Deploy to Vercel

```bash
bunx vercel
```

Set the same env vars in Vercel project settings.

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Announcements board |
| `/login` | Public | Admin login |
| `/admin` | Auth | Announcement management |
| `/admin/new` | Auth | Create announcement |
| `/admin/edit/:id` | Auth | Edit announcement |
| `/admin/subscribers` | Auth | Subscriber management |
| `/unsubscribe?token=` | Public | Email unsubscribe |
