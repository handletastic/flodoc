/**
 * Template Card Component
 *
 * Displays a template with preview and use actions
 */

import { FileText } from 'lucide-react';
import type { TemplateMetadata } from '@/lib/templates';

interface TemplateCardProps {
  template: TemplateMetadata;
  onPreview: (template: TemplateMetadata) => void;
  onUse: (template: TemplateMetadata) => void;
}

export function TemplateCard({ template, onPreview, onUse }: TemplateCardProps) {
  return (
    <div
      data-testid="template-card"
      className="border border-border rounded-lg p-6 hover:border-primary transition-colors bg-card"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3
            data-testid="template-title"
            className="text-lg font-semibold mb-2 text-foreground"
          >
            {template.title}
          </h3>
          <p
            data-testid="template-description"
            className="text-sm text-muted-foreground mb-4"
          >
            {template.description}
          </p>
          {template.tags && template.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <button
              data-testid="template-preview-btn"
              onClick={() => onPreview(template)}
              className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-accent transition-colors"
              aria-label={`Preview ${template.title}`}
            >
              Preview
            </button>
            <button
              data-testid="template-use-btn"
              onClick={() => onUse(template)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              aria-label={`Use ${template.title}`}
            >
              Use Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
