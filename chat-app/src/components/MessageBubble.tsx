import { twMerge } from 'tailwind-merge'

interface MessageBubbleProps {
    content: string
    isMe: boolean
    time: string
    status?: 'sent' | 'delivered' | 'read'
}

export function MessageBubble({ content, isMe, time }: MessageBubbleProps) {
    return (
        <div className={twMerge("flex w-full mb-2", isMe ? "justify-end" : "justify-start")}>
            <div
                className={twMerge(
                    "max-w-[75%] px-4 py-2 rounded-2xl relative shadow-sm",
                    isMe
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-bl-none border border-zinc-100 dark:border-zinc-700"
                )}
            >
                <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">{content}</p>
                <p className={twMerge("text-[10px] mt-1 text-right", isMe ? "text-blue-200" : "text-zinc-400")}>
                    {time}
                </p>
            </div>
        </div>
    )
}
