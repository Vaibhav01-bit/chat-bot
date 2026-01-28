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
        <div className="md:hidden fixed bottom-0 left-0 right-0 pb-[env(safe-area-inset-bottom)] z-50 px-3 pb-3">
            <div className="bg-white/90 dark:bg-[var(--clay-surface)]/95 backdrop-blur-xl rounded-[28px] border border-zinc-200/60 dark:border-zinc-700/50"
                style={{
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.3)'
                }}>
                <div className="flex justify-around items-center h-16 px-2">
                    {navItems.map(({ icon: Icon, label, path }) => {
                        const isActive = location.pathname === path
                        return (
                            <Link
                                key={path}
                                to={path}
                                className={twMerge(
                                    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 rounded-[20px]",
                                    isActive ? "text-[var(--accent-primary)]" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                                )}
                                onClick={(e) => {
                                    e.currentTarget.style.animation = 'clayBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                    setTimeout(() => {
                                        e.currentTarget.style.animation = ''
                                    }, 400)
                                }}
                            >
                                <div className={twMerge(
                                    "p-2.5 rounded-[16px] transition-all duration-200",
                                    isActive && "scale-110"
                                )}
                                    style={
                                        isActive
                                            ? {
                                                background: 'linear-gradient(135deg, rgba(107,138,255,0.15) 0%, rgba(96,213,196,0.12) 100%)',
                                                boxShadow: '0 4px 12px rgba(107,138,255,0.25), inset 0 1px 0 rgba(255,255,255,0.3)'
                                            }
                                            : undefined
                                    }>
                                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className={twMerge("text-[10px] font-medium transition-all", isActive ? "font-semibold" : "font-medium")}>{label}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
