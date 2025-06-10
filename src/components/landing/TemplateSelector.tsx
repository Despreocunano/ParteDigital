import React, { useRef } from 'react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../lib/utils';
import { templates } from './templates';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Grid } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelect: (templateId: string) => void;
}

export function TemplateSelector({
  selectedTemplateId,
  onSelect
}: TemplateSelectorProps) {
  const [showAllTemplates, setShowAllTemplates] = React.useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTemplate = (templateId: string) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const templateElement = container.querySelector(`[data-template-id="${templateId}"]`);
    if (templateElement) {
      templateElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    onSelect(templateId);
    setShowAllTemplates(false);
    scrollToTemplate(templateId);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Selecciona el diseño de tu invitación</h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowAllTemplates(true);
          }}
          leftIcon={<Grid className="h-4 w-4" />}
        >
          Ver todas las plantillas
        </Button>
      </div>

      <div className="overflow-x-auto pb-4 -mx-6 px-6" ref={scrollContainerRef}>
        <div className="flex gap-6 min-w-max">
          {Object.values(templates).map((template) => (
            <Card
              key={template.id}
              data-template-id={template.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-lg w-[280px] flex-shrink-0',
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
      </div>

      <Modal
        isOpen={showAllTemplates}
        onClose={() => setShowAllTemplates(false)}
        title="Todas las plantillas"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 max-w-6xl mx-auto">
          {Object.values(templates).map((template) => (
            <Card
              key={template.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-lg',
                selectedTemplateId === template.id && 'ring-2 ring-rose-500'
              )}
              onClick={() => handleTemplateSelect(template.id)}
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
      </Modal>
    </div>
  );
}