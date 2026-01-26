import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Moon, Sun } from 'lucide-react'

export const ThemeSettings = () => {
    const navigate = useNavigate()
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    return (
        <div className="p-4">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-3 text-zinc-600 dark:text-zinc-400"><ArrowLeft /></button>
                <h1 className="text-xl font-bold dark:text-white">Appearance</h1>
            </div>

            <div className="space-y-4">
                <button
                    onClick={() => setTheme('light')}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border ${theme === 'light' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-zinc-200 dark:border-zinc-800'}`}
                >
                    <div className="flex items-center">
                        <Sun className="mr-3 text-orange-500" />
                        <span className="dark:text-white">Light Mode</span>
                    </div>
                    {theme === 'light' && <div className="w-4 h-4 rounded-full bg-blue-600" />}
                </button>

                <button
                    onClick={() => setTheme('dark')}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border ${theme === 'dark' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-zinc-200 dark:border-zinc-800'}`}
                >
                    <div className="flex items-center">
                        <Moon className="mr-3 text-purple-500" />
                        <span className="dark:text-white">Dark Mode</span>
                    </div>
                    {theme === 'dark' && <div className="w-4 h-4 rounded-full bg-blue-600" />}
                </button>
            </div>
        </div>
    )
}
