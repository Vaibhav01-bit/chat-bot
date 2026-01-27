import { twMerge } from 'tailwind-merge'
import { MessageReactions } from './MessageReactions'
import { useState } from 'react'
import { Smile, Check, CheckCheck } from 'lucide-react'

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
                        <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm border border-white/10">
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-600" />
                    )}
                </div>
            )}
            <div className={twMerge("flex flex-col max-w-[85%] relative group/bubble", isMe && "items-end")}>
                {/* Reaction Button - Shows on hover */}
                {messageId && (
                    <button
                        onClick={() => setShowReactionPicker(!showReactionPicker)}
                        className={twMerge(
                            "absolute -top-3 p-1.5 bg-white dark:bg-zinc-800 rounded-full shadow-lg border border-zinc-100 dark:border-zinc-700 opacity-0 group-hover/bubble:opacity-100 transition-all hover:scale-110 active:scale-95 z-20 hover:bg-zinc-50 dark:hover:bg-zinc-700",
                            isMe ? "-left-10" : "-right-10",
                            showReactionPicker && "opacity-100"
                        )}
                        title="React to message"
                    >
                        <Smile size={16} className="text-zinc-500 hover:text-blue-500 transition-colors" />
                    </button>
                )}

                <div
                    className={twMerge(
                        "px-4 py-2.5 relative shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]",
                        isMe
                            ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-[1.25rem] rounded-br-[0.25rem]"
                            : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-[1.25rem] rounded-bl-[0.25rem] border border-zinc-100 dark:border-zinc-700/50"
                    )}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <p className="leading-relaxed break-words whitespace-pre-wrap tracking-wide" style={{
                        fontSize: 'var(--font-size-base)',
                        fontWeight: 'var(--font-weight-msg)',
                        fontStyle: 'var(--font-style-msg)',
                        lineHeight: '1.6'
                    }}>{content}</p>
                    <div className={twMerge("flex items-center gap-1 mt-1 select-none", isMe ? "justify-end text-blue-100/80" : "justify-start text-zinc-400 dark:text-zinc-500")}>
                        <p className="text-[10px] font-medium tracking-wider">
                            {time}
                        </p>
                        {isMe && (
                            <span className="animate-fade-in">
                                {status === 'read' ? (
                                    <CheckCheck size={12} className="text-blue-200" />
                                ) : (
                                    <Check size={12} className="text-blue-200/70" />
                                )}
                            </span>
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
