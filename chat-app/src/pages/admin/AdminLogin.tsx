import { useState } from 'react'
import { Shield, Lock, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../../services/supabaseClient'

export const AdminLogin = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const cleanUsername = username.trim()
        const cleanPassword = password.trim()

        try {
            console.log('Attempting login for:', cleanUsername)

            // Secure Login via Edge Function
            const { data, error } = await supabase.functions.invoke('admin-auth', {
                body: { email: cleanUsername, password: cleanPassword }
            })

            console.log('Login Response:', { data, error })

            if (error) {
                alert('Supabase Error: ' + JSON.stringify(error))
                throw error
            }
            if (data?.error) {
                alert('API Error: ' + data.error)
                throw new Error(data.error)
            }

            // Success
            // Store with expiration (1 hour)
            const tokenData = {
                token: data.token,
                role: data.role,
                expiresAt: Date.now() + (60 * 60 * 1000)
            }
            localStorage.setItem('admin_session', JSON.stringify(tokenData))

            // Legacy/Direct checks might need these, but we rely on admin_session mostly now
            // keeping for compatibility if other components check these directly, 
            // but fundamentally we should move to getAdminSession()
            localStorage.setItem('admin_token', data.token)
            localStorage.setItem('admin_role', data.role)
            // Force page reload to ensure AdminLayout picks up the token
            window.location.href = '/admin/dashboard'

        } catch (err: any) {
            console.error('Login flow error:', err)
            // alert('Catch Error: ' + err.message) // Optional, but let's keep it clean
            setError(err.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-slate-700">
                        <Shield className="text-emerald-500 w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
                    <p className="text-slate-400 text-sm mt-1">Restricted Access Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                        <input
                            type="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder-slate-600"
                            placeholder="Enter admin email"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder-slate-600"
                                placeholder="Enter password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-emerald-900/20"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <div className="flex items-center">
                                <Lock size={18} className="mr-2" />
                                Login to Dashboard
                            </div>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                    <p className="text-xs text-slate-600">
                        Unauthorized access is prohibited and logged.<br />
                        Secure Admin Portal
                    </p>
                </div>
            </div>
        </div>
    )
}
