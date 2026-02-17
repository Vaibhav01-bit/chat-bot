import { Search, Plus } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
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
        <div className="flex flex-col h-full bg-[var(--background)]">
            <Helmet>
                <title>ChatCat – Modern Real-Time Chat Platform</title>
                <meta name="description" content="ChatCat is a modern real-time chat platform with private chat, random chat, statuses, and premium UI/UX. Connect with friends instantly through our secure messaging platform." />
                <meta property="og:title" content="ChatCat – Modern Real-Time Chat Platform" />
                <meta property="og:description" content="ChatCat is a modern real-time chat platform with private chat, random chat, statuses, and premium UI/UX." />
                <meta property="og:type" content="website" />
                <link rel="canonical" href="https://chatmate.vercel.app/" />
            </Helmet>

            {/* SEO Content Section - Hidden visually but readable by search engines */}
            <div className="sr-only">
                <h1>Modern Real-Time Chat Platform</h1>
                <p>
                    ChatCat is a cutting-edge real-time chat app designed for seamless communication.
                    Our messaging platform offers private chat, random chat with strangers, and engaging status updates.
                    Experience instant messaging with a premium user interface and advanced features.
                </p>
                <p>
                    Connect with friends through our secure chat app, discover new people with random chat,
                    and share your moments with status updates. ChatCat combines the best of modern messaging
                    with real-time synchronization and beautiful design.
                </p>
            </div>

            <div className="p-4 border-b border-zinc-200/60 dark:border-zinc-700/50 sticky top-0 bg-white/90 dark:bg-[var(--clay-surface)]/90 backdrop-blur-xl z-10">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-tertiary)] bg-clip-text text-transparent md:hidden">ChatCat</h1>
                    {streak && streak.current_streak > 0 && (
                        <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
                            style={{
                                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3), inset 0 1px 0 rgba(255,255,255,0.3)'
                            }}>
                            <span>🔥</span>
                            <span>{streak.current_streak} day{streak.current_streak > 1 ? 's' : ''}</span>
                        </div>
                    )}
                </div>
                <div className="relative">
                    <Input
                        placeholder="Search chats..."
                        className="pl-12 bg-white dark:bg-[var(--clay-elevated)] border-zinc-200 dark:border-zinc-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <button onClick={() => navigate('/requests')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--accent-primary)] font-medium text-xs px-3 py-1.5 rounded-full transition-all active:scale-95"
                        style={{
                            background: 'linear-gradient(135deg, rgba(107,138,255,0.12) 0%, rgba(96,213,196,0.1) 100%)',
                            boxShadow: '0 2px 6px rgba(107,138,255,0.15), inset 0 1px 0 rgba(255,255,255,0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 10px rgba(107,138,255,0.25), inset 0 1px 0 rgba(255,255,255,0.3)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 2px 6px rgba(107,138,255,0.15), inset 0 1px 0 rgba(255,255,255,0.2)'
                        }}>
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
                        <div className="w-24 h-24 rounded-[24px] flex items-center justify-center mb-6"
                            style={{
                                background: 'linear-gradient(135deg, rgba(107,138,255,0.08) 0%, rgba(96,213,196,0.06) 100%)',
                                boxShadow: '0 -2px 8px rgba(255,255,255,0.4), 0 6px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.3)'
                            }}>
                            <Plus className="text-[var(--accent-primary)] w-12 h-12" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No chats yet</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto mb-8">
                            Start a new conversation with a friend or find someone new to talk to.
                        </p>
                        <button
                            onClick={() => navigate('/search')}
                            className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-tertiary)] text-white px-8 py-3.5 rounded-full font-semibold transition-all active:scale-[0.97]"
                            style={{
                                boxShadow: '0 -2px 8px rgba(255,255,255,0.2), 0 6px 16px rgba(107,138,255,0.3), inset 0 1px 0 rgba(255,255,255,0.25)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)'
                                e.currentTarget.style.boxShadow = '0 -3px 12px rgba(255,255,255,0.25), 0 10px 24px rgba(107,138,255,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = '0 -2px 8px rgba(255,255,255,0.2), 0 6px 16px rgba(107,138,255,0.3), inset 0 1px 0 rgba(255,255,255,0.25)'
                            }}
                        >
                            Start Chatting
                        </button>
                    </div>
                )}
            </div>

            <button
                onClick={() => navigate('/search')}
                className="fixed bottom-20 md:bottom-8 right-4 md:right-8 w-16 h-16 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-tertiary)] rounded-full flex items-center justify-center text-white transition-all z-20 active:scale-95"
                style={{
                    boxShadow: '0 -2px 10px rgba(255,255,255,0.25), 0 8px 24px rgba(107,138,255,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
                    e.currentTarget.style.boxShadow = '0 -3px 14px rgba(255,255,255,0.3), 0 12px 32px rgba(107,138,255,0.5), inset 0 1px 0 rgba(255,255,255,0.35)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = '0 -2px 10px rgba(255,255,255,0.25), 0 8px 24px rgba(107,138,255,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                }}
            >
                <Plus size={28} strokeWidth={2.5} />
            </button>
        </div>
    )
}
