-- Genesis Hacks: storage for every form on genesishacks.com.
--
-- One table holds all submissions. Columns every form shares are typed and
-- checked; anything form-specific lives in `payload` (jsonb), so adding a
-- field to a form never needs a schema change. Per-form views below give
-- the team readable tables.
--
-- Access model: Row Level Security is on and there are NO policies for the
-- `anon` or `authenticated` roles, so the public API can neither read nor
-- write. The site's server functions (/api/*) use the service role key,
-- which bypasses RLS. Never ship that key to the browser.

-- ─── Table ─────────────────────────────────────────────────────────────

create table if not exists public.form_submissions (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  form_type       text not null
                  check (form_type in ('contact', 'partner', 'collaborate', 'work_with_us', 'delhi_interest')),

  name            text not null check (char_length(btrim(name)) between 1 and 200),
  email           text not null
                  check (
                    char_length(email) <= 320
                    and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$'
                  ),
  phone           text check (phone is null or char_length(phone) <= 40),
  organization    text check (organization is null or char_length(organization) <= 200),
  message         text check (message is null or char_length(message) <= 5000),

  -- Every other field the form sent (goals, budget band, tracks, ...).
  payload         jsonb not null default '{}'::jsonb
                  check (jsonb_typeof(payload) = 'object' and pg_column_size(payload) <= 32768),

  -- Optional upload (partner decks), stored in the private `partner-decks` bucket.
  attachment_path text check (attachment_path is null or char_length(attachment_path) <= 512),
  attachment_name text check (attachment_name is null or char_length(attachment_name) <= 255),

  -- Context, for spam control. The IP is stored only as a salted hash.
  page            text check (page is null or char_length(page) <= 512),
  user_agent      text check (user_agent is null or char_length(user_agent) <= 512),
  ip_hash         text check (ip_hash is null or char_length(ip_hash) = 64),

  -- Team workflow, mirrors the Status / Notes columns in the old Google Sheet.
  status          text not null default 'new'
                  check (status in ('new', 'in_progress', 'replied', 'closed', 'spam')),
  notes           text
);

comment on table public.form_submissions is
  'Every form submission from genesishacks.com. Written only by server functions with the service role key.';
comment on column public.form_submissions.payload is
  'Form-specific fields. contact: role. partner: website, partnershipType, goals[], eventOfInterest, budgetBand, timeline. collaborate: website, partnershipType. delhi_interest: city, tracks[], teamStatus. work_with_us: role, city, experience, portfolio.';
comment on column public.form_submissions.ip_hash is
  'sha256(ip + FORM_IP_SALT). Used only to rate-limit repeat submissions.';

create index if not exists form_submissions_type_created_idx
  on public.form_submissions (form_type, created_at desc);
create index if not exists form_submissions_email_idx
  on public.form_submissions (lower(email));
create index if not exists form_submissions_ip_recent_idx
  on public.form_submissions (ip_hash, created_at desc)
  where ip_hash is not null;
create index if not exists form_submissions_open_idx
  on public.form_submissions (created_at desc)
  where status in ('new', 'in_progress');

-- ─── updated_at ────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists form_submissions_set_updated_at on public.form_submissions;
create trigger form_submissions_set_updated_at
  before update on public.form_submissions
  for each row execute function public.set_updated_at();

-- ─── Lock it down ──────────────────────────────────────────────────────

alter table public.form_submissions enable row level security;
alter table public.form_submissions force row level security;
revoke all on table public.form_submissions from anon, authenticated;

-- ─── Readable per-form views for the team ──────────────────────────────
-- security_invoker = true makes each view obey the table's RLS, so the
-- public API still sees nothing.

create or replace view public.contact_messages with (security_invoker = true) as
select
  id, created_at, status,
  name, email,
  payload ->> 'role' as reaching_out_as,
  message,
  page, notes
from public.form_submissions
where form_type = 'contact';

create or replace view public.partner_inquiries with (security_invoker = true) as
select
  id, created_at, status,
  name, email, phone,
  organization                       as company,
  payload ->> 'website'              as website,
  payload ->> 'partnershipType'      as partnership_type,
  payload -> 'goals'                 as goals,
  payload ->> 'eventOfInterest'      as event_of_interest,
  payload ->> 'budgetBand'           as budget_band,
  payload ->> 'timeline'             as timeline,
  message                            as details,
  attachment_name, attachment_path,
  notes
from public.form_submissions
where form_type = 'partner';

create or replace view public.collaboration_requests with (security_invoker = true) as
select
  id, created_at, status,
  name, email, phone,
  organization                       as organization_or_event,
  payload ->> 'partnershipType'      as collaboration_type,
  payload ->> 'website'              as website,
  message                            as details,
  notes
from public.form_submissions
where form_type = 'collaborate';

create or replace view public.crew_applications with (security_invoker = true) as
select
  id, created_at, status,
  name, email, phone,
  payload ->> 'role'                 as area,
  payload ->> 'city'                 as city,
  payload ->> 'experience'           as experience,
  payload ->> 'portfolio'            as portfolio,
  message                            as why_genesis,
  notes
from public.form_submissions
where form_type = 'work_with_us';

create or replace view public.delhi_interest_signups with (security_invoker = true) as
select
  id, created_at, status,
  name, email, phone,
  organization                       as college_or_organisation,
  payload ->> 'city'                 as city,
  payload -> 'tracks'                as tracks,
  payload ->> 'teamStatus'           as team_status,
  notes
from public.form_submissions
where form_type = 'delhi_interest';

revoke all on table
  public.contact_messages,
  public.partner_inquiries,
  public.collaboration_requests,
  public.crew_applications,
  public.delhi_interest_signups
from anon, authenticated;

-- ─── Retention (DPDP Act: keep personal data only as long as needed) ───
-- NEEDS_CONFIRMATION: the retention period. Run on a schedule, e.g. with
-- pg_cron:  select cron.schedule('purge-forms', '0 3 * * *',
--             $$select public.purge_expired_form_submissions()$$);

create or replace function public.purge_expired_form_submissions(retain interval default interval '24 months')
returns integer
language sql
security definer
set search_path = ''
as $$
  with deleted as (
    delete from public.form_submissions
    where created_at < now() - retain
    returning 1
  )
  select count(*)::integer from deleted;
$$;

revoke execute on function public.purge_expired_form_submissions(interval) from public, anon, authenticated;

-- ─── Private bucket for partner decks ──────────────────────────────────
-- No storage policies are created, so only the service role can read or
-- write. Files are capped at 3 MB to match the form and Vercel's body limit.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'partner-decks',
  'partner-decks',
  false,
  3145728,
  array[
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
