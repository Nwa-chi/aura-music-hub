create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

drop policy if exists "Users update their profile" on public.profiles;
create policy "Users update their own public profile" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles" on public.profiles
  for update using (public.is_admin())
  with check (public.is_admin());

revoke update on public.profiles from authenticated;
grant update (display_name, avatar_url) on public.profiles to authenticated;

drop policy if exists "Artists update their songs" on public.songs;
create policy "Artists update pending songs" on public.songs
  for update using (auth.uid() = owner_id and status in ('draft', 'pending', 'rejected'))
  with check (auth.uid() = owner_id and status in ('draft', 'pending'));

drop policy if exists "Admins read all songs" on public.songs;
create policy "Admins read all songs" on public.songs
  for select using (public.is_admin());

drop policy if exists "Admins moderate songs" on public.songs;
create policy "Admins moderate songs" on public.songs
  for update using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins read listening events" on public.listening_events;
create policy "Admins read listening events" on public.listening_events
  for select using (public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    case when lower(new.email) = lower('Udeinno01@gmail.com') then 'admin' else 'listener' end
  )
  on conflict (id) do update
    set display_name = excluded.display_name,
        role = case
          when lower(new.email) = lower('Udeinno01@gmail.com') then 'admin'
          else public.profiles.role
        end;

  return new;
end;
$$;

insert into public.profiles (id, display_name, role)
select
  id,
  coalesce(raw_user_meta_data->>'name', split_part(email, '@', 1), 'Music fan'),
  'admin'
from auth.users
where lower(email) = lower('Udeinno01@gmail.com')
on conflict (id) do update
  set role = 'admin',
      display_name = excluded.display_name;
