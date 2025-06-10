import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get slug from request body
    const { slug } = await req.json();
    console.log('Received slug:', slug);

    if (!slug) {
      return new Response(
        JSON.stringify({ error: "Slug is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Query the database
    const { data, error } = await supabase
      .from('landing_pages')
      .select('*, landing_templates(*)')
      .eq('slug', slug)
      .not('published_at', 'is', null)
      .is('unpublished_at', null)
      .single();

    console.log('Query result:', { data, error });

    if (error) {
      return new Response(
        JSON.stringify({ error: `Database error: ${error.message}` }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!data) {
      return new Response(
        JSON.stringify({ error: "Landing page not found" }),
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Check if the page is currently published
    const publishedAt = new Date(data.published_at);
    const now = new Date();

    if (now < publishedAt) {
      return new Response(
        JSON.stringify({ error: "Landing page is not yet published" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
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
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});