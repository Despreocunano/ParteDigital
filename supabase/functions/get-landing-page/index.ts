import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { slug } = await req.json();

    if (!slug) {
      throw new Error("Slug is required");
    }

    const { data, error } = await supabase
      .from('landing_pages')
      .select('*, landing_templates(*)')
      .eq('slug', slug)
      .not('published_at', 'is', null)
      .is('unpublished_at', null)
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    if (!data) {
      throw new Error("Landing page not found");
    }

    // Check if the page is currently published
    const publishedAt = new Date(data.published_at);
    const now = new Date();

    if (now < publishedAt) {
      throw new Error("Landing page is not yet published");
    }

    return new Response(
      JSON.stringify({ data }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching landing page:", error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to fetch landing page",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});