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
        <div className="flex flex-col h-screen bg-white dark:bg-zinc-950">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center space-x-3">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-zinc-600 dark:text-zinc-400">
                    <ArrowLeft />
                </button>
                <div className="flex-1">
                    <Input
                        placeholder="Search username or name..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {/* Random Chat Card */}
                {!query && (
                    <div
                        onClick={() => navigate('/random')}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white mb-6 cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold mb-1">Random Chat</h2>
                                <p className="text-blue-100">Connect with someone new instantly</p>
                            </div>
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <span className="text-2xl">🎲</span>
                            </div>
                        </div>
                    </div>
                )}

                {loading && <div className="text-center text-zinc-500 mt-4">Searching...</div>}

                {users.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl mb-3">
                        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate(`/profile/${u.id}`)}>
                            <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                                {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : null}
                            </div>
                            <div>
                                <p className="font-semibold text-zinc-900 dark:text-white">{u.full_name}</p>
                                <p className="text-sm text-zinc-500">@{u.username}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => handleMessage(u.id)}
                            className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 transition-colors"
                        >
                            <MessageSquare size={20} />
                        </button>
                    </div>
                ))}

                {!loading && users.length === 0 && query && (
                    <div className="text-center text-zinc-500 mt-10">No users found.</div>
                )}
            </div>
        </div>
    )
}
