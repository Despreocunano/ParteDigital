import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.8";
import { MercadoPagoConfig, Payment } from "npm:mercadopago";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the payment ID from the query string
    const url = new URL(req.url);
    const paymentId = url.searchParams.get("data.id");
    
    if (!paymentId) {
      throw new Error("No payment ID provided");
    }

    // Initialize MercadoPago
    const client = new MercadoPagoConfig({ 
      accessToken: Deno.env.get("MERCADOPAGO_ACCESS_TOKEN") ?? "" 
    });
    const payment = new Payment(client);

    // Get payment details
    const paymentData = await payment.get({ id: paymentId });

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

    // Update payment status in database
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        status: paymentData.status,
        payment_id: paymentId,
        payment_details: paymentData,
        updated_at: new Date().toISOString(),
      })
      .eq("external_reference", paymentData.external_reference);

    if (updateError) {
      console.error("Error updating payment:", updateError);
      throw new Error("Failed to update payment status");
    }

    // If payment is approved, update the invitation status
    if (paymentData.status === "approved") {
      const { error: invitationError } = await supabase
        .from("invitations")
        .update({
          status: "published",
          published_at: new Date().toISOString(),
        })
        .eq("user_id", paymentData.external_reference.split('-')[0]); // Extract user_id from external_reference

      if (invitationError) {
        console.error("Error updating invitation:", invitationError);
        throw new Error("Failed to update invitation status");
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
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
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
}); 