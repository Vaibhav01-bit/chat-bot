import React, { useEffect, useState, useRef } from 'react'
import { Chess } from 'chess.js'
import { X, Trophy, Flag } from 'lucide-react'
import { ChessBoard } from './ChessBoard'
import { supabase } from '../../services/supabaseClient'
import { useAuth } from '../../context/AuthContext'

interface GameRoomProps {
    chatId: string
    sessionId?: string // This is now gameId
    opponentId?: string
    onClose: () => void
    onInvite?: (gameId: string) => void
}

interface ChessGame {
    id: string
    white_player_id: string
    black_player_id: string
    status: 'waiting' | 'playing' | 'completed'
    winner_id?: string
    end_reason?: string
    current_fen: string
    white_seconds_remaining: number
    black_seconds_remaining: number
    last_move_at: string
}

export const GameRoom: React.FC<GameRoomProps> = ({ chatId, sessionId: initialGameId, opponentId, onClose, onInvite }) => {
    const { user } = useAuth()
    const [gameId, setGameId] = useState<string | undefined>(initialGameId)
    const [game, setGame] = useState<ChessGame | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [orientation, setOrientation] = useState<'white' | 'black'>('white')

    // Derived state for UI
    const [fen, setFen] = useState('start')
    const [whiteTime, setWhiteTime] = useState(600)
    const [blackTime, setBlackTime] = useState(600)

    const timerRef = useRef<number | null>(null)
    const chessRef = useRef(new Chess())

    useEffect(() => {
        if (initialGameId) {
            setGameId(initialGameId)
            fetchGame(initialGameId)
            subscribeToGame(initialGameId)
        }
    }, [initialGameId])

    const fetchGame = async (id: string) => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('chess_games')
            .select('*')
            .eq('id', id)
            .single()

        if (data && !error) {
            updateLocalState(data)
        }
        setIsLoading(false)
    }

    const updateLocalState = (data: ChessGame) => {
        setGame(data)
        setFen(data.current_fen)
        chessRef.current.load(data.current_fen)

        // Orientation
        if (user?.id === data.black_player_id) {
            setOrientation('black')
        } else {
            setOrientation('white')
        }

        // Sync Timers
        setWhiteTime(data.white_seconds_remaining)
        setBlackTime(data.black_seconds_remaining)
    }

    const subscribeToGame = (id: string) => {
        const channel = supabase.channel(`chess_game:${id}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'chess_games',
                filter: `id=eq.${id}`
            }, (payload) => {
                const newData = payload.new as ChessGame
                updateLocalState(newData)
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }

    // Timer Logic
    useEffect(() => {
        if (!game || game.status !== 'playing') {
            if (timerRef.current) clearInterval(timerRef.current)
            return
        }

        const runTimer = () => {
            const now = Date.now()
            const lastUpdate = new Date(game.last_move_at).getTime()
            const diffSeconds = Math.floor((now - lastUpdate) / 1000)

            // Calculate current time based on whose turn it is
            const turn = chessRef.current.turn() // 'w' or 'b'

            if (turn === 'w') {
                const remaining = Math.max(0, game.white_seconds_remaining - diffSeconds)
                setWhiteTime(remaining)
                setBlackTime(game.black_seconds_remaining) // Black invalid?

                if (remaining === 0 && user?.id !== game.white_player_id) {
                    // White timed out. If I am Black, I claim.
                    handleClaimTimeout()
                }
            } else {
                const remaining = Math.max(0, game.black_seconds_remaining - diffSeconds)
                setBlackTime(remaining)
                setWhiteTime(game.white_seconds_remaining)

                if (remaining === 0 && user?.id !== game.black_player_id) {
                    // Black timed out. If I am White, I claim.
                    handleClaimTimeout()
                }
            }
        }

        runTimer()
        timerRef.current = window.setInterval(runTimer, 1000)

        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [game]) // dependencies include game (updated via realtime)

    const handleCreateGame = async () => {
        setIsLoading(true)
        try {
            let targetOpponentId = opponentId
            if (!targetOpponentId) {
                // Try to find another participant in chat
                const { data: participants } = await supabase
                    .from('chat_participants')
                    .select('user_id')
                    .eq('chat_id', chatId)
                    .neq('user_id', user?.id)
                    .single()
                targetOpponentId = participants?.user_id
            }

            if (!targetOpponentId) {
                alert("No opponent found")
                setIsLoading(false)
                return
            }

            const { data, error } = await supabase.functions.invoke('game-engine', {
                body: {
                    action: 'create_game',
                    payload: { opponent_id: targetOpponentId }
                }
            })

            if (error) throw error
            if (data) {
                setGameId(data.id)
                subscribeToGame(data.id)
                updateLocalState(data)
                if (onInvite) onInvite(data.id)
            }
        } catch (e: any) {
            alert("Create failed: " + e.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleMove = async (move: { from: string, to: string, promotion?: string }) => {
        if (!game || !gameId) return

        // Optimistic UI
        try {
            const result = chessRef.current.move(move)
            if (result) {
                setFen(chessRef.current.fen())

                await supabase.functions.invoke('game-engine', {
                    body: {
                        action: 'make_move',
                        payload: { game_id: gameId, move: result.san }
                    }
                })
            }
        } catch (e) {
            console.error("Move failed", e)
            // Revert
            chessRef.current.load(game.current_fen)
            setFen(game.current_fen)
        }
    }

    const handleResign = async () => {
        if (!game || !gameId) return
        if (!confirm("Resign?")) return

        await supabase.functions.invoke('game-engine', {
            body: { action: 'resign', payload: { game_id: gameId } }
        })
    }

    const handleClaimTimeout = async () => {
        if (!game || !gameId) return
        // Debounce?
        await supabase.functions.invoke('game-engine', {
            body: { action: 'claim_timeout', payload: { game_id: gameId } }
        })
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    if (!gameId) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in">
                <button onClick={handleCreateGame} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Start 10-Min Chess"}
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="font-bold text-lg">Rapid Chess (10m)</h2>
                <button onClick={onClose}><X size={20} /></button>
            </div>

            {/* Opponent Info & Timer */}
            <div className="p-4 flex justify-between items-center bg-zinc-100 dark:bg-zinc-800/50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-zinc-300 rounded-full flex items-center justify-center text-xs">OP</div>
                    <span className="font-medium">Opponent</span>
                </div>
                <div className={`px-3 py-1 rounded font-mono font-bold ${activeTimer('opponent') ? 'bg-white text-black shadow' : 'bg-transparent text-zinc-500'}`}>
                    {formatTime(orientation === 'white' ? blackTime : whiteTime)}
                </div>
            </div>

            {/* Board */}
            <div className="flex-1 flex items-center justify-center p-2 bg-zinc-200 dark:bg-zinc-950 overflow-hidden">
                <div className="w-full max-w-[400px] aspect-square shadow-xl">
                    <ChessBoard
                        fen={fen}
                        orientation={orientation}
                        onMove={handleMove}
                        disabled={game?.status !== 'playing' || (chessRef.current.turn() === 'w' && orientation === 'black') || (chessRef.current.turn() === 'b' && orientation === 'white')}
                    />
                </div>
            </div>

            {/* User Info & Timer */}
            <div className="p-4 flex justify-between items-center bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${orientation === 'white' ? 'bg-zinc-400' : 'bg-zinc-800'}`}>ME</div>
                    <span className="font-medium">You</span>
                </div>
                <div className={`px-3 py-1 rounded font-mono font-bold ${activeTimer('me') ? 'bg-green-100 text-green-800 shadow' : 'bg-zinc-100 text-zinc-500'}`}>
                    {formatTime(orientation === 'white' ? whiteTime : blackTime)}
                </div>
            </div>

            {/* Controls */}
            {game?.status === 'playing' && (
                <div className="p-4 flex justify-center border-t border-zinc-200 dark:border-zinc-800">
                    <button onClick={handleResign} className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition">
                        <Flag size={16} /> Resign
                    </button>
                </div>
            )}

            {/* Game Over Overlay */}
            {game?.status === 'completed' && (
                <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur flex items-center justify-center">
                    <div className="bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-2xl text-center">
                        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                        <h3 className="text-2xl font-bold mb-2">
                            {game.winner_id === user?.id ? "You Won!" : (game.winner_id ? "You Lost" : "Draw")}
                        </h3>
                        <p className="text-zinc-500 mb-6 capitalize">{game.end_reason?.replace('_', ' ')}</p>
                        <button onClick={onClose} className="px-6 py-2 bg-zinc-900 text-white rounded-lg">Close</button>
                        {/* Rematch could go here */}
                    </div>
                </div>
            )}

        </div>
    )

    function activeTimer(who: 'me' | 'opponent') {
        if (!game || game.status !== 'playing') return false
        const turn = chessRef.current.turn()
        if (who === 'me') {
            return (turn === 'w' && orientation === 'white') || (turn === 'b' && orientation === 'black')
        } else {
            return (turn === 'w' && orientation === 'black') || (turn === 'b' && orientation === 'white')
        }
    }
}
