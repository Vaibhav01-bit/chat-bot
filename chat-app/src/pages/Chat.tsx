import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Paperclip } from 'lucide-react'
import { useMessages } from '../hooks/useMessages'
import { useAuth } from '../context/AuthContext'
import { MessageBubble } from '../components/MessageBubble'
import { useToast } from '../context/ToastContext'

import { supabase } from '../services/supabaseClient'

export const Chat = () => {
    const { chatId } = useParams<{ chatId: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { messages, loading, sendMessage } = useMessages(chatId!)
    const [newMessage, setNewMessage] = useState('')
    const [partner, setPartner] = useState<{ full_name: string, avatar_url?: string } | null>(null)
    const bottomRef = useRef<HTMLDivElement>(null)
    const { showToast } = useToast()

    useEffect(() => {
        // Fetch partner details
        if (!chatId || !user) return

        const fetchPartner = async () => {
            // Updated to fetch correctly from chat_participants
            // We want to find the participant that is NOT the current user
            const { data: participants, error } = await supabase
                .from('chat_participants')
                .select('user_id')
                .eq('chat_id', chatId)
                .neq('user_id', user.id)
                .single()

            if (error) {
                console.error('Error fetching chat partner:', error)
                return
            }

            if (!participants) {
                console.log('No partner found in this chat')
                return
            }

            const partnerId = participants.user_id

            const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name, avatar_url, username')
                .eq('id', partnerId)
                .single()

            if (profileData) {
                setPartner(profileData)
            }
        }
        fetchPartner()
    }, [chatId, user])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // ... handleSend ...
    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        console.log('🖱️ Send button clicked. Message content:', newMessage)

        try {
            await sendMessage(newMessage)
            setNewMessage('')
            console.log('✨ UI updated after successful send')
        } catch (err: any) {
            console.error('🔥 Error in handleSend:', err)
            showToast(`Failed to send: ${err.message || 'Unknown error'}`, 'error')
        }
    }

    return (
        <div className="flex flex-col h-[100dvh] bg-zinc-50 dark:bg-black">
            {/* Header */}
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 p-3 flex items-center sticky top-0 z-30 pt-[calc(0.75rem+env(safe-area-inset-top))] transition-all duration-200">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2.5 mr-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full active:scale-95 transition-all"
                >
                    <ArrowLeft size={22} />
                </button>
                <div className="flex items-center flex-1 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden mr-3 border border-zinc-100 dark:border-zinc-700">
                        {partner?.avatar_url && <img src={partner.avatar_url} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                        <h2 className="font-semibold text-zinc-900 dark:text-white text-base leading-tight">
                            {partner?.full_name || 'Loading...'}
                        </h2>
                        <div className="flex items-center space-x-1.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)] animate-pulse"></span>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Online</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
                {loading && <div className="text-center text-zinc-500 text-sm mt-4 animate-pulse">Loading messages...</div>}
                {messages.map(msg => (
                    <MessageBubble
                        key={msg.id}
                        content={msg.content}
                        isMe={msg.sender_id === user?.id}
                        time={new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    />
                ))}
                <div ref={bottomRef} className="h-2" />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-end space-x-2 sticky bottom-0 z-30 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
                <button type="button" className="p-3 text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors active:scale-95 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <Paperclip size={22} />
                </button>
                <div className="flex-1 min-h-[44px] bg-zinc-100 dark:bg-zinc-800/80 rounded-[20px] focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:bg-white dark:focus-within:bg-zinc-800 transition-all duration-200">
                    <input
                        className="w-full h-full bg-transparent border-transparent px-4 py-2.5 text-[15px] focus:outline-none text-zinc-900 dark:text-white placeholder-zinc-500"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-90 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
                >
                    <Send size={20} className={newMessage.trim() ? "translate-x-0.5" : ""} />
                </button>
            </form>
        </div>
    )
}
