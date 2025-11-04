/**
 * Template Preview Modal Component
 *
 * Shows a preview of the template content with copy and download actions
 */

import { useState } from 'react';
import { X, Copy, Download, Check } from 'lucide-react';
import type { Template } from '@/lib/templates';
import { copyTemplateToClipboard, downloadTemplate } from '@/lib/templates';

interface TemplatePreviewModalProps {
  template: Template | null;
  onClose: () => void;
}

export function TemplatePreviewModal({ template, onClose }: TemplatePreviewModalProps) {
  const [copied, setCopied] = useState(false);

  if (!template) return null;

  const handleCopy = async () => {
    try {
      await copyTemplateToClipboard(template.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = () => {
    downloadTemplate(template.content, `${template.metadata.slug}.mdx`);
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
      aria-labelledby="preview-title"
    >
      <div
        data-testid="template-preview-modal"
        className="bg-background border border-border rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 id="preview-title" className="text-xl font-bold text-foreground">
              {template.metadata.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {template.metadata.description}
            </p>
          </div>
          <button
            data-testid="template-preview-close"
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-md transition-colors"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata */}
        <div
          data-testid="template-preview-metadata"
          className="px-6 py-4 bg-accent/50 border-b border-border"
        >
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Slug:</span>{' '}
              <code className="px-2 py-1 bg-background rounded text-xs">
                {template.frontmatter.slug}
              </code>
            </div>
            {template.frontmatter.tags && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Tags:</span>
                <div className="flex gap-1">
                  {template.frontmatter.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <pre
            data-testid="template-preview-content"
            className="text-sm bg-accent/30 p-4 rounded-lg overflow-x-auto"
          >
            <code className="text-foreground">{template.content}</code>
          </pre>
        </div>

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
              data-testid="template-copy-btn"
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-accent transition-colors"
              aria-label="Copy template to clipboard"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button
              data-testid="template-download-btn"
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              aria-label="Download template"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
