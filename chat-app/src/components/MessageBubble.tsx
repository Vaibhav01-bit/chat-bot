import { twMerge } from 'tailwind-merge'

interface MessageBubbleProps {
    content: string
    isMe: boolean
    time: string
    status?: 'sent' | 'delivered' | 'read'
}

export function MessageBubble({ content, isMe, time }: MessageBubbleProps) {
    return (
        <div className={twMerge("flex w-full mb-3", isMe ? "justify-end" : "justify-start")}>
            <div
                className={twMerge(
                    "max-w-[80%] px-4 py-2.5 rounded-2xl relative shadow-sm transition-all duration-200",
                    isMe
                        ? "bg-blue-600 text-white rounded-br-none hover:bg-blue-700"
                        : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-bl-none border border-zinc-100 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                )}
            >
                <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap font-normal">{content}</p>
                <div className={twMerge("flex items-center justify-end mt-1 space-x-1", isMe ? "text-blue-100/90" : "text-zinc-400")}>
                    <p className="text-[10px] font-medium tracking-wide">
                        {time}
                    </p>
                    {isMe && (
                        <span className="text-[10px]">✓</span> // Simple check for now, can be upgraded to lucid icon later
                    )}
                </div>
            </div>
        </div>
    )
}
