-- Friend Requests
create table if not exists friend_requests (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references auth.users(id) not null,
  receiver_id uuid references auth.users(id) not null,
  status text check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  created_at timestamp with time zone default now(),
  unique(sender_id, receiver_id)
);

-- Friends Table
create table if not exists friends (
  id uuid default gen_random_uuid() primary key,
  user1_id uuid references auth.users(id) not null,
  user2_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default now(),
  unique(user1_id, user2_id)
);

-- Blocked Users (ensuring it exists with correct structure)
create table if not exists blocked_users (
  id uuid default gen_random_uuid() primary key,
  blocker_id uuid references auth.users(id) not null,
  blocked_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default now(),
  unique(blocker_id, blocked_id)
);

-- RLS Policies
alter table friend_requests enable row level security;
create policy "Users can view their own requests" on friend_requests
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Users can send requests" on friend_requests
  for insert with check (auth.uid() = sender_id);
create policy "Users can update their received requests" on friend_requests
  for update using (auth.uid() = receiver_id);

alter table friends enable row level security;
create policy "Users can view their friends" on friends
  for select using (auth.uid() = user1_id or auth.uid() = user2_id);
-- Insert is handled via backend logic usually, but here we might do it client side or via trigger
create policy "Users can insert friends" on friends
  for insert with check (auth.uid() = user1_id or auth.uid() = user2_id);

alter table blocked_users enable row level security;
create policy "Users can view who they blocked" on blocked_users
  for select using (auth.uid() = blocker_id);
create policy "Users can block others" on blocked_users
  for insert with check (auth.uid() = blocker_id);

-- Migration Reference: 
-- We prefer a trigger to auto-add to friends table when request is accepted, but client-side logic is fine for MVP.
