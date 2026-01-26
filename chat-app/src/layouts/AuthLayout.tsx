import type { ReactNode } from 'react'

export const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-200">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl opacity-50 dark:opacity-20" />
                <div className="absolute top-1/2 left-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl opacity-50 dark:opacity-20" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 border border-zinc-100 dark:border-zinc-700">
                    <div className="flex justify-center mb-6">
                        <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/30">
                            CM
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}
