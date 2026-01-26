import { User } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface ChatListItemProps {
    name: string
    avatarUrl?: string | null
    lastMessage?: string
    time?: string
    unreadCount?: number
    isActive?: boolean
    onClick: () => void
}

export function ChatListItem({ name, avatarUrl, lastMessage, time, unreadCount, isActive, onClick }: ChatListItemProps) {
    return (
        <div
            onClick={onClick}
            className={twMerge(
                "group relative p-4 mb-3 rounded-2xl cursor-pointer transition-all duration-300 border",
                // Base styles with nuanced border for depth
                "bg-white dark:bg-[#151821] border-zinc-100 dark:border-white/5",
                // Hover state (Scale, Lift & Shadow)
                "hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/40 hover:border-zinc-200 dark:hover:border-white/10 hover:z-10",
                // Active State (Gradient Border & Glow)
                isActive
                    ? "ring-2 ring-blue-500/50 dark:ring-blue-500/50 shadow-md bg-blue-50/40 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30"
                    : ""
            )}
        >
            <div className="flex items-center space-x-4">
                {/* Avatar with Status Ring */}
                <div className="relative flex-shrink-0">
                    {/* Animated Ring on Hover */}
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500"></div>

                    <div className={twMerge(
                        "relative w-14 h-14 rounded-full overflow-hidden flex items-center justify-center transition-transform duration-300 shadow-sm",
                        isActive ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-[#151821]" : "ring-1 ring-zinc-100 dark:ring-zinc-800",
                        "group-hover:scale-105"
                    )}>
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                                <User className="w-6 h-6 text-zinc-300 dark:text-zinc-600" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 min-w-0 py-1">
                    <div className="flex justify-between items-baseline mb-1.5">
                        <h3 className={twMerge(
                            "text-[16px] font-bold truncate transition-colors tracking-tight",
                            isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white"
                        )}>
                            {name || 'Unknown User'}
                        </h3>
                        {time && (
                            <span className={twMerge(
                                "text-xs font-medium transition-colors",
                                unreadCount ? "text-blue-600 dark:text-blue-400" : "text-zinc-400 dark:text-zinc-500"
                            )}>
                                {time}
                            </span>
                        )}
                    </div>
                    <div className="flex justify-between items-center h-5">
                        <p className={twMerge(
                            "text-sm truncate max-w-[85%] leading-relaxed transition-colors",
                            unreadCount
                                ? "text-zinc-900 dark:text-white font-semibold"
                                : isActive
                                    ? "text-blue-800/70 dark:text-blue-200/70"
                                    : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                        )}>
                            {lastMessage || 'Tap to start chatting'}
                        </p>
                        {unreadCount ? (
                            <div className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse">
                                <span className="text-[10px] text-white font-bold">{unreadCount}</span>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}
