import type { ReactNode } from 'react'
import { BottomNav } from '../components/BottomNav'
import { Sidebar } from '../components/Sidebar'
import { PageTransition } from '../components/PageTransition'

export function MainLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-[100dvh] bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-200">
            <Sidebar />
            <main className="md:ml-64 min-h-[100dvh] pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
            <BottomNav />
        </div>
    )
}
