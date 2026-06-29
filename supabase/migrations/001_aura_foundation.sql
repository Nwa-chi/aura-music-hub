create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Music fan',
  role text not null default 'listener' check (role in ('listener', 'artist', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  artist_name text not null,
  album text,
  genre text,
  audio_url text not null,
  cover_url text,
  lyrics jsonb not null default '[]'::jsonb,
  status text not null default 'pending' check (status in ('draft', 'pending', 'published', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  song_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, song_id)
);

create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.playlist_songs (
  playlist_id uuid not null references public.playlists(id) on delete cascade,
  song_id text not null,
  position integer not null default 0,
  added_at timestamptz not null default now(),
  primary key (playlist_id, song_id)
);

create table if not exists public.artist_follows (
  user_id uuid not null references auth.users(id) on delete cascade,
  artist_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, artist_id)
);

create table if not exists public.listening_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  song_id text not null,
  event_type text not null check (event_type in ('play', 'complete', 'skip', 'favorite')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.songs enable row level security;
alter table public.favorites enable row level security;
alter table public.playlists enable row level security;
alter table public.playlist_songs enable row level security;
alter table public.artist_follows enable row level security;
alter table public.listening_events enable row level security;

create policy "Public profiles are readable" on public.profiles for select using (true);
create policy "Users update their profile" on public.profiles for update using (auth.uid() = id);
create policy "Published songs are readable" on public.songs for select using (status = 'published' or auth.uid() = owner_id);
create policy "Artists create their songs" on public.songs for insert with check (auth.uid() = owner_id);
create policy "Artists update their songs" on public.songs for update using (auth.uid() = owner_id);
create policy "Users read their favorites" on public.favorites for select using (auth.uid() = user_id);
create policy "Users create their favorites" on public.favorites for insert with check (auth.uid() = user_id);
create policy "Users delete their favorites" on public.favorites for delete using (auth.uid() = user_id);
create policy "Users manage their playlists" on public.playlists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Playlist songs follow playlist ownership" on public.playlist_songs for all
  using (exists (select 1 from public.playlists where id = playlist_id and user_id = auth.uid()))
  with check (exists (select 1 from public.playlists where id = playlist_id and user_id = auth.uid()));
create policy "Users manage artist follows" on public.artist_follows for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users read listening history" on public.listening_events for select using (auth.uid() = user_id);
create policy "Users create listening history" on public.listening_events for insert with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();
