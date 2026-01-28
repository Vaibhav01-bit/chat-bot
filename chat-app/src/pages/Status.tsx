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
            <div className="flex flex-col h-full bg-[var(--background)]">
                {/* Header */}
                <div className="px-6 pt-8 pb-6">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-tertiary)] bg-clip-text text-transparent">
                                Status
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                                Share moments that fade in 24h
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/status/post')}
                            className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-tertiary)] text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all active:scale-95 flex items-center gap-2"
                            style={{
                                boxShadow: '0 -2px 8px rgba(255,255,255,0.2), 0 6px 16px rgba(107,138,255,0.3), inset 0 1px 0 rgba(255,255,255,0.25)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 -3px 12px rgba(255,255,255,0.25), 0 10px 24px rgba(107,138,255,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 -2px 8px rgba(255,255,255,0.2), 0 6px 16px rgba(107,138,255,0.3), inset 0 1px 0 rgba(255,255,255,0.25)'
                            }}
                        >
                            <Plus size={18} />
                            <span>Create</span>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-24">
                    {/* My Status Section */}
                    <section className="mb-8">
                        <h2 className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4">My Status</h2>
                        <div
                            onClick={() => navigate(myStatus ? `/status/${user?.id}` : '/status/post')}
                            className="group relative h-28 rounded-[24px] p-5 flex items-center gap-4 cursor-pointer border border-zinc-200/60 dark:border-zinc-700/50 bg-white dark:bg-[var(--clay-surface)] transition-all duration-200 active:scale-[0.98]"
                            style={{
                                boxShadow: '0 -2px 8px rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.25)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 -3px 12px rgba(255,255,255,0.5), 0 8px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.3)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 -2px 8px rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.25)'
                            }}
                        >
                            <div className="relative">
                                <div className="w-16 h-16 rounded-[20px] overflow-hidden"
                                    style={{
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
                                    }}>
                                    <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800">
                                        {myStatus?.media_url ? (
                                            <img src={myStatus.media_url} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                </div>
                                {!myStatus && (
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-tertiary)] rounded-full border-2 border-white dark:border-[var(--clay-surface)] flex items-center justify-center text-white"
                                        style={{
                                            boxShadow: '0 2px 8px rgba(107,138,255,0.4)'
                                        }}>
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
                                <div className="flex items-center text-zinc-400 text-xs font-medium px-3 py-1.5 rounded-full"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
                                        boxShadow: '0 2px 6px rgba(34, 197, 94, 0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
                                    }}>
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
                                        className="group relative aspect-[9/16] rounded-[24px] overflow-hidden cursor-pointer transition-all duration-300 animate-scale-in active:scale-95"
                                        style={{
                                            animationDelay: `${i * 100}ms`,
                                            boxShadow: '0 -2px 8px rgba(255,255,255,0.4), 0 6px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)'
                                            e.currentTarget.style.boxShadow = '0 -3px 12px rgba(255,255,255,0.5), 0 12px 28px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)'
                                            e.currentTarget.style.boxShadow = '0 -2px 8px rgba(255,255,255,0.4), 0 6px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)'
                                        }}
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
