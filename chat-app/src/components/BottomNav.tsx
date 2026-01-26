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
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pb-safe z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map(({ icon: Icon, label, path }) => {
                    const isActive = location.pathname === path
                    return (
                        <Link
                            key={path}
                            to={path}
                            className={twMerge(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                                isActive ? "text-blue-600 dark:text-blue-500" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                            )}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
