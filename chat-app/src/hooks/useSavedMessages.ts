import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'

export interface SavedMessage {
    id: string
    message_id: string | null
    chat_id: string
    message_content: string
    sender_id: string | null
    sender_name: string | null
    chat_name: string | null
    original_timestamp: string | null
    is_available: boolean
    saved_at: string
}

export function useSavedMessages() {
    const { user } = useAuth()
    const [savedMessages, setSavedMessages] = useState<SavedMessage[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch all saved messages
    const fetchSavedMessages = useCallback(async () => {
        if (!user) {
            setLoading(false)
            return
        }

        try {
            const { data, error } = await supabase
                .from('saved_messages')
                .select('*')
                .eq('user_id', user.id)
                .order('saved_at', { ascending: false })

            if (error) {
                console.error('Error fetching saved messages:', error)
                return
            }

            setSavedMessages(data || [])
        } catch (err) {
            console.error('Error in fetchSavedMessages:', err)
        } finally {
            setLoading(false)
        }
    }, [user])

    useEffect(() => {
        fetchSavedMessages()
    }, [fetchSavedMessages])

    // Save a message
    const saveMessage = async (
        messageId: string,
        content: string,
        senderId: string,
        senderName: string,
        chatId: string,
        chatName: string,
        timestamp: string
    ) => {
        if (!user) return false

        try {
            const { error } = await supabase
                .from('saved_messages')
                .insert({
                    user_id: user.id,
                    message_id: messageId,
                    chat_id: chatId,
                    message_content: content,
                    sender_id: senderId,
                    sender_name: senderName,
                    chat_name: chatName,
                    original_timestamp: timestamp
                })

            if (error) {
                console.error('Error saving message:', error)
                return false
            }

            // Refresh list
            await fetchSavedMessages()
            return true
        } catch (err) {
            console.error('Error in saveMessage:', err)
            return false
        }
    }

    // Unsave a message
    const unsaveMessage = async (savedMessageId: string) => {
        if (!user) return false

        try {
            const { error } = await supabase
                .from('saved_messages')
                .delete()
                .eq('id', savedMessageId)
                .eq('user_id', user.id)

            if (error) {
                console.error('Error unsaving message:', error)
                return false
            }

            // Update local state
            setSavedMessages(prev => prev.filter(msg => msg.id !== savedMessageId))
            return true
        } catch (err) {
            console.error('Error in unsaveMessage:', err)
            return false
        }
    }

    // Check if a message is saved
    const isMessageSaved = (messageId: string): boolean => {
        return savedMessages.some(msg => msg.message_id === messageId)
    }

    // Get saved message ID for a message
    const getSavedMessageId = (messageId: string): string | null => {
        const saved = savedMessages.find(msg => msg.message_id === messageId)
        return saved?.id || null
    }

    return {
        savedMessages,
        loading,
        saveMessage,
        unsaveMessage,
        isMessageSaved,
        getSavedMessageId,
        refetch: fetchSavedMessages
    }
}
