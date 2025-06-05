import { supabase } from './supabase';

export async function uploadImage(file: File) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No authenticated session');

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://api.cloudflare.com/client/v4/images/v1', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_CLOUDFLARE_API_TOKEN}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const result = await response.json();
    return result.result.variants[0];
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}