import React, { useMemo } from 'react';
import katex from 'katex';

interface KaTeXRendererProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const KaTeXRenderer: React.FC<KaTeXRendererProps> = ({ math, block = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch (e) {
      console.error(e);
      return math;
    }
  }, [math, block]);

  return (
    <span
      className={`inline-block select-text overflow-x-auto max-w-full py-1 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
