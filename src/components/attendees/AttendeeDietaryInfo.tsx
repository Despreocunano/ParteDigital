import React from 'react';

interface AttendeeDietaryInfoProps {
  dietaryRestrictions?: string | null;
}

export function AttendeeDietaryInfo({ dietaryRestrictions }: AttendeeDietaryInfoProps) {
  if (!dietaryRestrictions) {
    return null;
  }

  return (
    <div className="text-sm space-y-2">
      <div>
        <p className="text-xs font-medium text-gray-500">Restricciones Alimentarias:</p>
        <p className="text-xs text-gray-600 mt-1">{dietaryRestrictions}</p>
      </div>
    </div>
  );
}