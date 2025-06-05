import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function useWedding() {
  const { user } = useAuth();
  const [groomName, setGroomName] = useState<string>('');
  const [brideName, setBrideName] = useState<string>('');
  const [profileImage, setProfileImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchNames = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('groom_name, bride_name, profile_image')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setGroomName(data?.groom_name || '');
      setBrideName(data?.bride_name || '');
      setProfileImage(data?.profile_image || '');
    } catch (error) {
      console.error('Error fetching names:', error);
      setGroomName('');
      setBrideName('');
      setProfileImage('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNames();
    }
  }, [user]);

  const updateNames = async (newGroomName: string, newBrideName: string) => {
    if (!user?.id) return { success: false };

    try {
      const { error } = await supabase
        .from('users')
        .upsert({ 
          id: user.id,
          groom_name: newGroomName,
          bride_name: newBrideName
        });

      if (error) throw error;

      setGroomName(newGroomName);
      setBrideName(newBrideName);
      toast.success('Nombres actualizados correctamente');
      return { success: true };
    } catch (error) {
      console.error('Error updating names:', error);
      toast.error('Error al actualizar los nombres');
      return { success: false, error };
    }
  };

  const updateProfileImage = async (imageUrl: string) => {
    if (!user?.id) return { success: false };

    try {
      const { error } = await supabase
        .from('users')
        .update({ profile_image: imageUrl })
        .eq('id', user.id);

      if (error) throw error;

      setProfileImage(imageUrl);
      return { success: true };
    } catch (error) {
      console.error('Error updating profile image:', error);
      throw error;
    }
  };

  return {
    groomName,
    brideName,
    profileImage,
    loading,
    updateNames,
    updateProfileImage,
  };
}