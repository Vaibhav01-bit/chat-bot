import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageSquare, Calendar, User } from 'lucide-react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'

export const ProfileView = () => {
    const { userId } = useParams<{ userId: string }>()
    const navigate = useNavigate()
    const { user: currentUser } = useAuth()
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId!)
                .single()
            setProfile(data)
            setLoading(false)
        }
        fetchProfile()
    }, [userId])

    const handleChat = async () => {
        if (!currentUser || !profile) return

        const { data: chatId, error } = await supabase.rpc('get_or_create_dm', {
            partner_id: profile.id
        })

        if (chatId) {
            navigate(`/chat/${chatId}`)
        } else {
            console.error('Error opening chat:', error)
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0b0c15]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    )

    if (!profile) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0b0c15]">
            <div className="text-center">
                <h2 className="text-xl font-semibold dark:text-white">User not found</h2>
                <button onClick={() => navigate(-1)} className="mt-4 text-blue-500 hover:underline">Go back</button>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-white dark:bg-[#0b0c15] text-zinc-900 dark:text-zinc-100 font-sans pb-20 overflow-x-hidden">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-20 px-4 py-3 flex items-center justify-between bg-white/80 dark:bg-[#0b0c15]/80 backdrop-blur-xl border-b border-zinc-100 dark:border-white/5">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors text-zinc-600 dark:text-zinc-400"
                >
                    <ArrowLeft size={22} />
                </button>
                <span className="text-sm font-semibold tracking-wide uppercase opacity-0 animate-fade-in">Profile</span>
                <div className="w-8" />
            </div>

            {/* Hero Section */}
            <div className="pt-28 px-6 flex flex-col items-center relative animate-slide-up">
                {/* Background Decor */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

                {/* Avatar Ring */}
                <div className="relative group mb-6">
                    <div className="absolute -inset-0.5 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                    <div className="relative w-32 h-32 rounded-full ring-4 ring-white dark:ring-[#0b0c15] overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-2xl">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-700">
                                <span className="text-4xl">?</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Name & Bio */}
                <h1 className="text-3xl font-bold tracking-tight text-center dark:text-white mb-1">
                    {profile.full_name}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-6">@{profile.username}</p>

                {profile.bio && (
                    <div className="mb-8 max-w-xs text-center">
                        <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-[15px]">
                            {profile.bio}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="w-full max-w-xs flex gap-3 mb-12">
                    {currentUser?.id !== profile.id && (
                        <button
                            onClick={handleChat}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-3.5 font-semibold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/25 hover:shadow-blue-900/40"
                        >
                            <MessageSquare size={18} strokeWidth={2.5} />
                            <span>Message</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Info Grid */}
            <div className="px-6 max-w-md mx-auto animate-slide-up delay-200" style={{ animationFillMode: 'both' }}>
                <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4 pl-1">Details</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-5 rounded-2xl bg-white dark:bg-[#151821] border border-zinc-100 dark:border-white/5 shadow-sm flex flex-col gap-3 transition-colors hover:border-blue-500/30">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-0.5">Joined</p>
                            <p className="text-sm font-semibold dark:text-zinc-200">
                                {new Date(profile.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-[#151821] border border-zinc-100 dark:border-white/5 shadow-sm flex flex-col gap-3 transition-colors hover:border-purple-500/30">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-0.5">Gender</p>
                            <p className="text-sm font-semibold dark:text-zinc-200 capitalize">
                                {profile.gender || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
