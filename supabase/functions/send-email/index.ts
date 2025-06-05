import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.8';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const emailSchema = z.object({
  attendeeId: z.string().uuid(),
  subject: z.string(),
  message: z.string(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    const { attendeeId, subject, message } = emailSchema.parse(body);

    // Get attendee details
    const { data: attendee, error: attendeeError } = await supabase
      .from('attendees')
      .select('*')
      .eq('id', attendeeId)
      .eq('user_id', user.id)
      .single();

    if (attendeeError || !attendee) {
      throw new Error('Attendee not found or unauthorized');
    }

    // Get the sender email from environment variables
    const senderEmail = Deno.env.get('RESEND_SENDER_EMAIL');
    if (!senderEmail) {
      throw new Error('RESEND_SENDER_EMAIL environment variable is not set');
    }

    // Send email using Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: senderEmail,
        to: attendee.email,
        subject: subject,
        html: message,
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.json();
      console.error('Resend API error:', resendError);
      throw new Error(`Failed to send email: ${resendError.message || 'Unknown error'}`);
    }

    // Log the email
    const { error: logError } = await supabase
      .from('email_logs')
      .insert([{
        user_id: user.id,
        guest_id: attendeeId,
        subject: subject,
        content: message,
      }]);

    if (logError) {
      console.error('Failed to log email:', logError);
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      }),
      {
        status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});