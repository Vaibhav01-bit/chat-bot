import { useEffect, useState } from 'react'
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

    useEffect(() => {
        if (!user) return

        const fetchChats = async () => {
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
                    if (!chatsMap.has(p.chat_id)) {
                        chatsMap.set(p.chat_id, {
                            id: p.chat_id,
                            created_at: '', // We could fetch this from chats table but not critical
                            is_group: false,
                            partner: p.profiles,
                            last_message: lastMessagesMap.get(p.chat_id)
                        })
                    }
                })

                // Sort by last message time, or fallback to something else if no message
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
        }

        fetchChats()
    }, [user])

    return { chats, loading }
}
