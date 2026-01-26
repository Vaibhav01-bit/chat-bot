import { User } from 'lucide-react'

interface ChatListItemProps {
    name: string
    avatarUrl?: string | null
    lastMessage?: string
    time?: string
    onClick: () => void
}

export function ChatListItem({ name, avatarUrl, lastMessage, time, onClick }: ChatListItemProps) {
    return (
        <div
            onClick={onClick}
            className="flex items-center p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 active:bg-zinc-100 dark:active:bg-zinc-800"
        >
            <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex items-center justify-center border border-zinc-200 dark:border-zinc-600">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-6 h-6 text-zinc-400" />
                    )}
                </div>
            </div>

            <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white truncate pr-2 capitalize">
                        {name || 'Unknown User'}
                    </h3>
                    {time && (
                        <span className="text-xs text-zinc-500 flex-shrink-0">
                            {time}
                        </span>
                    )}
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                    {lastMessage || 'Tap to chat'}
                </p>
            </div>
        </div>
    )
}
