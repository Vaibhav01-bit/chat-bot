import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

export const ProtectedRoute = ({ requireUsername = true }: { requireUsername?: boolean }) => {
    const location = useLocation()
    const { user, loading } = useAuth()
    const [checkingProfile, setCheckingProfile] = useState(true)
    const [hasUsername, setHasUsername] = useState(false)

    useEffect(() => {
        if (loading) return

        if (!user) {
            // Check for OAuth callback params used by Supabase handles
            const isAuthCallback = location.hash.includes('access_token') ||
                location.search.includes('code') ||
                location.search.includes('error_description')

            // If we are in an auth callback, don't redirect yet - wait for Supabase to process it
            if (!isAuthCallback) {
                setCheckingProfile(false)
            }
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

    }, [user, loading, location])

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
