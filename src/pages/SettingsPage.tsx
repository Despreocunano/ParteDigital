import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useWedding } from '../hooks/useWedding';
import { Modal } from '../components/ui/Modal';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Trash2, AlertTriangle, Camera } from 'lucide-react';
import { ImageUpload } from '../components/ui/ImageUpload';
import toast from 'react-hot-toast';

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const { groomName, brideName, profileImage, updateNames, updateProfileImage } = useWedding();
  const navigate = useNavigate();
  
  const [newGroomName, setNewGroomName] = useState('');
  const [newBrideName, setNewBrideName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    setNewGroomName(groomName);
    setNewBrideName(brideName);
  }, [groomName, brideName]);

  const handleNamesUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateNames(newGroomName, newBrideName);
      if (result.success) {
        setSuccess('Nombres actualizados correctamente');
      } else {
        setError('Error al actualizar los nombres');
      }
    } catch (err) {
      setError('Error al actualizar los nombres');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpdate = async (imageUrl: string) => {
    try {
      await updateProfileImage(imageUrl);
      setShowImageModal(false);
      toast.success('Imagen actualizada correctamente');
    } catch (error) {
      console.error('Error updating profile image:', error);
      toast.error('Error al actualizar la imagen');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'ELIMINAR') {
      toast.error('Por favor escribe ELIMINAR para confirmar');
      return;
    }

    setIsDeletingAccount(true);
    try {
      // Delete all related data
      const { error: deleteError } = await supabase
        .rpc('delete_user_data', { user_id: user?.id });

      if (deleteError) throw deleteError;

      // Delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(
        user?.id as string
      );

      if (authError) throw authError;

      await signOut();
      navigate('/login');
      toast.success('Cuenta eliminada correctamente');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Error al eliminar la cuenta');
    } finally {
      setIsDeletingAccount(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-1">
          Gestiona tu cuenta y preferencias
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Boda</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNamesUpdate} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                  {success}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nombre del Novio"
                  value={newGroomName}
                  onChange={(e) => setNewGroomName(e.target.value)}
                  placeholder={groomName || "Juan"}
                  required
                />
                <Input
                  label="Nombre de la Novia"
                  value={newBrideName}
                  onChange={(e) => setNewBrideName(e.target.value)}
                  placeholder={brideName || "María"}
                  required
                />
              </div>
              <Button type="submit" isLoading={isLoading}>
                Guardar cambios
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil</label>
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    {profileImage ? (
                      <div className="w-16 h-16 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${profileImage})` }} />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Camera className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowImageModal(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-white text-xs">Cambiar</span>
                    </button>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">
                      Esta imagen será utilizada como logo en la firma de los correos enviados a tus invitados.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cuenta Creada</label>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.created_at 
                    ? new Date(user.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : new Date().toLocaleString()}
                </p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="danger"
                  onClick={() => setShowDeleteModal(true)}
                  leftIcon={<Trash2 className="h-4 w-4" />}
                >
                  Eliminar Cuenta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Eliminar Cuenta"
        confirmText="Eliminar Cuenta"
        isDanger
        isLoading={isDeletingAccount}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              Esta acción es irreversible. Se eliminarán todos tus datos, incluyendo invitados, mesas, canciones y la página web.
            </p>
          </div>

          <p className="text-sm text-gray-600">
            Para confirmar, escribe <span className="font-mono font-bold">ELIMINAR</span> en el campo de abajo:
          </p>

          <Input
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="ELIMINAR"
          />
        </div>
      </Modal>

      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        title="Foto de Perfil"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Esta imagen será utilizada como logo en la firma de los correos enviados a tus invitados.
          </p>
          <ImageUpload
            value={profileImage}
            onChange={handleImageUpdate}
            onRemove={() => handleImageUpdate('')}
            label="Subir foto de perfil"
          />
        </div>
      </Modal>
    </div>
  );
}