import React from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { Input } from './Input';

const libraries: ("places")[] = ["places"];

interface PlacesAutocompleteProps {
  label?: string;
  value?: string;
  onChange: (address: string, placeId?: string) => void;
  error?: string;
  placeholder?: string;
}

export function PlacesAutocomplete({
  label,
  value,
  onChange,
  error,
  placeholder
}: PlacesAutocompleteProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = React.useState<google.maps.places.Autocomplete | null>(null);

  React.useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google) return;

    try {
      const autocompleteInstance = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'cl' }
      });

      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        if (place.formatted_address) {
          onChange(place.formatted_address, place.place_id);
        }
      });

      setAutocomplete(autocompleteInstance);

      return () => {
        if (autocompleteInstance) {
          window.google.maps.event.clearInstanceListeners(autocompleteInstance);
        }
      };
    } catch (err) {
      console.error('Error initializing Google Places Autocomplete:', err);
    }
  }, [isLoaded, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  if (loadError) {
    console.error('Error loading Google Maps:', loadError);
    return (
      <Input
        label={label}
        value={value}
        onChange={handleInputChange}
        error={error || "Error loading Google Maps"}
        placeholder={placeholder}
      />
    );
  }

  if (!isLoaded) {
    return (
      <Input
        label={label}
        value={value}
        onChange={handleInputChange}
        error={error}
        placeholder={placeholder}
      />
    );
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        className={`flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}