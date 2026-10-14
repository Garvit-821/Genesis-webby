# Supabase: form storage

One SQL file sets up storage for every form on genesishacks.com:

| File | What it creates |
|---|---|
| `migrations/20261013120000_form_submissions.sql` | `public.form_submissions` table, indexes, `updated_at` trigger, Row Level Security, five readable per-form views, a retention function and the private `partner-decks` storage bucket (3 MB, PDF/PPT/PPTX). |

## Apply it (drag and drop)

1. Open your project in the Supabase dashboard → **SQL Editor** → **New query**.
2. Drag the `.sql` file into the editor (or paste its contents) and click **Run**.
   It is safe to run more than once.
3. **Project Settings → API**: copy the **Project URL** and the **service_role** key into the site's environment as `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, then redeploy.

The service_role key bypasses Row Level Security. Keep it server-side only: never put it in a `REACT_APP_` variable or in frontend code.

## Check it worked

Run in the SQL Editor:

```sql
-- Table and views exist
select table_name, table_type
from information_schema.tables
where table_schema = 'public'
  and table_name in ('form_submissions', 'partner_inquiries', 'contact_messages',
                     'collaboration_requests', 'crew_applications', 'delhi_interest_signups');

-- RLS is on (should be true, true)
select relrowsecurity, relforcerowsecurity
from pg_class where oid = 'public.form_submissions'::regclass;

-- Bucket is private with a 3 MB cap (should be false, 3145728)
select public, file_size_limit from storage.buckets where id = 'partner-decks';
```

Then submit the contact form on the live site once and look for the row:

```sql
select created_at, form_type, name, email from public.form_submissions order by created_at desc limit 5;
```

## Where submissions show up

**Table Editor** → pick a view:

- `partner_inquiries`: sponsors (goals, event of interest, budget band, timeline, deck path)
- `delhi_interest_signups`: students registering interest in Hackers Occupied Delhi 2027
- `contact_messages`, `collaboration_requests`, `crew_applications`

Track follow-up with the `status` (`new`, `in_progress`, `replied`, `closed`, `spam`) and `notes` columns on `form_submissions`. Uploaded decks are under **Storage → partner-decks**.

## Retention

Personal data should not be kept longer than needed (DPDP Act, 2023). To delete submissions older than 24 months:

```sql
select public.purge_expired_form_submissions();          -- default 24 months
select public.purge_expired_form_submissions('12 months');
```

Decks in the bucket are not deleted by this function; remove old ones from **Storage → partner-decks**. The retention period is still to be confirmed.
