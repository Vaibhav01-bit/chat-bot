import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, Palette, Lock, LogOut, ChevronRight } from 'lucide-react'

export const Settings = () => {
    const { signOut, user } = useAuth()
    const navigate = useNavigate()

    const menuItems = [
        { icon: User, label: 'Edit Profile', path: '/settings/profile', color: 'text-blue-500' },
        { icon: Palette, label: 'Theme', path: '/settings/theme', color: 'text-purple-500' },
        { icon: Lock, label: 'Privacy', path: '/settings/privacy', color: 'text-green-500' },
    ]

    return (
        <div className="p-6 bg-white dark:bg-[var(--background)] h-full overflow-y-auto">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">Settings</h1>

            <div className="max-w-xl mx-auto space-y-8">
                {/* Profile Section */}
                <section>
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-1">Account</h3>
                    <div className="group bg-white dark:bg-[var(--card)] rounded-3xl p-4 shadow-sm hover:shadow-xl hover:shadow-blue-900/10 cursor-pointer transition-all duration-300 border border-zinc-100 dark:border-zinc-800/50 hover:border-blue-500/30" onClick={() => navigate(`/profile/${user?.id}`)}>
                        <div className="flex items-center space-x-5">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-[2px]">
                                    <div className="w-full h-full rounded-2xl bg-white dark:bg-[var(--card)] overflow-hidden">
                                        {/* Placeholder or actual avatar would go here */}
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                                            <User size={28} className="text-zinc-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors">My Profile</h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your personal info</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
                                <ChevronRight className="text-zinc-400 group-hover:text-blue-500 transition-colors" size={20} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Preferences Section */}
                <section>
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-1">Preferences</h3>
                    <div className="bg-white dark:bg-[var(--card)] rounded-3xl overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-800/50">
                        {menuItems.map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => navigate(item.path)}
                                className="group flex items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-[var(--card-hover)] cursor-pointer transition-colors border-b border-zinc-100 dark:border-zinc-800/50 last:border-0"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 ${item.color.replace('text-', 'text-opacity-100 bg-opacity-10 bg-')} bg-opacity-20`}>
                                        <item.icon size={22} className={item.color} />
                                    </div>
                                    <span className="font-medium text-zinc-700 dark:text-zinc-200 group-hover:translate-x-1 transition-transform">{item.label}</span>
                                </div>
                                <ChevronRight className="text-zinc-300 group-hover:text-zinc-500 transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" size={18} />
                            </div>
                        ))}
                    </div>
                </section>

                <button
                    onClick={signOut}
                    className="w-full p-4 flex items-center justify-center text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all active:scale-[0.98] border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
                >
                    <LogOut size={20} className="mr-2" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
