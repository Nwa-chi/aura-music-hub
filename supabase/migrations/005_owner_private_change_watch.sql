create table if not exists public.owner_change_events (
  id uuid primary key default gen_random_uuid(),
  change_type text not null,
  title text not null,
  detail text,
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.owner_change_events enable row level security;

drop policy if exists "App can record owner change events" on public.owner_change_events;
create policy "App can record owner change events"
  on public.owner_change_events for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins read owner change events" on public.owner_change_events;
create policy "Admins read owner change events"
  on public.owner_change_events for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins manage owner change events" on public.owner_change_events;
create policy "Admins manage owner change events"
  on public.owner_change_events for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins delete owner change events" on public.owner_change_events;
create policy "Admins delete owner change events"
  on public.owner_change_events for delete
  to authenticated
  using (public.is_admin());

create index if not exists idx_owner_change_events_created_at on public.owner_change_events (created_at desc);
create index if not exists idx_owner_change_events_change_type on public.owner_change_events (change_type);
