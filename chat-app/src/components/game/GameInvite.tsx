
import React from 'react'
import { Play, Check } from 'lucide-react'

interface GameInviteProps {
    isMe: boolean
    onAccept: () => void
    status?: 'waiting' | 'playing' | 'completed' | 'expired'
}

export const GameInvite: React.FC<GameInviteProps> = ({ isMe, onAccept, status = 'waiting' }) => {
    return (
        <div className={`p-4 rounded-xl max-w-xs shadow-sm border ${isMe
            ? 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800'
            : 'bg-white border-zinc-100 dark:bg-zinc-800 dark:border-zinc-700'
            }`}>
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center text-white text-xl shadow-sm">
                    ♟️
                </div>
                <div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Chess Invite</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">10 min • Rapid</p>
                </div>
            </div>

            {status === 'waiting' ? (
                <button
                    onClick={onAccept}
                    className={`w-full py-2 text-sm font-medium rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isMe
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                            : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                        }`}
                >
                    <Play size={14} className="fill-current" />
                    {isMe ? 'Open Game Room' : 'Accept Game'}
                </button>
            ) : (
                <button
                    onClick={onAccept}
                    className="w-full py-2 bg-zinc-100 dark:bg-zinc-700/50 text-zinc-500 text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                    {status === 'playing' ? (
                        <>
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Return to Game
                        </>
                    ) : status === 'completed' ? (
                        'Game Ended'
                    ) : (
                        'Open Game'
                    )}
                </button>
            )}
        </div>
    )
}
