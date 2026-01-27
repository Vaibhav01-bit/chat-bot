
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { Chess } from "https://esm.sh/chess.js@1.0.0-beta.8"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { action, payload } = await req.json()

        // Auth check
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) throw new Error('Missing Authorization header')
        const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))

        if (userError || !user) throw new Error('Invalid User')
        const actorId = user.id

        if (action === 'create_game') {
            const { opponent_id } = payload
            const { data, error } = await supabaseClient
                .from('chess_games')
                .insert({
                    white_player_id: actorId, // Creator is White
                    black_player_id: opponent_id,
                    status: 'waiting',
                    current_fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                    white_seconds_remaining: 600,
                    black_seconds_remaining: 600,
                    last_move_at: new Date().toISOString() // Placeholder, will reset on start
                })
                .select()
                .single()

            if (error) throw error
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        if (action === 'accept_invite') {
            const { game_id } = payload

            const { data: game, error: fetchError } = await supabaseClient
                .from('chess_games')
                .select('*')
                .eq('id', game_id)
                .single()

            if (fetchError || !game) throw new Error('Game not found')
            if (game.status !== 'waiting') throw new Error('Game already started or finished')

            // Check if actor is the opponent (black player) or white player? 
            // Usually invitee accepts.
            if (actorId !== game.black_player_id && actorId !== game.white_player_id) {
                throw new Error('Not a participant')
            }

            // Start the game! Reset last_move_at to NOW so timer starts freshly.
            const { data: updated, error: updateError } = await supabaseClient
                .from('chess_games')
                .update({
                    status: 'playing',
                    last_move_at: new Date().toISOString(),
                    // Ensure full time is available
                    white_seconds_remaining: 600,
                    black_seconds_remaining: 600
                })
                .eq('id', game_id)
                .select()
                .single()

            if (updateError) throw updateError
            return new Response(JSON.stringify(updated), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        if (action === 'make_move') {
            const { game_id, move } = payload

            const { data: game, error: fetchError } = await supabaseClient
                .from('chess_games')
                .select('*')
                .eq('id', game_id)
                .single()

            if (fetchError || !game) throw new Error('Game not found')
            if (game.status !== 'playing') throw new Error('Game is not playing (Invite not accepted?)')

            const chess = new Chess(game.current_fen)
            const turn = chess.turn() // 'w' or 'b'

            // Validate Turn & Player
            if (turn === 'w' && actorId !== game.white_player_id) throw new Error('Not your turn')
            if (turn === 'b' && actorId !== game.black_player_id) throw new Error('Not your turn')

            // Time Calculation
            const now = new Date().getTime()
            const lastMoveTime = new Date(game.last_move_at).getTime()
            const timeUsed = Math.floor((now - lastMoveTime) / 1000)

            let newWhiteTime = game.white_seconds_remaining
            let newBlackTime = game.black_seconds_remaining

            if (turn === 'w') {
                newWhiteTime -= timeUsed
            } else {
                newBlackTime -= timeUsed
            }

            // Check Timeout
            if (newWhiteTime < 0 || newBlackTime < 0) {
                const winnerVal = (newWhiteTime < 0) ? game.black_player_id : game.white_player_id
                const { data: updated } = await supabaseClient
                    .from('chess_games')
                    .update({
                        status: 'completed',
                        winner_id: winnerVal,
                        end_reason: 'timeout',
                        white_seconds_remaining: Math.max(0, newWhiteTime),
                        black_seconds_remaining: Math.max(0, newBlackTime),
                        ended_at: new Date().toISOString()
                    })
                    .eq('id', game_id)
                    .select()
                    .single()
                return new Response(JSON.stringify(updated), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
            }

            // Validate Move
            try {
                const moveResult = chess.move(move)
                if (!moveResult) throw new Error('Invalid move')
            } catch (e) {
                throw new Error('Invalid move')
            }

            const newFen = chess.fen()
            let newStatus = 'playing'
            let winnerId = null
            let endReason = null

            // Check Game Over
            if (chess.isGameOver()) {
                newStatus = 'completed'
                if (chess.isCheckmate()) {
                    winnerId = actorId
                    endReason = 'checkmate'
                } else if (chess.isDraw()) {
                    endReason = 'draw'
                    if (chess.isStalemate()) endReason = 'stalemate'
                    if (chess.isInsufficientMaterial()) endReason = 'insufficient_material'
                    if (chess.isThreefoldRepetition()) endReason = 'threefold_repetition'
                }
            }

            // Update State
            const { data: updatedGame, error: updateError } = await supabaseClient
                .from('chess_games')
                .update({
                    current_fen: newFen,
                    status: newStatus,
                    winner_id: winnerId,
                    end_reason: endReason,
                    white_seconds_remaining: newWhiteTime,
                    black_seconds_remaining: newBlackTime,
                    last_move_at: new Date().toISOString(),
                    ended_at: newStatus === 'completed' ? new Date().toISOString() : null
                })
                .eq('id', game_id)
                .select()
                .single()

            if (updateError) throw updateError

            return new Response(JSON.stringify(updatedGame), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        if (action === 'resign') { /* ... Same as before ... */
            const { game_id } = payload
            const { data: game, error: fetchError } = await supabaseClient
                .from('chess_games')
                .select('*')
                .eq('id', game_id)
                .single()

            if (fetchError || !game) throw new Error('Game not found')
            if (game.status === 'completed') throw new Error('Game already ended')

            const winnerId = (actorId === game.white_player_id) ? game.black_player_id : game.white_player_id

            if (actorId !== game.white_player_id && actorId !== game.black_player_id) throw new Error('Not a player')

            const { data: updated } = await supabaseClient
                .from('chess_games')
                .update({
                    status: 'completed',
                    winner_id: winnerId,
                    end_reason: 'resign',
                    ended_at: new Date().toISOString()
                })
                .eq('id', game_id)
                .select()
                .single()

            return new Response(JSON.stringify(updated), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        if (action === 'claim_timeout') { /* ... Same - reuse make_move logic or explicit ... */
            const { game_id } = payload
            // Same timeout logic as make_move basically, or just trigger a check
            const { data: game, error: fetchError } = await supabaseClient
                .from('chess_games')
                .select('*')
                .eq('id', game_id)
                .single()

            if (fetchError || !game) throw new Error('Game not found')
            if (game.status !== 'playing') throw new Error('Game not playing')

            const now = new Date().getTime()
            const lastMoveTime = new Date(game.last_move_at).getTime()
            const timeUsed = Math.floor((now - lastMoveTime) / 1000)

            // Check whose turn
            const chess = new Chess(game.current_fen)
            const turn = chess.turn()

            let newWhiteTime = game.white_seconds_remaining
            let newBlackTime = game.black_seconds_remaining

            if (turn === 'w') newWhiteTime -= timeUsed
            else newBlackTime -= timeUsed

            if (newWhiteTime < 0 || newBlackTime < 0) {
                const winnerVal = (newWhiteTime < 0) ? game.black_player_id : game.white_player_id
                const { data: updated } = await supabaseClient
                    .from('chess_games')
                    .update({
                        status: 'completed',
                        winner_id: winnerVal,
                        end_reason: 'timeout',
                        white_seconds_remaining: Math.max(0, newWhiteTime),
                        black_seconds_remaining: Math.max(0, newBlackTime),
                        ended_at: new Date().toISOString()
                    })
                    .eq('id', game_id)
                    .select()
                    .single()
                return new Response(JSON.stringify(updated), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
            }

            return new Response(JSON.stringify({ message: "Time not up yet" }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
        }

        throw new Error('Unknown action: ' + action)

    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
