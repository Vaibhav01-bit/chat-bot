
-- 1. STATUSES TABLE SCHEMA & SECURITY
create table if not exists public.statuses (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    content text,
    media_url text,
    media_type text check (media_type in ('image', 'video')),
    expires_at timestamp with time zone default (now() + interval '24 hours'),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.statuses enable row level security;

-- Policies
drop policy if exists "Public Read for authenticated users" on public.statuses;
create policy "Public Read for authenticated users" 
on public.statuses for select 
to authenticated 
using (true);

drop policy if exists "Users can create their own statuses" on public.statuses;
create policy "Users can create their own statuses" 
on public.statuses for insert 
to authenticated 
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own statuses" on public.statuses;
create policy "Users can delete their own statuses" 
on public.statuses for delete 
to authenticated 
using (auth.uid() = user_id);


-- 2. PROFILES SECURITY
-- Ensure RLS is on
alter table public.profiles enable row level security;

-- Drop insecure policies if any (safeguard)
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

-- Create Strict Policies
create policy "Public profiles are viewable by everyone" 
on public.profiles for select 
using (true);

create policy "Users can insert their own profile" 
on public.profiles for insert 
with check (auth.uid() = id);

create policy "Users can update own profile" 
on public.profiles for update 
using (auth.uid() = id);


-- 3. STORAGE SECURITY
-- Create buckets if they don't exist
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true),
       ('chat-images', 'chat-images', false),
       ('status-media', 'status-media', false)
on conflict (id) do nothing;

-- Helper policy to ensure user owns the folder "uid/*"
-- (Assuming file paths are stored as "user_id/filename")

-- AVATARS (Public Read, Owner Write)
drop policy if exists "Avatar Public Read" on storage.objects;
create policy "Avatar Public Read"
on storage.objects for select
to public
using ( bucket_id = 'avatars' );

drop policy if exists "Avatar Owner Upload" on storage.objects;
create policy "Avatar Owner Upload"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'avatars' 
    and (storage.foldername(name))[1] = auth.uid()::text
    and (rtrim(name, right(name, position('.' in reverse(name))))) not like '%.computed%' -- prevent weird extensions if needed, basically allow any
);

drop policy if exists "Avatar Owner Update/Delete" on storage.objects;
create policy "Avatar Owner Update/Delete"
on storage.objects for all
to authenticated
using (
    bucket_id = 'avatars' 
    and (storage.foldername(name))[1] = auth.uid()::text
);


-- CHAT IMAGES (Authenticated Read, Sender Write)
drop policy if exists "Chat Images Read" on storage.objects;
create policy "Chat Images Read"
on storage.objects for select
to authenticated
using ( bucket_id = 'chat-images' );

drop policy if exists "Chat Images Upload" on storage.objects;
create policy "Chat Images Upload"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'chat-images' 
    and (storage.foldername(name))[1] = auth.uid()::text
);


-- STATUS MEDIA (Authenticated Read, Owner Write)
drop policy if exists "Status Media Read" on storage.objects;
create policy "Status Media Read"
on storage.objects for select
to authenticated
using ( bucket_id = 'status-media' );

drop policy if exists "Status Media Upload" on storage.objects;
create policy "Status Media Upload"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'status-media' 
    and (storage.foldername(name))[1] = auth.uid()::text
);
