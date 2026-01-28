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
        <div className={twMerge("flex w-full mb-4 group", isMe ? "justify-end" : "justify-start")}>
            {!isMe && (
                <div className="flex-shrink-0 mr-3 self-end mb-1">
                    {avatarUrl ? (
                        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/40 dark:border-white/10" style={{
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
                        }}>
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-600" style={{
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
                        }} />
                    )}
                </div>
            )}
            <div className={twMerge("flex flex-col max-w-[85%] relative group/bubble", isMe && "items-end")}>
                {/* Reaction Button - Shows on hover */}
                {messageId && (
                    <button
                        onClick={() => setShowReactionPicker(!showReactionPicker)}
                        className={twMerge(
                            "absolute -top-3 p-2 rounded-full opacity-0 group-hover/bubble:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 z-20",
                            "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
                            isMe ? "-left-11" : "-right-11",
                            showReactionPicker && "opacity-100"
                        )}
                        style={{
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
                        }}
                        title="React to message"
                    >
                        <Smile size={16} className="text-zinc-500 hover:text-blue-500 transition-colors" />
                    </button>
                )}

                <div
                    className={twMerge(
                        "px-5 py-3 relative transition-all duration-200",
                        isMe
                            ? "text-white rounded-[22px] rounded-br-md"
                            : "text-zinc-900 dark:text-zinc-100 rounded-[22px] rounded-bl-md border border-zinc-200/50 dark:border-zinc-700/30"
                    )}
                    style={
                        isMe
                            ? {
                                background: 'var(--msg-out-bg)',
                                boxShadow: '0 -2px 8px rgba(255,255,255,0.15), 0 6px 16px rgba(107,138,255,0.25), inset 0 1px 0 rgba(255,255,255,0.25)'
                            }
                            : {
                                background: 'var(--msg-in-bg)',
                                boxShadow: '0 -2px 8px rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.3)'
                            }
                    }
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onMouseEnter={(e) => {
                        if (isMe) {
                            e.currentTarget.style.boxShadow = '0 -3px 12px rgba(255,255,255,0.2), 0 8px 20px rgba(107,138,255,0.35), inset 0 1px 0 rgba(255,255,255,0.3)'
                            e.currentTarget.style.transform = 'translateY(-1px)'
                        } else {
                            e.currentTarget.style.boxShadow = '0 -3px 12px rgba(255,255,255,0.5), 0 6px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.4)'
                            e.currentTarget.style.transform = 'translateY(-1px)'
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (isMe) {
                            e.currentTarget.style.boxShadow = '0 -2px 8px rgba(255,255,255,0.15), 0 6px 16px rgba(107,138,255,0.25), inset 0 1px 0 rgba(255,255,255,0.25)'
                            e.currentTarget.style.transform = 'translateY(0)'
                        } else {
                            e.currentTarget.style.boxShadow = '0 -2px 8px rgba(255,255,255,0.4), 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.3)'
                            e.currentTarget.style.transform = 'translateY(0)'
                        }
                    }}
                >
                    <p className="leading-relaxed break-words whitespace-pre-wrap tracking-wide" style={{
                        fontSize: 'var(--font-size-base)',
                        fontWeight: 'var(--font-weight-msg)',
                        fontStyle: 'var(--font-style-msg)',
                        lineHeight: '1.6'
                    }}>{content}</p>
                    <div className={twMerge("flex items-center gap-1.5 mt-1.5 select-none", isMe ? "justify-end text-white/70" : "justify-start text-zinc-400 dark:text-zinc-500")}>
                        <p className="text-[10px] font-medium tracking-wider">
                            {time}
                        </p>
                        {isMe && (
                            <span className="animate-fade-in">
                                {status === 'read' ? (
                                    <CheckCheck size={12} className="text-white/80" />
                                ) : (
                                    <Check size={12} className="text-white/60" />
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
