// Script de prueba para la función de contacto
// Ejecutar con: node test-contact-form.js

const SUPABASE_URL = 'https://your-project.supabase.co'; // Reemplaza con tu URL

async function testContactForm() {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Message',
    message: 'This is a test message to verify the contact form is working.'
  };

  try {
    console.log('Testing contact form...');
    console.log('URL:', `${SUPABASE_URL}/functions/v1/contact-form`);
    console.log('Data:', testData);

    const response = await fetch(`${SUPABASE_URL}/functions/v1/contact-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    console.log('Response body:', result);

    if (response.ok) {
      console.log('✅ Test passed! Contact form is working.');
    } else {
      console.log('❌ Test failed! Contact form returned an error.');
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Verificar que la URL esté configurada
if (SUPABASE_URL === 'https://your-project.supabase.co') {
  console.log('⚠️  Please update the SUPABASE_URL in this script with your actual Supabase URL');
} else {
  testContactForm();
} 