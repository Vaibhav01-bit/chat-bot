import { twMerge } from 'tailwind-merge'
import { MessageReactions } from './MessageReactions'
import { useState } from 'react'
import { Smile } from 'lucide-react'

interface MessageBubbleProps {
    content: string
    isMe: boolean
    time: string
    status?: 'sent' | 'delivered' | 'read'
    avatarUrl?: string
    messageId?: string
}

export function MessageBubble({ content, isMe, time, avatarUrl, messageId }: MessageBubbleProps) {
    const [showReactionPicker, setShowReactionPicker] = useState(false)
    const [longPressTimer, setLongPressTimer] = useState<number | null>(null)

    const handleTouchStart = () => {
        const timer = setTimeout(() => {
            if (messageId) setShowReactionPicker(true)
        }, 500)
        setLongPressTimer(timer)
    }

    const handleTouchEnd = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer)
            setLongPressTimer(null)
        }
    }

    return (
        <div className={twMerge("flex w-full mb-3 group", isMe ? "justify-end" : "justify-start")}>
            {!isMe && (
                <div className="flex-shrink-0 mr-2 self-end mb-1">
                    {avatarUrl ? (
                        <div className="w-6 h-6 rounded-full overflow-hidden">
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                    )}
                </div>
            )}
            <div className="flex flex-col max-w-[80%] relative">
                {/* Reaction Button - Shows on hover */}
                {messageId && (
                    <button
                        onClick={() => setShowReactionPicker(!showReactionPicker)}
                        className={twMerge(
                            "absolute -top-3 p-1.5 bg-white dark:bg-zinc-800 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 z-10",
                            isMe ? "-left-10" : "-right-10",
                            showReactionPicker && "opacity-100"
                        )}
                        title="React to message"
                    >
                        <Smile size={16} className="text-zinc-600 dark:text-zinc-400" />
                    </button>
                )}

                <div
                    className={twMerge(
                        "px-4 py-2.5 rounded-2xl relative shadow-sm transition-all duration-200",
                        isMe
                            ? "bg-blue-600 text-white rounded-br-none hover:bg-blue-700"
                            : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-bl-none border border-zinc-100 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                    )}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap font-normal">{content}</p>
                    <div className={twMerge("flex items-center justify-end mt-1 space-x-1", isMe ? "text-blue-100/90" : "text-zinc-400")}>
                        <p className="text-[10px] font-medium tracking-wide">
                            {time}
                        </p>
                        {isMe && (
                            <span className="text-[10px]">✓</span>
                        )}
                    </div>
                </div>
                {messageId && (
                    <MessageReactions
                        messageId={messageId}
                        showPicker={showReactionPicker}
                        onClose={() => setShowReactionPicker(false)}
                    />
                )}
            </div>
        </div>
    )
}
