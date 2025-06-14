export interface LandingPageFormData {
  groom_name: string;
  bride_name: string;
  welcome_message: string;
  
  ceremony_date: string;
  ceremony_location: string;
  ceremony_time: string;
  ceremony_address: string;
  ceremony_place_id?: string;
  
  party_date: string;
  party_location: string;
  party_time: string;
  party_address: string;
  party_place_id?: string;
  
  music_enabled: boolean;
  selected_track: string;
  hashtag: string;

  // Additional Info
  dress_code: string;
  additional_info: string;

  accepts_kids: boolean;
  accepts_pets: boolean;

  couple_code: string;
  store: string;

  bank_info: {
    accountHolder: string;
    rut: string;
    bank: string;
    accountType: string;
    accountNumber: string;
    email: string;
  };
} 