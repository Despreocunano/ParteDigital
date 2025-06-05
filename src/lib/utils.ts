import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function calculateRsvpStats(guests: any[]) {
  const total = guests.length;
  const attending = guests.filter(guest => guest.attending === true).length;
  const notAttending = guests.filter(guest => guest.attending === false).length;
  const pending = total - attending - notAttending;
  
  return {
    total,
    attending,
    notAttending,
    pending,
    attendingPercent: total ? Math.round((attending / total) * 100) : 0,
    pendingPercent: total ? Math.round((pending / total) * 100) : 0,
  };
}