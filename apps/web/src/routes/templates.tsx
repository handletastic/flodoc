/**
 * Templates Page Route
 *
 * Displays available document templates and allows users to preview,
 * customize, and download them
 */

import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { getAllTemplates, loadTemplate } from '@/lib/templates';
import type { TemplateMetadata, Template } from '@/lib/templates';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { TemplatePreviewModal } from '@/components/templates/TemplatePreviewModal';
import { TemplateCustomizationModal } from '@/components/templates/TemplateCustomizationModal';

export const Route = createFileRoute('/templates')({
  component: TemplatesPage,
  loader: async () => {
    const templates = await getAllTemplates();
    return { templates };
  },
});

function TemplatesPage() {
  const { templates } = Route.useLoaderData();
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [customizeTemplate, setCustomizeTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update document title
    document.title = 'Document Templates | Flodoc';
  }, []);

  const handlePreview = async (templateMeta: TemplateMetadata) => {
    setLoading(true);
    try {
      const template = await loadTemplate(templateMeta.id);
      if (template) {
        setPreviewTemplate(template);
      }
    } catch (error) {
      console.error('Failed to load template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUse = async (templateMeta: TemplateMetadata) => {
    setLoading(true);
    try {
      const template = await loadTemplate(templateMeta.id);
      if (template) {
        setCustomizeTemplate(template);
      }
    } catch (error) {
      console.error('Failed to load template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewTemplate(null);
  };

  const handleCloseCustomization = () => {
    setCustomizeTemplate(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Document Templates</h1>
          </div>
          <p
            data-testid="templates-description"
            className="text-lg text-muted-foreground max-w-3xl"
          >
            Start your documentation with professional templates. Choose from pre-built
            structures for guides, tutorials, API references, and more. Each template
            includes best practices and helpful placeholders to get you started quickly.
          </p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={handlePreview}
              onUse={handleUse}
            />
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No templates available.</p>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-background border border-border rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-foreground">Loading template...</p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <TemplatePreviewModal template={previewTemplate} onClose={handleClosePreview} />
      <TemplateCustomizationModal
        template={customizeTemplate}
        onClose={handleCloseCustomization}
      />
    </div>
  );
}
