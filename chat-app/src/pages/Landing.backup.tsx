import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MessageSquare, Zap, Shield, Brain, ArrowRight, Check, Sparkles } from 'lucide-react'
import { useEffect } from 'react'

export function Landing() {
    const navigate = useNavigate()
    const { user } = useAuth()

    // Redirect authenticated users to /chat
    useEffect(() => {
        if (user) {
            navigate('/chat')
        }
    }, [user, navigate])

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        element?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-900/50 border-b border-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/50">
                                CC
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                ChatCat
                            </span>
                        </div>

                        {/* Nav Links - Hidden on mobile */}
                        <div className="hidden md:flex items-center gap-8">
                            <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition-colors">
                                Features
                            </button>
                            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-300 hover:text-white transition-colors">
                                How It Works
                            </button>
                            <button onClick={() => scrollToSection('preview')} className="text-gray-300 hover:text-white transition-colors">
                                Preview
                            </button>
                        </div>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                                <Sparkles className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-blue-300">AI-Powered Conversations</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                                Chat Smarter
                                <br />
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    with AI
                                </span>
                            </h1>

                            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0">
                                Your intelligent conversation workspace powered by AI. Experience seamless communication with smart responses and secure chats.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Get Started Free
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300"
                                >
                                    Sign In
                                </button>
                            </div>
                        </div>

                        {/* Right Content - Animated Chat Preview */}
                        <div className="hidden lg:block">
                            <div className="relative">
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl rounded-full"></div>

                                {/* Chat Preview Card */}
                                <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
                                    <div className="space-y-4">
                                        {/* Message 1 */}
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0"></div>
                                            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-4">
                                                <p className="text-sm text-gray-300">Hey! How can I help you today?</p>
                                            </div>
                                        </div>

                                        {/* Message 2 */}
                                        <div className="flex gap-3 justify-end">
                                            <div className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl rounded-tr-none p-4">
                                                <p className="text-sm">Tell me about ChatCat features</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0"></div>
                                        </div>

                                        {/* Message 3 - Typing */}
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0"></div>
                                            <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-4">
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
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

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-gray-400">
                            Everything you need for intelligent conversations
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Feature 1 */}
                        <div className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">AI Conversations</h3>
                            <p className="text-gray-400">
                                Engage in natural, intelligent conversations powered by advanced AI
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Fast Responses</h3>
                            <p className="text-gray-400">
                                Get instant, accurate responses to your questions in real-time
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-green-500/50 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Secure Chats</h3>
                            <p className="text-gray-400">
                                Your conversations are encrypted and protected with enterprise-grade security
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="group backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-pink-500/50 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-pink-500/50 transition-all">
                                <Brain className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Smart Memory</h3>
                            <p className="text-gray-400">
                                AI remembers context and preferences for personalized interactions
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-400">
                            Get started in three simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="relative mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/50">
                                    <span className="text-2xl font-bold">1</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Create Account</h3>
                            <p className="text-gray-400">
                                Sign up in seconds with your email. No credit card required.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="relative mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/50">
                                    <span className="text-2xl font-bold">2</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Start Chatting</h3>
                            <p className="text-gray-400">
                                Begin conversations with AI instantly. Ask anything you want.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="relative mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mx-auto shadow-lg shadow-pink-500/50">
                                    <span className="text-2xl font-bold">3</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Manage & Save</h3>
                            <p className="text-gray-400">
                                Save important conversations and access them anytime, anywhere.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* App Preview Section */}
            <section id="preview" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                            Beautiful Interface
                        </h2>
                        <p className="text-xl text-gray-400">
                            Designed for productivity and elegance
                        </p>
                    </div>

                    {/* Mock Chat Interface */}
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        {/* Chat Header */}
                        <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
                            <div>
                                <h4 className="font-semibold">AI Assistant</h4>
                                <p className="text-sm text-gray-400">Online</p>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="p-6 space-y-4 min-h-[400px]">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0"></div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 max-w-md">
                                    <p className="text-sm">Hello! I'm your AI assistant. I can help you with questions, tasks, and conversations. What would you like to talk about?</p>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl rounded-tr-none p-4 max-w-md">
                                    <p className="text-sm">Can you help me brainstorm ideas for a project?</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0"></div>
                            </div>

                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0"></div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-4 max-w-md">
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
                            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 bg-transparent outline-none text-gray-300 placeholder-gray-500"
                                    disabled
                                />
                                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-medium">
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-12">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                            Ready to start chatting?
                        </h2>
                        <p className="text-xl text-gray-400 mb-8">
                            Join thousands of users already using ChatCat for smarter conversations
                        </p>
                        <button
                            onClick={() => navigate('/signup')}
                            className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 inline-flex items-center gap-2"
                        >
                            Create Free Account
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        {/* Logo & Description */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/50">
                                    CC
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    ChatCat
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Your intelligent conversation workspace powered by AI.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">
                                        Features
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">
                                        How It Works
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">
                                        Sign In
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => navigate('/signup')} className="hover:text-white transition-colors">
                                        Get Started
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Cookie Policy
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-400">
                        <p>&copy; {new Date().getFullYear()} ChatCat. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
