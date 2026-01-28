import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    children: ReactNode
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary: 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-tertiary)] text-white border border-transparent hover:shadow-lg active:scale-[0.97]',
        secondary: 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 hover:shadow-md active:scale-[0.97]',
        outline: 'border-2 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-[0.97]',
        ghost: 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent active:scale-[0.97]',
    }

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3.5 text-lg',
    }

    const getBoxShadow = () => {
        if (variant === 'primary') {
            return '0 -2px 8px rgba(255,255,255,0.2), 0 6px 16px rgba(107,138,255,0.3), inset 0 1px 0 rgba(255,255,255,0.25)'
        }
        return '0 -2px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.2)'
    }

    return (
        <button
            className={twMerge(baseStyles, variants[variant], sizes[size], className)}
            disabled={isLoading || disabled}
            style={{
                boxShadow: variant !== 'ghost' && variant !== 'outline' ? getBoxShadow() : undefined
            }}
            onMouseEnter={(e) => {
                if (!disabled && !isLoading && variant !== 'ghost') {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    if (variant === 'primary') {
                        e.currentTarget.style.boxShadow = '0 -3px 12px rgba(255,255,255,0.25), 0 10px 24px rgba(107,138,255,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
                    } else {
                        e.currentTarget.style.boxShadow = '0 -3px 10px rgba(255,255,255,0.4), 0 8px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.25)'
                    }
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled && !isLoading) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    if (variant !== 'ghost' && variant !== 'outline') {
                        e.currentTarget.style.boxShadow = getBoxShadow()
                    }
                }
            }}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            ) : null}
            {children}
        </button>
    )
}
