import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.8";
import { MercadoPagoConfig, Payment } from "npm:mercadopago";

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

    const { paymentId, preferenceId } = await req.json();

    if (!paymentId || !preferenceId) {
      throw new Error("Missing payment information");
    }

    const client = new MercadoPagoConfig({ 
      accessToken: Deno.env.get("MERCADOPAGO_ACCESS_TOKEN") ?? "" 
    });
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: paymentId });

    if (paymentData.status !== "approved") {
      throw new Error("Payment not approved");
    }

    const { data: paymentRecord, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("payment_id", paymentId)
      .single();

    if (paymentError || !paymentRecord) {
      throw new Error("Payment record not found");
    }

    const { data: landingData, error: landingError } = await supabase
      .from("landing_pages")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (landingError || !landingData) {
      throw new Error("Landing page not found");
    }

    const slug = `${landingData.groom_name.toLowerCase()}-y-${landingData.bride_name.toLowerCase()}`
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const { data, error: updateError } = await supabase
      .from("landing_pages")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
        slug: slug
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      throw new Error("Failed to update landing page status");
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        data: {
          slug: slug,
          published_at: data.published_at
        }
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