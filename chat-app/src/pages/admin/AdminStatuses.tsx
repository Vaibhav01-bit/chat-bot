import { useState, useEffect } from 'react'
import { Trash2, Eye, AlertTriangle } from 'lucide-react'
import { supabase } from '../../services/supabaseClient'

export const AdminStatuses = () => {
    const [statuses, setStatuses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStatuses()
    }, [])

    const fetchStatuses = async () => {
        setLoading(true)
        try {
            // Fetch statuses with creator info
            const { data, error } = await supabase
                .from('statuses')
                .select('*, profiles(username, full_name, avatar_url)')
                .order('created_at', { ascending: false })

            if (error) throw error
            setStatuses(data || [])
        } catch (error) {
            console.error('Error fetching statuses:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Permanently delete this status? This cannot be undone.')) return

        try {
            const { error } = await supabase.from('statuses').delete().eq('id', id)
            if (error) throw error
            setStatuses(prev => prev.filter(s => s.id !== id))
        } catch (err) {
            console.error('Error deleting status:', err)
            alert('Failed to delete status')
        }
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Status Feed Moderation</h2>
                    <p className="text-slate-400">Review and remove inappropriate content ({statuses.length} active)</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-500">Loading feed...</div>
            ) : statuses.length === 0 ? (
                <div className="text-center py-20 bg-slate-950 rounded-2xl border border-slate-800">
                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Eye className="text-slate-600" />
                    </div>
                    <h3 className="text-slate-300 font-medium">No active statuses</h3>
                    <p className="text-slate-500 text-sm mt-1">The feed is clean.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {statuses.map((status) => (
                        <div key={status.id} className="group relative aspect-[9/16] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-md hover:border-slate-600 transition-all">
                            {/* Media Content */}
                            {status.media_url ? (
                                status.media_type === 'video' ? (
                                    <video src={status.media_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <img src={status.media_url} alt="Status" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                )
                            ) : (
                                <div className="w-full h-full flex items-center justify-center p-4 text-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
                                    <p className="text-white font-medium text-sm line-clamp-4">"{status.content || 'No Content'}"</p>
                                </div>
                            )}

                            {/* Overlay Info */}
                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-700 overflow-hidden ring-1 ring-white/20">
                                        {status.profiles?.avatar_url && <img src={status.profiles.avatar_url} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-white truncate">{status.profiles?.username || 'Unknown'}</p>
                                        <p className="text-[10px] text-slate-300">{new Date(status.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Actions */}
                            <div className="absolute top-2 right-2 flex space-x-1 opacity-100 transition-all">
                                <button
                                    onClick={() => handleDelete(status.id)}
                                    className="p-2 bg-red-600/90 hover:bg-red-500 text-white rounded-full shadow-lg backdrop-blur-sm transition-transform hover:scale-110"
                                    title="Delete Content"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
