import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { announcement_id } = await req.json()
    console.log('Received announcement_id:', announcement_id)

    if (!announcement_id) {
      return new Response(
        JSON.stringify({ error: 'announcement_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const appUrl = Deno.env.get('APP_URL') || 'http://localhost:5173'
    const fromEmail = Deno.env.get('FROM_EMAIL') || 'announcements@yourdomain.com'

    console.log('Env check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      hasResendKey: !!resendApiKey,
      appUrl,
      fromEmail,
    })

    if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing required environment variables' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch announcement
    const { data: announcement, error: annError } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', announcement_id)
      .single()

    if (annError || !announcement) {
      return new Response(
        JSON.stringify({ error: 'Announcement not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Guard: don't send if already sent or not published
    if (announcement.email_sent) {
      return new Response(
        JSON.stringify({ error: 'Emails already sent for this announcement', sent: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!announcement.is_published) {
      return new Response(
        JSON.stringify({ error: 'Announcement is not published' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch active subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('subscribers')
      .select('email, unsubscribe_token')
      .eq('is_active', true)

    if (subError) throw subError

    if (!subscribers || subscribers.length === 0) {
      await supabase
        .from('announcements')
        .update({ email_sent: true })
        .eq('id', announcement_id)

      return new Response(
        JSON.stringify({ sent: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Build snippet from body (first 200 chars, strip markdown)
    const snippet = announcement.body
      .replace(/[#*_`~\[\]()>]/g, '')
      .substring(0, 200)
      .trim() + (announcement.body.length > 200 ? '...' : '')

    // Send emails via Resend batch API (max 100 per call)
    const batches = []
    for (let i = 0; i < subscribers.length; i += 100) {
      batches.push(subscribers.slice(i, i + 100))
    }

    let totalSent = 0

    for (const batch of batches) {
      const emails = batch.map((sub: { email: string; unsubscribe_token: string }) => ({
        from: fromEmail,
        to: sub.email,
        subject: `New Announcement: ${announcement.title}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
            <h1 style="font-size: 24px; font-weight: 700; color: #1F1A1D; margin: 0 0 8px 0; letter-spacing: -0.02em;">
              ${announcement.title}
            </h1>
            <span style="display: inline-block; font-size: 12px; font-weight: 600; color: #4A4548; text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 16px;">
              ${announcement.category}
            </span>
            <p style="font-size: 16px; color: #4A4548; line-height: 1.5; margin: 0 0 24px 0;">
              ${snippet}
            </p>
            <a href="${appUrl}" style="display: inline-block; padding: 12px 24px; background: #1F1A1D; color: #FDFBF4; text-decoration: none; border-radius: 28px; font-size: 15px;">
              View announcement
            </a>
            <hr style="border: none; border-top: 1px solid #E8E6DE; margin: 32px 0 16px 0;" />
            <p style="font-size: 12px; color: #4A4548;">
              <a href="${appUrl}/unsubscribe?token=${sub.unsubscribe_token}" style="color: #4A4548;">
                Unsubscribe
              </a>
            </p>
          </div>
        `,
      }))

      const res = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emails),
      })

      console.log('Resend response status:', res.status)
      if (!res.ok) {
        const errBody = await res.text()
        console.error('Resend error:', errBody)
        throw new Error(`Resend API error ${res.status}: ${errBody}`)
      }

      totalSent += batch.length
    }

    // Mark emails as sent
    await supabase
      .from('announcements')
      .update({ email_sent: true })
      .eq('id', announcement_id)

    return new Response(
      JSON.stringify({ sent: totalSent }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Function error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
