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
      .neq('published_at', null)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Landing page not found");

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