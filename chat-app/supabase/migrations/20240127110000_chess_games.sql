-- CHESS GAMES TABLE
-- Stores minimal state for active games and final results for completed games.
-- NO move history is stored.

create table if not exists chess_games (
  id uuid default gen_random_uuid() primary key,
  white_player_id uuid references auth.users not null,
  black_player_id uuid references auth.users not null,
  
  -- Game Status
  status text default 'waiting' check (status in ('waiting', 'playing', 'completed')),
  winner_id uuid references auth.users, -- Null if draw or ongoing
  end_reason text check (end_reason in ('checkmate', 'timeout', 'resign', 'draw', 'stalemate', 'insufficient_material', 'threefold_repetition', 'abandoned')),
  
  -- Transient State (Overwritten on every move)
  current_fen text not null, -- Current board state (FEN)
  
  -- Time Control (10 minutes = 600 seconds)
  white_seconds_remaining int default 600 not null,
  black_seconds_remaining int default 600 not null,
  last_move_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ended_at timestamp with time zone
);

-- RLS Policies
alter table chess_games enable row level security;

-- Users can view games they are part of
drop policy if exists "Users can view their own chess games" on chess_games;
create policy "Users can view their own chess games"
  on chess_games for select
  using (auth.uid() = white_player_id or auth.uid() = black_player_id);

-- System (Service Role) manages everything else via Edge Functions.
-- But standard users might need update for local optimistic UI? 
-- NO, for strict enforcement, ONLY edge function should update state to prevent cheating.
-- However, we might need insert permission if the client initiates the row.
-- Let's assume 'create_game' edge function handles insertion to ensure correct initial state (600s, standard FEN).
-- So no INSERT/UPDATE policies for public role needed if fully managed by Edge Function (Service Role).
-- Wait, if usage of 'create_game' via client direct insert is desired:
-- Let's stick to Edge Function for everything to ensure the "No History" and "Timer" rules are strictly followed.

-- Enable Realtime
-- Enable Realtime safely
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' 
    and tablename = 'chess_games'
  ) then
    alter publication supabase_realtime add table chess_games;
  end if;
end;
$$;
