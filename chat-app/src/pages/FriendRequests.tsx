import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, X, User } from 'lucide-react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export const FriendRequests = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const { showToast } = useToast()
    const [incoming, setIncoming] = useState<any[]>([])
    const [outgoing, setOutgoing] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRequests()

        // Real-time listener
        if (!user) return
        const channel = supabase.channel('friend_requests_updates')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'friend_requests',
                filter: `receiver_id=eq.${user.id}`
            }, () => {
                fetchRequests() // Simplest update strategy
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [user])

    const fetchRequests = async () => {
        if (!user) return

        // Fetch Incoming
        const { data: inc } = await supabase
            .from('friend_requests')
            .select('*, profiles!sender_id(*)')
            .eq('receiver_id', user.id)
            .eq('status', 'pending')

        setIncoming(inc || [])

        // Fetch Outgoing
        const { data: out } = await supabase
            .from('friend_requests')
            .select('*, profiles!receiver_id(*)')
            .eq('sender_id', user.id)
            .eq('status', 'pending')

        setOutgoing(out || [])
        setLoading(false)
    }

    const handleAccept = async (request: any) => {
        // 1. Update status
        const { error } = await supabase
            .from('friend_requests')
            .update({ status: 'accepted' })
            .eq('id', request.id)

        if (error) {
            showToast('Failed to accept request', 'error')
            return
        }

        // 2. Create Chat via RPC (safely adds both users)
        const { error: chatError } = await supabase.rpc('create_new_chat', {
            partner_id: request.sender_id
        })

        if (!chatError) {
            showToast(`You are now friends with ${request.profiles.username}`, 'success')
            fetchRequests()
        }
    }

    const handleDecline = async (id: string, isIncoming: boolean) => {
        const { error } = await supabase.from('friend_requests').delete().eq('id', id)
        if (error) {
            showToast('Action failed', 'error')
        } else {
            showToast(isIncoming ? 'Request declined' : 'Request cancelled', 'info')
            fetchRequests()
        }
    }

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-zinc-950">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center">
                <button onClick={() => navigate(-1)} className="mr-3 text-zinc-600 dark:text-zinc-400">
                    <ArrowLeft />
                </button>
                <h1 className="text-xl font-bold dark:text-white">Friend Requests</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {loading && <div className="text-center text-zinc-500">Loading...</div>}

                {!loading && incoming.length === 0 && outgoing.length === 0 && (
                    <div className="text-center text-zinc-500 mt-10">
                        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="text-zinc-400" size={32} />
                        </div>
                        <p>No pending requests.</p>
                    </div>
                )}

                {incoming.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-sm font-bold text-zinc-500 uppercase mb-3">Incoming ({incoming.length})</h2>
                        <div className="space-y-3">
                            {incoming.map(req => (
                                <div key={req.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden">
                                            {req.profiles.avatar_url && <img src={req.profiles.avatar_url} className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold dark:text-white">{req.profiles.full_name}</p>
                                            <p className="text-sm text-zinc-500">@{req.profiles.username}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleAccept(req)} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                                            <Check size={18} />
                                        </button>
                                        <button onClick={() => handleDecline(req.id, true)} className="p-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full hover:bg-zinc-300">
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {outgoing.length > 0 && (
                    <div>
                        <h2 className="text-sm font-bold text-zinc-500 uppercase mb-3">Sent ({outgoing.length})</h2>
                        <div className="space-y-3">
                            {outgoing.map(req => (
                                <div key={req.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl opacity-75">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden">
                                            {req.profiles.avatar_url && <img src={req.profiles.avatar_url} className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold dark:text-white">{req.profiles.full_name}</p>
                                            <p className="text-sm text-zinc-500">@{req.profiles.username}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDecline(req.id, false)} className="text-xs text-red-500 font-medium px-3 py-1 border border-red-200 rounded-full hover:bg-red-50">
                                        Cancel
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
