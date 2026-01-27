import { Search, Plus } from 'lucide-react'
import { ChatListItem } from '../components/ChatListItem'
import { Input } from '../components/Input'
import { useChats } from '../hooks/useChats'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useStreaks } from '../hooks/useStreaks'

export const Home = () => {
    const { chats, loading } = useChats()
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const { streak } = useStreaks()

    const filteredChats = chats.filter(chat =>
        chat.partner?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        chat.partner?.username?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent md:hidden">ChatMate</h1>
                    {streak && streak.current_streak > 0 && (
                        <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                            <span>🔥</span>
                            <span>{streak.current_streak} day{streak.current_streak > 1 ? 's' : ''}</span>
                        </div>
                    )}
                </div>
                <div className="relative">
                    <Input
                        placeholder="Search chats..."
                        className="pl-10 bg-zinc-100 dark:bg-zinc-900 border-transparent dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-950"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <button onClick={() => navigate('/requests')} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 font-medium text-xs bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100">
                        Requests
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pt-2 pb-24 md:pb-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-zinc-500 text-sm font-medium">Loading conversations...</p>
                    </div>
                ) : filteredChats.length > 0 ? (
                    <div className="space-y-1">
                        {filteredChats.map((chat, index) => (
                            <div key={chat.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                                <ChatListItem
                                    name={chat.partner?.full_name || chat.partner?.username || 'Unknown'}
                                    avatarUrl={chat.partner?.avatar_url}
                                    lastMessage={chat.last_message?.content}
                                    time={chat.last_message?.created_at ? new Date(chat.last_message.created_at).toLocaleDateString() : undefined}
                                    status={chat.partner?.privacy_settings?.online_status === 'hidden' ? undefined : chat.partner?.status}
                                    onClick={() => navigate(`/chat/${chat.id}`)} // Navigate to chat
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 animate-scale-in">
                        <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <Plus className="text-zinc-300 dark:text-zinc-700 w-10 h-10" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No chats yet</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto mb-8">
                            Start a new conversation with a friend or find someone new to talk to.
                        </p>
                        <button
                            onClick={() => navigate('/search')}
                            className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all"
                        >
                            Start Chatting
                        </button>
                    </div>
                )}
            </div>

            <button
                onClick={() => navigate('/search')}
                className="fixed bottom-20 md:bottom-8 right-4 md:right-8 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all z-20 hover:scale-105 active:scale-95"
            >
                <Plus size={28} />
            </button>
        </div>
    )
}
