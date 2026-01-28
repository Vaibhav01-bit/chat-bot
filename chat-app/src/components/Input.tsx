import { type InputHTMLAttributes, forwardRef } from 'react'

import { twMerge } from 'tailwind-merge'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={twMerge(
                        'block w-full rounded-full px-5 py-3 text-base sm:text-sm transition-all duration-200',
                        'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400',
                        'border border-zinc-200 dark:border-zinc-700',
                        'focus:outline-none focus:border-transparent',
                        error && 'border-red-400 focus:border-red-400',
                        className
                    )}
                    style={{
                        boxShadow: error
                            ? 'inset 0 2px 4px rgba(239, 68, 68, 0.1), 0 0 0 3px rgba(239, 68, 68, 0.15)'
                            : 'inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)'
                    }}
                    onFocus={(e) => {
                        if (!error) {
                            e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 0 0 3px rgba(107, 138, 255, 0.15)'
                        }
                    }}
                    onBlur={(e) => {
                        if (!error) {
                            e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)'
                        }
                    }}
                    {...props}
                />
                {error && <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>}
            </div>
        )
    }
)
Input.displayName = 'Input'
