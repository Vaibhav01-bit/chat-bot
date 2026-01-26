import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'

export const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900 p-4 text-center">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Page not found</p>
            <Button onClick={() => navigate('/')}>
                Go Home
            </Button>
        </div>
    )
}
