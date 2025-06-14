export interface Place {
  name: string;
  formatted_address: string;
  place_id: string;
}

export interface PlacesAutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: Place) => void;
  error?: string;
}

export interface Track {
  id: string;
  name: string;
  artist: string;
  url?: string;
} 