alter table public.songs
add column if not exists video_url text;

comment on column public.songs.video_url is 'Optional public video URL for music videos and live performance tracks.';
