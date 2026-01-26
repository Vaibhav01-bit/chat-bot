import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Paperclip, MoreVertical, ShieldAlert, Ban, Smile } from 'lucide-react'
import { useMessages } from '../hooks/useMessages'
import { useAuth } from '../context/AuthContext'
import { MessageBubble } from '../components/MessageBubble'
import { useToast } from '../context/ToastContext'
import { PageTransition } from '../components/PageTransition'
import { safetyService } from '../services/safetyService'
import { supabase } from '../services/supabaseClient'
import { useStreaks } from '../hooks/useStreaks'

export const Chat = () => {
    const { chatId } = useParams<{ chatId: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { messages, loading, sendMessage } = useMessages(chatId!)
    const [newMessage, setNewMessage] = useState('')
    const [partner, setPartner] = useState<{ id: string, full_name: string, avatar_url?: string, username?: string } | null>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isBlocked, setIsBlocked] = useState(false)
    const [isPartnerTyping, setIsPartnerTyping] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { showToast } = useToast()
    const { updateStreak } = useStreaks()
    const typingTimeoutRef = useRef<number | null>(null)
    const presenceChannelRef = useRef<any>(null)

    useEffect(() => {
        if (!chatId || !user) return

        const fetchPartner = async () => {
            const { data: participants, error } = await supabase
                .from('chat_participants')
                .select('user_id')
                .eq('chat_id', chatId)
                .neq('user_id', user.id)
                .single()

            if (error || !participants) {
                console.error('Error fetching chat partner:', error)
                return
            }

            const partnerId = participants.user_id

            const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name, avatar_url, username')
                .eq('id', partnerId)
                .single()

            if (profileData) {
                setPartner({ ...profileData, id: partnerId })

                // Check if user is blocked (either direction)
                const { data: blockData } = await supabase
                    .from('blocked_users')
                    .select('id')
                    .or(`and(blocker_id.eq.${user.id},blocked_id.eq.${partnerId}),and(blocker_id.eq.${partnerId},blocked_id.eq.${user.id})`)
                    .limit(1)

                // Set blocked status if any block record exists
                setIsBlocked(!!(blockData && blockData.length > 0))

                // Setup typing indicator presence
                setupPresence(partnerId)
            }
        }

        fetchPartner()
    }, [chatId, user])

    const handleBlockToggle = async () => {
        if (!partner) return
        try {
            if (isBlocked) {
                await safetyService.unblockUser(partner.id)
                setIsBlocked(false)
                showToast('User unblocked', 'success')
            } else {
                if (window.confirm(`Are you sure you want to block ${partner.full_name}?`)) {
                    await safetyService.blockUser(partner.id)
                    setIsBlocked(true)
                    showToast('User blocked', 'success')
                    navigate('/')
                }
            }
            setIsMenuOpen(false)
        } catch (err) {
            showToast('Failed to update block status', 'error')
        }
    }

    const handleReport = async () => {
        if (!partner) return
        const reason = window.prompt('Reason for reporting (harassment, spam, etc):')
        if (reason) {
            try {
                await safetyService.reportUser(partner.id, reason)
                showToast('User reported.', 'success')
            } catch (err) {
                showToast('Failed to submit report', 'error')
            }
            setIsMenuOpen(false)
        }
    }

    const setupPresence = (partnerId: string) => {
        if (!chatId || !user) return

        const channel = supabase.channel(`chat:${chatId}:presence`)
        presenceChannelRef.current = channel

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState()
                const partnerPresence = Object.values(state).find(
                    (presence: any) => presence[0]?.user_id === partnerId
                ) as any
                setIsPartnerTyping(partnerPresence?.[0]?.typing || false)
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({ user_id: user.id, typing: false })
                }
            })

        return () => {
            if (presenceChannelRef.current) {
                supabase.removeChannel(presenceChannelRef.current)
            }
        }
    }

    const handleTyping = async () => {
        if (!presenceChannelRef.current || !user) return

        // Track typing
        await presenceChannelRef.current.track({ user_id: user.id, typing: true })

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        // Stop typing after 3 seconds of inactivity
        typingTimeoutRef.current = setTimeout(async () => {
            if (presenceChannelRef.current) {
                await presenceChannelRef.current.track({ user_id: user.id, typing: false })
            }
        }, 3000)
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        try {
            await sendMessage(newMessage)
            setNewMessage('')
            // Update daily streak
            await updateStreak()
        } catch (err: any) {
            showToast(`Failed to send: ${err.message || 'Unknown error'}`, 'error')
        }
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !user || !chatId) return

        if (file.size > 10 * 1024 * 1024) {
            showToast('File size must be less than 10MB', 'error')
            return
        }

        setIsUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}/${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('chat-images')
                .upload(fileName, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('chat-images')
                .getPublicUrl(fileName)

            await sendMessage('Sent an image', 'image', publicUrl)
            await updateStreak()
        } catch (err: any) {
            showToast(`Failed to upload: ${err.message || 'Unknown error'}`, 'error')
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    return (
        <PageTransition>
            <div className="flex flex-col h-[100dvh] bg-zinc-50 dark:bg-zinc-950 relative">
                {/* Header */}
                <div className="sticky top-0 z-20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 pt-[env(safe-area-inset-top)] transition-all duration-300">
                    <div className="flex items-center px-4 h-16 max-w-3xl mx-auto w-full">
                        <button
                            onClick={() => navigate('/')}
                            className="mr-3 p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-all active:scale-95"
                        >
                            <ArrowLeft size={22} />
                        </button>

                        <div className="flex items-center flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm border border-white/20 dark:border-white/10 shadow-sm mr-3 flex-shrink-0">
                                {partner?.avatar_url ? (
                                    <img src={partner.avatar_url} alt={partner.full_name || 'Chat partner'} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span>{partner?.full_name?.[0] || '?'}</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-zinc-900 dark:text-white truncate text-[15px] leading-tight">
                                    {partner?.full_name || 'Chat'}
                                </h3>
                                {isPartnerTyping ? (
                                    <p className="text-xs text-blue-500 font-medium flex items-center mt-0.5">
                                        <span className="typing-indicator mr-1.5">
                                            <span></span><span></span><span></span>
                                        </span>
                                        typing...
                                    </p>
                                ) : (
                                    <p className="text-xs text-green-500 font-medium flex items-center mt-0.5">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                                        Online
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Menu Actions */}
                        <div className="relative ml-2">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                            >
                                <MoreVertical size={20} />
                            </button>

                            {isMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-100 dark:border-zinc-700 py-1 z-20 overflow-hidden">
                                        <button
                                            onClick={handleReport}
                                            className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700/50 flex items-center text-zinc-700 dark:text-zinc-300"
                                        >
                                            <ShieldAlert size={16} className="mr-2" />
                                            Report User
                                        </button>
                                        <button
                                            onClick={handleBlockToggle}
                                            className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center text-red-600"
                                        >
                                            <Ban size={16} className="mr-2" />
                                            {isBlocked ? 'Unblock User' : 'Block User'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth overscroll-contain pb-24">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 text-blue-600/50"></div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-500 space-y-4 animate-fade-in">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                                <Send size={32} className="opacity-20" />
                            </div>
                            <p className="text-sm font-medium">No messages yet. Say hello!</p>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-1 max-w-3xl mx-auto w-full">
                            {messages.map((msg, index) => {
                                const isMe = msg.sender_id === user?.id
                                const showAvatar = !isMe && (index === 0 || messages[index - 1].sender_id !== msg.sender_id)
                                return (
                                    <div key={msg.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                                        <MessageBubble
                                            content={msg.content}
                                            isMe={isMe}
                                            time={new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            avatarUrl={showAvatar ? partner?.avatar_url : undefined}
                                            messageId={msg.id}
                                        />
                                    </div>
                                )
                            })}
                            <div ref={bottomRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                {isBlocked ? (
                    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-200/50 dark:border-zinc-800/50 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] transition-all duration-300 text-center">
                        <p className="text-zinc-500 text-sm mb-3">You have blocked this user.</p>
                        <button
                            onClick={handleBlockToggle}
                            className="text-red-600 font-medium text-sm hover:underline"
                        >
                            Unblock to send message
                        </button>
                    </div>
                ) : (
                    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-200/50 dark:border-zinc-800/50 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] transition-all duration-300">
                        <form
                            onSubmit={handleSend}
                            className="max-w-3xl mx-auto w-full flex items-end gap-2 p-2"
                        >
                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {/* Attachment Button */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="p-3 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-95 flex-shrink-0 disabled:opacity-50"
                                title="Attach image"
                            >
                                {isUploading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                ) : (
                                    <Paperclip size={22} />
                                )}
                            </button>

                            <div className="flex-1 bg-zinc-100 dark:bg-black/20 rounded-[1.25rem] border border-transparent focus-within:border-blue-500/30 focus-within:bg-white dark:focus-within:bg-zinc-900 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-200 overflow-visible min-h-[48px] flex items-center relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => {
                                        setNewMessage(e.target.value)
                                        handleTyping()
                                    }}
                                    placeholder="Message..."
                                    className="w-full bg-transparent border-none pl-5 pr-12 py-3 text-[15px] focus:ring-0 placeholder:text-zinc-400 text-zinc-900 dark:text-white"
                                />

                                {/* Emoji Picker Button */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        console.log('Emoji button clicked!')
                                        setShowEmojiPicker(!showEmojiPicker)
                                    }}
                                    className="absolute right-2 p-2 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-95 z-20"
                                    aria-label="Open emoji picker"
                                    title="Add emoji"
                                >
                                    <Smile size={20} />
                                </button>

                                {/* Simple Inline Emoji Picker */}
                                {showEmojiPicker && (
                                    <div
                                        className="fixed bottom-20 right-4 w-80 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border-2 border-blue-500 p-4 z-[9999]"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Pick an Emoji</h3>
                                            <button
                                                type="button"
                                                onClick={() => setShowEmojiPicker(false)}
                                                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-400"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
                                            {['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🔥', '✨', '⭐', '🌟', '💫', '💥', '💢', '💦', '💨', '🕊', '🦋', '🐝', '🐞', '🦗', '🕷', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿', '🦔', '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🥝', '🍅', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧃', '🧉', '🧊', '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '⛸', '🥌', '🎿', '⛷', '🏂', '🏋️', '🤼', '🤸', '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏊', '🤽', '🚣', '🧗', '🚴', '🚵', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🎻', '🎲', '🎯', '🎳', '🎮', '🎰', '🧩', '✅', '❌', '⭕', '🔥', '💯', '💢', '💬', '💭', '🗯', '💤', '💮', '♨️', '💈', '🛑', '⛔', '📛', '🚫', '💯', '💢', '🔞', '⚠️', '🚸', '⚡', '🌈', '⭐', '🌟', '✨', '⚡', '🔥', '💥', '💫', '💦', '💨', '☁️', '🌤', '⛅', '🌥', '☁️', '🌦', '🌧', '⛈', '🌩', '🌨', '❄️', '☃️', '⛄', '🌬', '💨', '💧', '💦', '☔', '☂️', '🌊', '🌫'].map((emoji, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => {
                                                        console.log('Emoji selected:', emoji)
                                                        const input = inputRef.current
                                                        if (input) {
                                                            const start = input.selectionStart || 0
                                                            const end = input.selectionEnd || 0
                                                            const newValue = newMessage.substring(0, start) + emoji + newMessage.substring(end)
                                                            setNewMessage(newValue)
                                                            setTimeout(() => {
                                                                input.focus()
                                                                const newPos = start + emoji.length
                                                                input.setSelectionRange(newPos, newPos)
                                                            }, 0)
                                                        }
                                                        setShowEmojiPicker(false)
                                                    }}
                                                    className="text-2xl hover:bg-blue-100 dark:hover:bg-blue-900/30 p-2 rounded transition-all hover:scale-125 cursor-pointer"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="p-3 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none disabled:bg-zinc-200 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600 transition-all duration-200 active:scale-90 flex-shrink-0 hover:rotate-[-10deg]"
                            >
                                <Send size={20} className={newMessage.trim() ? 'translate-x-[2px] -translate-y-[1px]' : ''} />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </PageTransition>
    )
}
