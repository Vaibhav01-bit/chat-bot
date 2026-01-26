import { useState } from 'react'
import { Save, Bell, Shield, Server } from 'lucide-react'

export const AdminSettings = () => {
    const [settings, setSettings] = useState({
        allowRegistrations: true,
        maintenanceMode: false,
        emailNotifications: true,
        autoModeration: true,
        maxUploadSize: 5
    })
    const [saving, setSaving] = useState(false)

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleChange = (key: keyof typeof settings, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const handleSave = () => {
        setSaving(true)
        // Simulate API call
        setTimeout(() => {
            setSaving(false)
            alert('Settings saved successfully!')
        }, 800)
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">System Settings</h2>
                    <p className="text-slate-400">Configure global platform behavior</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-all transform active:scale-95 shadow-lg shadow-emerald-900/20 disabled:opacity-50"
                >
                    {saving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Save size={18} />
                    )}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            <div className="space-y-6">
                {/* General Section */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
                        <Server className="text-blue-500" size={24} />
                        <h3 className="text-lg font-bold text-white">General Configuration</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
                            <div>
                                <h4 className="text-white font-medium">Maintenance Mode</h4>
                                <p className="text-sm text-slate-500">Disable access for all non-admin users</p>
                            </div>
                            <Toggle enabled={settings.maintenanceMode} onChange={() => handleToggle('maintenanceMode')} danger />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
                            <div>
                                <h4 className="text-white font-medium">Allow New Registrations</h4>
                                <p className="text-sm text-slate-500">Pause user signups globally</p>
                            </div>
                            <Toggle enabled={settings.allowRegistrations} onChange={() => handleToggle('allowRegistrations')} />
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
                        <Shield className="text-purple-500" size={24} />
                        <h3 className="text-lg font-bold text-white">Security & Moderation</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
                            <div>
                                <h4 className="text-white font-medium">Auto-Moderation (AI)</h4>
                                <p className="text-sm text-slate-500">Automatically flag inappropriate content</p>
                            </div>
                            <Toggle enabled={settings.autoModeration} onChange={() => handleToggle('autoModeration')} />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
                            <div>
                                <h4 className="text-white font-medium">Max Upload Size (MB)</h4>
                                <p className="text-sm text-slate-500">Limit for images and videos</p>
                            </div>
                            <input
                                type="number"
                                value={settings.maxUploadSize}
                                onChange={(e) => handleChange('maxUploadSize', parseInt(e.target.value))}
                                className="w-20 bg-slate-950 border border-slate-700 text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-purple-500 text-center"
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
                        <Bell className="text-amber-500" size={24} />
                        <h3 className="text-lg font-bold text-white">Notifications</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
                            <div>
                                <h4 className="text-white font-medium">System Emails</h4>
                                <p className="text-sm text-slate-500">Send welcome emails and alerts</p>
                            </div>
                            <Toggle enabled={settings.emailNotifications} onChange={() => handleToggle('emailNotifications')} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Toggle = ({ enabled, onChange, danger = false }: { enabled: boolean, onChange: () => void, danger?: boolean }) => (
    <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${enabled ? (danger ? 'bg-red-500 focus:ring-red-500' : 'bg-emerald-500 focus:ring-emerald-500') : 'bg-slate-700'
            }`}
    >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
        />
    </button>
)
