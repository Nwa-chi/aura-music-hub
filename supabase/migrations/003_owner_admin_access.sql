create or replace function public.ensure_owner_admin()
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  current_email text;
  current_name text;
  profile_row public.profiles;
begin
  select
    email,
    coalesce(raw_user_meta_data->>'name', split_part(email, '@', 1), 'AURA owner')
  into current_email, current_name
  from auth.users
  where id = auth.uid();

  if auth.uid() is null or lower(coalesce(current_email, '')) <> lower('Udeinno01@gmail.com') then
    raise exception 'Only the configured AURA owner can activate admin access.';
  end if;

  insert into public.profiles (id, display_name, role)
  values (auth.uid(), current_name, 'admin')
  on conflict (id) do update
    set role = 'admin',
        display_name = coalesce(nullif(public.profiles.display_name, ''), excluded.display_name)
  returning * into profile_row;

  return profile_row;
end;
$$;

grant execute on function public.ensure_owner_admin() to authenticated;

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
  coalesce(raw_user_meta_data->>'name', split_part(email, '@', 1), 'AURA owner'),
  'admin'
from auth.users
where lower(email) = lower('Udeinno01@gmail.com')
on conflict (id) do update
  set role = 'admin',
      display_name = excluded.display_name;
