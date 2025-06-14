// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

console.log("Hello from Functions!")

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
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

    // Parse the webhook payload
    const payload = await req.json();
    const { type, data } = payload;

    // Only process payment notifications
    if (type !== "payment") {
      return new Response(
        JSON.stringify({ success: true, message: "Ignored non-payment notification" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get payment details from MercadoPago
    const paymentId = data.id;
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${Deno.env.get("MERCADOPAGO_ACCESS_TOKEN")}`,
        },
      }
    );

    const paymentDetails = await response.json();
    const { status, external_reference, preference_id } = paymentDetails;

    // Update payment status in database
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: status === "approved" ? "approved" : 
                status === "rejected" ? "rejected" : 
                status === "pending" ? "pending" : "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("preference_id", preference_id);

    if (updateError) {
      console.error("Error updating payment:", updateError);
      throw new Error("Failed to update payment status");
    }

    // If payment is approved, update the user's published status
    if (status === "approved") {
      const { error: publishError } = await supabase
        .from("users")
        .update({
          is_published: true,
          published_at: new Date().toISOString(),
        })
        .eq("id", external_reference);

      if (publishError) {
        console.error("Error updating user publish status:", publishError);
        throw new Error("Failed to update user publish status");
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Failed to process webhook",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/payment-webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
