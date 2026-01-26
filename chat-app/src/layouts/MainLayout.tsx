import type { ReactNode } from 'react'
import { BottomNav } from '../components/BottomNav'
import { Sidebar } from '../components/Sidebar'

export function MainLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-200">
            <Sidebar />
            <main className="md:ml-64 min-h-screen pb-16 md:pb-0">
                {children}
            </main>
            <BottomNav />
        </div>
    )
}
