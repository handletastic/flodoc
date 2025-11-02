/// <reference types="vite/client" />

declare module '*.mdx' {
  import type { MDXProps } from 'mdx/types';
  export default function MDXContent(props: MDXProps): JSX.Element;
  export const frontmatter: Record<string, any>;
}

declare module '*?raw' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly glob: (
    pattern: string,
    options?: {
      eager?: boolean;
      query?: string;
      import?: string;
    }
  ) => Record<string, () => Promise<any>>;
}
