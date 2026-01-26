import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, Eye } from 'lucide-react'

export const PrivacySettings = () => {
    const navigate = useNavigate()

    return (
        <div className="p-4">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-3 text-zinc-600 dark:text-zinc-400"><ArrowLeft /></button>
                <h1 className="text-xl font-bold dark:text-white">Privacy</h1>
            </div>

            <div className="space-y-6">
                <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl">
                    <h3 className="font-semibold mb-2 flex items-center dark:text-white"><Eye size={18} className="mr-2" /> Profile Visibility</h3>
                    <p className="text-sm text-zinc-500 mb-4">Who can see your profile details?</p>

                    <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="visibility" defaultChecked className="text-blue-600" />
                            <span className="dark:text-white">Everyone</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="radio" name="visibility" className="text-blue-600" />
                            <span className="dark:text-white">Contacts Only</span>
                        </label>
                    </div>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl">
                    <h3 className="font-semibold mb-2 flex items-center dark:text-white"><Lock size={18} className="mr-2" /> Blocked Users</h3>
                    <p className="text-sm text-zinc-500">Manage users you have blocked.</p>
                    <button className="mt-2 text-blue-600 font-medium text-sm">View Blocked List</button>
                </div>
            </div>
        </div>
    )
}
