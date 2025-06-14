import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.8";
import { MercadoPagoConfig, Preference } from "npm:mercadopago";

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
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

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

    // Verify the user's JWT and get their ID
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Parse request body
    const { amount, description, paymentType } = await req.json();

    if (!amount || !description || !paymentType) {
      throw new Error("Missing required parameters");
    }

    // Initialize MercadoPago
    const client = new MercadoPagoConfig({ 
      accessToken: Deno.env.get("MERCADOPAGO_ACCESS_TOKEN") ?? "" 
    });
    const preference = new Preference(client);

    // Create payment preference
    const preferenceData = await preference.create({
      items: [
        {
          title: description,
          unit_price: amount,
          quantity: 1,
          currency_id: "CLP"
        }
      ],
      back_urls: {
        success: `${Deno.env.get("FRONTEND_URL")}/success`,
        failure: `${Deno.env.get("FRONTEND_URL")}/failure`,
        pending: `${Deno.env.get("FRONTEND_URL")}/pending`
      },
      auto_return: "approved",
      external_reference: user.id,
      notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/payment-webhook`
    });

    // Record the payment in the database
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert([
        {
          user_id: user.id,
          amount: amount,
          description: description,
          type: paymentType,
          status: "pending",
          external_reference: preferenceData.id,
          preference_id: preferenceData.id,
        },
      ])
      .select()
      .single();

    if (paymentError) {
      console.error("Error recording payment:", paymentError);
      throw new Error("Failed to record payment");
    }

    return new Response(
      JSON.stringify({
        success: true,
        init_point: preferenceData.init_point
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error creating payment:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Failed to create payment",
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