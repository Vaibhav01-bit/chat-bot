import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'

export interface ChatType {
    id: string
    created_at: string
    is_group: boolean
    last_message?: {
        content: string
        created_at: string
    }
    partner?: {
        id: string
        full_name: string
        avatar_url: string
        username: string
    }
}

export function useChats() {
    const { user } = useAuth()
    const [chats, setChats] = useState<ChatType[]>([])
    const [loading, setLoading] = useState(true)

    const fetchChats = useCallback(async () => {
        if (!user) {
            setChats([])
            setLoading(false)
            return
        }

        try {
            // 1. Get my chats
            const { data: myChats, error } = await supabase
                .from('chat_participants')
                .select('chat_id')
                .eq('user_id', user.id)

            if (error || !myChats || myChats.length === 0) {
                setChats([])
                setLoading(false)
                return
            }

            const chatIds = myChats.map(c => c.chat_id)

            // 2. Get partners
            const { data: participants } = await supabase
                .from('chat_participants')
                .select('chat_id, user_id, profiles(id, full_name, avatar_url, username)')
                .in('chat_id', chatIds)
                .neq('user_id', user.id)

            // 3. Get last messages for each chat to sort
            const { data: messages } = await supabase
                .from('messages')
                .select('chat_id, content, created_at')
                .in('chat_id', chatIds)
                .order('created_at', { ascending: false })

            // Group messages by chat to find the latest
            const lastMessagesMap = new Map()
            messages?.forEach(m => {
                if (!lastMessagesMap.has(m.chat_id)) {
                    lastMessagesMap.set(m.chat_id, m)
                }
            })

            const chatsMap = new Map<string, ChatType>()
            participants?.forEach((p: any) => {
                // Ensure we haven't already added this chat (handle duplicates if any)
                // Also ensure we have a partner profile
                if (!chatsMap.has(p.chat_id) && p.profiles) {
                    chatsMap.set(p.chat_id, {
                        id: p.chat_id,
                        created_at: '',
                        is_group: false,
                        partner: p.profiles,
                        last_message: lastMessagesMap.get(p.chat_id)
                    })
                }
            })

            // Sort by last message time
            const sortedChats = Array.from(chatsMap.values()).sort((a, b) => {
                const timeA = a.last_message?.created_at || '1970-01-01'
                const timeB = b.last_message?.created_at || '1970-01-01'
                return new Date(timeB).getTime() - new Date(timeA).getTime()
            })

            setChats(sortedChats)
        } catch (err) {
            console.error('Error fetching chats:', err)
        } finally {
            setLoading(false)
        }
    }, [user]) // Dependencies for useCallback

    useEffect(() => {
        if (!user) return

        fetchChats()

        // Subscription for new chats (added to chat_participants)
        const participantChannel = supabase.channel(`user_chats:${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_participants',
                    filter: `user_id=eq.${user.id}`,
                },
                () => {
                    console.log('🆕 New chat added, refetching list...')
                    fetchChats()
                }
            )
            .subscribe()

        // Subscription for new messages (to update last message preview and sort order)
        // We listen to all messages, but ideally we'd filter. 
        // Since we can't filter by "chat_id IN list" dynamically easily in one channel without resetting it,
        // we'll listen to global messages and check if it matters to us.
        // NOTE: In a high-scale app, this is bad. But for this scale, it's fine.
        const messageChannel = supabase.channel('public:messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                },
                (_payload) => {
                    // Optimistic update or refetch? Refetch is safer for consistency.
                    // Check if this message belongs to one of our chats to avoid unnecessary fetches
                    // We can't check 'chats' state here easily due to closure staleness unless we use a ref or dependency.
                    // simpler: just refetch.
                    fetchChats()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(participantChannel)
            supabase.removeChannel(messageChannel)
        }
    }, [user])

    return { chats, loading, refreshChats: fetchChats }
}
