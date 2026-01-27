import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from './AuthContext'

type Theme = 'light' | 'dark' | 'system'

export interface StyleSettings {
    fontSize: 'small' | 'medium' | 'large' | 'xl'
    fontFamily: 'inter' | 'poppins' | 'handwritten' | 'mono'
    emojiSize: 'small' | 'normal' | 'large'
    highContrast: boolean
    boldText: boolean
    italicText: boolean
}

const defaultStyleSettings: StyleSettings = {
    fontSize: 'medium',
    fontFamily: 'inter',
    emojiSize: 'normal',
    highContrast: false,
    boldText: false,
    italicText: false,
}

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    resolvedTheme: 'light' | 'dark'
    styleSettings: StyleSettings
    updateStyleSettings: (settings: Partial<StyleSettings>) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        // Read strictly from localStorage or default to system
        // The script in index.html will handle the initial paint class
        const savedTheme = localStorage.getItem('theme') as Theme
        return (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')
            ? savedTheme
            : 'system'
    })

    const { user } = useAuth()
    const [styleSettings, setStyleSettings] = useState<StyleSettings>(defaultStyleSettings)

    // Load saved style settings from localStorage on mount (for immediate feedback)
    useEffect(() => {
        const saved = localStorage.getItem('style_settings')
        if (saved) {
            try {
                setStyleSettings({ ...defaultStyleSettings, ...JSON.parse(saved) })
            } catch (e) {
                console.error('Failed to parse saved style settings', e)
            }
        }
    }, [])

    // Sync with database when user is available
    useEffect(() => {
        if (!user) return

        const fetchSettings = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('style_settings')
                .eq('id', user.id)
                .single()

            if (data?.style_settings) {
                const merged = { ...defaultStyleSettings, ...data.style_settings }
                setStyleSettings(merged)
                localStorage.setItem('style_settings', JSON.stringify(merged))
            }
        }

        fetchSettings()
    }, [user])

    // Apply styles to root
    useEffect(() => {
        const root = document.documentElement

        // Font Size
        const fontSizeMap = {
            small: '14px',
            medium: '16px',
            large: '18px',
            xl: '20px'
        }
        root.style.setProperty('--font-size-base', fontSizeMap[styleSettings.fontSize])

        // Font Family
        const fontFamilyMap = {
            inter: '"Inter", system-ui, sans-serif',
            poppins: '"Poppins", system-ui, sans-serif',
            handwritten: '"Comic Neue", "Comic Sans MS", cursive, sans-serif',
            mono: '"JetBrains Mono", "Fira Code", monospace'
        }
        root.style.setProperty('--font-family-base', fontFamilyMap[styleSettings.fontFamily])

        // Emoji Size
        const emojiSizeMap = {
            small: '1em',
            normal: '1.25em',
            large: '1.5em'
        }
        root.style.setProperty('--emoji-size', emojiSizeMap[styleSettings.emojiSize])

        // High Contrast
        if (styleSettings.highContrast) {
            root.classList.add('high-contrast')
            root.style.setProperty('--contrast-multiplier', '1.5')
        } else {
            root.classList.remove('high-contrast')
            root.style.setProperty('--contrast-multiplier', '1')
        }

        // Bold Text
        root.style.setProperty('--font-weight-msg', styleSettings.boldText ? '600' : '400')

        // Italic Text
        root.style.setProperty('--font-style-msg', styleSettings.italicText ? 'italic' : 'normal')

    }, [styleSettings])

    const updateStyleSettings = (updates: Partial<StyleSettings>) => {
        const newSettings = { ...styleSettings, ...updates }
        setStyleSettings(newSettings)
        localStorage.setItem('style_settings', JSON.stringify(newSettings))

        if (user) {
            supabase
                .from('profiles')
                .update({ style_settings: newSettings })
                .eq('id', user.id)
                .then(({ error }) => {
                    if (error) console.error('Failed to sync style settings', error)
                })
        }
    }

    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window === 'undefined') return 'light'
        const savedTheme = localStorage.getItem('theme') as Theme
        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    })

    // Use layout effect to avoid flash
    useEffect(() => {
        const root = window.document.documentElement
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const applyTheme = () => {
            let effectiveTheme: 'light' | 'dark'
            if (theme === 'system') {
                effectiveTheme = mediaQuery.matches ? 'dark' : 'light'
            } else {
                effectiveTheme = theme
            }

            setResolvedTheme(effectiveTheme)

            // Important: Remove BOTH classes first to ensure clean slate
            root.classList.remove('light', 'dark')
            root.classList.add(effectiveTheme)
        }

        applyTheme()

        const handleSystemChange = (e: MediaQueryListEvent) => {
            if (theme === 'system') {
                const newSystemTheme = e.matches ? 'dark' : 'light'
                setResolvedTheme(newSystemTheme)
                root.classList.remove('light', 'dark')
                root.classList.add(newSystemTheme)
            }
        }

        // Listen for system changes independently of theme mechanism
        // But only act if theme is system
        mediaQuery.addEventListener('change', handleSystemChange)
        return () => mediaQuery.removeEventListener('change', handleSystemChange)
    }, [theme])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        localStorage.setItem('theme', newTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, styleSettings, updateStyleSettings }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
