// Built-in wallpapers for chat customization
// Curated collection of subtle, premium wallpapers

export interface Wallpaper {
    id: string
    name: string
    type: 'gradient' | 'texture'
    value: string // CSS gradient or image URL
    preview: string // Preview color/gradient
}

// Soft gradient wallpapers
export const GRADIENT_WALLPAPERS: Wallpaper[] = [
    {
        id: 'soft-dawn',
        name: 'Soft Dawn',
        type: 'gradient',
        value: 'linear-gradient(135deg, #FFE5E5 0%, #FFD4A3 100%)',
        preview: 'linear-gradient(135deg, #FFE5E5 0%, #FFD4A3 100%)'
    },
    {
        id: 'ocean-mist',
        name: 'Ocean Mist',
        type: 'gradient',
        value: 'linear-gradient(135deg, #E0F4FF 0%, #B8E6E6 100%)',
        preview: 'linear-gradient(135deg, #E0F4FF 0%, #B8E6E6 100%)'
    },
    {
        id: 'forest-calm',
        name: 'Forest Calm',
        type: 'gradient',
        value: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
        preview: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)'
    },
    {
        id: 'lavender-dreams',
        name: 'Lavender Dreams',
        type: 'gradient',
        value: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
        preview: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)'
    },
    {
        id: 'warm-sand',
        name: 'Warm Sand',
        type: 'gradient',
        value: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)',
        preview: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)'
    },
    {
        id: 'rose-quartz',
        name: 'Rose Quartz',
        type: 'gradient',
        value: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)',
        preview: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)'
    },
    {
        id: 'sky-blue',
        name: 'Sky Blue',
        type: 'gradient',
        value: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
        preview: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)'
    },
    {
        id: 'mint-fresh',
        name: 'Mint Fresh',
        type: 'gradient',
        value: 'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 100%)',
        preview: 'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 100%)'
    }
]

// Subtle texture patterns (using CSS patterns or data URIs)
export const TEXTURE_WALLPAPERS: Wallpaper[] = [
    {
        id: 'paper-grain',
        name: 'Paper Grain',
        type: 'texture',
        value: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.01) 2px, rgba(0,0,0,0.01) 4px)',
        preview: '#FAFAFA'
    },
    {
        id: 'linen-fabric',
        name: 'Linen Fabric',
        type: 'texture',
        value: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.015) 10px, rgba(0,0,0,0.015) 20px)',
        preview: '#F5F5F7'
    },
    {
        id: 'subtle-dots',
        name: 'Subtle Dots',
        type: 'texture',
        value: 'radial-gradient(circle, rgba(0,0,0,0.02) 1px, transparent 1px)',
        preview: '#FFFFFF'
    }
]

export const ALL_WALLPAPERS = [...GRADIENT_WALLPAPERS, ...TEXTURE_WALLPAPERS]

// Get wallpaper by ID
export function getWallpaperById(id: string): Wallpaper | undefined {
    return ALL_WALLPAPERS.find(w => w.id === id)
}

// Get wallpaper CSS
export function getWallpaperCSS(wallpaper: Wallpaper, dim: number = 0, blur: number = 0): string {
    const dimValue = 1 - (dim / 100)
    const blurValue = blur

    return `
    background: ${wallpaper.value};
    opacity: ${dimValue};
    filter: blur(${blurValue}px);
  `
}
