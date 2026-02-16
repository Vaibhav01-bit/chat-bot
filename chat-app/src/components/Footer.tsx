import { useNavigate, useLocation } from 'react-router-dom';

export function Footer() {
    const navigate = useNavigate();
    const location = useLocation();

    const scrollToSection = (id: string) => {
        // If not on landing page, navigate there first
        if (location.pathname !== '/') {
            navigate('/');
            // Small timeout to allow navigation to complete before scrolling
            setTimeout(() => {
                const element = document.getElementById(id);
                element?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.getElementById(id);
            element?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-purple-950/10">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    {/* Logo & Description */}
                    <div>
                        <div
                            className="flex items-center gap-2 mb-4 group cursor-pointer"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-purple-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all">
                                CM
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                ChatMate
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Your intelligent conversation workspace powered by AI.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-purple-400">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <button onClick={() => scrollToSection('features')} className="hover:text-purple-400 hover:translate-x-1 transition-all inline-block">
                                    Features
                                </button>
                            </li>
                            <li>
                                <button onClick={() => scrollToSection('how-it-works')} className="hover:text-purple-400 hover:translate-x-1 transition-all inline-block">
                                    How It Works
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate('/login')} className="hover:text-purple-400 hover:translate-x-1 transition-all inline-block">
                                    Sign In
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate('/signup')} className="hover:text-purple-400 hover:translate-x-1 transition-all inline-block">
                                    Get Started
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold mb-4 text-purple-400">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <a href="#" className="hover:text-purple-400 hover:translate-x-1 transition-all inline-block">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-purple-400 hover:translate-x-1 transition-all inline-block">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-purple-400 hover:translate-x-1 transition-all inline-block">
                                    Cookie Policy
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} ChatMate. All rights reserved. Made with 💜 by Vaibhav Ingle</p>
                </div>
            </div>
        </footer>
    );
}
