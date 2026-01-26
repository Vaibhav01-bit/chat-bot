import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/Input'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import { useToast } from '../context/ToastContext'

export const SearchUsers = () => {
    const [query, setQuery] = useState('')
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { user } = useAuth()
    const { showToast } = useToast()

    useEffect(() => {
        if (!query.trim()) {
            setUsers([])
            return
        }

        const searchUsers = async () => {
            setLoading(true)
            const { data } = await supabase
                .from('profiles')
                .select('*')
                // Basic text search. For exact ID search, user must paste exact UUID.
                .or(`username.ilike.%${query}%,full_name.ilike.%${query}%${/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(query) ? `,id.eq.${query}` : ''}`)
                .neq('id', user?.id)
                .limit(10)

            setUsers(data || [])
            setLoading(false)
        }

        const timeout = setTimeout(searchUsers, 500)
        return () => clearTimeout(timeout)
    }, [query, user])

    const handleMessage = async (partnerId: string) => {
        if (!user) return

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
        }
    }

    return (
        <div className="flex flex-col h-[100dvh] bg-white dark:bg-zinc-950">
            <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center space-x-2 sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl z-20 pt-[calc(0.75rem+env(safe-area-inset-top))]">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2.5 -ml-1 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors active:scale-95"
                >
                    <ArrowLeft size={22} />
                </button>
                <div className="flex-1 bg-zinc-100 dark:bg-zinc-900 rounded-full px-4 py-2.5 flex items-center transition-all focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:bg-white dark:focus-within:bg-zinc-800">
                    <Input
                        className="bg-transparent border-none p-0 h-auto focus:ring-0 text-[15px] placeholder-zinc-500 w-full"
                        placeholder="Search by username or name..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Random Chat Card */}
                {!query && (
                    <div
                        onClick={() => navigate('/random')}
                        className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 text-white mb-6 cursor-pointer shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl"></div>

                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <h2 className="text-xl font-bold mb-1.5 tracking-tight">Random Chat</h2>
                                <p className="text-blue-100/90 text-sm font-medium">Connect with someone new instantly</p>
                            </div>
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/10 group-hover:rotate-12 transition-transform duration-300">
                                <span className="text-3xl filter drop-shadow-md">🎲</span>
                            </div>
                        </div>
                    </div>
                )}

                {loading && <div className="text-center text-zinc-500 mt-8 animate-pulse text-sm font-medium">Searching profiles...</div>}

                {users.map(u => (
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

                        <button
                            onClick={() => handleMessage(u.id)}
                            className="p-3 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-500/20 transition-all active:scale-95"
                        >
                            <MessageSquare size={20} className="stroke-[2.5px]" />
                        </button>
                    </div>
                ))}

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
