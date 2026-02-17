import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, MessageSquare, Settings, LogOut, Shield } from 'lucide-react'
import { useEffect } from 'react'

export const AdminLayout = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const getAdminSession = () => {
        try {
            const session = localStorage.getItem('admin_session')
            if (!session) {
                // Fallback to legacy check if session object doesn't exist yet
                const legacyToken = localStorage.getItem('admin_token')
                return legacyToken ? { token: legacyToken } : null
            }

            const data = JSON.parse(session)
            if (Date.now() > data.expiresAt) {
                localStorage.removeItem('admin_session')
                localStorage.removeItem('admin_token')
                localStorage.removeItem('admin_role')
                return null
            }

            return data
        } catch {
            return null
        }
    }

    const isAdmin = getAdminSession()

    useEffect(() => {
        if (!isAdmin && location.pathname !== '/admin/login') {
            // Clean up potentially stale items
            localStorage.removeItem('admin_token')
            localStorage.removeItem('admin_role')
            localStorage.removeItem('admin_session')
            navigate('/admin/login')
        }
    }, [isAdmin, navigate, location])

    const handleLogout = () => {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_role')
        localStorage.removeItem('admin_session')
        navigate('/admin/login')
    }

    if (location.pathname === '/admin/login') {
        return <Outlet />
    }

    return (
        <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0 bg-slate-950 border-r border-slate-800 flex flex-col">
                <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
                    <Shield className="text-emerald-500" size={24} />
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">ChatCat Admin</h1>
                        <span className="text-xs text-slate-500 font-mono">v2.1.0</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <NavItem to="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={location.pathname === '/admin/dashboard'} />
                    <NavItem to="/admin/users" icon={<Users size={20} />} label="User Management" active={location.pathname.startsWith('/admin/users')} />
                    <NavItem to="/admin/statuses" icon={<MessageSquare size={20} />} label="Status Feed" active={location.pathname === '/admin/statuses'} />
                    <NavItem to="/admin/settings" icon={<Settings size={20} />} label="System Settings" active={location.pathname === '/admin/settings'} />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                    <div className="mt-4 px-4 text-xs text-slate-600 text-center">
                        Logged in as Super Admin
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-slate-900">
                <Outlet />
            </div>
        </div>
    )
}

const NavItem = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) => {
    const navigate = useNavigate()
    return (
        <button
            onClick={() => navigate(to)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
                ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    )
}
