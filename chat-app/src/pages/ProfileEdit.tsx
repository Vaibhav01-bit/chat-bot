import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

export const ProfileEdit = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        bio: '',
        gender: '',
        dob: ''
    })

    useEffect(() => {
        if (!user) return
        supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
            if (data) {
                setFormData({
                    full_name: data.full_name || '',
                    username: data.username || '',
                    bio: data.bio || '',
                    gender: data.gender || '',
                    dob: data.dob || ''
                })
            }
        })
    }, [user])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        setLoading(true)

        await supabase.from('profiles').update(formData).eq('id', user.id)

        setLoading(false)
        navigate('/settings') // Go back to settings menu
    }

    return (
        <div className="p-4 max-w-lg mx-auto">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-3 text-zinc-600 dark:text-zinc-400"><ArrowLeft /></button>
                <h1 className="text-2xl font-bold dark:text-white">Edit Profile</h1>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
                <Input label="Full Name" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
                <Input label="Username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} disabled />

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Bio</label>
                    <textarea
                        className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white border-transparent focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        value={formData.bio}
                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input type="date" label="Date of Birth" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Gender</label>
                        <select
                            className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white border-transparent focus:ring-2 focus:ring-blue-500"
                            value={formData.gender}
                            onChange={e => setFormData({ ...formData, gender: e.target.value })}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                    </div>
                </div>

                <Button type="submit" isLoading={loading} className="w-full flex items-center justify-center">
                    <Save size={18} className="mr-2" /> Save Changes
                </Button>
            </form>
        </div>
    )
}
