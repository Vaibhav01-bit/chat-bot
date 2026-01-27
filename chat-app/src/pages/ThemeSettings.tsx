import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Moon, Sun, Smartphone, Type, Smile, Eye } from 'lucide-react'
import { useTheme, type StyleSettings as StyleSettingsType } from '../context/ThemeContext'
import { twMerge } from 'tailwind-merge'

export const ThemeSettings = () => {
    const navigate = useNavigate()
    const { theme, setTheme, styleSettings, updateStyleSettings } = useTheme()

    const handleStyleChange = (key: keyof StyleSettingsType, value: any) => {
        updateStyleSettings({ [key]: value })
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-950 overflow-y-auto pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
                <button onClick={() => navigate(-1)} className="mr-3 p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 touch-manipulation">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold dark:text-white">Appearance</h1>
            </div>

            <div className="p-4 space-y-8 max-w-2xl mx-auto w-full">

                {/* Live Preview Panel */}
                <div className="bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800 shadow-inner">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Live Preview</span>
                    </div>

                    <div className="space-y-4">
                        {/* Mock Incoming Message */}
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs flex-shrink-0">
                                A
                            </div>
                            <div className="bg-white dark:bg-[#1A1D26] p-3 rounded-2xl rounded-tl-none shadow-sm border border-zinc-100 dark:border-zinc-800/50 max-w-[85%]">
                                <p className="text-zinc-900 dark:text-[#ededed] leading-relaxed">
                                    Hey! How do the new styles look? 🎨
                                </p>
                            </div>
                        </div>

                        {/* Mock Outgoing Message */}
                        <div className="flex gap-3 flex-row-reverse">
                            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-3 rounded-2xl rounded-tr-none shadow-md text-white max-w-[85%]">
                                <p className="leading-relaxed">
                                    Looks amazing! The customizable font is a nice touch. ✨
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Theme Mode Section */}
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider px-1">Color Theme</h2>
                    <div className="grid grid-cols-3 gap-3">
                        {(['light', 'dark', 'system'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setTheme(mode)}
                                className={twMerge(
                                    "flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-200 active:scale-95",
                                    theme === mode
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500"
                                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                )}
                            >
                                {mode === 'light' && <Sun size={24} strokeWidth={1.5} />}
                                {mode === 'dark' && <Moon size={24} strokeWidth={1.5} />}
                                {mode === 'system' && <Smartphone size={24} strokeWidth={1.5} />}
                                <span className="capitalize font-medium text-sm">{mode}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Typography Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 px-1">
                        <Type className="w-4 h-4 text-blue-500" />
                        <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Typography</h2>
                    </div>

                    {/* Font Size Control */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-medium dark:text-white">Text Size</span>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md capitalize">
                                {styleSettings?.fontSize || 'Medium'}
                            </span>
                        </div>
                        <div className="relative flex items-center h-12">
                            {/* Track Lines */}
                            <div className="absolute inset-x-0 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${(['small', 'medium', 'large', 'xl'].indexOf(styleSettings?.fontSize || 'medium') / 3) * 100}%` }}
                                />
                            </div>

                            {/* Custom Step Input */}
                            <input
                                type="range"
                                min="0"
                                max="3"
                                step="1"
                                value={['small', 'medium', 'large', 'xl'].indexOf(styleSettings?.fontSize || 'medium')}
                                onChange={(e) => handleStyleChange('fontSize', ['small', 'medium', 'large', 'xl'][parseInt(e.target.value)])}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />

                            {/* Visual Dots */}
                            <div className="absolute inset-x-0 flex justify-between pointer-events-none px-0.5">
                                {[0, 1, 2, 3].map((step) => (
                                    <div
                                        key={step}
                                        className={twMerge(
                                            "w-4 h-4 rounded-full border-2 transition-colors duration-300 flex items-center justify-center",
                                            ['small', 'medium', 'large', 'xl'].indexOf(styleSettings?.fontSize || 'medium') >= step
                                                ? "bg-blue-500 border-blue-500"
                                                : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                                        )}
                                    >
                                        <div className="w-1.5 h-1.5 bg-white rounded-full opacity-50" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between mt-3 text-zinc-400 font-medium px-1">
                            <span className="text-xs">Mm</span>
                            <span className="text-xl">Mm</span>
                        </div>
                    </div>

                    {/* Font Family Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: 'inter', name: 'Classic', font: 'Inter, sans-serif', preview: 'Clean' },
                            { id: 'poppins', name: 'Modern', font: 'Poppins, sans-serif', preview: 'Round' },
                            { id: 'handwritten', name: 'Playful', font: 'Comic Sans MS, cursive', preview: 'Fun' },
                            { id: 'mono', name: 'Code', font: 'monospace', preview: 'Dev' }
                        ].map((font) => (
                            <button
                                key={font.id}
                                onClick={() => handleStyleChange('fontFamily', font.id)}
                                className={twMerge(
                                    "p-4 rounded-2xl border text-left transition-all duration-200 hover:scale-[1.02] active:scale-95 flex flex-col justify-between h-24",
                                    styleSettings?.fontFamily === font.id
                                        ? "border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                                )}
                            >
                                <span className={twMerge(
                                    "text-xs font-medium opacity-80 uppercase tracking-wide",
                                    styleSettings?.fontFamily === font.id ? "text-white/80" : "text-zinc-400"
                                )}>{font.name}</span>
                                <span className="text-2xl font-bold" style={{ fontFamily: font.font }}>{font.preview}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Extras Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 px-1">
                        <Eye className="w-4 h-4 text-green-500" />
                        <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Display & Reads</h2>
                    </div>

                    {/* Emoji Size */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                                <Smile size={20} />
                            </div>
                            <div>
                                <div className="font-medium dark:text-white text-sm">Emoji Size</div>
                                <div className="text-xs text-zinc-500 capitalize">{styleSettings?.emojiSize || 'Normal'}</div>
                            </div>
                        </div>
                        <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
                            {['small', 'normal', 'large'].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => handleStyleChange('emojiSize', size)}
                                    className={twMerge(
                                        "w-8 h-8 flex items-center justify-center rounded-md transition-all text-lg",
                                        styleSettings?.emojiSize === size
                                            ? "bg-white dark:bg-zinc-600 shadow-sm text-orange-500"
                                            : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                    )}
                                >
                                    {size === 'small' ? '👍' : size === 'normal' ? '👍' : '👍'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Toggle Cards Grid */}
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { id: 'highContrast', label: 'High Contrast', desc: 'Sharper text', activeColor: 'bg-zinc-900 dark:bg-white text-white dark:text-black' },
                            { id: 'boldText', label: 'Bold Text', desc: 'Thicker font weight', activeColor: 'bg-indigo-600 text-white' },
                            { id: 'italicText', label: 'Italic Text', desc: 'Slanted message style', activeColor: 'bg-pink-600 text-white' }
                        ].map((toggle) => {
                            const isActive = !!styleSettings?.[toggle.id as keyof StyleSettingsType]
                            return (
                                <button
                                    key={toggle.id}
                                    onClick={() => handleStyleChange(toggle.id as keyof StyleSettingsType, !isActive)}
                                    className={twMerge(
                                        "flex items-center justify-between p-4 rounded-xl border transition-all duration-200 active:scale-[0.98]",
                                        isActive
                                            ? `${toggle.activeColor} border-transparent shadow-lg`
                                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                                    )}
                                >
                                    <div className="text-left">
                                        <div className={twMerge("font-bold text-sm", isActive ? "text-current" : "dark:text-white")}>{toggle.label}</div>
                                        <div className={twMerge("text-xs mt-0.5", isActive ? "opacity-80" : "text-zinc-500")}>{toggle.desc}</div>
                                    </div>
                                    <div className={twMerge(
                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                        isActive
                                            ? "border-current bg-white/20"
                                            : "border-zinc-300 dark:border-zinc-600"
                                    )}>
                                        {isActive && <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Reset Button */}
                <button
                    onClick={() => {
                        if (window.confirm('Reset all appearance settings to default?')) {
                            setTheme('system')
                            updateStyleSettings({
                                fontSize: 'medium',
                                fontFamily: 'inter',
                                emojiSize: 'normal',
                                highContrast: false,
                                boldText: false,
                                italicText: false
                            })
                        }
                    }}
                    className="w-full py-4 text-center text-zinc-500 hover:text-red-500 text-sm font-medium transition-colors"
                >
                    Reset to defaults
                </button>
            </div>
        </div>
    )
}
