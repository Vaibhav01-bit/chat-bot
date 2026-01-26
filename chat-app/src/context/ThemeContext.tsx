import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    resolvedTheme: 'light' | 'dark'
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
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
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
