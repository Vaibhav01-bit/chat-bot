import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { supabase } from '../services/supabaseClient'
import { StatusReactions } from '../components/StatusReactions'

export const StatusView = () => {
    const { userId } = useParams<{ userId: string }>()
    const navigate = useNavigate()
    const [statuses, setStatuses] = useState<any[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUserStatuses = async () => {
            if (!userId) return

            const { data } = await supabase
                .from('statuses')
                .select('*, profiles(full_name, avatar_url)')
                .eq('user_id', userId)
                .gt('expires_at', new Date().toISOString())
                .order('created_at', { ascending: true })

            if (data && data.length > 0) {
                setStatuses(data)
            } else {
                navigate('/status') // No active statuses
            }
            setLoading(false)
        }
        fetchUserStatuses()
    }, [userId, navigate])

    useEffect(() => {
        if (statuses.length === 0) return

        const timer = setTimeout(() => {
            if (currentIndex < statuses.length - 1) {
                setCurrentIndex(prev => prev + 1)
            } else {
                navigate('/status') // Finished all
            }
        }, 5000) // 5 seconds per status

        return () => clearTimeout(timer)
    }, [currentIndex, statuses, navigate])

    const handleNext = () => {
        if (currentIndex < statuses.length - 1) {
            setCurrentIndex(prev => prev + 1)
        } else {
            navigate('/status')
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
        }
    }

    if (loading) return <div className="bg-black h-screen flex items-center justify-center text-white">Loading...</div>
    if (statuses.length === 0) return null

    const currentStatus = statuses[currentIndex]

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            {/* Progress Bar */}
            <div className="absolute top-2 left-2 right-2 flex space-x-1 z-20">
                {statuses.map((_, idx) => (
                    <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-white transition-all duration-300 ${idx < currentIndex ? 'w-full' : idx === currentIndex ? 'w-full animate-progress' : 'w-0'}`}
                            style={{ transitionDuration: idx === currentIndex ? '5000ms' : '0ms' }}
                        />
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-20 text-white">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-white/20">
                        {currentStatus.profiles.avatar_url && <img src={currentStatus.profiles.avatar_url} />}
                    </div>
                    <div>
                        <p className="font-semibold text-sm shadow-md">{currentStatus.profiles.full_name}</p>
                        <p className="text-xs opacity-70">{new Date(currentStatus.created_at).toLocaleTimeString()}</p>
                    </div>
                </div>
                <button onClick={() => navigate('/status')} className="p-2">
                    <X />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center relative bg-zinc-900">
                <img src={currentStatus.media_url} className="max-h-full max-w-full object-contain" />
                {currentStatus.content && (
                    <div className="absolute bottom-32 left-0 right-0 p-4 text-center bg-gradient-to-t from-black/80 to-transparent pt-20">
                        <p className="text-white text-lg font-medium">{currentStatus.content}</p>
                    </div>
                )}
            </div>

            {/* Status Reactions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/95 to-transparent z-20">
                <StatusReactions statusId={currentStatus.id} statusOwnerId={currentStatus.user_id} />
            </div>

            {/* Navigation Areas (invisible) */}
            <div className="absolute inset-y-0 left-0 w-1/4 z-10" onClick={(e) => { e.stopPropagation(); handlePrev(); }} />
            <div className="absolute inset-y-0 right-0 w-1/4 z-10" onClick={(e) => { e.stopPropagation(); handleNext(); }} />
        </div>
    )
}
