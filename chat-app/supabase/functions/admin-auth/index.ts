
// @ts-ignore
declare const Deno: any

// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { email, password } = await req.json()
        const clientIp = req.headers.get('x-forwarded-for') || 'unknown'

        // 1. Rate Limiting: Check last 15 mins failures
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString()
        const { count, error: countError } = await supabaseAdmin
            .from('admin_logs')
            .select('*', { count: 'exact', head: true })
            .eq('ip_address', clientIp)
            .eq('success', false)
            .gte('created_at', fifteenMinutesAgo)

        if (countError) throw countError
        if (count && count >= 5) {
            await supabaseAdmin.from('admin_logs').insert({
                ip_address: clientIp,
                attempted_email: email,
                success: false,
                details: 'Rate limit exceeded'
            })
            return new Response(JSON.stringify({ error: 'Too many login attempts. Try again in 15 minutes.' }), {
                status: 429,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        // 2. RPC Verification
        const { data: result, error: rpcError } = await supabaseAdmin
            .rpc('verify_admin_credentials', {
                email_input: email,
                password_input: password
            })

        if (rpcError) throw rpcError

        if (result && result.success) {
            // Log Success
            await supabaseAdmin.from('admin_logs').insert({
                ip_address: clientIp,
                attempted_email: email,
                success: true,
                details: 'Login successful'
            })

            // Return success with minimal info (Token should be generated here in a real app, but for this MVP we return a success flag)
            // Ideally we'd sign a JWT here. 
            return new Response(JSON.stringify({
                success: true,
                token: `admin_session_${result.id}_${Date.now()}`, // Simple token for MVP
                role: result.role
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        } else {
            // Log Failure
            await supabaseAdmin.from('admin_logs').insert({
                ip_address: clientIp,
                attempted_email: email,
                success: false,
                details: 'Invalid credentials'
            })

            return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
