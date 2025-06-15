import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { userId, slug } = await req.json();

    if (userId !== user.id) {
      throw new Error("Unauthorized");
    }

    // Generate unique slug with user ID
    const userIdSuffix = user.id.substring(0, 4);
    const uniqueSlug = `${slug}-${userIdSuffix}`;

    // Check if slug is already in use
    const { data: existingPage, error: checkError } = await supabase
      .from('landing_pages')
      .select('id')
      .eq('slug', uniqueSlug)
      .neq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error("Error checking slug availability");
    }

    if (existingPage) {
      throw new Error("This URL is already in use");
    }

    // Update landing page status
    const { data, error: updateError } = await supabase
      .from('landing_pages')
      .update({ 
        published_at: new Date().toISOString(),
        slug: uniqueSlug
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      throw new Error("Failed to update landing page status");
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        data
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error publishing landing:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Failed to publish landing page",
      }),
      {
        status: error instanceof Error && error.message === "Unauthorized" ? 401 : 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});