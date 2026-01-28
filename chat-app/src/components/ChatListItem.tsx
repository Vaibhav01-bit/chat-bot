import { User } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface ChatListItemProps {
    name: string
    avatarUrl?: string | null
    lastMessage?: string
    time?: string
    unreadCount?: number
    isActive?: boolean
    status?: 'online' | 'away' | 'offline'
    onClick: () => void
}

// Helper function to format message preview
function formatMessagePreview(message?: string): string {
    if (!message) return 'Tap to start chatting'

    // Check if it's a JSON string (game invite)
    try {
        const parsed = JSON.parse(message)
        if (parsed.type === 'invite' && parsed.gameType) {
            return `🎮 Sent a ${parsed.gameType} invite`
        }
    } catch {
        // Not JSON, just return the message
    }

    return message
}

export function ChatListItem({ name, avatarUrl, lastMessage, time, unreadCount, isActive, status, onClick }: ChatListItemProps) {
    const displayMessage = formatMessagePreview(lastMessage)
    return (
        <div
            onClick={onClick}
            className={twMerge(
                "group relative p-5 mb-3 rounded-[20px] cursor-pointer transition-all duration-300 border",
                "bg-white dark:bg-[var(--clay-surface)] border-zinc-200/60 dark:border-white/5",
                "active:scale-[0.98]",
                isActive && "ring-2 ring-[var(--accent-primary)]/30 bg-blue-50/40 dark:bg-blue-900/10 border-blue-200/50 dark:border-blue-800/30"
            )}
            style={{
                boxShadow: isActive
                    ? '0 -2px 10px rgba(255,255,255,0.5), 0 8px 20px rgba(107,138,255,0.2), inset 0 1px 0 rgba(255,255,255,0.3)'
                    : '0 -2px 8px rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.25)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                if (isActive) {
                    e.currentTarget.style.boxShadow = '0 -3px 14px rgba(255,255,255,0.6), 0 12px 28px rgba(107,138,255,0.3), inset 0 1px 0 rgba(255,255,255,0.35)'
                } else {
                    e.currentTarget.style.boxShadow = '0 -3px 12px rgba(255,255,255,0.5), 0 8px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.3)'
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                if (isActive) {
                    e.currentTarget.style.boxShadow = '0 -2px 10px rgba(255,255,255,0.5), 0 8px 20px rgba(107,138,255,0.2), inset 0 1px 0 rgba(255,255,255,0.3)'
                } else {
                    e.currentTarget.style.boxShadow = '0 -2px 8px rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.25)'
                }
            }}
        >
            <div className="flex items-center space-x-4">
                {/* Avatar with Status Ring */}
                <div className="relative flex-shrink-0">
                    {/* Animated Ring on Hover */}
                    <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-tertiary)] opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500"></div>

                    <div className={twMerge(
                        "relative w-14 h-14 rounded-full overflow-hidden flex items-center justify-center transition-transform duration-300",
                        isActive ? "ring-2 ring-[var(--accent-primary)] ring-offset-2 ring-offset-white dark:ring-offset-[var(--clay-surface)]" : "ring-1 ring-zinc-200 dark:ring-zinc-700",
                        "group-hover:scale-105"
                    )}
                        style={{
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
                        }}>
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <User className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
                            </div>
                        )}
                    </div>

                    {/* Status Indicator */}
                    {status && (
                        <div className={twMerge(
                            "absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[var(--clay-surface)]",
                            status === 'online' ? "bg-green-500 animate-pulse-ring" :
                                status === 'away' ? "bg-yellow-500" :
                                    "bg-zinc-400"
                        )}
                            style={{
                                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                            }}></div>
                    )}
                </div>

                <div className="flex-1 min-w-0 py-1">
                    <div className="flex justify-between items-baseline mb-1.5">
                        <h3
                            className={twMerge(
                                "font-bold truncate transition-colors tracking-tight",
                                isActive ? "text-[var(--accent-primary)]" : "text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white"
                            )}
                            style={{
                                fontSize: 'var(--font-size-base)',
                                fontFamily: 'var(--font-family-base)'
                            }}
                        >
                            {name || 'Unknown User'}
                        </h3>
                        {time && (
                            <span className={twMerge(
                                "text-xs font-medium transition-colors",
                                unreadCount ? "text-[var(--accent-primary)]" : "text-zinc-400 dark:text-zinc-500"
                            )}>
                                {time}
                            </span>
                        )}
                    </div>
                    <div className="flex justify-between items-center h-5">
                        <p
                            className={twMerge(
                                "truncate max-w-[85%] leading-relaxed transition-colors",
                                unreadCount
                                    ? "text-zinc-900 dark:text-white font-semibold"
                                    : isActive
                                        ? "text-blue-800/70 dark:text-blue-200/70"
                                        : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                            )}
                            style={{
                                fontSize: 'calc(var(--font-size-base) * 0.9)',
                                fontFamily: 'var(--font-family-base)'
                            }}
                        >
                            {displayMessage}
                        </p>
                        {unreadCount ? (
                            <div className="flex-shrink-0 min-w-[22px] h-5 px-2 rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-tertiary)] flex items-center justify-center animate-pulse"
                                style={{
                                    boxShadow: '0 4px 12px rgba(107,138,255,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                                }}>
                                <span className="text-[10px] text-white font-bold">{unreadCount}</span>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}
