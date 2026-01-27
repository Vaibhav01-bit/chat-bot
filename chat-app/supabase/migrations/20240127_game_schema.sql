-- Create game_sessions table
CREATE TABLE IF NOT EXISTS public.game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
    white_player_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    black_player_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'completed', 'aborted')),
    fen TEXT NOT NULL DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    pgn TEXT DEFAULT '',
    turn TEXT DEFAULT 'w' CHECK (turn IN ('w', 'b')),
    winner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create game_moves table
CREATE TABLE IF NOT EXISTS public.game_moves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.game_sessions(id) ON DELETE CASCADE,
    player_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    move_san TEXT NOT NULL,
    fen_after TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_moves ENABLE ROW LEVEL SECURITY;

-- Policies for game_sessions
DROP POLICY IF EXISTS "Users can view games they are part of" ON public.game_sessions;
CREATE POLICY "Users can view games they are part of"
    ON public.game_sessions FOR SELECT
    USING (auth.uid() = white_player_id OR auth.uid() = black_player_id);

DROP POLICY IF EXISTS "Users can create games" ON public.game_sessions;
CREATE POLICY "Users can create games"
    ON public.game_sessions FOR INSERT
    WITH CHECK (auth.uid() = white_player_id OR auth.uid() = black_player_id);

DROP POLICY IF EXISTS "Users can update their games" ON public.game_sessions;
CREATE POLICY "Users can update their games"
    ON public.game_sessions FOR UPDATE
    USING (auth.uid() = white_player_id OR auth.uid() = black_player_id);

-- Policies for game_moves
DROP POLICY IF EXISTS "Users can view moves for their games" ON public.game_moves;
CREATE POLICY "Users can view moves for their games"
    ON public.game_moves FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.game_sessions
            WHERE id = session_id
            AND (white_player_id = auth.uid() OR black_player_id = auth.uid())
        )
    );

-- Allow service role (Edge Functions) full access implicitly (usually true by default, but policies apply to anon/authenticated roles)
