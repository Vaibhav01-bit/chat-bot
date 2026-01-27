import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabaseClient'

export const AdminDebug = () => {
    const [logs, setLogs] = useState<string[]>([])

    const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])

    const runDiagnostics = async () => {
        setLogs([])
        addLog('Starting Diagnostics...')

        try {
            // 1. Check Config
            addLog('Checking Supabase Config...')
            const url = import.meta.env.VITE_SUPABASE_URL
            const key = import.meta.env.VITE_SUPABASE_ANON_KEY
            addLog(`URL: ${url ? 'Found' : 'MISSING'}`)
            addLog(`Key: ${key ? 'Found' : 'MISSING'}`)

            // 2. Query Admins
            addLog('Querying admins table...')
            const { data, error } = await supabase
                .from('admins')
                .select('*', { count: 'exact' })

            if (error) {
                addLog(`ERROR Querying Admins: ${error.message} (${error.code})`)
            } else {
                addLog(`SUCCESS: Found ${data?.length} admins.`)
                if (data && data.length > 0) {
                    data.forEach(a => {
                        addLog(`Admin User: ${a.username} | Role: ${a.role} | Pwd: ${a.password}`)
                    })
                }
            }

            // 3. Insert Test
            addLog('Attempting read-only check completed.')

            // 4. LocalStorage
            const token = localStorage.getItem('admin_token')
            addLog(`Current Admin Token: ${token || 'None'}`)

        } catch (err: any) {
            addLog(`CRITICAL EXCEPTION: ${err.message}`)
        }
        addLog('Diagnostics Complete.')
    }

    useEffect(() => {
        runDiagnostics()
    }, [])

    return (
        <div className="p-8 bg-black text-green-400 font-mono min-h-screen">
            <h1 className="text-xl font-bold mb-4">Admin Debug Console</h1>
            <button onClick={runDiagnostics} className="mb-4 px-4 py-2 bg-gray-800 text-white rounded">Rerun Tests</button>
            <div className="space-y-1">
                {logs.map((log, i) => (
                    <div key={i}>{log}</div>
                ))}
            </div>
        </div>
    )
}
