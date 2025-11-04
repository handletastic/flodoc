import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useEffect } from 'react';
import { loadDocument, getConnectedDocuments, mdxComponents } from '@/lib/mdx';
import { TableOfContents } from '@/components/TableOfContents';
import type { DocumentFrontmatter, DocumentMetadata } from '@/lib/mdx';

export const Route = createFileRoute('/docs/$slug')({
  component: DocumentPage,
  loader: async ({ params }) => {
    const doc = await loadDocument(params.slug);
    if (!doc) {
      throw notFound();
    }
    const connections = await getConnectedDocuments(params.slug);
    return { doc, connections };
  },
  onError: (error) => {
    console.error('Error loading document:', error);
  },
});

function DocumentPage() {
  const { doc, connections } = Route.useLoaderData();
  const { slug } = Route.useParams();

  // Update document title
  useEffect(() => {
    if (doc?.frontmatter?.title) {
      document.title = `${doc.frontmatter.title} | Flodoc`;
    }
  }, [doc?.frontmatter?.title]);

  if (!doc) {
    return <DocumentNotFound slug={slug} />;
  }

  const { frontmatter, Component } = doc;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-8">
        {/* Main Content */}
        <article data-testid="doc-content" className="prose dark:prose-invert max-w-none">
          {/* Document metadata */}
          {frontmatter.description && (
            <p data-testid="doc-description" className="text-lg text-muted-foreground -mt-2 mb-6">
              {frontmatter.description}
            </p>
          )}

          {/* MDX Content */}
          <Component components={mdxComponents} />

          {/* Tags */}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="mt-8 flex gap-2 flex-wrap not-prose">
              {frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  data-testid="doc-tag"
                  data-tag={tag}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Document Connections */}
          {connections && connections.size > 0 && (
            <div className="mt-12 pt-8 border-t not-prose">
              <h2 className="text-xl font-bold mb-6">Related Documents</h2>
              <div className="grid gap-6">
                {Array.from(connections.entries()).map(([type, docs]) => (
                  <div key={type}>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {type}
                    </h3>
                    <div className="space-y-2">
                      {docs.map((connectedDoc) => (
                        <Link
                          key={connectedDoc.slug}
                          to={`/docs/${connectedDoc.slug}`}
                          data-testid="doc-connection"
                          data-connection-type={type}
                          className="block p-3 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors"
                        >
                          <div className="font-medium text-foreground">
                            {connectedDoc.title}
                          </div>
                          {connectedDoc.description && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {connectedDoc.description}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Table of Contents - Desktop: sticky sidebar, Mobile: collapsible */}
        <aside className="lg:block mt-8 lg:mt-0">
          <TableOfContents />
        </aside>
      </div>
    </div>
  );
}

function DocumentNotFound({ slug }: { slug: string }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div data-testid="doc-error" className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">404 - Document Not Found</h1>
        <p className="text-lg text-muted-foreground mb-8">
          The document "{slug}" could not be found.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
