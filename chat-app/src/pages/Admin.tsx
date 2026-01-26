import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Trash2 } from 'lucide-react'

export const Admin = () => {
    const [auth, setAuth] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isSetup, setIsSetup] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Dashboard Data
    const [stats, setStats] = useState({ users: 0, messages: 0, statuses: 0 })
    const [usersList, setUsersList] = useState<any[]>([])
    const [statusList, setStatusList] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'statuses'>('dashboard')

    useEffect(() => {
        checkSetup()
    }, [])

    const checkSetup = async () => {
        const { count } = await supabase.from('admins').select('*', { count: 'exact', head: true })
        if (count === 0) setIsSetup(false) // Need setup
        else setIsSetup(true)
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        if (!isSetup) {
            // Register as admin
            const { error } = await supabase.from('admins').insert({ username, password })
            if (error) setError(error.message)
            else {
                setAuth(true)
                loadDashboard()
                setIsSetup(true)
            }
        } else {
            // Login
            const { data } = await supabase.from('admins').select('*').eq('username', username).eq('password', password).single()
            if (data) {
                setAuth(true)
                loadDashboard()
            } else {
                setError('Invalid credentials')
            }
        }
        setLoading(false)
    }

    const loadDashboard = async () => {
        // Stats
        const { count: u } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
        const { count: m } = await supabase.from('messages').select('*', { count: 'exact', head: true })
        const { count: s } = await supabase.from('statuses').select('*', { count: 'exact', head: true })

        setStats({ users: u || 0, messages: m || 0, statuses: s || 0 })

        // Users
        const { data: users } = await supabase.from('profiles').select('*')
        setUsersList(users || [])

        // Statuses
        const { data: statuses } = await supabase.from('statuses').select('*, profiles(username)')
        setStatusList(statuses || [])
    }

    const deleteUser = async (id: string) => {
        if (!confirm('Are you sure? This effectively bans the user.')) return

        // Delete from profiles? Or Auth?
        // Deleting from profiles cascades to other tables.
        // But we can't delete from auth.users via client easily without service key.
        // We can only delete public data.
        await supabase.from('profiles').delete().eq('id', id)
        loadDashboard()
    }

    const deleteStatus = async (id: string) => {
        if (!confirm('Delete this status?')) return
        await supabase.from('statuses').delete().eq('id', id)
        loadDashboard()
    }

    if (!auth) {
        return (
            <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-4">
                <div className="w-full max-w-sm bg-zinc-800 p-8 rounded-xl shadow-2xl">
                    <h1 className="text-2xl font-bold mb-6 text-center">Admin Panel</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input label="Username" value={username} onChange={e => setUsername(e.target.value)} className="bg-zinc-700 border-zinc-600 text-white" />
                        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-zinc-700 border-zinc-600 text-white" />

                        {error && <p className="text-red-500 text-sm md:text-center">{error}</p>}

                        <Button type="submit" className="w-full text-white" variant="primary" isLoading={loading}>
                            {isSetup ? 'Login' : 'Create Admin Account'}
                        </Button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 p-6 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-4 mb-6 md:mb-0 md:mr-6 h-fit">
                <h2 className="text-xl font-bold mb-6 dark:text-white px-2">Admin Panel</h2>
                <nav className="space-y-2">
                    <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left p-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:text-zinc-300'}`}>Dashboard</button>
                    <button onClick={() => setActiveTab('users')} className={`w-full text-left p-3 rounded-lg ${activeTab === 'users' ? 'bg-blue-50 text-blue-600' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:text-zinc-300'}`}>Users</button>
                    <button onClick={() => setActiveTab('statuses')} className={`w-full text-left p-3 rounded-lg ${activeTab === 'statuses' ? 'bg-blue-50 text-blue-600' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:text-zinc-300'}`}>Statuses</button>
                </nav>
                <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <button onClick={() => setAuth(false)} className="w-full text-left p-3 text-red-500 hover:bg-red-50 rounded-lg">Logout</button>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1">
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm">
                            <h3 className="text-zinc-500 mb-2">Total Users</h3>
                            <p className="text-3xl font-bold dark:text-white">{stats.users}</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm">
                            <h3 className="text-zinc-500 mb-2">Total Messages</h3>
                            <p className="text-3xl font-bold dark:text-white">{stats.messages}</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm">
                            <h3 className="text-zinc-500 mb-2">Active Statuses</h3>
                            <p className="text-3xl font-bold dark:text-white">{stats.statuses}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                            <h2 className="font-bold dark:text-white">User Management</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-50 dark:bg-zinc-950 text-zinc-500 text-sm">
                                    <tr>
                                        <th className="p-4">User</th>
                                        <th className="p-4">Joined</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersList.map(u => (
                                        <tr key={u.id} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                            <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden">
                                                        {u.avatar_url && <img src={u.avatar_url} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium dark:text-white">{u.full_name}</p>
                                                        <p className="text-xs text-zinc-500">@{u.username}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-zinc-500">{new Date(u.created_at).toLocaleDateString()}</td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Ban User</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'statuses' && (
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                            <h2 className="font-bold dark:text-white">Status Content</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                            {statusList.map(s => (
                                <div key={s.id} className="relative group rounded-lg overflow-hidden bg-zinc-100 aspect-[9/16]">
                                    <img src={s.media_url} className="w-full h-full object-cover" />
                                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="text-xs text-white truncate">@{s.profiles?.username}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteStatus(s.id)}
                                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
