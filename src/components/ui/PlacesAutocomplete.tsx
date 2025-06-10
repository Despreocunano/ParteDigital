import React from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
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

  const [autocomplete, setAutocomplete] = React.useState<google.maps.places.Autocomplete | null>(null);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address, place.place_id);
      }
    }
  };

  if (loadError) {
    return (
      <Input
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
        onChange={(e) => onChange(e.target.value)}
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
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
          placeholder={placeholder}
        />
      </Autocomplete>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}