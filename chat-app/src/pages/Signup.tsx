import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { User, Mail, Lock, Calendar, Users, Loader2 } from 'lucide-react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { AuthLayout } from '../layouts/AuthLayout'

export const Signup = () => {
    const { user } = useAuth()
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        gender: 'prefer_not_to_say'
    })
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/chat')
        }
    }, [user, navigate])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
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

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match")
            return
        }
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.fullName,
                    dob: formData.dob,
                    gender: formData.gender
                }
            }
        })

        if (error) {
            setError(error.message)
        } else {
            navigate('/username-setup')
        }
        setLoading(false)
    }

    return (
        <AuthLayout>
            <Helmet>
                <title>Sign Up – ChatCat</title>
                <meta name="description" content="Create your ChatCat account and start chatting with friends in real-time." />
            </Helmet>

            <div className="text-center mb-8 animate-fade-in">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">Create Account</h1>
                <p className="text-gray-400 mt-2 text-sm font-medium">Join ChatCat today</p>
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
                    <span className="text-xs uppercase text-gray-500 font-medium tracking-wider">Or register with email</span>
                    <div className="h-px flex-1 bg-white/10"></div>
                </div>

                <form onSubmit={handleSignup} className="space-y-5">
                    <Input
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        icon={User}
                        placeholder="John Doe"
                    />
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        icon={Mail}
                        placeholder="you@example.com"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Date of Birth"
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                            icon={Calendar}
                            className="dark:[color-scheme:dark]"
                        />
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-200 mb-1.5 ml-1">
                                Gender
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <Users size={20} />
                                </div>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 pl-12 text-white focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500/50 sm:text-base hover:bg-white/10 hover:border-white/20 transition-all duration-200 appearance-none"
                                >
                                    <option value="male" className="bg-gray-800 text-white">Male</option>
                                    <option value="female" className="bg-gray-800 text-white">Female</option>
                                    <option value="other" className="bg-gray-800 text-white">Other</option>
                                    <option value="prefer_not_to_say" className="bg-gray-800 text-white">Prefer not to say</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        icon={Lock}
                        placeholder="••••••••"
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        icon={Lock}
                        placeholder="••••••••"
                    />

                    {error && (
                        <div className="text-red-200 text-sm text-center bg-red-500/10 p-3 rounded-xl border border-red-500/20 animate-scale-in backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full mt-2 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                        isLoading={loading}
                        disabled={googleLoading}
                    >
                        Sign Up
                    </Button>

                    <p className="text-center text-sm text-gray-500 mt-4 pt-2">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    )
}
