import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.8';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const rsvpSchema = z.object({
  userId: z.string().uuid(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  dietary_restrictions: z.string().optional().nullable(),
  has_plus_one: z.boolean(),
  plus_one_name: z.string().optional().nullable(),
  plus_one_dietary_restrictions: z.string().optional().nullable(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const body = await req.json();
    const validatedData = rsvpSchema.parse(body);

    // Prepare the attendee data
    const attendeeData = {
      user_id: validatedData.userId,
      first_name: validatedData.first_name,
      last_name: validatedData.last_name,
      email: validatedData.email,
      phone: validatedData.phone,
      rsvp_status: 'confirmed',
      dietary_restrictions: validatedData.dietary_restrictions,
      has_plus_one: validatedData.has_plus_one,
      plus_one_name: validatedData.has_plus_one ? validatedData.plus_one_name : null,
      plus_one_dietary_restrictions: validatedData.has_plus_one ? validatedData.plus_one_dietary_restrictions : null,
      plus_one_rsvp_status: validatedData.has_plus_one ? 'confirmed' : null,
    };

    const { data, error } = await supabase
      .from('attendees')
      .insert([attendeeData])
      .select()
      .single();

    if (error) {
      console.error('Error submitting RSVP:', error);
      throw error;
    }

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
    console.error('Error in submit-rsvp function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
}); 