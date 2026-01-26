import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { AuthLayout } from '../layouts/AuthLayout'
import { useAuth } from '../context/AuthContext'

export const UsernameSetup = () => {
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const { user } = useAuth()

    const handleUsernameSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)
        setError(null)

        // Check availability (simplistic check, real check can be via function or unique constraint error)
        // We'll rely on unique constraint for MVP
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ username: username })
            .eq('id', user.id)

        if (updateError) {
            if (updateError.code === '23505') { // Unique violation
                setError('Username is already taken')
            } else {
                setError(updateError.message)
            }
        } else {
            navigate('/')
        }
        setLoading(false)
    }

    return (
        <AuthLayout>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Choose Username</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Pick a unique username to identify yourself</p>
            </div>

            <form onSubmit={handleUsernameSubmit} className="space-y-6">
                <Input
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} // Basic sanitization
                    required
                    placeholder="username"
                    minLength={3}
                />

                {error && <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900">{error}</div>}

                <Button type="submit" className="w-full" isLoading={loading}>
                    Continue
                </Button>
            </form>
        </AuthLayout>
    )
}
