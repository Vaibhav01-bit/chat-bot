import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Clock } from 'lucide-react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { PageTransition } from '../components/PageTransition'

export const Status = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [statuses, setStatuses] = useState<any[]>([])

    useEffect(() => {
        const fetchStatuses = async () => {
            const { data } = await supabase
                .from('statuses')
                .select('*, profiles(full_name, avatar_url, username)')
                .gt('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false })

            setStatuses(data || [])
        }
        fetchStatuses()
    }, [])

    const myStatus = statuses.find(s => s.user_id === user?.id)
    const friendStatuses = statuses.filter(s => s.user_id !== user?.id)

    return (
        <PageTransition>
            <div className="flex flex-col h-full bg-white dark:bg-[var(--background)]">
                {/* Header */}
                <div className="px-6 pt-8 pb-6">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Status
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                                Share moments that fade in 24h
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/status/post')}
                            className="bg-zinc-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-full font-semibold text-sm shadow-lg shadow-zinc-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Plus size={18} />
                            <span>Create</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-24">
                    {/* My Status Section */}
                    <section className="mb-8">
                        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">My Status</h2>
                        <div
                            onClick={() => navigate(myStatus ? `/status/${user?.id}` : '/status/post')}
                            className="group relative h-28 bg-zinc-50 dark:bg-[var(--card)] rounded-3xl p-4 flex items-center gap-4 cursor-pointer border border-zinc-100 dark:border-zinc-800/50 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-[2px]">
                                    <div className="w-full h-full rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                                        {myStatus?.media_url ? (
                                            <img src={myStatus.media_url} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                </div>
                                {!myStatus && (
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white dark:border-[var(--card)] flex items-center justify-center text-white">
                                        <Plus size={14} strokeWidth={3} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-zinc-900 dark:text-white text-lg">My Story</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {myStatus ? 'Click to view' : 'Tap to add an update'}
                                </p>
                            </div>
                            {myStatus && (
                                <div className="flex items-center text-zinc-400 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                                    Active
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Recent Updates */}
                    <section>
                        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Recent Updates</h2>

                        {friendStatuses.length === 0 ? (
                            <div className="text-center py-12 opacity-50">
                                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="text-zinc-400" />
                                </div>
                                <p className="text-zinc-500 dark:text-zinc-400">No recent updates from friends</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {friendStatuses.map((status, i) => (
                                    <div
                                        key={status.id}
                                        onClick={() => navigate(`/status/${status.user_id}`)}
                                        className="group relative aspect-[9/16] rounded-3xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 animate-scale-in"
                                        style={{ animationDelay: `${i * 100}ms` }}
                                    >
                                        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800">
                                            {status.media_url ? (
                                                <img src={status.media_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-black p-4 text-center">
                                                    <p className="text-white text-sm font-medium">{status.content}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 opacity-60 group-hover:opacity-80 transition-opacity" />

                                        {/* Metadata */}
                                        <div className="absolute bottom-4 left-4 right-4 animate-slide-up">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full border border-white/30 p-[1px]">
                                                    <img
                                                        src={status.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${status.user_id}`}
                                                        className="w-full h-full rounded-full object-cover bg-zinc-800"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-bold text-sm truncate leading-tight">
                                                        {status.profiles?.full_name}
                                                    </p>
                                                    <p className="text-white/60 text-xs font-medium">
                                                        {new Date(status.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </PageTransition>
    )
}
