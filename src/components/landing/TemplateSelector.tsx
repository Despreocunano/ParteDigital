import { useRef, useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../lib/utils';
import { templates, getUniqueTemplates, templateVariants } from './templates';
import { Modal } from '../ui/Modal';
import { Palette } from 'lucide-react';
import type { Template, TemplateVariantGroup } from './templates/types';

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelect: (templateId: string) => void;
  showAllTemplates: boolean;
  setShowAllTemplates: (show: boolean) => void;
}

// Type guard to check if template is a variant group
function isVariantGroup(template: Template | TemplateVariantGroup): template is TemplateVariantGroup {
  return 'variants' in template && 'baseId' in template;
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

  const handleVariantSelect = (variantId: string) => {
    onSelect(variantId);
  };

  const uniqueTemplates = getUniqueTemplates();

  const renderTemplateCard = (template: Template | TemplateVariantGroup) => {
    if (isVariantGroup(template)) {
      // Render variant group (Deluxe/Terra)
      const currentVariant = template.variants.find((v) => v.id === selectedTemplateId) || template.variants[0];
      
      return (
        <Card
          key={template.baseId}
          data-template-id={template.baseId}
          className={cn(
            'cursor-pointer transition-all hover:shadow-lg w-[200px] flex-shrink-0',
            selectedTemplateId === currentVariant.id && 'ring-2 ring-rose-500'
          )}
          onClick={() => handleVariantSelect(currentVariant.id)}
        >
          <div className="aspect-[3/5] max-h-[300px] relative overflow-hidden mx-auto p-1">
            <img
              src={currentVariant.preview}
              alt={currentVariant.name}
              className="object-cover w-full h-full"
            />
            {selectedTemplateId === currentVariant.id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white text-rose-600 px-4 py-2 rounded-full text-sm font-medium">
                  Seleccionado
                </div>
              </div>
            )}
            {/* Color variant indicator */}
            <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1">
              <Palette className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 text-center mb-2">{template.name}</h3>
            {/* Color variant selector */}
            <div className="flex gap-2 justify-center">
              {template.variants.map((variant) => (
                <button
                  type="button"
                  key={variant.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVariantSelect(variant.id);
                  }}
                  className={cn(
                    'w-6 h-6 rounded-full border-2 transition-all',
                    selectedTemplateId === variant.id 
                      ? 'border-primary scale-110' 
                      : 'border-gray-300 hover:border-gray-400'
                  )}
                  style={{
                    backgroundColor: variant.colorValue
                  }}
                  title={variant.name}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      );
    } else {
      // Render regular template
  return (
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
              <div className="absolute inset-0 flex items-center justify-center">
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
      );
    }
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto pb-4 -mx-6 px-6" ref={scrollContainerRef}>
        <div className="flex gap-6 min-w-max py-4">
          {uniqueTemplates.map((template) => renderTemplateCard(template))}
        </div>
      </div>

      <Modal
        isOpen={showAllTemplates}
        onClose={() => setShowAllTemplates(false)}
        title="Todas las plantillas"
      >
        <div className="w-full">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {uniqueTemplates.map((template) => {
              if (isVariantGroup(template)) {
                const currentVariant = template.variants.find((v) => v.id === selectedTemplateId) || template.variants[0];
                
                return (
                  <Card
                    key={template.baseId}
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-lg',
                      selectedTemplateId === currentVariant.id && 'ring-2 ring-rose-500'
                    )}
                    onClick={() => handleTemplateSelect(currentVariant.id)}
                  >
                    <div className="aspect-[3/5] max-h-[200px] relative overflow-hidden rounded-t-lg mx-auto p-2">
                      <img
                        src={currentVariant.preview}
                        alt={currentVariant.name}
                        className="object-cover w-full h-full"
                      />
                      {selectedTemplateId === currentVariant.id && (
                        <div className="absolute inset-0 bg-opacity-20 flex items-center justify-center">
                          <div className="bg-white text-rose-600 px-4 py-2 rounded-full text-sm font-medium">
                            Seleccionado
                          </div>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1">
                        <Palette className="w-3 h-3 text-gray-600" />
                      </div>
                    </div>
                    <CardContent className="pb-2 pt-0">
                      <h3 className="font-medium text-gray-900 text-center mb-2">{template.name}</h3>
                      <div className="flex gap-2 justify-center">
                        {template.variants.map((variant) => (
                          <button
                            type="button"
                            key={variant.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVariantSelect(variant.id);
                            }}
                            className={cn(
                              'w-4 h-4 rounded-full border transition-all',
                              selectedTemplateId === variant.id 
                                ? 'border-primary scale-110' 
                                : 'border-gray-300 hover:border-gray-400'
                            )}
                            style={{
                              backgroundColor: variant.colorValue
                            }}
                            title={variant.name}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              } else {
                return (
              <Card
                key={template.id}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-lg',
                  selectedTemplateId === template.id && 'ring-2 ring-rose-500'
                )}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="aspect-[3/5] max-h-[200px] relative overflow-hidden rounded-t-lg mx-auto p-2">
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="object-cover w-full h-full"
                  />
                  {selectedTemplateId === template.id && (
                    <div className="absolute inset-0 bg-opacity-20 flex items-center justify-center">
                          <div className="bg-white text-rose-600 px-4 py-2 rounded-full text-sm font-medium">
                        Seleccionado
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="pb-2 pt-0">
                  <h3 className="font-medium text-gray-900 text-center">{template.name}</h3>
                </CardContent>
              </Card>
                );
              }
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}