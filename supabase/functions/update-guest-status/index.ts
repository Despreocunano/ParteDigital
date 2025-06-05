import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.8';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const updateSchema = z.object({
  guestId: z.string().uuid(),
  attending: z.boolean().nullable(),
  currentUserId: z.string().uuid(),
  companion_attending: z.boolean().nullable().optional(),
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

    // Verify the user's JWT and get their ID
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    const { guestId, attending, companion_attending } = updateSchema.parse({
      ...body,
      currentUserId: user.id,
    });

    // First verify the guest exists and belongs to the user
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('*')
      .eq('id', guestId)
      .eq('user_id', user.id)
      .single();

    if (guestError || !guest) {
      throw new Error('Guest not found or unauthorized');
    }

    // Prepare update data
    const updateData: Record<string, any> = {
      attending,
      updated_at: new Date().toISOString(),
    };

    // Only update companion_attending if the guest has a companion
    if (guest.has_companion && companion_attending !== undefined) {
      updateData.companion_attending = companion_attending;
    }

    // Update the guest status
    const { data: updatedGuest, error: updateError } = await supabase
      .from('guests')
      .update(updateData)
      .eq('id', guestId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update guest: ${updateError.message}`);
    }

    if (!updatedGuest) {
      throw new Error('Failed to update guest status');
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: updatedGuest,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in update-guest-status:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      }),
      {
        status: error instanceof Error && 
          (error.message === 'Unauthorized' || error.message === 'No authorization header') 
          ? 401 : 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});