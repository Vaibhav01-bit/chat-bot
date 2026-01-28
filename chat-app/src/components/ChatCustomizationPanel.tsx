import { useState } from 'react'
import { X, Image, Palette, MessageSquare } from 'lucide-react'
import type { ChatCustomization } from '../hooks/useChatCustomization'
import { GRADIENT_WALLPAPERS, TEXTURE_WALLPAPERS } from '../constants/wallpapers'
import { BUBBLE_STYLES } from '../constants/bubbleStyles'
import { twMerge } from 'tailwind-merge'

interface ChatCustomizationPanelProps {
    isOpen: boolean
    onClose: () => void
    customization: ChatCustomization
    onUpdate: (updates: Partial<ChatCustomization>) => void
    onReset: () => void
}

export function ChatCustomizationPanel({
    isOpen,
    onClose,
    customization,
    onUpdate,
    onReset
}: ChatCustomizationPanelProps) {
    const [activeTab, setActiveTab] = useState<'wallpaper' | 'bubble' | 'accent'>('wallpaper')

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 animate-fade-in"
                onClick={onClose}
                style={{
                    backdropFilter: 'blur(4px)',
                    animation: 'fadeIn 200ms var(--ease-out)'
                }}
            />

            {/* Panel */}
            <div
                className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-3xl z-50 max-h-[80vh] overflow-hidden flex flex-col"
                style={{
                    animation: 'slideUp 300ms var(--ease-out)',
                    boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.1)'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-700">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                        🎨 Customize Chat
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <X size={20} className="text-zinc-600 dark:text-zinc-400" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 p-4 border-b border-zinc-200 dark:border-zinc-700">
                    <button
                        onClick={() => setActiveTab('wallpaper')}
                        className={twMerge(
                            "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
                            activeTab === 'wallpaper'
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        )}
                    >
                        <Image size={18} />
                        <span>Wallpaper</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('bubble')}
                        className={twMerge(
                            "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
                            activeTab === 'bubble'
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        )}
                    >
                        <MessageSquare size={18} />
                        <span>Bubble Style</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('accent')}
                        className={twMerge(
                            "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
                            activeTab === 'accent'
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        )}
                    >
                        <Palette size={18} />
                        <span>Accent</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'wallpaper' && (
                        <WallpaperTab customization={customization} onUpdate={onUpdate} />
                    )}
                    {activeTab === 'bubble' && (
                        <BubbleStyleTab customization={customization} onUpdate={onUpdate} />
                    )}
                    {activeTab === 'accent' && (
                        <AccentColorTab customization={customization} onUpdate={onUpdate} />
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-700 flex gap-3">
                    <button
                        onClick={onReset}
                        className="flex-1 px-4 py-3 rounded-xl font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        Reset to Default
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </>
    )
}

// Wallpaper Tab Component
function WallpaperTab({
    customization,
    onUpdate
}: {
    customization: ChatCustomization
    onUpdate: (updates: Partial<ChatCustomization>) => void
}) {
    return (
        <div className="space-y-6">
            {/* None Option */}
            <div>
                <button
                    onClick={() => onUpdate({ wallpaper_type: 'none', wallpaper_value: undefined })}
                    className={twMerge(
                        "w-full p-4 rounded-xl border-2 transition-all text-left",
                        customization.wallpaper_type === 'none'
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    )}
                >
                    <p className="font-medium text-zinc-900 dark:text-white">No Wallpaper</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Default background</p>
                </button>
            </div>

            {/* Gradients */}
            <div>
                <h3 className="font-medium text-zinc-900 dark:text-white mb-3">Gradients</h3>
                <div className="grid grid-cols-2 gap-3">
                    {GRADIENT_WALLPAPERS.map(wallpaper => (
                        <button
                            key={wallpaper.id}
                            onClick={() => onUpdate({ wallpaper_type: 'gradient', wallpaper_value: wallpaper.id })}
                            className={twMerge(
                                "p-3 rounded-xl border-2 transition-all",
                                customization.wallpaper_type === 'gradient' && customization.wallpaper_value === wallpaper.id
                                    ? "border-blue-500"
                                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
                            )}
                        >
                            <div
                                className="w-full h-20 rounded-lg mb-2"
                                style={{ background: wallpaper.preview }}
                            />
                            <p className="text-sm font-medium text-zinc-900 dark:text-white">{wallpaper.name}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Textures */}
            <div>
                <h3 className="font-medium text-zinc-900 dark:text-white mb-3">Textures</h3>
                <div className="grid grid-cols-2 gap-3">
                    {TEXTURE_WALLPAPERS.map(wallpaper => (
                        <button
                            key={wallpaper.id}
                            onClick={() => onUpdate({ wallpaper_type: 'texture', wallpaper_value: wallpaper.id })}
                            className={twMerge(
                                "p-3 rounded-xl border-2 transition-all",
                                customization.wallpaper_type === 'texture' && customization.wallpaper_value === wallpaper.id
                                    ? "border-blue-500"
                                    : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
                            )}
                        >
                            <div
                                className="w-full h-20 rounded-lg mb-2"
                                style={{ background: wallpaper.preview }}
                            />
                            <p className="text-sm font-medium text-zinc-900 dark:text-white">{wallpaper.name}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Dim & Blur Controls */}
            {customization.wallpaper_type !== 'none' && (
                <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Dim ({customization.wallpaper_dim}%)
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="40"
                            value={customization.wallpaper_dim}
                            onChange={(e) => onUpdate({ wallpaper_dim: parseInt(e.target.value) })}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Blur ({customization.wallpaper_blur}px)
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={customization.wallpaper_blur}
                            onChange={(e) => onUpdate({ wallpaper_blur: parseInt(e.target.value) })}
                            className="w-full"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

// Bubble Style Tab Component
function BubbleStyleTab({
    customization,
    onUpdate
}: {
    customization: ChatCustomization
    onUpdate: (updates: Partial<ChatCustomization>) => void
}) {
    return (
        <div className="space-y-3">
            {BUBBLE_STYLES.map(style => (
                <button
                    key={style.id}
                    onClick={() => onUpdate({ bubble_style: style.id })}
                    className={twMerge(
                        "w-full p-4 rounded-xl border-2 transition-all text-left",
                        customization.bubble_style === style.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
                    )}
                >
                    <p className="font-medium text-zinc-900 dark:text-white">{style.name}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{style.description}</p>
                    {/* Preview bubble */}
                    <div className="mt-3 flex justify-end">
                        <div
                            className="px-4 py-2 bg-blue-500 text-white text-sm"
                            style={style.preview}
                        >
                            Preview
                        </div>
                    </div>
                </button>
            ))}
        </div>
    )
}

// Accent Color Tab Component
function AccentColorTab({
    customization,
    onUpdate
}: {
    customization: ChatCustomization
    onUpdate: (updates: Partial<ChatCustomization>) => void
}) {
    const ACCENT_COLORS = [
        { name: 'iOS Blue', value: '#007AFF' },
        { name: 'Soft Purple', value: '#A78BFA' },
        { name: 'Mint Green', value: '#60D5C4' },
        { name: 'Rose Pink', value: '#FF6B9D' },
        { name: 'Warm Orange', value: '#FF9F66' }
    ]

    return (
        <div className="space-y-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Choose a subtle accent color for this chat. It will tint outgoing messages and highlights.
            </p>
            <div className="grid grid-cols-2 gap-3">
                {ACCENT_COLORS.map(color => (
                    <button
                        key={color.value}
                        onClick={() => onUpdate({ accent_color: color.value })}
                        className={twMerge(
                            "p-4 rounded-xl border-2 transition-all",
                            customization.accent_color === color.value
                                ? "border-blue-500"
                                : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
                        )}
                    >
                        <div
                            className="w-full h-12 rounded-lg mb-2"
                            style={{ backgroundColor: color.value }}
                        />
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">{color.name}</p>
                    </button>
                ))}
            </div>
        </div>
    )
}
