import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, Brain, ArrowRight, Check, Sparkles, Rocket, Gamepad2, Shuffle } from 'lucide-react'
import { Footer } from '../components/Footer'
import { useEffect, useState } from 'react'

export function Landing() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    // Redirect authenticated users to /chat
    useEffect(() => {
        if (user) {
            navigate('/chat')
        }
    }, [user, navigate])

    // Track mouse position for parallax effects
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

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        element?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 text-white overflow-hidden relative">
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(50)].map((_, i) => (
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

            {/* Navbar with 3D effect */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/50 border-b border-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo with 3D hover */}
                        <div
                            className="flex items-center gap-2 cursor-pointer group"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/50 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                CC
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                ChatCat
                            </span>
                        </div>

                        {/* Nav Links */}
                        <div className="hidden md:flex items-center gap-8">
                            <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white hover:scale-110 transition-all duration-200">
                                Features
                            </button>
                            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-300 hover:text-white hover:scale-110 transition-all duration-200">
                                How It Works
                            </button>
                            <button onClick={() => scrollToSection('preview')} className="text-gray-300 hover:text-white hover:scale-110 transition-all duration-200">
                                Preview
                            </button>
                        </div>

                        {/* Auth Buttons with 3D effect */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:scale-105 transition-all duration-200"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transform transition-all duration-300"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section with Parallax */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
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

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 mb-6 animate-pulse">
                                <Sparkles className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
                                <span className="text-sm bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent font-semibold">
                                    Play Chess with Friends
                                </span>
                                <Gamepad2 className="w-4 h-4 text-pink-400" />
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-slide-up">
                                Connect, Chat
                                <br />
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                                    & Play Games
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 animate-fade-in">
                                Experience real-time messaging with built-in games. Challenge friends to chess while you chat, all in one beautiful interface.
                            </p>

                            {/* CTA Buttons with 3D effect */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="group px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transform transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <Rocket className="w-5 h-5" />
                                        Get Started Free
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 hover:scale-105 hover:border-purple-500/50 transform transition-all duration-300"
                                >
                                    Sign In
                                </button>
                            </div>
                        </div>

                        {/* Right Content - 3D Animated Chat Preview */}
                        <div className="hidden lg:block">
                            <div
                                className="relative transform hover:scale-105 transition-transform duration-500"
                                style={{
                                    transform: `perspective(1000px) rotateY(${mousePosition.x * 0.5}deg) rotateX(${-mousePosition.y * 0.5}deg)`
                                }}
                            >
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-3xl rounded-full animate-pulse" />

                                {/* Chat Preview Card */}
                                <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-2xl">
                                    <div className="space-y-4">
                                        {/* Message 1 - Animated */}
                                        <div className="flex gap-3 animate-slide-up">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex-shrink-0 animate-pulse" />
                                            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 hover:bg-white/15 transition-colors">
                                                <p className="text-sm text-gray-200">Hey! How can I help you today? ✨</p>
                                            </div>
                                        </div>

                                        {/* Message 2 */}
                                        <div className="flex gap-3 justify-end animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                            <div className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl rounded-tr-none p-4 hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                                                <p className="text-sm">You're on! e4 is my opening move 🚀</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex-shrink-0" />
                                        </div>

                                        {/* Message 3 - Typing */}
                                        <div className="flex gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex-shrink-0 animate-pulse" />
                                            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-4">
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                                                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section with 3D Card Tilt */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-gray-300">
                            Everything you need for intelligent conversations
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Feature Cards with 3D Hover */}
                        {[
                            {
                                icon: Gamepad2,
                                title: 'Play Games',
                                desc: 'Challenge friends to a game of Chess directly within your chat conversations',
                                delay: '0s',
                                styles: {
                                    border: 'hover:border-blue-500/50',
                                    shadow: 'hover:shadow-blue-500/20',
                                    iconBg: 'from-blue-500 to-blue-600',
                                    iconShadow: 'group-hover:shadow-blue-500/50',
                                    text: 'group-hover:text-blue-400'
                                }
                            },
                            {
                                icon: Shuffle,
                                title: 'Random Chat',
                                desc: 'Meet new people instantly. Connect with random users safely and anonymously.',
                                delay: '0.1s',
                                styles: {
                                    border: 'hover:border-orange-500/50',
                                    shadow: 'hover:shadow-orange-500/20',
                                    iconBg: 'from-orange-500 to-red-500',
                                    iconShadow: 'group-hover:shadow-orange-500/50',
                                    text: 'group-hover:text-orange-400'
                                }
                            },
                            {
                                icon: Shield,
                                title: 'Secure Chats',
                                desc: 'Your conversations are encrypted and protected with enterprise-grade security',
                                delay: '0.2s',
                                styles: {
                                    border: 'hover:border-green-500/50',
                                    shadow: 'hover:shadow-green-500/20',
                                    iconBg: 'from-green-500 to-green-600',
                                    iconShadow: 'group-hover:shadow-green-500/50',
                                    text: 'group-hover:text-green-400'
                                }
                            },
                            {
                                icon: Brain,
                                title: 'Smart Memory',
                                desc: 'Never lose a moment. Your conversations are saved securely and accessible anytime.',
                                delay: '0.3s',
                                styles: {
                                    border: 'hover:border-pink-500/50',
                                    shadow: 'hover:shadow-pink-500/20',
                                    iconBg: 'from-pink-500 to-pink-600',
                                    iconShadow: 'group-hover:shadow-pink-500/50',
                                    text: 'group-hover:text-pink-400'
                                }
                            }
                        ].map((feature, idx) => (
                            <div
                                key={idx}
                                className={`group backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/15 ${feature.styles.border} transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl ${feature.styles.shadow}`}
                                style={{ animationDelay: feature.delay }}
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.styles.iconBg} flex items-center justify-center mb-4 group-hover:shadow-lg ${feature.styles.iconShadow} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className={`text-xl font-semibold mb-2 ${feature.styles.text} transition-colors`}>{feature.title}</h3>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works with Animated Steps */}
            <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent relative">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-300">
                            Get started in three simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                num: '1',
                                title: 'Create Account',
                                desc: 'Sign up in seconds with your email. No credit card required.',
                                styles: {
                                    gradient: 'from-blue-500 to-blue-600',
                                    shadow: 'shadow-blue-500/50',
                                    line: 'from-blue-500/50',
                                    text: 'group-hover:text-blue-400'
                                }
                            },
                            {
                                num: '2',
                                title: 'Start Chatting',
                                desc: 'Begin conversations with AI instantly. Ask anything you want.',
                                styles: {
                                    gradient: 'from-purple-500 to-purple-600',
                                    shadow: 'shadow-purple-500/50',
                                    line: 'from-purple-500/50',
                                    text: 'group-hover:text-purple-400'
                                }
                            },
                            {
                                num: '3',
                                title: 'Manage & Save',
                                desc: 'Save important conversations and access them anytime, anywhere.',
                                styles: {
                                    gradient: 'from-pink-500 to-pink-600',
                                    shadow: 'shadow-pink-500/50',
                                    line: 'from-pink-500/50',
                                    text: 'group-hover:text-pink-400'
                                }
                            }
                        ].map((step, idx) => (
                            <div key={idx} className="text-center group">
                                <div className="relative mb-6">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.styles.gradient} flex items-center justify-center mx-auto shadow-lg ${step.styles.shadow} group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 transform`}>
                                        <span className="text-2xl font-bold">{step.num}</span>
                                    </div>
                                    {/* Connecting line */}
                                    {idx < 2 && (
                                        <div className={`hidden md:block absolute top-8 left-[calc(50%+2rem)] w-full h-0.5 bg-gradient-to-r ${step.styles.line} to-purple-500/50`} />
                                    )}
                                </div>
                                <h3 className={`text-xl font-semibold mb-3 ${step.styles.text} transition-colors`}>{step.title}</h3>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* App Preview with 3D Transform */}
            <section id="preview" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Beautiful Interface
                        </h2>
                        <p className="text-xl text-gray-300">
                            Designed for productivity and elegance
                        </p>
                    </div>

                    {/* Mock Chat Interface */}
                    <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02] transition-all duration-500">
                        {/* Chat Header */}
                        <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-pulse" />
                            <div>
                                <h4 className="font-semibold">Chess Master</h4>
                                <p className="text-sm text-green-400 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    Online
                                </p>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="p-6 space-y-4 min-h-[400px] bg-gradient-to-b from-transparent to-purple-950/5">
                            <div className="flex gap-3 animate-slide-up">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex-shrink-0" />
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 max-w-md hover:bg-white/15 transition-colors">
                                    <p className="text-sm">Hey! Up for a quick game of chess? ♟️</p>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl rounded-tr-none p-4 max-w-md hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                                    <p className="text-sm">Can you help me brainstorm ideas for a project? 🚀</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0" />
                            </div>

                            <div className="flex gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex-shrink-0" />
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 max-w-md hover:bg-white/15 transition-colors">
                                    <p className="text-sm mb-2">Absolutely! I'd love to help. Here are some approaches:</p>
                                    <ul className="text-sm space-y-1 ml-4">
                                        <li className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>Mind mapping your core concepts</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>Analyzing similar successful projects</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>Identifying your target audience</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Chat Input */}
                        <div className="bg-white/5 border-t border-white/10 px-6 py-4">
                            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10 hover:border-purple-500/50 transition-colors">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 bg-transparent outline-none text-gray-300 placeholder-gray-500"
                                    disabled
                                />
                                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all">
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA with 3D Effect */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/20 rounded-3xl p-12 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 transform">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Ready to start chatting?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Join thousands of users already using ChatCat for smarter conversations
                        </p>
                        <button
                            onClick={() => navigate('/signup')}
                            className="group px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transform transition-all duration-300 inline-flex items-center gap-2 relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <Rocket className="w-5 h-5" />
                                Create Free Account
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />

            <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
        </div>
    )
}
