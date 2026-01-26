import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

export const ProtectedRoute = ({ requireUsername = true }: { requireUsername?: boolean }) => {
    const { user, loading } = useAuth()
    const [checkingProfile, setCheckingProfile] = useState(true)
    const [hasUsername, setHasUsername] = useState(false)

    useEffect(() => {
        if (loading) return
        if (!user) {
            setCheckingProfile(false)
            return
        }

        async function checkProfile() {
            if (!user) return

            try {
                const { data } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', user.id)
                    .single()

                setHasUsername(!!data?.username)
            } catch (error) {
                // Handle error if needed
            } finally {
                setCheckingProfile(false)
            }
        }

        checkProfile()

    }, [user, loading])

    if (loading || checkingProfile) return (
        <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    )

    if (!user) return <Navigate to="/login" />

    if (requireUsername && !hasUsername) {
        return <Navigate to="/username-setup" />
    }

    return <Outlet />
}
