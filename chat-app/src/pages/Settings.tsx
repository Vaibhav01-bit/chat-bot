import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, Palette, Lock, LogOut, ChevronRight } from 'lucide-react'

export const Settings = () => {
    const { signOut, user } = useAuth()
    const navigate = useNavigate()

    const menuItems = [
        { icon: User, label: 'Edit Profile', path: '/settings/profile', color: 'text-blue-500' },
        { icon: Palette, label: 'Theme', path: '/settings/theme', color: 'text-purple-500' },
        { icon: Lock, label: 'Privacy', path: '/settings/privacy', color: 'text-green-500' },
    ]

    return (
        <div className="p-4 bg-white dark:bg-zinc-950 h-full">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">Settings</h1>

            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 mb-6 flex items-center space-x-4 cursor-pointer" onClick={() => navigate(`/profile/${user?.id}`)}>
                <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    {/* Placeholder for avatar, or fetch context */}
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500" />
                </div>
                <div className="flex-1">
                    <h2 className="font-bold dark:text-white">My Profile</h2>
                    <p className="text-sm text-zinc-500">View how others see you</p>
                </div>
                <ChevronRight className="text-zinc-400" />
            </div>

            <div className="space-y-2">
                {menuItems.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => navigate(item.path)}
                        className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl cursor-pointer transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 ${item.color}`}>
                                <item.icon size={20} />
                            </div>
                            <span className="font-medium dark:text-white">{item.label}</span>
                        </div>
                        <ChevronRight className="text-zinc-300" size={18} />
                    </div>
                ))}
            </div>

            <button
                onClick={signOut}
                className="mt-8 w-full p-4 flex items-center justify-center text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
            >
                <LogOut size={20} className="mr-2" />
                Sign Out
            </button>
        </div>
    )
}
