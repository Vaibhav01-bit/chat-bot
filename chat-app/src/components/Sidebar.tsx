import { Link, useLocation } from 'react-router-dom'
import { MessageSquare, RefreshCw, Circle, Settings, LogOut } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { useAuth } from '../context/AuthContext'

export function Sidebar() {
    const location = useLocation()
    const { signOut } = useAuth()

    const navItems = [
        { icon: MessageSquare, label: 'Chats', path: '/' },
        { icon: RefreshCw, label: 'Random', path: '/random' },
        { icon: Circle, label: 'Status', path: '/status' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ]

    return (
        <div className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-white dark:bg-[var(--clay-surface)] border-r border-zinc-200/60 dark:border-zinc-700/50 z-50"
            style={{
                boxShadow: '0 0 40px rgba(0,0,0,0.06)'
            }}>
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-tertiary)] bg-clip-text text-transparent">ChatMate</h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map(({ icon: Icon, label, path }) => {
                    const isActive = location.pathname === path
                    return (
                        <Link
                            key={path}
                            to={path}
                            className={twMerge(
                                "group flex items-center space-x-3 px-4 py-3.5 rounded-[16px] transition-all duration-200 relative overflow-hidden",
                                isActive
                                    ? "text-[var(--accent-primary)] font-medium"
                                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                            )}
                            style={
                                isActive
                                    ? {
                                        background: 'linear-gradient(135deg, rgba(107,138,255,0.1) 0%, rgba(96,213,196,0.08) 100%)',
                                        boxShadow: '0 0 0 2px rgba(107,138,255,0.15), inset 0 1px 0 rgba(255,255,255,0.2)'
                                    }
                                    : undefined
                            }
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'rgba(0,0,0,0.03)'
                                    e.currentTarget.style.transform = 'translateX(2px)'
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'transparent'
                                    e.currentTarget.style.transform = 'translateX(0)'
                                }
                            }}
                        >
                            {/* Active Glow */}
                            {isActive && (
                                <div className="absolute left-0 w-1 h-10 bg-gradient-to-b from-[var(--accent-primary)] to-[var(--accent-tertiary)] rounded-r-full animate-clay-glow"></div>
                            )}

                            <div className={twMerge(
                                "relative z-10 p-2 rounded-[12px] transition-all duration-200",
                                isActive ? "scale-110" : "group-hover:scale-105"
                            )}
                                style={
                                    isActive
                                        ? {
                                            background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-tertiary) 100%)',
                                            boxShadow: '0 4px 12px rgba(107,138,255,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
                                            color: 'white'
                                        }
                                        : undefined
                                }>
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className="relative z-10">{label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-zinc-200/60 dark:border-zinc-700/50">
                <button
                    onClick={() => signOut()}
                    className="flex items-center space-x-3 px-4 py-3.5 w-full rounded-[16px] text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-all duration-200 active:scale-[0.97]"
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
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    )
}
