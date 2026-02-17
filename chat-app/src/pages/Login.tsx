import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { AuthLayout } from '../layouts/AuthLayout'

export const Login = () => {
    const { user } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/chat')
        }
    }, [user, navigate])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
        } else {
            navigate('/')
        }
        setLoading(false)
    }

    const handleGoogleLogin = async () => {
        setGoogleLoading(true)
        setError(null)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/chat`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            })
            if (error) throw error
        } catch (err: any) {
            console.error('Google Auth Error:', err)
            setError(err.message || 'Failed to connect with Google. Please try again.')
            setGoogleLoading(false)
        }
    }

    return (
        <AuthLayout>
            {/* ... (Helmet unchanged) */}
            <Helmet>
                <title>Login – ChatCat</title>
                <meta name="description" content="Sign in to ChatCat to access your chats, statuses, and connect with friends in real-time." />
            </Helmet>

            <div className="text-center mb-6 animate-fade-in">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">Welcome Back</h1>
                <p className="text-gray-400 mt-2 text-sm font-medium">Sign in to continue to ChatCat</p>
            </div>

            <div className="space-y-6 animate-slide-up delay-100">
                {/* Google Login Button */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={googleLoading || loading}
                    className="w-full relative flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white/20 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-black/20"
                >
                    {googleLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                    ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                    )}
                    <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
                    {!googleLoading && (
                        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5 pointer-events-none" />
                    )}
                </button>

                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/10"></div>
                    <span className="text-xs uppercase text-gray-500 font-medium tracking-wider">Or</span>
                    <div className="h-px flex-1 bg-white/10"></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            icon={Mail}
                            placeholder="you@example.com"
                            disabled={loading || googleLoading}
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            icon={Lock}
                            placeholder="••••••••"
                            disabled={loading || googleLoading}
                        />
                    </div>

                    {error && (
                        <div className="text-red-200 text-sm text-center bg-red-500/10 p-3 rounded-xl border border-red-500/20 animate-scale-in backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                        isLoading={loading}
                        disabled={googleLoading}
                    >
                        Sign In
                    </Button>

                    <p className="text-center text-sm text-gray-500 pt-2">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    )
}
