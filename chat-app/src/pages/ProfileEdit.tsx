import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Image as ImageIcon, Grid, UploadCloud } from 'lucide-react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { AvatarSelectionGrid } from '../components/AvatarSelectionGrid'
import { ImageCropper } from '../components/ImageCropper'

export const ProfileEdit = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [avatarMode, setAvatarMode] = useState<'image' | 'preset'>('image')

    // Cropper State
    const [selectedFile, setSelectedFile] = useState<string | null>(null)
    const [isCropperOpen, setIsCropperOpen] = useState(false)

    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        bio: '',
        gender: '',
        dob: '',
        avatar_url: '',
        custom_avatar_url: '' // To store the uploaded photo separately
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
                    dob: data.dob || '',
                    avatar_url: data.avatar_url || '',
                    custom_avatar_url: data.custom_avatar_url || data.avatar_url || ''
                })
                setAvatarMode(data.avatar_mode || 'image')
            }
        })
    }, [user])

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setSelectedFile(reader.result?.toString() || null)
                setIsCropperOpen(true)
            })
            reader.readAsDataURL(file)
        }
    }

    const onCropComplete = async (croppedBlob: Blob) => {
        setIsCropperOpen(false)
        setIsUploading(true)
        if (!user) return

        try {
            const fileName = `avatar_${user.id}_${Date.now()}.jpg`
            const { error } = await supabase.storage
                .from('avatars')
                .upload(fileName, croppedBlob)

            if (error) {
                throw error
            }

            const { data: publicUrlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName)

            const publicUrl = publicUrlData.publicUrl

            setFormData(prev => ({
                ...prev,
                custom_avatar_url: publicUrl
            }))

            // Auto-switch to photo mode
            setAvatarMode('image')

        } catch (error: any) {
            console.error('Error uploading avatar:', error)
            alert('Error uploading image. Make sure "avatars" bucket exists in Supabase Storage and is public.')
        } finally {
            setIsUploading(false)
            setSelectedFile(null)
            // Reset input value to allow re-selecting same file
            const fileInput = document.getElementById('avatar-upload') as HTMLInputElement
            if (fileInput) fileInput.value = ''
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        setLoading(true)

        const updates = {
            ...formData,
            avatar_mode: avatarMode,
            // If in preset mode, avatar_url is the preset. If in image mode, it's the custom one.
            avatar_url: avatarMode === 'preset' ? formData.avatar_url : formData.custom_avatar_url
        }

        const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)

        setLoading(false)
        if (!error) {
            navigate('/settings')
        } else {
            console.error('Error saving profile:', error)
            alert('Failed to save profile. Did you run the database migration?')
        }
    }

    return (
        <div className="p-4 max-w-lg mx-auto pb-20">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-3 text-zinc-600 dark:text-zinc-400"><ArrowLeft /></button>
                <h1 className="text-2xl font-bold dark:text-white">Edit Profile</h1>
            </div>

            <form onSubmit={handleSave} className="space-y-6">

                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 ring-4 ring-white dark:ring-zinc-800 shadow-xl">
                            {/* Preview logic: show preset if mode is preset, else show custom */}
                            {/* Preview logic: show preset if mode is preset, else show custom */}
                            <img
                                src={avatarMode === 'preset' ? formData.avatar_url : formData.custom_avatar_url}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150')}
                            />
                        </div>
                        <div className="absolute inset-0 rounded-full ring-2 ring-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                        {avatarMode === 'image' && (
                            <button
                                type="button"
                                onClick={() => document.getElementById('avatar-upload')?.click()}
                                className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 transition-all hover:scale-110 active:scale-95"
                            >
                                <UploadCloud size={20} />
                            </button>
                        )}
                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            className="hidden"
                            onChange={onFileSelect}
                        />
                    </div>

                    {/* Check if Cropper should be open */}
                    {isCropperOpen && selectedFile && (
                        <ImageCropper
                            imageSrc={selectedFile}
                            onClose={() => setIsCropperOpen(false)}
                            onCropComplete={onCropComplete}
                        />
                    )}

                    {/* Toggle Control */}
                    <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-full w-full max-w-xs">
                        <button
                            type="button"
                            onClick={() => setAvatarMode('image')}
                            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-full text-sm font-medium transition-all ${avatarMode === 'image'
                                ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white'
                                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                                }`}
                        >
                            <ImageIcon size={16} className="mr-2" />
                            Photo
                        </button>
                        <button
                            type="button"
                            onClick={() => setAvatarMode('preset')}
                            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-full text-sm font-medium transition-all ${avatarMode === 'preset'
                                ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white'
                                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                                }`}
                        >
                            <Grid size={16} className="mr-2" />
                            Avatars
                        </button>
                    </div>

                    {/* Mode Specific Content */}
                    <div className="w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800">
                        {avatarMode === 'image' ? (
                            <div className="text-center py-4">
                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    Upload a custom photo
                                </p>
                                <p className="text-xs text-zinc-500 mb-4">
                                    Click the upload icon on your profile picture to select a file from your device.
                                </p>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => document.getElementById('avatar-upload')?.click()}
                                    className="mx-auto"
                                >
                                    <UploadCloud size={16} className="mr-2" />
                                    Select Image
                                </Button>
                                {isUploading && <p className="text-xs text-blue-500 mt-2 animate-pulse">Uploading...</p>}
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 text-center">
                                    Choose an Avatar
                                </label>
                                <AvatarSelectionGrid
                                    selectedAvatar={formData.avatar_url}
                                    onSelect={(url) => setFormData({ ...formData, avatar_url: url })}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <Input label="Full Name" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
                    <Input label="Username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} disabled />

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Bio</label>
                        <textarea
                            className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white border-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
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
                                className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white border-transparent focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
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
                </div>

                <Button type="submit" isLoading={loading} className="w-full flex items-center justify-center py-3 text-base">
                    <Save size={20} className="mr-2" /> Save Changes
                </Button>
            </form>
        </div>
    )
}
