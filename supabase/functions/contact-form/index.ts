import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const contactFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('El email no es válido'),
  subject: z.string().min(1, 'El asunto es requerido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

serve(async (req) => {
  console.log('=== Contact Form Function Called ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', Object.fromEntries(req.headers.entries()));

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Parsing request body...');
    const body = await req.json();
    console.log('Request body:', body);
    
    const { name, email, subject, message } = contactFormSchema.parse(body);
    console.log('Parsed data:', { name, email, subject, message });

    // Get environment variables
    const senderEmail = Deno.env.get('RESEND_SENDER_EMAIL');
    const adminEmail = Deno.env.get('ADMIN_EMAIL') || 'contacto@tuparte.digital';
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    console.log('Environment variables:', {
      senderEmail: senderEmail ? 'SET' : 'NOT SET',
      adminEmail,
      resendApiKey: resendApiKey ? 'SET' : 'NOT SET'
    });

    if (!senderEmail) {
      throw new Error('RESEND_SENDER_EMAIL environment variable is not set');
    }

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }

    // Simple email content for testing
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Nuevo mensaje de contacto</title>
        </head>
        <body>
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </body>
      </html>
    `;

    console.log('Sending email to admin...');
    
    // Send email to admin using Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: senderEmail,
        to: adminEmail,
        subject: `Nuevo mensaje de contacto: ${subject}`,
        html: htmlContent,
        replyTo: email,
      }),
    });

    console.log('Resend response status:', resendResponse.status);

    if (!resendResponse.ok) {
      const resendError = await resendResponse.json();
      console.error('Resend API error:', resendError);
      throw new Error(`Failed to send email: ${resendError.message || 'Unknown error'}`);
    }

    console.log('Email sent successfully to admin');

    // Send confirmation email to the user
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Mensaje recibido - Tu Parte Digital</title>
        </head>
        <body>
          <h2>¡Mensaje recibido!</h2>
          <p>Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos lo antes posible.</p>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </body>
      </html>
    `;

    console.log('Sending confirmation email...');

    const confirmationResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: senderEmail,
        to: email,
        subject: 'Mensaje recibido - Tu Parte Digital',
        html: confirmationHtml,
      }),
    });

    if (!confirmationResponse.ok) {
      console.error('Failed to send confirmation email');
    } else {
      console.log('Confirmation email sent successfully');
    }

    console.log('Contact form processed successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Mensaje enviado con éxito'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Error al procesar el formulario',
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
}); 