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
    console.log('Request received:', {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
    });

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing environment variables:', { supabaseUrl, supabaseKey });
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get slug from request body
    const body = await req.json();
    console.log('Request body:', body);
    const { slug } = body;

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
    console.log('Querying database for slug:', slug);
    const { data, error } = await supabase
      .from('landing_pages')
      .select('*, landing_templates(*)')
      .eq('slug', slug)
      .not('published_at', 'is', null)
      .is('unpublished_at', null)
      .single();

    console.log('Query result:', { data, error });

    if (error) {
      console.error('Database error:', error);
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
      console.log('No data found for slug:', slug);
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

    console.log('Date check:', {
      publishedAt: publishedAt.toISOString(),
      now: now.toISOString(),
      isPublished: now >= publishedAt
    });

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
    console.error("Error in get-landing-page:", error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to fetch landing page",
        details: error instanceof Error ? error.stack : undefined
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