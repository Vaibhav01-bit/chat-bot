import { useState, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'

interface Reaction {
    id: string
    message_id: string
    user_id: string
    emoji: string
    created_at: string
}

interface MessageReactionsProps {
    messageId: string
    showPicker?: boolean
    onClose?: () => void
}

const EMOJIS = ['👍', '😂', '❤️', '🔥']

export const MessageReactions = ({ messageId, showPicker = false, onClose }: MessageReactionsProps) => {
    const { user } = useAuth()
    const [reactions, setReactions] = useState<Reaction[]>([])
    const pickerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchReactions()

        // Real-time subscription
        const channel = supabase
            .channel(`message_reactions:${messageId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'message_reactions',
                filter: `message_id=eq.${messageId}`
            }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setReactions(prev => [...prev, payload.new as Reaction])
                } else if (payload.eventType === 'DELETE') {
                    setReactions(prev => prev.filter(r => r.id !== payload.old.id))
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [messageId])

    // Click outside to close
    useEffect(() => {
        if (!showPicker || !onClose) return

        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showPicker, onClose])

    const fetchReactions = async () => {
        const { data } = await supabase
            .from('message_reactions')
            .select('*')
            .eq('message_id', messageId)

        if (data) setReactions(data)
    }

    const toggleReaction = async (emoji: string) => {
        if (!user) return

        // Check if user already reacted with this emoji
        const existing = reactions.find(r => r.user_id === user.id)

        if (existing) {
            if (existing.emoji === emoji) {
                // Remove same reaction
                await supabase
                    .from('message_reactions')
                    .delete()
                    .eq('id', existing.id)
            } else {
                // Change to different reaction
                await supabase
                    .from('message_reactions')
                    .delete()
                    .eq('id', existing.id)

                await supabase
                    .from('message_reactions')
                    .insert({
                        message_id: messageId,
                        user_id: user.id,
                        emoji
                    })
            }
        } else {
            // Add new reaction
            await supabase
                .from('message_reactions')
                .insert({
                    message_id: messageId,
                    user_id: user.id,
                    emoji
                })
        }

        // Close picker after selection
        if (onClose) onClose()
    }

    // Count reactions by emoji
    const reactionCounts = reactions.reduce((acc, r) => {
        acc[r.emoji] = (acc[r.emoji] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const userReaction = reactions.find(r => r.user_id === user?.id)

    return (
        <div className="relative">
            {/* Reaction Picker */}
            {showPicker && (
                <div
                    ref={pickerRef}
                    className="absolute -top-14 left-0 glass-panel rounded-full p-1.5 flex space-x-1 animate-scale-in z-20 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {EMOJIS.map((emoji, index) => (
                        <button
                            key={emoji}
                            onClick={() => toggleReaction(emoji)}
                            className="w-9 h-9 rounded-full transition-all hover:scale-125 active:scale-90 flex items-center justify-center text-xl hover:bg-white/50 dark:hover:bg-white/10"
                            style={{ animationDelay: `${index * 50}ms` }}
                            title={`React with ${emoji}`}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}

            {/* Reaction Display */}
            {Object.keys(reactionCounts).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                    {Object.entries(reactionCounts).map(([emoji, count]) => {
                        const isUserReaction = userReaction?.emoji === emoji
                        return (
                            <button
                                key={emoji}
                                onClick={() => toggleReaction(emoji)}
                                className={twMerge(
                                    "px-2 py-0.5 rounded-full text-xs flex items-center space-x-1 transition-all hover:scale-110 active:scale-95 border animate-pop backdrop-blur-sm",
                                    isUserReaction
                                        ? "bg-blue-100/80 dark:bg-blue-500/20 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                                        : "bg-white/60 dark:bg-zinc-800/60 border-zinc-200/50 dark:border-zinc-700/50 text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-700"
                                )}
                                title={isUserReaction ? 'Remove your reaction' : 'React with this emoji'}
                            >
                                <span className="text-sm shadow-sm filter drop-shadow-sm">{emoji}</span>
                                <span className="font-semibold text-[10px] opacity-90">
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
