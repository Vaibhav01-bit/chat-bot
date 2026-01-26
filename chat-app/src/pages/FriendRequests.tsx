import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, X, Clock, UserPlus } from 'lucide-react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow } from 'date-fns'

interface FriendRequest {
    id: string
    sender_id: string
    receiver_id: string
    status: string
    created_at: string
    expires_at: string
    sender?: {
        id: string
        username: string
        full_name: string
        avatar_url: string
    }
    receiver?: {
        id: string
        username: string
        full_name: string
        avatar_url: string
    }
}

export const FriendRequests = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [incoming, setIncoming] = useState<FriendRequest[]>([])
    const [sent, setSent] = useState<FriendRequest[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return
        fetchRequests()

        // Real-time subscription
        const channel = supabase
            .channel(`friend_requests:${user.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'friend_requests',
                filter: `receiver_id=eq.${user.id}`
            }, () => {
                fetchRequests()
            })
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'friend_requests',
                filter: `sender_id=eq.${user.id}`
            }, () => {
                fetchRequests()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user])

    const fetchRequests = async () => {
        if (!user) return

        // Incoming requests
        const { data: incomingData } = await supabase
            .from('friend_requests')
            .select('*, sender:profiles!friend_requests_sender_id_fkey(id, username, full_name, avatar_url)')
            .eq('receiver_id', user.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })

        // Sent requests
        const { data: sentData } = await supabase
            .from('friend_requests')
            .select('*, receiver:profiles!friend_requests_receiver_id_fkey(id, username, full_name, avatar_url)')
            .eq('sender_id', user.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })

        setIncoming(incomingData || [])
        setSent(sentData || [])
        setLoading(false)
    }

    const handleAccept = async (requestId: string, senderId: string) => {
        if (!user) return

        try {
            // 1. Create friendship
            await supabase.from('friends').insert({
                user1_id: user.id,
                user2_id: senderId
            })

            // 2. Update request status
            await supabase
                .from('friend_requests')
                .update({ status: 'accepted' })
                .eq('id', requestId)

            // 3. Create permanent chat
            const { data: existingChat } = await supabase
                .from('chats')
                .select('id')
                .or(`and(user1_id.eq.${user.id},user2_id.eq.${senderId}),and(user1_id.eq.${senderId},user2_id.eq.${user.id})`)
                .eq('is_group', false)
                .single()

            if (!existingChat) {
                const { data: newChat } = await supabase
                    .from('chats')
                    .insert({
                        user1_id: user.id,
                        user2_id: senderId,
                        is_group: false
                    })
                    .select()
                    .single()

                if (newChat) {
                    await supabase
                        .from('chat_participants')
                        .insert([
                            { chat_id: newChat.id, user_id: user.id },
                            { chat_id: newChat.id, user_id: senderId }
                        ])
                }
            }

            // Remove from UI
            setIncoming(prev => prev.filter(r => r.id !== requestId))
        } catch (error) {
            console.error('Error accepting request:', error)
        }
    }

    const handleReject = async (requestId: string) => {
        await supabase
            .from('friend_requests')
            .update({
                status: 'rejected',
                rejected_at: new Date().toISOString()
            })
            .eq('id', requestId)

        setIncoming(prev => prev.filter(r => r.id !== requestId))
    }

    const handleCancelSent = async (requestId: string) => {
        await supabase
            .from('friend_requests')
            .delete()
            .eq('id', requestId)

        setSent(prev => prev.filter(r => r.id !== requestId))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen bg-zinc-50 dark:bg-black">
            {/* Header */}
            <div className="p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="mr-3 text-zinc-600 dark:text-zinc-400">
                        <ArrowLeft />
                    </button>
                    <div>
                        <h1 className="font-bold text-lg dark:text-white">Friend Requests</h1>
                        <p className="text-xs text-zinc-500">
                            {incoming.length} incoming · {sent.length} sent
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-20">
                {/* Incoming Requests */}
                <div className="mb-8">
                    <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center">
                        <UserPlus size={16} className="mr-2" />
                        Incoming ({incoming.length})
                    </h2>

                    {incoming.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserPlus className="text-zinc-400" size={24} />
                            </div>
                            <p className="text-zinc-500 text-sm">No incoming requests</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {incoming.map((request) => (
                                <div
                                    key={request.id}
                                    className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3 flex-1">
                                            <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                                                {request.sender?.avatar_url ? (
                                                    <img
                                                        src={request.sender.avatar_url}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold">
                                                        {request.sender?.username?.[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-zinc-900 dark:text-white">
                                                    {request.sender?.full_name || request.sender?.username}
                                                </div>
                                                <div className="text-sm text-zinc-500">
                                                    @{request.sender?.username}
                                                </div>
                                                <div className="text-xs text-zinc-400 flex items-center mt-1">
                                                    <Clock size={12} className="mr-1" />
                                                    {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleAccept(request.id, request.sender_id)}
                                                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all hover:scale-110 active:scale-95"
                                                title="Accept"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleReject(request.id)}
                                                className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all hover:scale-110 active:scale-95"
                                                title="Reject"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sent Requests */}
                <div>
                    <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">
                        Sent ({sent.length})
                    </h2>

                    {sent.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <p className="text-zinc-500 text-sm">No sent requests</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {sent.map((request) => (
                                <div
                                    key={request.id}
                                    className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3 flex-1">
                                            <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                                                {request.receiver?.avatar_url ? (
                                                    <img
                                                        src={request.receiver.avatar_url}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold">
                                                        {request.receiver?.username?.[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-zinc-900 dark:text-white">
                                                    {request.receiver?.full_name || request.receiver?.username}
                                                </div>
                                                <div className="text-sm text-zinc-500">
                                                    @{request.receiver?.username}
                                                </div>
                                                <div className="text-xs text-zinc-400 flex items-center mt-1">
                                                    <Clock size={12} className="mr-1" />
                                                    Pending · {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleCancelSent(request.id)}
                                            className="px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
