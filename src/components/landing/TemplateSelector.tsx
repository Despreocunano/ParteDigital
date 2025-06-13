import { useRef } from 'react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../lib/utils';
import { templates } from './templates';
import { Modal } from '../ui/Modal';

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelect: (templateId: string) => void;
  showAllTemplates: boolean;
  setShowAllTemplates: (show: boolean) => void;
}

export function TemplateSelector({
  selectedTemplateId,
  onSelect,
  showAllTemplates,
  setShowAllTemplates
}: TemplateSelectorProps) {
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
      <div className="overflow-x-auto pb-4 -mx-6 px-6" ref={scrollContainerRef}>
        <div className="flex gap-6 min-w-max py-4">
      {Object.values(templates).map((template) => (
        <Card
          key={template.id}
              data-template-id={template.id}
          className={cn(
                'cursor-pointer transition-all hover:shadow-lg w-[200px] flex-shrink-0',
            selectedTemplateId === template.id && 'ring-2 ring-rose-500'
          )}
          onClick={() => onSelect(template.id)}
        >
          <div className="aspect-[3/5] max-h-[300px] relative overflow-hidden mx-auto p-1">
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
            <h3 className="font-semibold text-gray-900 text-center">{template.name}</h3>
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
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {Object.values(templates).map((template) => (
              <Card
                key={template.id}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-lg',
                  selectedTemplateId === template.id && 'ring-2 ring-rose-500'
                )}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="aspect-[3/5] max-h-[300px] relative overflow-hidden rounded-t-lg mx-auto">
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
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}