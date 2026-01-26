import { useEffect, useState, useRef } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface MessageType {
    id: string
    content: string
    sender_id: string
    created_at: string
    type: 'text' | 'image'
}

export function useMessages(chatId: string) {
    const { user } = useAuth()
    const [messages, setMessages] = useState<MessageType[]>([])
    const [loading, setLoading] = useState(true)
    const [isConnected, setIsConnected] = useState(false)
    const channelRef = useRef<RealtimeChannel | null>(null)

    // Scroll ref logic should be in the component, not the hook

    // Load initial messages
    useEffect(() => {
        if (!chatId || !user) return

        const fetchMessages = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('chat_id', chatId)
                .order('created_at', { ascending: true })

            if (error) {
                console.error('Error fetching messages:', error)
            } else {
                setMessages(data || [])
            }
            setLoading(false)
        }

        fetchMessages()
    }, [chatId, user])

    // Subscription
    useEffect(() => {
        if (!chatId || !user) return

        console.log('🔌 Setting up real-time subscription for chat:', chatId)

        const channel = supabase.channel(`chat:${chatId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `chat_id=eq.${chatId}`,
                },
                (payload) => {
                    console.log('📨 New message received:', payload)
                    const newMsg = payload.new as MessageType

                    // Deduplicate
                    setMessages((prev) => {
                        if (prev.some(msg => msg.id === newMsg.id)) {
                            return prev
                        }
                        return [...prev, newMsg]
                    })
                }
            )
            .subscribe((status) => {
                console.log('📡 Subscription status:', status)
                if (status === 'SUBSCRIBED') {
                    setIsConnected(true)
                } else {
                    setIsConnected(false)
                }
            })

        channelRef.current = channel

        return () => {
            supabase.removeChannel(channel)
            setIsConnected(false)
        }
    }, [chatId, user])

    const sendMessage = async (content: string, type: 'text' | 'image' = 'text', imageUrl?: string) => {
        if (!user || !chatId) return

        console.log('🚀 Attempting to send message:', { chatId, senderId: user.id, content, type })

        const { data, error } = await supabase.from('messages').insert({
            chat_id: chatId,
            sender_id: user.id,
            content: content,
            message_type: type,
            image_url: imageUrl
        }).select().single()

        if (error) {
            console.error('❌ Supabase INSERT Error:', error)
            console.error('Error Details:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            })
            throw error
        }

        console.log('✅ Message sent successfully:', data)
    }

    return { messages, loading, sendMessage, isConnected }
}
