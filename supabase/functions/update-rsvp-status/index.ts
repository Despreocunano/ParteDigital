import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.8';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const RsvpStatus = z.enum(['pending', 'confirmed', 'declined']);

const updateSchema = z.object({
  attendeeId: z.string().uuid(),
  status: RsvpStatus,
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    const validatedData = updateSchema.parse(body);

    // First verify the attendee exists and belongs to the user
    const { data: attendee, error: attendeeError } = await supabaseClient
      .from('attendees')
      .select('*')
      .eq('id', validatedData.attendeeId)
      .eq('user_id', user.id)
      .single();

    if (attendeeError || !attendee) {
      throw new Error('Attendee not found or unauthorized');
    }

    // Prepare update data
    const updateData: Record<string, any> = {
      rsvp_status: validatedData.status,
      updated_at: new Date().toISOString(),
    };

    // Si el invitado tiene acompañante, el acompañante debe tener el mismo estado
    if (attendee.has_plus_one) {
      updateData.plus_one_rsvp_status = validatedData.status;
    }

    const { data, error } = await supabaseClient
      .from('attendees')
      .update(updateData)
      .eq('id', validatedData.attendeeId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
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