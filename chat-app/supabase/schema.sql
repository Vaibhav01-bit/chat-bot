-- Enable RLS on profiles if not already
alter table profiles enable row level security;

-- CHATS TABLE
create table if not exists chats (
  id uuid default gen_random_uuid() primary key,
  user1_id uuid references auth.users not null,
  user2_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_message_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint chats_users_check check (user1_id < user2_id)
);

alter table chats enable row level security;

drop policy if exists "Users can view their own chats" on chats;
create policy "Users can view their own chats"
  on chats for select
  using (auth.uid() = user1_id or auth.uid() = user2_id);

drop policy if exists "Users can create chats" on chats;
create policy "Users can create chats"
  on chats for insert
  with check (auth.uid() = user1_id or auth.uid() = user2_id);

-- MESSAGES TABLE
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  chat_id uuid references chats(id) on delete cascade not null,
  sender_id uuid references auth.users not null,
  content text,
  message_type text default 'text' check (message_type in ('text', 'image', 'system')),
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  delivered_at timestamp with time zone,
  read_at timestamp with time zone
);

alter table messages enable row level security;

-- ENABLE REALTIME
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table random_chat_sessions;
alter publication supabase_realtime add table random_chat_queue;


drop policy if exists "Users can view messages in their chats" on messages;
create policy "Users can view messages in their chats"
  on messages for select
  using (
    exists (
      select 1 from chats
      where chats.id = messages.chat_id
      and (chats.user1_id = auth.uid() or chats.user2_id = auth.uid())
    )
  );

drop policy if exists "Users can insert messages in their chats" on messages;
create policy "Users can insert messages in their chats"
  on messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from chats
      where chats.id = messages.chat_id
      and (chats.user1_id = auth.uid() or chats.user2_id = auth.uid())
    )
  );

-- RANDOM CHAT QUEUE
create table if not exists random_chat_queue (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  status text default 'waiting' check (status in ('waiting', 'matched', 'timeout')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table random_chat_queue enable row level security;

drop policy if exists "Users can view their own queue entry" on random_chat_queue;
create policy "Users can view their own queue entry"
  on random_chat_queue for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert into queue" on random_chat_queue;
create policy "Users can insert into queue"
  on random_chat_queue for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own queue status" on random_chat_queue;
create policy "Users can update their own queue status"
  on random_chat_queue for update
  using (auth.uid() = user_id);
  
drop policy if exists "Users can delete from queue" on random_chat_queue;
create policy "Users can delete from queue"
  on random_chat_queue for delete
  using (auth.uid() = user_id);


-- RANDOM CHAT SESSIONS
create table if not exists random_chat_sessions (
  id uuid default gen_random_uuid() primary key,
  user1_id uuid references auth.users not null,
  user2_id uuid references auth.users not null,
  status text default 'active' check (status in ('active', 'ended')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ended_at timestamp with time zone,
  message_count int default 0
);

alter table random_chat_sessions enable row level security;

drop policy if exists "Users can view their random sessions" on random_chat_sessions;
create policy "Users can view their random sessions"
  on random_chat_sessions for select
  using (auth.uid() = user1_id or auth.uid() = user2_id);

drop policy if exists "Users can update their random sessions (e.g. disconnect)" on random_chat_sessions;
create policy "Users can update their random sessions (e.g. disconnect)"
  on random_chat_sessions for update
  using (auth.uid() = user1_id or auth.uid() = user2_id);

-- FUNCTION TO GET OR CREATE DM
create or replace function get_or_create_dm(partner_id uuid)
returns uuid
language plpgsql
security definer
as $$
declare
  chat_id uuid;
  u1 uuid;
  u2 uuid;
begin
  if auth.uid() < partner_id then
    u1 := auth.uid();
    u2 := partner_id;
  else
    u1 := partner_id;
    u2 := auth.uid();
  end if;

  select id into chat_id
  from chats
  where user1_id = u1 and user2_id = u2;

  if chat_id is null then
    insert into chats (user1_id, user2_id)
    values (u1, u2)
    returning id into chat_id;
  end if;

  return chat_id;
end;
$$;
