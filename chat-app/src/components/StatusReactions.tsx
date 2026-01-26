import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Eye } from 'lucide-react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'

interface StatusReactionsProps {
    statusId: string
    statusOwnerId: string
}

const EMOJIS = ['❤️', '😂', '🔥', '👍', '😮']

export const StatusReactions = ({ statusId, statusOwnerId }: StatusReactionsProps) => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [reactions, setReactions] = useState<any[]>([])
    const [viewCount, setViewCount] = useState(0)
    const [hasViewed, setHasViewed] = useState(false)

    useEffect(() => {
        fetchReactions()
        fetchViews()
        trackView()

        // Real-time subscription
        const channel = supabase
            .channel(`status_reactions:${statusId}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'status_reactions',
                filter: `status_id=eq.${statusId}`
            }, () => {
                fetchReactions()
            })
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'status_views',
                filter: `status_id=eq.${statusId}`
            }, () => {
                fetchViews()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [statusId])

    const fetchReactions = async () => {
        const { data } = await supabase
            .from('status_reactions')
            .select('*')
            .eq('status_id', statusId)

        if (data) setReactions(data)
    }

    const fetchViews = async () => {
        const { count } = await supabase
            .from('status_views')
            .select('*', { count: 'exact', head: true })
            .eq('status_id', statusId)

        setViewCount(count || 0)
    }

    const trackView = async () => {
        if (!user || hasViewed) return

        const { error } = await supabase
            .from('status_views')
            .insert({ status_id: statusId, user_id: user.id })
            .select()

        if (!error) setHasViewed(true)
    }

    const toggleReaction = async (emoji: string) => {
        if (!user) return

        const existing = reactions.find(r => r.user_id === user.id)

        if (existing) {
            await supabase
                .from('status_reactions')
                .delete()
                .eq('id', existing.id)
        } else {
            await supabase
                .from('status_reactions')
                .insert({
                    status_id: statusId,
                    user_id: user.id,
                    emoji
                })
        }
    }

    const handleReply = async () => {
        if (!user) return

        // Check if chat exists
        const { data: existingChat } = await supabase
            .from('chats')
            .select('id')
            .or(`and(user1_id.eq.${user.id},user2_id.eq.${statusOwnerId}),and(user1_id.eq.${statusOwnerId},user2_id.eq.${user.id})`)
            .eq('is_group', false)
            .single()

        if (existingChat) {
            navigate(`/chat/${existingChat.id}`)
        } else {
            // Check if friends
            const { data: friendship } = await supabase
                .from('friends')
                .select('id')
                .or(`and(user1_id.eq.${user.id},user2_id.eq.${statusOwnerId}),and(user1_id.eq.${statusOwnerId},user2_id.eq.${user.id})`)
                .single()

            if (!friendship) {
                alert('Send a friend request first to reply to this status')
                return
            }

            // Create chat
            const { data: newChat } = await supabase
                .from('chats')
                .insert({ user1_id: user.id, user2_id: statusOwnerId, is_group: false })
                .select()
                .single()

            if (newChat) {
                await supabase
                    .from('chat_participants')
                    .insert([
                        { chat_id: newChat.id, user_id: user.id },
                        { chat_id: newChat.id, user_id: statusOwnerId }
                    ])

                navigate(`/chat/${newChat.id}`)
            }
        }
    }

    // Count reactions by emoji
    const reactionCounts = reactions.reduce((acc, r) => {
        acc[r.emoji] = (acc[r.emoji] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const userReaction = reactions.find(r => r.user_id === user?.id)

    return (
        <div className="mt-4 space-y-3">
            {/* Reaction Picker */}
            <div className="flex items-center gap-2 flex-wrap">
                {EMOJIS.map(emoji => {
                    const count = reactionCounts[emoji] || 0
                    const isUserReaction = userReaction?.emoji === emoji
                    return (
                        <button
                            key={emoji}
                            onClick={() => toggleReaction(emoji)}
                            className={`px-3 py-1.5 rounded-full text-sm flex items-center space-x-1.5 transition-all hover:scale-105 ${isUserReaction
                                    ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                                    : count > 0
                                        ? 'bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700'
                                        : 'bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 opacity-60 hover:opacity-100'
                                }`}
                        >
                            <span className="text-lg">{emoji}</span>
                            {count > 0 && (
                                <span className={`text-xs font-semibold ${isUserReaction ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* View Count and Reply */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-sm">
                    <Eye size={16} className="mr-1.5" />
                    <span>{viewCount} {viewCount === 1 ? 'view' : 'views'}</span>
                </div>

                {user?.id !== statusOwnerId && (
                    <button
                        onClick={handleReply}
                        className="flex items-center space-x-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                    >
                        <MessageCircle size={16} />
                        <span>Reply</span>
                    </button>
                )}
            </div>
        </div>
    )
}
