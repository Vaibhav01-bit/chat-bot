import { useState, useEffect } from 'react'
import { Users, MessageSquare as MessageSquareIcon, Zap, Activity, ArrowUp, ArrowDown } from 'lucide-react'
import { supabase } from '../../services/supabaseClient'

export const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeToday: 0,
        totalMessages: 0,
        randomSessions: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            // Count total users
            const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })

            // Count messages (just an estimate for performance)
            const { count: msgCount } = await supabase.from('messages').select('*', { count: 'exact', head: true })

            // Mocking active & random sessions since we don't have those tables/columns fully populated yet
            setStats({
                totalUsers: userCount || 0,
                activeToday: Math.floor((userCount || 0) * 0.3), // Mock 30% active
                totalMessages: msgCount || 0,
                randomSessions: 142 // Mock
            })
        } catch (error) {
            console.error('Error fetching admin stats:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Dashboard Overview</h2>
                    <p className="text-slate-400">Platform performance for {new Date().toLocaleDateString()}</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                    Refresh Data
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    title="Total Users"
                    value={stats.totalUsers.toLocaleString()}
                    trend="+12%"
                    trendUp={true}
                    icon={<Users className="text-blue-500" />}
                />
                <MetricCard
                    title="Active Today"
                    value={stats.activeToday.toLocaleString()}
                    trend="+5%"
                    trendUp={true}
                    icon={<Activity className="text-green-500" />}
                />
                <MetricCard
                    title="Total Messages"
                    value={stats.totalMessages.toLocaleString()}
                    trend="+28%"
                    trendUp={true}
                    icon={<MessageSquareIcon className="text-purple-500" />}
                />
                <MetricCard
                    title="Random Sessions"
                    value={stats.randomSessions.toLocaleString()}
                    trend="-2%"
                    trendUp={false}
                    icon={<Zap className="text-amber-500" />}
                />
            </div>

            {/* Recent Activity Section */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Live System Activity</h3>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800/50">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-slate-300 text-sm">New user registration: <span className="text-white font-mono">User#{2930 + i}</span></span>
                            </div>
                            <span className="text-slate-500 text-xs">{i * 2} mins ago</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const MetricCard = ({ title, value, trend, trendUp, icon }: any) => (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-900 rounded-xl">
                {icon}
            </div>
            <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {trendUp ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                {trend}
            </div>
        </div>
        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        <p className="text-slate-500 text-sm">{title}</p>
    </div>
)


