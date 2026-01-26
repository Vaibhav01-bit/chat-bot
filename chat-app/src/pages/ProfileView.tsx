import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageSquare } from 'lucide-react'
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

    if (loading) return <div className="p-4 text-center">Loading...</div>
    if (!profile) return <div className="p-4 text-center">User not found</div>

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
            <div className="p-4 flex items-center">
                <button onClick={() => navigate(-1)} className="mr-4 text-zinc-600 dark:text-zinc-400">
                    <ArrowLeft />
                </button>
                <h1 className="text-xl font-bold dark:text-white">Profile</h1>
            </div>

            <div className="flex flex-col items-center p-8">
                <div className="w-32 h-32 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden mb-4 border-4 border-white dark:border-zinc-900 shadow-xl">
                    {profile.avatar_url && <img src={profile.avatar_url} className="w-full h-full object-cover" />}
                </div>
                <h2 className="text-2xl font-bold dark:text-white">{profile.full_name}</h2>
                <p className="text-zinc-500">@{profile.username}</p>

                {profile.bio && (
                    <p className="mt-4 text-center text-zinc-600 dark:text-zinc-300 max-w-xs">
                        {profile.bio}
                    </p>
                )}

                <div className="mt-6 flex space-x-4">
                    {currentUser?.id !== profile.id && (
                        <button
                            onClick={handleChat}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition"
                        >
                            <MessageSquare size={20} />
                            <span>Message</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="px-6 py-4">
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                        <span className="text-zinc-500">Gender</span>
                        <span className="font-medium dark:text-white capitalize">{profile.gender || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-zinc-500">Joined</span>
                        <span className="font-medium dark:text-white">{new Date(profile.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
