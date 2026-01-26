import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/Input'
import { ArrowLeft, MessageSquare, RefreshCw, UserPlus } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/Button'
import { friendService } from '../services/friendService'

export const SearchUsers = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const { showToast } = useToast()

    const [query, setQuery] = useState('')
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        const searchUsers = async () => {
            if (!query.trim()) {
                setUsers([])
                return
            }

            setLoading(true)
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .ilike('username', `%${query}%`)
                    .neq('id', user?.id)
                    .limit(20)

                if (error) throw error
                setUsers(data || [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        const timeout = setTimeout(searchUsers, 500)
        return () => clearTimeout(timeout)
    }, [query, user])

    const handleMessage = async (partnerId: string) => {
        if (!user || actionLoading) return
        setActionLoading(partnerId)

        try {
            const { data: chatId, error } = await supabase.rpc('get_or_create_dm', { partner_id: partnerId })

            if (error) {
                console.error('Error creating DM:', error)
                showToast(error.message, 'error')
                return
            }

            if (chatId) {
                navigate(`/chat/${chatId}`)
            }
        } catch (err) {
            console.error(err)
            showToast('Failed to open chat', 'error')
        } finally {
            setActionLoading(null)
        }
    }

    const handleAddFriend = async (userId: string) => {
        if (!user) return
        try {
            await friendService.sendFriendRequest(userId)
            showToast('Friend request sent!', 'success')
        } catch (err: any) {
            showToast(err.message, 'error')
        }
    }

    return (
        <div className="flex flex-col h-[100dvh] bg-white dark:bg-zinc-950">
            <div className="px-4 pt-4 pb-2 border-b border-zinc-100 dark:border-zinc-900 sticky top-0 bg-white dark:bg-zinc-950 z-10">
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-zinc-900 dark:text-white" />
                    </button>
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-white">New Chat</h1>
                </div>
                <Input
                    placeholder="Search users by username..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-zinc-100 dark:bg-zinc-900 border-transparent dark:border-zinc-800"
                    autoFocus
                />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <Button
                    variant="secondary"
                    className="w-full flex items-center justify-between p-4 h-auto bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800 shadow-sm"
                    onClick={() => navigate('/random')}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <RefreshCw size={20} />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-zinc-900 dark:text-white">Random Chat</p>
                            <p className="text-xs text-zinc-500">Meet someone new instantly</p>
                        </div>
                    </div>
                </Button>

                <div className="space-y-2">
                    {query && <p className="text-sm font-medium text-zinc-500 px-1">Search Results</p>}

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" />
                        </div>
                    ) : (
                        users.map(u => (
                            <div key={u.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group">
                                <div className="flex items-center space-x-3.5 cursor-pointer flex-1" onClick={() => navigate(`/profile/${u.id}`)}>
                                    <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden ring-2 ring-white dark:ring-zinc-900 shadow-sm">
                                        {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover transition-transform group-hover:scale-105" /> : null}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-zinc-900 dark:text-white text-[15px]">{u.full_name}</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">@{u.username}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAddFriend(u.id)}
                                        className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
                                        title="Add Friend"
                                    >
                                        <UserPlus size={20} className="stroke-[2.5px]" />
                                    </button>
                                    <button
                                        onClick={() => handleMessage(u.id)}
                                        disabled={actionLoading === u.id}
                                        className="p-3 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                                        title="Send Message"
                                    >
                                        {actionLoading === u.id ? (
                                            <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                                        ) : (
                                            <MessageSquare size={20} className="stroke-[2.5px]" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {!loading && users.length === 0 && query && (
                    <div className="flex flex-col items-center justify-center mt-20 text-zinc-400 space-y-2">
                        <div className="text-4xl">🔍</div>
                        <p className="text-sm">No users found used "{query}"</p>
                    </div>
                )}
            </div>
        </div>
    )
}
