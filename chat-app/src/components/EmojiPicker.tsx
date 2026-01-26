import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void
    onClose: () => void
}

// Using Unicode code points to avoid encoding issues
const EMOJI_LIST = [
    '\u{1F600}', '\u{1F603}', '\u{1F604}', '\u{1F601}', '\u{1F606}', '\u{1F605}', '\u{1F923}', '\u{1F602}',
    '\u{1F642}', '\u{1F643}', '\u{1F609}', '\u{1F60A}', '\u{1F607}', '\u{1F970}', '\u{1F60D}', '\u{1F929}',
    '\u{1F618}', '\u{1F617}', '\u{1F61A}', '\u{1F619}', '\u{1F60B}', '\u{1F61B}', '\u{1F61D}', '\u{1F61C}',
    '\u{1F92A}', '\u{1F928}', '\u{1F9D0}', '\u{1F913}', '\u{1F60E}', '\u{1F929}', '\u{1F973}', '\u{1F60F}',
    '\u{1F612}', '\u{1F61E}', '\u{1F614}', '\u{1F61F}', '\u{1F615}', '\u{1F641}', '\u{2639}', '\u{1F623}',
    '\u{1F616}', '\u{1F62B}', '\u{1F629}', '\u{1F97A}', '\u{1F622}', '\u{1F62D}', '\u{1F624}', '\u{1F620}',
    '\u{1F621}', '\u{1F92C}', '\u{1F92F}', '\u{1F633}', '\u{1F975}', '\u{1F976}', '\u{1F631}', '\u{1F628}',
    '\u{1F630}', '\u{1F625}', '\u{1F613}', '\u{1F917}', '\u{1F914}', '\u{1F92D}', '\u{1F92B}', '\u{1F925}',
    '\u{1F636}', '\u{1F610}', '\u{1F611}', '\u{1F62C}', '\u{1F644}', '\u{1F62F}', '\u{1F626}', '\u{1F627}',
    '\u{1F62E}', '\u{1F632}', '\u{1F971}', '\u{1F634}', '\u{1F924}', '\u{1F62A}', '\u{1F635}', '\u{1F910}',
    '\u{1F974}', '\u{1F922}', '\u{1F92E}', '\u{1F927}', '\u{1F637}', '\u{1F912}', '\u{1F915}', '\u{1F44D}',
    '\u{1F44E}', '\u{1F44B}', '\u{1F91A}', '\u{1F590}', '\u{270B}', '\u{1F596}', '\u{1F44C}', '\u{1F90C}',
    '\u{1F90F}', '\u{270C}', '\u{1F91E}', '\u{1F91F}', '\u{1F918}', '\u{1F919}', '\u{1F448}', '\u{1F449}',
    '\u{1F446}', '\u{1F447}', '\u{261D}', '\u{270A}', '\u{1F44A}', '\u{1F91B}', '\u{1F91C}', '\u{1F44F}',
    '\u{1F64C}', '\u{1F450}', '\u{1F932}', '\u{1F91D}', '\u{1F64F}', '\u{2764}', '\u{1F9E1}', '\u{1F49B}',
    '\u{1F49A}', '\u{1F499}', '\u{1F49C}', '\u{1F5A4}', '\u{1F90D}', '\u{1F90E}', '\u{1F494}', '\u{2764}\u{FE0F}\u{200D}\u{1F525}',
    '\u{1F495}', '\u{1F49E}', '\u{1F493}', '\u{1F497}', '\u{1F496}', '\u{1F498}', '\u{1F49D}', '\u{1F525}',
    '\u{2728}', '\u{2B50}', '\u{1F31F}', '\u{1F4AB}', '\u{2705}', '\u{274C}', '\u{2B55}', '\u{1F389}',
    '\u{1F38A}', '\u{1F388}', '\u{1F381}', '\u{1F3C6}', '\u{1F947}', '\u{1F948}', '\u{1F949}'
]

const RECENT_EMOJIS_KEY = 'chatmate_recent_emojis'

export const EmojiPicker = ({ onEmojiSelect, onClose }: EmojiPickerProps) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [recentEmojis, setRecentEmojis] = useState<string[]>([])
    const pickerRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const stored = localStorage.getItem(RECENT_EMOJIS_KEY)
        if (stored) {
            try {
                setRecentEmojis(JSON.parse(stored))
            } catch (e) {
                console.error('Failed to load recent emojis:', e)
            }
        }
        searchInputRef.current?.focus()
        console.log('EmojiPicker mounted, emoji count:', EMOJI_LIST.length)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [onClose])

    const handleEmojiClick = (emoji: string) => {
        console.log('Emoji clicked:', emoji)
        const updated = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 24)
        setRecentEmojis(updated)
        localStorage.setItem(RECENT_EMOJIS_KEY, JSON.stringify(updated))
        onEmojiSelect(emoji)
        onClose()
    }

    const displayEmojis = searchQuery ? EMOJI_LIST.slice(0, 50) : EMOJI_LIST

    return (
        <div
            ref={pickerRef}
            className="absolute bottom-full mb-2 right-0 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border-2 border-blue-500 dark:border-blue-600 overflow-hidden z-50"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="p-3 border-b-2 border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
                        😊 Emoji Picker ({displayEmojis.length})
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X size={18} className="text-red-500" />
                    </button>
                </div>

                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search emojis..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                </div>
            </div>

            {/* Emoji Grid */}
            <div className="h-64 overflow-y-auto p-4 bg-white dark:bg-zinc-900">
                {recentEmojis.length > 0 && !searchQuery && (
                    <div className="mb-4">
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">
                            ⭐ RECENTLY USED
                        </p>
                        <div className="grid grid-cols-8 gap-2">
                            {recentEmojis.slice(0, 16).map((emoji, idx) => (
                                <button
                                    key={`recent-${idx}`}
                                    onClick={() => handleEmojiClick(emoji)}
                                    className="w-10 h-10 flex items-center justify-center text-3xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-800/40 rounded-xl transition-all hover:scale-125 active:scale-95 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 shadow-sm hover:shadow-md"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-2">
                        {searchQuery ? '🔍 SEARCH RESULTS' : '🎨 ALL EMOJIS'}
                    </p>
                    <div className="grid grid-cols-8 gap-2">
                        {displayEmojis.map((emoji, idx) => (
                            <button
                                key={`emoji-${idx}`}
                                onClick={() => handleEmojiClick(emoji)}
                                className="w-10 h-10 flex items-center justify-center text-3xl bg-zinc-50 dark:bg-zinc-800 hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 rounded-xl transition-all hover:scale-125 active:scale-95 border-2 border-zinc-200 dark:border-zinc-700 hover:border-purple-400 dark:hover:border-purple-600 shadow-sm hover:shadow-lg"
                                title={`Click to insert ${emoji}`}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
