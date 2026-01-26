import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'

interface StreakData {
    current_streak: number
    longest_streak: number
    last_activity_date: string
}

export const useStreaks = () => {
    const { user } = useAuth()
    const [streak, setStreak] = useState<StreakData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return
        fetchStreak()
    }, [user])

    const fetchStreak = async () => {
        if (!user) return

        const { data } = await supabase
            .from('user_streaks')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle()

        setStreak(data)
        setLoading(false)
    }

    const updateStreak = async () => {
        if (!user) return

        const today = new Date().toISOString().split('T')[0]

        const { data: existingStreak } = await supabase
            .from('user_streaks')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle()

        if (!existingStreak) {
            // First time
            const { data: newStreak } = await supabase
                .from('user_streaks')
                .insert({
                    user_id: user.id,
                    current_streak: 1,
                    longest_streak: 1,
                    last_activity_date: today
                })
                .select()
                .maybeSingle()

            setStreak(newStreak)
            return
        }

        const lastDate = new Date(existingStreak.last_activity_date)
        const todayDate = new Date(today)
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays === 0) {
            // Already counted today
            return
        } else if (diffDays === 1) {
            // Consecutive day
            const newStreakCount = existingStreak.current_streak + 1
            const { data: updatedStreak } = await supabase
                .from('user_streaks')
                .update({
                    current_streak: newStreakCount,
                    longest_streak: Math.max(newStreakCount, existingStreak.longest_streak),
                    last_activity_date: today
                })
                .eq('user_id', user.id)
                .select()
                .maybeSingle()

            setStreak(updatedStreak)
        } else {
            // Streak broken
            const { data: resetStreak } = await supabase
                .from('user_streaks')
                .update({
                    current_streak: 1,
                    last_activity_date: today
                })
                .eq('user_id', user.id)
                .select()
                .maybeSingle()

            setStreak(resetStreak)
        }
    }

    return { streak, loading, updateStreak, refreshStreak: fetchStreak }
}
