import { Search, Plus } from 'lucide-react'
import { ChatListItem } from '../components/ChatListItem'
import { Input } from '../components/Input'
import { useChats } from '../hooks/useChats'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export const Home = () => {
    const { chats, loading } = useChats()
    const navigate = useNavigate()
    const [search, setSearch] = useState('')

    const filteredChats = chats.filter(chat =>
        chat.partner?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        chat.partner?.username?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 md:hidden">ChatMate</h1>
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

            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-zinc-500 text-sm">Loading chats...</p>
                    </div>
                ) : filteredChats.length > 0 ? (
                    filteredChats.map(chat => (
                        <ChatListItem
                            key={chat.id}
                            name={chat.partner?.full_name || chat.partner?.username || 'Unknown'}
                            avatarUrl={chat.partner?.avatar_url}
                            lastMessage={chat.last_message?.content}
                            time={chat.last_message?.created_at ? new Date(chat.last_message.created_at).toLocaleDateString() : undefined}
                            onClick={() => navigate(`/chat/${chat.id}`)} // Navigate to chat
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 dark:text-zinc-400 p-8 text-center mt-20">
                        <p className="mb-2">No chats yet.</p>
                        <p className="text-sm">Search for users to start a conversation.</p>
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
