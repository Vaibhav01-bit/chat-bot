import { supabase } from './supabaseClient'

export const friendService = {
    /**
     * Send a friend request
     */
    sendFriendRequest: async (receiverId: string) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        // Check if request already exists
        // Checking logical OR (A=me AND B=them) OR (A=them AND B=me) is hard with simple query
        // Simplest is just insert and catch unique violation, OR select distinct

        // Proper check:
        const { count } = await supabase
            .from('friend_requests')
            .select('id', { count: 'exact', head: true })
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)

        if (count && count > 0) {
            throw new Error('Friend request already exists or you are already friends')
        }

        const { error } = await supabase.from('friend_requests').insert({
            sender_id: user.id,
            receiver_id: receiverId,
            status: 'pending'
        })
        if (error) throw error
    },

    /**
     * Get pending incoming requests
     */
    getIncomingRequests: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return []

        const { data, error } = await supabase
            .from('friend_requests')
            .select(`
                id,
                created_at,
                sender:profiles!sender_id (id, full_name, username, avatar_url)
            `)
            .eq('receiver_id', user.id)
            .eq('status', 'pending')

        if (error) throw error
        return data
    },

    /**
     * Get pending outgoing requests
     */
    getOutgoingRequests: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return []

        const { data, error } = await supabase
            .from('friend_requests')
            .select(`
                id,
                created_at,
                receiver:profiles!receiver_id (id, full_name, username, avatar_url)
            `)
            .eq('sender_id', user.id)
            .eq('status', 'pending')

        if (error) throw error
        return data
    },

    /**
     * Accept a request
     */
    acceptRequest: async (requestId: string) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

        // 1. Update request status
        const { data: request, error: updateError } = await supabase
            .from('friend_requests')
            .update({ status: 'accepted' })
            .eq('id', requestId)
            .eq('receiver_id', user.id) // Ensure only receiver can accept
            .select()
            .single()

        if (updateError) throw updateError
        if (!request) throw new Error('Request not found')

        // 2. Add to friendships
        // We need to sort IDs to satisfy check constraint user1_id < user2_id
        const u1 = user.id < request.sender_id ? user.id : request.sender_id
        const u2 = user.id < request.sender_id ? request.sender_id : user.id

        const { error: friendError } = await supabase
            .from('friendships')
            .insert({
                user1_id: u1,
                user2_id: u2
            })

        if (friendError) {
            // Rollback status? Ideally we use a stored procedure or trigger.
            // But for now, just log. Unique constraint might trigger if already friends.
            console.error('Error creating friendship:', friendError)
        }
    },

    /**
     * Reject a request
     */
    rejectRequest: async (requestId: string) => {
        const { error } = await supabase
            .from('friend_requests')
            .delete()
            .eq('id', requestId)
        if (error) throw error
    },

    /**
     * Check friendship status between current user and another
     */
    getFriendshipStatus: async (otherUserId: string) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return 'none'

        // Check Friendships
        const { count } = await supabase
            .from('friendships')
            .select('id', { count: 'exact', head: true })
            .or(`and(user1_id.eq.${user.id},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${user.id})`)

        if (count && count > 0) return 'friends'

        // Check Requests
        const { data: requests } = await supabase
            .from('friend_requests')
            .select('sender_id, status')
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
            .maybeSingle()

        if (requests) {
            if (requests.status === 'accepted') return 'friends' // Should correspond to friendship table
            if (requests.status === 'pending') {
                return requests.sender_id === user.id ? 'sent' : 'received'
            }
        }

        return 'none'
    },

    /**
     * Get list of friends
     */
    getFriends: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return []

        const { data: friendships, error } = await supabase
            .from('friendships')
            .select('user1_id, user2_id')
            .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)

        if (error) throw error

        const friendIds = friendships.map(f =>
            f.user1_id === user.id ? f.user2_id : f.user1_id
        )

        if (friendIds.length === 0) return []

        const { data: friends, error: profileError } = await supabase
            .from('profiles')
            .select('id, full_name, username, avatar_url')
            .in('id', friendIds)

        if (profileError) throw profileError
        return friends
    }
}
