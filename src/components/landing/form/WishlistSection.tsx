import React, { useState } from 'react';
import { CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Switch } from '../../ui/Switch';
import { Button } from '../../ui/Button';
import { Plus, X, Upload, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';

interface WishlistItem {
  id: string;
  title: string;
  price: number;
  image_url: string;
  purchased: boolean;
}

interface WishlistSectionProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  items: WishlistItem[];
  onItemsChange: (items: WishlistItem[]) => void;
}

export function WishlistSection({ enabled, onEnabledChange, items, onItemsChange }: WishlistSectionProps) {
  const [isUploading, setIsUploading] = useState<string | null>(null);

  const handleAddItem = () => {
    const newItem: WishlistItem = {
      id: Date.now().toString(),
      title: '',
      price: 0,
      image_url: '',
      purchased: false
    };
    onItemsChange([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    onItemsChange(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof WishlistItem, value: any) => {
    onItemsChange(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleImageUpload = async (file: File, itemId: string) => {
    if (!file) return;

    setIsUploading(itemId);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `wishlist/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('landing-pages')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('landing-pages')
        .getPublicUrl(filePath);

      handleItemChange(itemId, 'image_url', publicUrl);
      toast.success('Imagen subida exitosamente');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setIsUploading(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, itemId);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <CardHeader className="px-0 pt-0 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
            <span className="text-rose-600 font-medium">12</span>
          </div>
          <CardTitle>Lista de Deseos</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Habilitar lista de deseos</h3>
            <p className="text-sm text-gray-500 mb-4">
              Permite a tus invitados ver y comprar regalos de tu lista de deseos
            </p>
            <p className="text-sm italic text-gray-400">
              Los pagos realizados por tus invitados tendrán un descuento de comisión del 3,19% realizado po mercado pago, despues de ese descuento tu dinero será transferido integramente a la cuenta que elijas en un plazo de 3 días hábiles.
            </p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={onEnabledChange}
          />
        </div>

        {enabled && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Regalos</h4>
              <Button
                type="button"
                onClick={handleAddItem}
                className="bg-rose-500 hover:bg-rose-600 text-white"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar regalo
              </Button>
            </div>

            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No hay regalos agregados aún</p>
                <p className="text-sm">Haz clic en "Agregar regalo" para comenzar</p>
              </div>
            )}

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-gray-900">Regalo {index + 1}</h5>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Título del regalo"
                      value={item.title}
                      onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
                      placeholder="Ej: Juego de sábanas"
                    />
                    <Input
                      label="Precio"
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Imagen del regalo</label>
                    <div className="flex items-center gap-4">
                      {item.image_url ? (
                        <div className="relative">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleItemChange(item.id, 'image_url', '')}
                            className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 text-white hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                          <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, item.id)}
                          className="hidden"
                          id={`image-upload-${item.id}`}
                        />
                        <label
                          htmlFor={`image-upload-${item.id}`}
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          {isUploading === item.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-rose-600 mr-2"></div>
                          ) : (
                            <Upload className="w-4 h-4 mr-2" />
                          )}
                          {isUploading === item.id ? 'Subiendo...' : 'Subir imagen'}
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG hasta 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-900 mb-2">💡 Consejo</h5>
                <p className="text-sm text-blue-700">
                  Agrega regalos de diferentes rangos de precios para que todos tus invitados 
                  puedan encontrar algo que se ajuste a su presupuesto.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </div>
  );
} 