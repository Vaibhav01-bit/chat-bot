import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Paperclip, MoreVertical, ShieldAlert, Ban, Smile, Gamepad2 } from 'lucide-react'
import { GameRoom } from '../components/game/GameRoom'
import { GameInvite } from '../components/game/GameInvite'
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
    const [partner, setPartner] = useState<{
        id: string,
        full_name: string,
        avatar_url?: string,
        username?: string,
        status?: 'online' | 'away' | 'offline',
        last_seen?: string,
        privacy_settings?: any
    } | null>(null)
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
    const [showGameRoom, setShowGameRoom] = useState(false)
    const [activeSessionId, setActiveSessionId] = useState<string | undefined>(undefined)
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
                .select('full_name, avatar_url, username, status, last_seen, privacy_settings')
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

                // Setup typing indicator presence AND profile status subscription
                setupPresence(partnerId)
                subscribeToProfileChanges(partnerId)
            }
        }

        fetchPartner()
    }, [chatId, user])

    const subscribeToProfileChanges = (partnerId: string) => {
        const channel = supabase.channel(`profile:${partnerId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${partnerId}`,
                },
                (payload) => {
                    setPartner(prev => prev ? { ...prev, ...payload.new } : null)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }

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
            <div className="flex flex-col h-[100dvh] bg-gradient-to-b from-[var(--chat-bg-gradient-start)] to-[var(--chat-bg-gradient-end)] relative overflow-hidden">
                {/* Ambient Background Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float delay-1000"></div>
                </div>

                {/* Main Split Layout Container */}
                <div className={`flex flex-col lg:flex-row h-full transition-all duration-500 ${showGameRoom ? 'lg:pl-0' : ''}`}>

                    {/* Game Panel (Left) */}
                    {showGameRoom && (
                        <div className="flex-none h-[50vh] lg:h-full lg:flex-1 order-1 lg:order-1 relative z-30 shadow-xl lg:shadow-none animate-fade-in border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800">
                            <GameRoom
                                chatId={chatId!}
                                sessionId={activeSessionId}
                                onClose={() => {
                                    setShowGameRoom(false)
                                    setActiveSessionId(undefined)
                                }}
                                opponentId={partner?.id}
                                onInvite={async (sessionId) => {
                                    await sendMessage(JSON.stringify({
                                        type: 'invite',
                                        sessionId,
                                        gameType: 'chess'
                                    }))
                                    setActiveSessionId(sessionId)
                                }}
                            />
                        </div>
                    )}

                    {/* Chat Panel (Right) - Becomes sidebar when game is active */}
                    <div className={`flex flex-col h-full bg-transparent transition-all duration-500 order-2 lg:order-2 relative
                        ${showGameRoom ? 'lg:w-96 lg:border-l border-zinc-200 dark:border-zinc-800' : 'flex-1 mx-auto w-full max-w-5xl shadow-2xl shadow-blue-500/5 my-0 lg:my-6 rounded-none lg:rounded-2xl border-x active-chat-container overflow-hidden'}`
                    }>
                        {/* Header */}
                        <div className={`sticky top-0 z-20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 pt-[env(safe-area-inset-top)] transition-all duration-300 w-full`}>
                            <div className={`flex items-center px-4 h-16 w-full ${showGameRoom ? 'max-w-none' : 'max-w-3xl mx-auto'}`}>
                                <button
                                    onClick={() => navigate('/')}
                                    className="mr-3 p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-all active:scale-95"
                                >
                                    <ArrowLeft size={22} />
                                </button>

                                <div className="flex items-center flex-1 min-w-0">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/10 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-lg border border-white/20 dark:border-white/10 shadow-sm mr-4 flex-shrink-0 animate-fade-in group hover:scale-105 transition-transform duration-300">
                                            {partner?.avatar_url ? (
                                                <img src={partner.avatar_url} alt={partner.full_name || 'Chat partner'} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <span>{partner?.full_name?.[0] || '?'}</span>
                                            )}
                                        </div>
                                        {isPartnerTyping || !partner ? null : (
                                            <span className="absolute bottom-0.5 right-4 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full animate-pulse-ring"></span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3
                                            className="font-semibold text-zinc-900 dark:text-white truncate leading-tight"
                                            style={{
                                                fontSize: 'var(--font-size-base)',
                                                fontFamily: 'var(--font-family-base)'
                                            }}
                                        >
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
                                            <p
                                                className="font-medium flex items-center mt-0.5 transition-colors"
                                                style={{ fontSize: 'calc(var(--font-size-base) * 0.85)' }}
                                            >
                                                {/* Privacy Check */}
                                                {partner?.privacy_settings?.online_status === 'hidden' ? (
                                                    <span className="text-zinc-400 dark:text-zinc-500">Last seen recently</span>
                                                ) : partner?.status === 'online' ? (
                                                    <>
                                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                                                        <span className="text-green-500">Online</span>
                                                    </>
                                                ) : partner?.status === 'away' ? (
                                                    <>
                                                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></span>
                                                        <span className="text-yellow-500">Away</span>
                                                    </>
                                                ) : (
                                                    <span className="text-zinc-400 dark:text-zinc-500">
                                                        {partner?.last_seen
                                                            ? `Last seen ${new Date(partner.last_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                                            : 'Offline'}
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Menu Actions */}
                                <div className="relative ml-2">
                                    <button
                                        onClick={() => setShowGameRoom(true)}
                                        className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 mr-1"
                                        title="Play Game"
                                    >
                                        <Gamepad2 size={22} className="text-purple-500" />
                                    </button>
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
                                <div className="flex flex-col items-center justify-center h-full text-zinc-400/50 dark:text-zinc-500/50 space-y-6 animate-fade-in select-none">
                                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-50 to-blue-100/50 dark:from-blue-900/10 dark:to-blue-800/10 flex items-center justify-center shadow-inner animate-pulse-ring" style={{ animationDuration: '4s' }}>
                                        <span className="text-4xl opacity-80 animate-pop">👋</span>
                                    </div>
                                    <div className="text-center space-y-1">
                                        <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">Say hello!</p>
                                        <p className="text-sm text-zinc-400 dark:text-zinc-500">Start the conversation</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-1 max-w-3xl mx-auto w-full">
                                    {messages.map((msg, index) => {
                                        const isMe = msg.sender_id === user?.id
                                        const showAvatar = !isMe && (index === 0 || messages[index - 1].sender_id !== msg.sender_id)
                                        return (
                                            <div key={msg.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                                                {msg.content.startsWith('{"type":"invite"') ? (
                                                    (() => {
                                                        try {
                                                            const parsed = JSON.parse(msg.content)
                                                            return (
                                                                <div className={`flex w-full mb-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                                    <GameInvite
                                                                        isMe={isMe}
                                                                        onAccept={() => {
                                                                            setActiveSessionId(parsed.sessionId)
                                                                            setShowGameRoom(true)
                                                                        }}
                                                                    />
                                                                </div>
                                                            )
                                                        } catch {
                                                            return <MessageBubble content="Invalid Invite" isMe={isMe} time="" messageId={msg.id} />
                                                        }
                                                    })()
                                                ) : (
                                                    <MessageBubble
                                                        content={msg.content}
                                                        isMe={isMe}
                                                        time={new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        avatarUrl={showAvatar ? partner?.avatar_url : undefined}
                                                        messageId={msg.id}
                                                    />
                                                )}
                                            </div>
                                        )
                                    })}

                                    {/* Typing Indicator Bubble */}
                                    {isPartnerTyping && (
                                        <div className="flex w-full mb-3 animate-slide-up">
                                            <div className="flex-shrink-0 mr-2 self-end mb-1">
                                                {partner?.avatar_url ? (
                                                    <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm border border-white/10 opacity-80">
                                                        <img src={partner.avatar_url} alt="Typing" className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 opacity-80" />
                                                )}
                                            </div>
                                            <div className="px-4 py-3 bg-white dark:bg-zinc-800 rounded-[1.25rem] rounded-bl-[0.25rem] shadow-sm border border-zinc-100 dark:border-zinc-700/50 flex items-center gap-1">
                                                <div className="typing-indicator scale-75 origin-left text-zinc-500 dark:text-zinc-400">
                                                    <span></span><span></span><span></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

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
                            <div className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300">
                                <form
                                    onSubmit={handleSend}
                                    className="max-w-3xl mx-auto w-full flex items-end gap-2"
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

                                    <div className="flex-1 glass-panel rounded-[2rem] shadow-lg shadow-black/5 focus-within:shadow-blue-500/20 focus-within:border-blue-500/30 transition-all duration-300 flex items-center relative overflow-visible min-h-[52px]">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => {
                                                setNewMessage(e.target.value)
                                                handleTyping()
                                            }}
                                            placeholder="Message..."
                                            className="w-full bg-transparent border-none pl-6 pr-12 py-3.5 text-[15px] focus:ring-0 placeholder:text-zinc-500/70 text-zinc-900 dark:text-white"
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
                                            className="absolute right-3 p-2 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-95 z-20"
                                            aria-label="Open emoji picker"
                                            title="Add emoji"
                                        >
                                            <Smile size={22} className="hover:animate-pop" />
                                        </button>

                                        {/* Simple Inline Emoji Picker */}
                                        {showEmojiPicker && (
                                            <div
                                                className="absolute bottom-full right-0 mb-4 w-80 bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-700 p-4 z-[9999] animate-scale-in origin-bottom-right"
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
                                                <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
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
                                        className="p-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 disabled:opacity-50 disabled:shadow-none disabled:scale-100 transition-all duration-300 active:scale-95 flex-shrink-0"
                                    >
                                        <Send size={20} className={newMessage.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''} />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
