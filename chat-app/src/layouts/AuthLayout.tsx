import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

export const AuthLayout = ({ children }: { children: ReactNode }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white overflow-hidden relative">
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 10}s`,
                            animationDuration: `${10 + Math.random() * 20}s`
                        }}
                    />
                ))}
            </div>

            {/* Floating orbs */}
            <div
                className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
                style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
            />
            <div
                className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
                style={{
                    transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
                    animationDelay: '1s'
                }}
            />

            <div className="w-full max-w-md relative z-10 p-4">
                <div
                    className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 overflow-hidden transform transition-all duration-500 hover:shadow-blue-500/10"
                    style={{
                        transform: `perspective(1000px) rotateX(${mousePosition.y * 0.05}deg) rotateY(${mousePosition.x * 0.05}deg)`
                    }}
                >
                    {/* Glass Shine Effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="flex justify-center mb-8">
                        <div className="relative group cursor-pointer">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                            <div className="relative h-16 w-16 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl ring-1 ring-white/10">
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">CC</span>
                            </div>
                        </div>
                    </div>
                    {children}
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>© 2024 ChatCat. Secure & Private.</p>
                </div>
            </div>
        </div>
    )
}
