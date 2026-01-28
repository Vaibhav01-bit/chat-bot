import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, Palette, Lock, LogOut, ChevronRight } from 'lucide-react'

export const Settings = () => {
    const { signOut, user } = useAuth()
    const navigate = useNavigate()

    const menuItems = [
        { icon: User, label: 'Edit Profile', path: '/settings/profile', color: 'text-[var(--accent-primary)]' },
        { icon: Palette, label: 'Theme', path: '/settings/theme', color: 'text-purple-500' },
        { icon: Lock, label: 'Privacy', path: '/settings/privacy', color: 'text-green-500' },
    ]

    return (
        <div className="p-6 bg-[var(--background)] h-full overflow-y-auto pb-24 md:pb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-tertiary)] bg-clip-text text-transparent mb-8">Settings</h1>

            <div className="max-w-xl mx-auto space-y-8">
                {/* Profile Section */}
                <section>
                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3 px-1">Account</h3>
                    <div className="group rounded-[24px] p-5 cursor-pointer transition-all duration-200 border border-zinc-200/60 dark:border-zinc-700/50 bg-white dark:bg-[var(--clay-surface)] active:scale-[0.98]"
                        onClick={() => navigate(`/profile/${user?.id}`)}
                        style={{
                            boxShadow: '0 -2px 8px rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.25)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = '0 -3px 12px rgba(255,255,255,0.5), 0 8px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.3)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = '0 -2px 8px rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.25)'
                        }}>
                        <div className="flex items-center space-x-5">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-[20px] overflow-hidden"
                                    style={{
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
                                    }}>
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                                        <User size={28} className="text-zinc-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-[var(--accent-primary)] transition-colors">My Profile</h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage your personal info</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
                                <ChevronRight className="text-zinc-400 group-hover:text-[var(--accent-primary)] transition-colors" size={20} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Preferences Section */}
                <section>
                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3 px-1">Preferences</h3>
                    <div className="rounded-[24px] overflow-hidden border border-zinc-200/60 dark:border-zinc-700/50 bg-white dark:bg-[var(--clay-surface)]"
                        style={{
                            boxShadow: '0 -2px 8px rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.25)'
                        }}>
                        {menuItems.map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => navigate(item.path)}
                                className="group flex items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-all border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 active:scale-[0.99]"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-[16px] transition-all`}
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(107,138,255,0.08) 0%, rgba(96,213,196,0.06) 100%)',
                                            boxShadow: '0 2px 6px rgba(107,138,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
                                        }}>
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
                    className="w-full p-4 flex items-center justify-center text-red-500 font-medium rounded-[20px] transition-all active:scale-[0.98] border border-transparent hover:border-red-200 dark:hover:border-red-900/30"
                    style={{
                        background: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                    }}
                >
                    <LogOut size={20} className="mr-2" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
