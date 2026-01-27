import { useEffect, useRef, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'

export const usePresence = () => {
    const { user } = useAuth()
    const [status, setStatus] = useState<'online' | 'away' | 'offline'>('online')
    const presenceChannel = useRef<any>(null)
    const awayTimeoutRef = useRef<number | null>(null)

    useEffect(() => {
        if (!user) return

        // 1. Initial Status Update
        updateStatus('online')

        // 2. Realtime Presence Channel
        const channel = supabase.channel('global_presence')
        presenceChannel.current = channel

        channel
            .on('presence', { event: 'sync' }, () => {
                // Determine other users' status (optional for global tracking)
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        user_id: user.id,
                        online_at: new Date().toISOString(),
                        status: 'online'
                    })
                }
            })

        // 3. Handle Visibility Change (Away status)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Wait 3 mins before setting away
                awayTimeoutRef.current = setTimeout(() => {
                    updateStatus('away')
                }, 3 * 60 * 1000)
            } else {
                if (awayTimeoutRef.current) clearTimeout(awayTimeoutRef.current)
                updateStatus('online')
            }
        }

        // 4. Handle Tab Close / Disconnect
        const handleBeforeUnload = () => {
            updateStatus('offline')
            if (presenceChannel.current) {
                presenceChannel.current.untrack()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('beforeunload', handleBeforeUnload)
            if (awayTimeoutRef.current) clearTimeout(awayTimeoutRef.current)

            // Mark as offline on unmount/cleanup
            updateStatus('offline')
            supabase.removeChannel(channel)
        }
    }, [user])

    const updateStatus = async (newStatus: 'online' | 'away' | 'offline') => {
        if (!user) return
        setStatus(newStatus)
        try {
            await supabase
                .from('profiles')
                .update({
                    status: newStatus,
                    last_seen: new Date().toISOString()
                })
                .eq('id', user.id)

            // Also update realtime track if connected
            if (presenceChannel.current) {
                await presenceChannel.current.track({
                    user_id: user.id,
                    online_at: new Date().toISOString(),
                    status: newStatus
                })
            }
        } catch (err) {
            console.error('Failed to update presence:', err)
        }
    }

    return { status }
}
