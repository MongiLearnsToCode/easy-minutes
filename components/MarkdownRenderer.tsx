import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer: React.FC<{ content: string; }> = ({ content }) => {
  // By using the `prose` classes, the styling for the rendered markdown will be consistent
  // with the rich text editor's view, as both will be styled by the Tailwind Typography plugin.
  return (
    <div className="prose prose-slate max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
        </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;