import React from 'react';
import { AttendeeStatus } from './AttendeeStatus';
import type { RsvpStatus } from '../../types/supabase';

interface PlusOneInfoProps {
  name: string | null;
  rsvpStatus: RsvpStatus | null;
  dietaryRestrictions?: string | null;
}

export function PlusOneInfo({ name, rsvpStatus, dietaryRestrictions }: PlusOneInfoProps) {
  if (!name) return null;

  return (
    <div className="border-t border-gray-200 pt-3">
      <p className="text-sm font-medium text-gray-700">Acompañante:</p>
      <div className="mt-2">
        <p className="text-sm">{name}</p>
        {rsvpStatus && (
          <div className="mt-1">
            <AttendeeStatus status={rsvpStatus} />
          </div>
        )}
        {dietaryRestrictions && (
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-500">Restricciones Alimentarias:</p>
            <p className="text-xs text-gray-600 mt-1">{dietaryRestrictions}</p>
          </div>
        )}
      </div>
    </div>
  );
}