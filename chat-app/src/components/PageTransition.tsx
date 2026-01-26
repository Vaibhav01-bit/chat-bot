import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface PageTransitionProps {
    children: React.ReactNode
}

export const PageTransition = ({ children }: PageTransitionProps) => {
    const location = useLocation()
    const [displayLocation, setDisplayLocation] = useState(location)
    const [transitionStage, setTransitionStage] = useState('fadeIn')

    useEffect(() => {
        if (location !== displayLocation) {
            setTransitionStage('fadeOut')
        }
    }, [location, displayLocation])

    const onAnimationEnd = () => {
        if (transitionStage === 'fadeOut') {
            setTransitionStage('fadeIn')
            setDisplayLocation(location)
        }
    }

    return (
        <div
            className={`
                ${transitionStage === 'fadeIn' ? 'animate-fade-in' : ''}
                min-h-screen w-full
            `}
            onAnimationEnd={onAnimationEnd}
            key={location.pathname} // Simple key-based remount for entrance animation
        >
            {children}
        </div>
    )
}
