import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AlertProps {
  message: string;
  action?: {
    text: string;
    to: string;
  };
}

export function Alert({ message, action }: AlertProps) {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between items-center">
          <p className="text-sm text-amber-700">{message}</p>
          {action && (
            <Link
              to={action.to}
              className="ml-6 whitespace-nowrap text-sm font-medium text-amber-700 hover:text-amber-600"
            >
              {action.text} <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}