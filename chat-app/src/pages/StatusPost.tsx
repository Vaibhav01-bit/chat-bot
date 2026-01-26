import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'

export const StatusPost = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [caption, setCaption] = useState('')
    const [loading, setLoading] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0]
            setFile(f)
            setPreview(URL.createObjectURL(f))
        }
    }

    const handlePost = async () => {
        if (!file || !user) return
        setLoading(true)

        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('status_media')
            .upload(fileName, file)

        if (uploadError) {
            console.error(uploadError)
            setLoading(false)
            return
        }

        const { data: { publicUrl } } = supabase.storage
            .from('status_media')
            .getPublicUrl(fileName)

        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 24)

        await supabase.from('statuses').insert({
            user_id: user.id,
            content: caption,
            media_url: publicUrl,
            expires_at: expiresAt.toISOString()
        })

        setLoading(false)
        navigate('/status')
    }

    if (!preview) {
        return (
            <div className="flex flex-col h-screen bg-black text-white items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-4">Select an image</h2>
                    <label className="bg-blue-600 px-6 py-3 rounded-xl cursor-pointer hover:bg-blue-700 transition">
                        Choose from Gallery
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                    <button onClick={() => navigate(-1)} className="block mt-8 text-zinc-500 hover:text-white">Cancel</button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen bg-black">
            <div className="flex-1 relative flex items-center justify-center bg-zinc-900">
                <img src={preview} className="max-h-full max-w-full object-contain" />
                <button
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute top-4 left-4 p-2 bg-black/50 rounded-full text-white"
                >
                    <X />
                </button>
            </div>

            <div className="p-4 bg-zinc-900 border-t border-zinc-800">
                <div className="flex items-end gap-2">
                    <textarea
                        value={caption}
                        onChange={e => setCaption(e.target.value)}
                        placeholder="Add a caption..."
                        className="flex-1 bg-zinc-800 text-white rounded-xl p-3 resize-none focus:outline-none min-h-[50px] max-h-[100px]"
                        rows={2}
                    />
                    <Button
                        onClick={handlePost}
                        isLoading={loading}
                        className="rounded-full w-12 h-12 flex items-center justify-center p-0 flex-shrink-0 bg-blue-600 hover:bg-blue-700"
                    >
                        <Check />
                    </Button>
                </div>
            </div>
        </div>
    )
}
