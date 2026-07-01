create table if not exists public.content_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users(id) on delete set null,
  reporter_email text,
  song_id text not null,
  song_title text,
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'rejected')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  reason text,
  status text not null default 'requested' check (status in ('requested', 'reviewing', 'completed', 'rejected')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.release_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  version text not null,
  status text not null default 'saved' check (status in ('saved', 'approved', 'published', 'rolled_back')),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.content_reports enable row level security;
alter table public.account_deletion_requests enable row level security;
alter table public.audit_logs enable row level security;
alter table public.release_logs enable row level security;

drop policy if exists "Anyone can submit content reports" on public.content_reports;
create policy "Anyone can submit content reports"
  on public.content_reports for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins manage content reports" on public.content_reports;
create policy "Admins manage content reports"
  on public.content_reports for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Users request account deletion" on public.account_deletion_requests;
create policy "Users request account deletion"
  on public.account_deletion_requests for insert
  to authenticated
  with check (auth.uid() = user_id or user_id is null);

drop policy if exists "Admins manage deletion requests" on public.account_deletion_requests;
create policy "Admins manage deletion requests"
  on public.account_deletion_requests for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins manage audit logs" on public.audit_logs;
create policy "Admins manage audit logs"
  on public.audit_logs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins manage release logs" on public.release_logs;
create policy "Admins manage release logs"
  on public.release_logs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Owners delete unpublished songs" on public.songs;
create policy "Owners delete unpublished songs"
  on public.songs for delete
  to authenticated
  using (auth.uid() = owner_id and status in ('draft', 'pending', 'rejected'));

drop policy if exists "Admins delete songs" on public.songs;
create policy "Admins delete songs"
  on public.songs for delete
  to authenticated
  using (public.is_admin());

create index if not exists idx_content_reports_created_at on public.content_reports (created_at desc);
create index if not exists idx_content_reports_song_id on public.content_reports (song_id);
create index if not exists idx_deletion_requests_created_at on public.account_deletion_requests (created_at desc);
create index if not exists idx_audit_logs_created_at on public.audit_logs (created_at desc);
create index if not exists idx_release_logs_created_at on public.release_logs (created_at desc);
