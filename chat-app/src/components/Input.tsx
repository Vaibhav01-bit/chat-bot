import { forwardRef, type ElementType, type InputHTMLAttributes } from 'react'

import { twMerge } from 'tailwind-merge'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: ElementType
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon: Icon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-200 mb-1.5 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {Icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <Icon size={20} />
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={twMerge(
                            'block w-full rounded-xl px-5 py-3.5 text-base transition-all duration-200',
                            'bg-white/5 border border-white/10 text-white placeholder-gray-500',
                            'focus:outline-none focus:border-blue-500/50 focus:bg-white/10 focus:ring-1 focus:ring-blue-500/50',
                            'hover:bg-white/10 hover:border-white/20',
                            error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
                            Icon && 'pl-12',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="mt-2 text-sm text-red-400 font-medium ml-1 animate-slide-up">{error}</p>}
            </div>
        )
    }
)
Input.displayName = 'Input'
