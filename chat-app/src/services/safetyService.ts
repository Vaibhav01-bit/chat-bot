import { supabase } from './supabaseClient'

export const safetyService = {
    /**
     * Block a user
     */
    blockUser: async (blockedId: string) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { error } = await supabase.from('blocked_users').insert({
            blocker_id: user.id,
            blocked_id: blockedId
        })
        if (error) throw error
    },

    /**
     * Unblock a user
     */
    unblockUser: async (blockedId: string) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { error } = await supabase.from('blocked_users').delete().match({
            blocker_id: user.id,
            blocked_id: blockedId
        })
        if (error) throw error
    },

    /**
     * Get list of users blocked by the current user
     */
    getBlockedUsers: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return []

        const { data, error } = await supabase
            .from('blocked_users')
            .select('blocked_id')
            .eq('blocker_id', user.id)

        if (error) throw error
        return data.map(r => r.blocked_id)
    },

    /**
     * Report a user
     */
    reportUser: async (reportedId: string, reason: string, description?: string) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        const { error } = await supabase.from('reports').insert({
            reporter_id: user.id,
            reported_id: reportedId,
            reason,
            description
        })
        if (error) throw error
    }
}
