// Bubble style options for chat customization

export interface BubbleStyle {
    id: 'soft' | 'flat' | 'elevated'
    name: string
    description: string
    preview: {
        borderRadius: string
        boxShadow: string
        border?: string
    }
}

export const BUBBLE_STYLES: BubbleStyle[] = [
    {
        id: 'soft',
        name: 'Soft Rounded',
        description: 'Gentle curves with minimal shadow',
        preview: {
            borderRadius: '24px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.04)'
        }
    },
    {
        id: 'flat',
        name: 'Minimal Flat',
        description: 'Clean and simple',
        preview: {
            borderRadius: '12px',
            boxShadow: 'none',
            border: '1px solid rgba(0, 0, 0, 0.06)'
        }
    },
    {
        id: 'elevated',
        name: 'Slightly Elevated',
        description: 'Subtle depth (default)',
        preview: {
            borderRadius: '20px',
            boxShadow: '0 -2px 8px rgba(255, 255, 255, 0.4), 0 2px 8px rgba(0, 0, 0, 0.04)'
        }
    }
]

export function getBubbleStyleById(id: string): BubbleStyle | undefined {
    return BUBBLE_STYLES.find(s => s.id === id)
}
