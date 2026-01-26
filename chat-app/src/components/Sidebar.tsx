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
        <div className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-white dark:bg-[var(--sidebar)] border-r border-zinc-200 dark:border-zinc-800 z-50">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ChatMate</h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map(({ icon: Icon, label, path }) => {
                    const isActive = location.pathname === path
                    return (
                        <Link
                            key={path}
                            to={path}
                            className={twMerge(
                                "group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden",
                                isActive
                                    ? "text-blue-500 font-medium"
                                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50"
                            )}
                        >
                            {/* Active Background Pill */}
                            <div className={twMerge(
                                "absolute inset-0 bg-blue-50 dark:bg-blue-500/10 transition-opacity duration-300",
                                isActive ? "opacity-100" : "opacity-0"
                            )} />

                            {/* Active Glow */}
                            {isActive && (
                                <div className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                            )}

                            <div className={twMerge(
                                "relative z-10 p-1 rounded-lg transition-all duration-300",
                                isActive ? "scale-110" : "group-hover:scale-105"
                            )}>
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className="relative z-10">{label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                    onClick={() => signOut()}
                    className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-500 transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    )
}
