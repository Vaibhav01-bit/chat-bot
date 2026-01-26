import { Link, useLocation } from 'react-router-dom'
import { MessageSquare, RefreshCw, Circle, Settings } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

export function BottomNav() {
    const location = useLocation()

    const navItems = [
        { icon: MessageSquare, label: 'Chats', path: '/' },
        { icon: RefreshCw, label: 'Random', path: '/random' },
        { icon: Circle, label: 'Status', path: '/status' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ]

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 pb-[env(safe-area-inset-bottom)] z-50 transition-all duration-300">
            <div className="flex justify-around items-center h-16">
                {navItems.map(({ icon: Icon, label, path }) => {
                    const isActive = location.pathname === path
                    return (
                        <Link
                            key={path}
                            to={path}
                            className={twMerge(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 active:scale-95",
                                isActive ? "text-blue-600 dark:text-blue-500" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                            )}
                        >
                            <div className={twMerge("p-1 rounded-xl transition-colors", isActive && "bg-blue-50 dark:bg-blue-500/10")}>
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={twMerge("text-[10px] font-medium transition-all", isActive ? "font-semibold" : "font-medium")}>{label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
