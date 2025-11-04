/**
 * Template Customization Modal Component
 *
 * Form for customizing template metadata before copying or downloading
 */

import { useState, useEffect } from 'react';
import { X, Copy, Download, Check, AlertCircle } from 'lucide-react';
import type { Template, TemplateCustomization } from '@/lib/templates';
import {
  customizeTemplate,
  generateSlug,
  copyTemplateToClipboard,
  downloadTemplate,
} from '@/lib/templates';

interface TemplateCustomizationModalProps {
  template: Template | null;
  onClose: () => void;
}

export function TemplateCustomizationModal({
  template,
  onClose,
}: TemplateCustomizationModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [tags, setTags] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (template) {
      setTitle('');
      setDescription('');
      setSlug('');
      setTags(template.frontmatter.tags?.join(', ') || '');
      setAutoSlug(true);
      setErrors({});
      setCopied(false);
    }
  }, [template]);

  if (!template) return null;

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (autoSlug) {
      setSlug(generateSlug(value));
    }
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: '' }));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlug(value);
    setAutoSlug(false);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCustomization = (): TemplateCustomization => {
    return {
      title: title.trim(),
      description: description.trim(),
      slug: slug.trim(),
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };
  };

  const handleCopy = async () => {
    if (!validate()) return;

    try {
      const customization = getCustomization();
      const customizedContent = customizeTemplate(template, customization);
      await copyTemplateToClipboard(customizedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    if (!validate()) return;

    const customization = getCustomization();
    const customizedContent = customizeTemplate(template, customization);
    downloadTemplate(customizedContent, `${customization.slug}.mdx`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCopy();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="customization-title"
    >
      <div
        data-testid="template-customization-form"
        className="bg-background border border-border rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 id="customization-title" className="text-xl font-bold text-foreground">
              Customize Template
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {template.metadata.title}
            </p>
          </div>
          <button
            data-testid="template-form-cancel"
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-md transition-colors"
            aria-label="Close customization form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="template-title"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="template-title"
                data-testid="template-form-title"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter document title"
                aria-required="true"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              {errors.title && (
                <p
                  id="title-error"
                  data-testid="form-error"
                  className="mt-1 text-sm text-red-500 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="template-description"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Description
              </label>
              <textarea
                id="template-description"
                data-testid="template-form-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Brief description of the document"
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="template-slug"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                id="template-slug"
                data-testid="template-form-slug"
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                placeholder="url-friendly-slug"
                aria-required="true"
                aria-invalid={!!errors.slug}
                aria-describedby={errors.slug ? 'slug-error' : 'slug-help'}
              />
              {errors.slug ? (
                <p
                  id="slug-error"
                  data-testid="form-error"
                  className="mt-1 text-sm text-red-500 flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.slug}
                </p>
              ) : (
                <p id="slug-help" className="mt-1 text-sm text-muted-foreground">
                  Auto-generated from title (lowercase, hyphens only)
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="template-tags"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Tags
              </label>
              <input
                id="template-tags"
                data-testid="template-form-tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="tutorial, guide, beginner"
                aria-describedby="tags-help"
              />
              <p id="tags-help" className="mt-1 text-sm text-muted-foreground">
                Comma-separated list of tags
              </p>
            </div>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-accent/30">
          {copied && (
            <div
              data-testid="copy-success-message"
              className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
            >
              <Check className="w-4 h-4" />
              Copied to clipboard!
            </div>
          )}
          {!copied && <div />}
          <div className="flex gap-2">
            <button
              type="button"
              data-testid="template-form-copy"
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-accent transition-colors"
              aria-label="Copy customized template to clipboard"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button
              type="button"
              data-testid="template-form-download"
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              aria-label="Download customized template"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        {/* Hidden submit button for form */}
        <button
          type="submit"
          data-testid="template-form-submit"
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
