import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { supabase } from '../services/supabaseClient'


export const Status = () => {
    const navigate = useNavigate()
    const [statuses, setStatuses] = useState<any[]>([])

    useEffect(() => {
        const fetchStatuses = async () => {
            // Fetch simplified list (one per user, latest)
            // For MVP, just fetching all active
            const { data } = await supabase
                .from('statuses')
                .select('*, profiles(full_name, avatar_url, username)')
                .gt('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false })

            // Group by user? For now just list them.
            // Ideally we should group by user_id so clicking opens that user's story.
            // We'll simplistic list for now.
            setStatuses(data || [])
        }
        fetchStatuses()
    }, [])

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Status</h1>
            </div>

            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto">
                {/* My Status / Add Status */}
                <div
                    onClick={() => navigate('/status/post')}
                    className="relative aspect-[9/16] bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden cursor-pointer group"
                >
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                            <Plus className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium">Add Status</span>
                    </div>
                </div>

                {statuses.map(status => (
                    <div
                        key={status.id}
                        onClick={() => navigate(`/ status / ${status.user_id} `)}
                        className="relative aspect-[9/16] bg-gray-200 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    >
                        {status.media_url ? (
                            <img src={status.media_url} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-white p-2 text-center text-sm">
                                {status.content}
                            </div>
                        )}
                        <div className="absolute bottom-2 left-2 flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-zinc-200 border border-white overflow-hidden">
                                {status.profiles?.avatar_url && <img src={status.profiles.avatar_url} />}
                            </div>
                            <span className="text-xs text-white font-medium drop-shadow-md truncate max-w-[80px]">
                                {status.profiles?.full_name}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

