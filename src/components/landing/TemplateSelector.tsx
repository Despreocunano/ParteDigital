import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../lib/utils';
import { templates } from './templates';

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelect: (templateId: string) => void;
}

export function TemplateSelector({
  selectedTemplateId,
  onSelect
}: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.values(templates).map((template) => (
        <Card
          key={template.id}
          className={cn(
            'cursor-pointer transition-all hover:shadow-lg',
            selectedTemplateId === template.id && 'ring-2 ring-rose-500'
          )}
          onClick={() => onSelect(template.id)}
        >
          <div className="aspect-video relative overflow-hidden rounded-t-lg">
            <img
              src={template.preview}
              alt={template.name}
              className="object-cover w-full h-full"
            />
            {selectedTemplateId === template.id && (
              <div className="absolute inset-0 bg-rose-500 bg-opacity-20 flex items-center justify-center">
                <div className="bg-white text-rose-600 px-4 py-2 rounded-full text-sm font-medium">
                  Seleccionado
                </div>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900">{template.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{template.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}