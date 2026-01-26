import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, X, RefreshCw, AlertCircle } from 'lucide-react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { MessageBubble } from '../components/MessageBubble'

export const RandomChat = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    // State Machine: 'idle' | 'searching' | 'connected' | 'ended'
    const [status, setStatus] = useState<'idle' | 'searching' | 'connected' | 'ended'>('idle')

    // Session Data
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [partnerId, setPartnerId] = useState<string | null>(null)
    const [messages, setMessages] = useState<any[]>([])
    const [input, setInput] = useState('')
    const [timeLeft, setTimeLeft] = useState(60) // Queue timeout
    const [endReason, setEndReason] = useState<string>('')

    const bottomRef = useRef<HTMLDivElement>(null)
    const queueChannelRef = useRef<any>(null)
    const sessionChannelRef = useRef<any>(null)

    // Cleanup on unmount or status change to 'idle'
    useEffect(() => {
        return () => {
            cleanupSubscriptions()
            if (status === 'searching') {
                leaveQueue()
            }
        }
    }, [])

    const cleanupSubscriptions = async () => {
        if (queueChannelRef.current) await supabase.removeChannel(queueChannelRef.current)
        if (sessionChannelRef.current) await supabase.removeChannel(sessionChannelRef.current)
        queueChannelRef.current = null
        sessionChannelRef.current = null
    }

    const leaveQueue = async () => {
        if (!user) return
        await supabase.from('random_chat_queue').delete().eq('user_id', user.id)
    }

    // 1. START SEARCH
    const startSearch = async () => {
        if (!user) return
        setStatus('searching')
        setMessages([])
        setSessionId(null)
        setPartnerId(null)
        setTimeLeft(60)

        // Polling loop for match check
        const matchPoll = setInterval(async () => {
            await fetchActiveSession()
        }, 3000)

        try {
            // Call Match Engine
            const { data, error } = await supabase.rpc('match_users')

            if (error) throw error

            const result = data as any

            if (result.status === 'matched') {
                clearInterval(matchPoll)
                handleMatchFound(result.session_id, result.partner_id)
            } else {
                subscribeToQueue()
                // Keep polling in background via the interval above
                // We'll clear it when status changes
            }
        } catch (err) {
            console.error('Matching error:', err)
            setStatus('idle')
            clearInterval(matchPoll)
        }
    }

    // 2. SUBSCRIBE TO QUEUE (Realtime)
    const subscribeToQueue = () => {
        const channel = supabase.channel(`queue:${user?.id}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'random_chat_queue',
                filter: `user_id=eq.${user?.id}`
            }, (payload) => {
                if (payload.new.status === 'matched') {
                    fetchActiveSession()
                }
            })
            .subscribe()

        queueChannelRef.current = channel
    }

    // Queue Timer
    useEffect(() => {
        let timer: any
        if (status === 'searching') {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleTimeout()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [status])

    const handleTimeout = async () => {
        setStatus('idle')
        await leaveQueue()
        alert("No match found. Please try again.")
    }

    const fetchActiveSession = async () => {
        if (!user) return
        const { data } = await supabase.from('random_chat_sessions')
            .select('*')
            .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
            .eq('status', 'active')
            .order('started_at', { ascending: false })
            .limit(1)
            .single()

        if (data) {
            const startTime = new Date(data.started_at).getTime()
            if (Date.now() - startTime < 60000) {
                const partner = data.user1_id === user.id ? data.user2_id : data.user1_id
                handleMatchFound(data.id, partner)
            }
        }
    }

    const handleMatchFound = (sid: string, pid: string) => {
        cleanupSubscriptions()
        setSessionId(sid)
        setPartnerId(pid)
        setStatus('connected')
        subscribeToSession(sid)
    }

    // 3. CONNECTED SESSION
    const subscribeToSession = async (sid: string) => {
        // 1. Initial Fetch (Important for history!)
        await fetchMessages(sid)

        // 2. Realtime
        const channel = supabase.channel(`session:${sid}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'random_chat_messages',
                filter: `session_id=eq.${sid}`
            }, (payload) => {
                setMessages(prev => {
                    if (prev.some(m => m.id === payload.new.id)) return prev
                    return [...prev, payload.new]
                })
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'random_chat_sessions',
                filter: `id=eq.${sid}`
            }, (payload) => {
                if (payload.new.status === 'ended') {
                    setStatus('ended')
                    setEndReason('Chat ended.')
                    cleanupSubscriptions()
                }
            })
            .subscribe()
        sessionChannelRef.current = channel
    }

    const fetchMessages = async (sid: string) => {
        const { data } = await supabase.from('random_chat_messages')
            .select('*')
            .eq('session_id', sid)
            .order('created_at', { ascending: true })

        if (data) {
            setMessages(prev => {
                const unique = new Map()
                prev.forEach(m => unique.set(m.id, m))
                data.forEach(m => unique.set(m.id, m))
                return Array.from(unique.values()).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            })
        }
    }

    // Message Polling Fallback (Every 3s)
    useEffect(() => {
        let interval: any
        if (status === 'connected' && sessionId) {
            interval = setInterval(() => {
                fetchMessages(sessionId)
            }, 3000)
        }
        return () => clearInterval(interval)
    }, [status, sessionId])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || !user || !sessionId) return

        if (input.length > 500) {
            alert("Message too long (max 500 chars)")
            return
        }

        const tempId = crypto.randomUUID()
        const newMessage = {
            id: tempId,
            session_id: sessionId,
            sender_id: user.id,
            receiver_id: partnerId,
            content: input.trim(),
            created_at: new Date().toISOString()
        }

        setMessages(prev => [...prev, newMessage])
        setInput('')

        const { data, error } = await supabase.from('random_chat_messages').insert({
            session_id: sessionId,
            sender_id: user.id,
            receiver_id: partnerId,
            content: newMessage.content
        }).select().single()

        if (error) {
            console.error('Send failed:', error)
            setMessages(prev => prev.filter(m => m.id !== tempId))
            if (error.message.includes('Session time limit')) {
                setStatus('ended')
                setEndReason('Time limit reached')
            }
        } else {
            setMessages(prev => prev.map(m => m.id === tempId ? data : m))
        }
    }

    const handleDisconnect = async () => {
        if (!confirm("Are you sure you want to disconnect?")) return
        if (!sessionId) return

        await supabase.from('random_chat_sessions').update({
            status: 'ended',
            ended_by: user?.id,
            ended_at: new Date().toISOString()
        }).eq('id', sessionId)

        setStatus('ended')
        setEndReason('You disconnected')
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className="flex flex-col h-screen bg-zinc-50 dark:bg-black">
            {/* Header */}
            <div className="p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={() => { leaveQueue(); navigate(-1); }} className="mr-3 text-zinc-600 dark:text-zinc-400">
                        <ArrowLeft />
                    </button>
                    <div>
                        <h1 className="font-bold text-lg dark:text-white">Random Chat</h1>
                        {status === 'connected' && <span className="text-xs text-green-500">● Connected</span>}
                    </div>
                </div>
                {status === 'connected' && (
                    <button onClick={handleDisconnect} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center relative">

                {/* IDLE */}
                {status === 'idle' && (
                    <div className="text-center max-w-sm">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20">
                            <RefreshCw size={40} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 dark:text-white">Meet Someone New</h2>
                        <p className="text-zinc-500 mb-8 leading-relaxed">
                            Connect instantly with a random user.
                            <br />Chat is anonymous and ends when you say so.
                        </p>
                        <button
                            onClick={startSearch}
                            className="w-full bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:bg-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Start Searching
                        </button>
                    </div>
                )}

                {/* SEARCHING */}
                {status === 'searching' && (
                    <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-8">
                            <div className="absolute inset-0 border-4 border-zinc-200 dark:border-zinc-800 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-xl dark:text-white">
                                {timeLeft}s
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 dark:text-white">Finding a partner...</h3>
                        <p className="text-zinc-500 mb-8">Please wait while we match you.</p>
                        <button
                            onClick={() => { leaveQueue(); setStatus('idle'); }}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-6 py-2 rounded-full transition-colors"
                        >
                            Cancel Search
                        </button>
                    </div>
                )}

                {/* ENDED */}
                {status === 'ended' && (
                    <div className="text-center bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl max-w-sm w-full border border-zinc-100 dark:border-zinc-800">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} className="text-zinc-500" />
                        </div>
                        <h2 className="text-xl font-bold mb-2 dark:text-white">Chat Ended</h2>
                        <p className="text-zinc-500 mb-6">{endReason || 'Session disconnected'}</p>
                        <button
                            onClick={startSearch}
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all mb-3"
                        >
                            Find New Partner
                        </button>
                        <button
                            onClick={() => navigate('/search')}
                            className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-6 py-3 rounded-xl font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                        >
                            Go Back
                        </button>
                    </div>
                )}

                {/* CONNECTED MESSAGES */}
                {status === 'connected' && (
                    <div className="w-full h-full flex flex-col justify-start absolute inset-0 p-4 pb-24 overflow-y-auto">
                        <div className="max-w-2xl mx-auto w-full space-y-4">
                            <div className="text-center py-4">
                                <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs px-3 py-1 rounded-full">
                                    You're connected! Say Hi 👋
                                </span>
                            </div>

                            {messages.map((msg, i) => (
                                <MessageBubble
                                    key={msg.id || i}
                                    content={msg.content}
                                    isMe={msg.sender_id === user?.id}
                                    time={new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                />
                            ))}
                            <div ref={bottomRef} />
                        </div>
                    </div>
                )}
            </div>

            {/* INPUT AREA */}
            {status === 'connected' && (
                <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 z-10">
                    <form onSubmit={handleSend} className="max-w-2xl mx-auto flex space-x-2">
                        <div className="flex-1 relative">
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-full pl-5 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                                disabled={status !== 'connected'}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
                                {input.length}/500
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={!input.trim() || status !== 'connected'}
                            className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:transform-none transition-all transform hover:scale-105 shadow-lg shadow-blue-600/20"
                        >
                            <Send size={20} className="ml-0.5" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}
