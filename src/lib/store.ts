import { create } from 'zustand';
import { Attendee, GuestTable } from '../types/supabase';

interface AppState {
  guests: Attendee[];
  tables: GuestTable[];
  setGuests: (guests: Attendee[]) => void;
  setTables: (tables: GuestTable[]) => void;
  updateGuest: (id: string, updates: Partial<Attendee>) => void;
  removeGuest: (id: string) => void;
  addGuest: (guest: Attendee) => void;
  updateTable: (id: string, updates: Partial<GuestTable>) => void;
  removeTable: (id: string) => void;
  addTable: (table: GuestTable) => void;
}

export const useStore = create<AppState>((set) => ({
  guests: [],
  tables: [],
  setGuests: (guests) => set({ guests }),
  setTables: (tables) => set({ tables }),
  updateGuest: (id, updates) =>
    set((state) => ({
      guests: state.guests.map((guest) =>
        guest.id === id ? { ...guest, ...updates } : guest
      ),
    })),
  removeGuest: (id) =>
    set((state) => ({
      guests: state.guests.filter((guest) => guest.id !== id),
    })),
  addGuest: (guest) =>
    set((state) => ({
      guests: [...state.guests, guest],
    })),
  updateTable: (id, updates) =>
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === id ? { ...table, ...updates } : table
      ),
    })),
  removeTable: (id) =>
    set((state) => ({
      tables: state.tables.filter((table) => table.id !== id),
    })),
  addTable: (table) =>
    set((state) => ({
      tables: [...state.tables, table],
    })),
}));