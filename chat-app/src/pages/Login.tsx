import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../services/supabaseClient'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { AuthLayout } from '../layouts/AuthLayout'

export const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

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

    return (
        <AuthLayout>
            <Helmet>
                <title>Login – ChatMate</title>
                <meta name="description" content="Sign in to ChatMate to access your chats, statuses, and connect with friends in real-time." />
                <meta property="og:title" content="Login – ChatMate" />
                <meta property="og:description" content="Sign in to ChatMate to access your chats, statuses, and connect with friends." />
                <link rel="canonical" href="https://chatmate.vercel.app/login" />
            </Helmet>

            <div className="text-center mb-8 animate-fade-in">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Welcome Back</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm z-10">Sign in to continue to ChatMate</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5 animate-slide-up delay-100">
                <div className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="bg-zinc-50 dark:bg-zinc-900/50"
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="bg-zinc-50 dark:bg-zinc-900/50"
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/50 animate-scale-in">
                        {error}
                    </div>
                )}

                <Button type="submit" className="w-full py-3 text-[15px] font-semibold shadow-blue-500/20 active:scale-[0.98]" isLoading={loading}>
                    Sign In
                </Button>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                        Sign up
                    </Link>
                </p>
            </form>
        </AuthLayout>
    )
}
