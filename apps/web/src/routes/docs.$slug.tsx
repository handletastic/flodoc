import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/docs/$slug')({
  component: DocumentPage,
})

function DocumentPage() {
  const { slug } = Route.useParams()

  // Placeholder implementation - will be enhanced with actual MDX loading
  return (
    <div className="container mx-auto px-4 py-8">
      <article data-testid="doc-content" className="prose dark:prose-invert max-w-none">
        <h1>Document: {slug}</h1>
        <p data-testid="doc-description">
          This is a placeholder for the MDX document "{slug}".
        </p>

        <div className="mt-8 flex gap-2">
          <span data-testid="doc-tag" data-tag="placeholder" className="px-2 py-1 bg-secondary rounded text-sm">
            placeholder
          </span>
          <span data-testid="doc-tag" data-tag="mdx" className="px-2 py-1 bg-secondary rounded text-sm">
            mdx
          </span>
        </div>

        <div className="mt-8">
          <h2>Example Code Block</h2>
          <pre>
            <code className="language-typescript">
              <span className="token keyword">const</span>{' '}
              <span className="token function">example</span>{' '}
              <span className="token operator">=</span>{' '}
              <span className="token string">"Hello World"</span>
              <span className="token punctuation">;</span>
            </code>
          </pre>
        </div>

        <div className="mt-8">
          <h2>Document Connections</h2>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Next</h3>
            <Link
              to="/docs/basic-concepts"
              data-testid="doc-connection"
              data-connection-type="next"
              className="text-primary hover:underline"
            >
              Basic Concepts
            </Link>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Related</h3>
            <Link
              to="/docs/installation"
              data-testid="doc-connection"
              data-connection-type="related"
              className="text-primary hover:underline"
            >
              Installation
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
