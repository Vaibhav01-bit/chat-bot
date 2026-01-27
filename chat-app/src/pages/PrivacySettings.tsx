import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, Eye } from 'lucide-react'

import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export const PrivacySettings = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { showToast } = useToast()
    const [loading, setLoading] = useState(true)
    const [privacy, setPrivacy] = useState<{ online_status: 'everyone' | 'hidden' }>({ online_status: 'everyone' })

    useEffect(() => {
        if (!user) return
        const fetchSettings = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('privacy_settings')
                .eq('id', user.id)
                .single()

            if (data?.privacy_settings) {
                setPrivacy(data.privacy_settings)
            }
            setLoading(false)
        }
        fetchSettings()
    }, [user])

    const updatePrivacy = async (key: string, value: string) => {
        if (!user) return
        const newPrivacy = { ...privacy, [key]: value }
        setPrivacy(newPrivacy) // Optimistic update

        const { error } = await supabase
            .from('profiles')
            .update({ privacy_settings: newPrivacy })
            .eq('id', user.id)

        if (error) {
            showToast('Failed to update settings', 'error')
            // Revert state if needed (skipped for simplicity)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
    )

    return (
        <div className="p-4">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-3 text-zinc-600 dark:text-zinc-400"><ArrowLeft /></button>
                <h1 className="text-xl font-bold dark:text-white">Privacy</h1>
            </div>

            <div className="space-y-6">
                <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl">
                    <h3 className="font-semibold mb-2 flex items-center dark:text-white"><Eye size={18} className="mr-2" /> Profile Visibility</h3>
                    <p className="text-sm text-zinc-500 mb-4">Who can see your profile details?</p>

                    <div className="space-y-3">
                        <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                            <div className="flex items-center justify-center w-5 h-5">
                                <input
                                    type="radio"
                                    name="online_status"
                                    checked={privacy.online_status === 'everyone'}
                                    onChange={() => updatePrivacy('online_status', 'everyone')}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="dark:text-white font-medium">Share Online Status</span>
                                <span className="text-xs text-zinc-500">Let friends see when you're online</span>
                            </div>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                            <div className="flex items-center justify-center w-5 h-5">
                                <input
                                    type="radio"
                                    name="online_status"
                                    checked={privacy.online_status === 'hidden'}
                                    onChange={() => updatePrivacy('online_status', 'hidden')}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="dark:text-white font-medium">Hide Online Status</span>
                                <span className="text-xs text-zinc-500">Don't show my online status</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl">
                    <h3 className="font-semibold mb-2 flex items-center dark:text-white"><Lock size={18} className="mr-2" /> Blocked Users</h3>
                    <p className="text-sm text-zinc-500">Manage users you have blocked.</p>
                    <button className="mt-2 text-blue-600 font-medium text-sm">View Blocked List</button>
                </div>
            </div>
        </div>
    )
}
