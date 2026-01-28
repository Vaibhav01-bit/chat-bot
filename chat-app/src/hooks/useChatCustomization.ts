import { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from '../context/AuthContext'

export interface ChatCustomization {
    wallpaper_type: 'none' | 'gradient' | 'texture' | 'custom'
    wallpaper_value?: string
    wallpaper_dim: number
    wallpaper_blur: number
    bubble_style: 'soft' | 'flat' | 'elevated'
    accent_color?: string
}

const DEFAULT_CUSTOMIZATION: ChatCustomization = {
    wallpaper_type: 'none',
    wallpaper_dim: 0,
    wallpaper_blur: 0,
    bubble_style: 'elevated'
}

export function useChatCustomization(chatId: string) {
    const { user } = useAuth()
    const [customization, setCustomization] = useState<ChatCustomization>(DEFAULT_CUSTOMIZATION)
    const [loading, setLoading] = useState(true)

    // Fetch customization from database
    useEffect(() => {
        if (!user || !chatId) {
            setLoading(false)
            return
        }

        const fetchCustomization = async () => {
            try {
                const { data, error } = await supabase
                    .from('chat_customizations')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('chat_id', chatId)
                    .single()

                if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
                    console.error('Error fetching customization:', error)
                    return
                }

                if (data) {
                    setCustomization({
                        wallpaper_type: data.wallpaper_type,
                        wallpaper_value: data.wallpaper_value,
                        wallpaper_dim: data.wallpaper_dim,
                        wallpaper_blur: data.wallpaper_blur,
                        bubble_style: data.bubble_style,
                        accent_color: data.accent_color
                    })
                }
            } catch (err) {
                console.error('Error in fetchCustomization:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchCustomization()
    }, [user, chatId])

    // Update customization
    const updateCustomization = async (updates: Partial<ChatCustomization>) => {
        if (!user || !chatId) return

        const newCustomization = { ...customization, ...updates }
        setCustomization(newCustomization)

        try {
            const { error } = await supabase
                .from('chat_customizations')
                .upsert({
                    user_id: user.id,
                    chat_id: chatId,
                    ...newCustomization
                }, {
                    onConflict: 'user_id,chat_id'
                })

            if (error) {
                console.error('Error updating customization:', error)
                // Revert on error
                setCustomization(customization)
            }
        } catch (err) {
            console.error('Error in updateCustomization:', err)
            setCustomization(customization)
        }
    }

    // Reset to default
    const resetCustomization = async () => {
        if (!user || !chatId) return

        setCustomization(DEFAULT_CUSTOMIZATION)

        try {
            await supabase
                .from('chat_customizations')
                .delete()
                .eq('user_id', user.id)
                .eq('chat_id', chatId)
        } catch (err) {
            console.error('Error resetting customization:', err)
        }
    }

    return {
        customization,
        updateCustomization,
        resetCustomization,
        loading
    }
}
