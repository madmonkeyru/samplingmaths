import React from 'react';
import katex from 'katex';

interface TextRendererProps {
  content?: string;
  className?: string;
  inline?: boolean;
}

export const TextRenderer: React.FC<TextRendererProps> = ({
  content = '',
  className = '',
  inline = false,
}) => {
  if (!content) return null;

  // Split by LaTeX delimiters: $...$, $$...$$, \(...\), \[...\]
  // Pattern matches $...$, $$...$$, \(...\), or \[...\]
  const parts: Array<{ text: string; isMath: boolean; isBlock: boolean }> = [];
  const regex = /(\$\$.*?\$\$|\$.*?\$|\\\(.*?\\\)|\\\[.*?\\\])/gs;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        text: content.substring(lastIndex, match.index),
        isMath: false,
        isBlock: false,
      });
    }

    const matchedStr = match[0];
    let mathExpr = matchedStr;
    let isBlock = false;

    if (matchedStr.startsWith('$$') && matchedStr.endsWith('$$')) {
      mathExpr = matchedStr.slice(2, -2);
      isBlock = true;
    } else if (matchedStr.startsWith('$') && matchedStr.endsWith('$')) {
      mathExpr = matchedStr.slice(1, -1);
    } else if (matchedStr.startsWith('\\(') && matchedStr.endsWith('\\)')) {
      mathExpr = matchedStr.slice(2, -2);
    } else if (matchedStr.startsWith('\\[') && matchedStr.endsWith('\\]')) {
      mathExpr = matchedStr.slice(2, -2);
      isBlock = true;
    }

    parts.push({
      text: mathExpr,
      isMath: true,
      isBlock,
    });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({
      text: content.substring(lastIndex),
      isMath: false,
      isBlock: false,
    });
  }

  return (
    <span className={`text-renderer ${className}`}>
      {parts.map((part, index) => {
        if (!part.isMath) {
          return <React.Fragment key={index}>{part.text}</React.Fragment>;
        }

        try {
          const html = katex.renderToString(part.text, {
            displayMode: part.isBlock && !inline,
            throwOnError: false,
          });

          return (
            <span
              key={index}
              className={part.isBlock ? 'block my-2 text-center' : 'inline-block px-0.5'}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={index} className="text-red-500 font-mono">{part.text}</span>;
        }
      })}
    </span>
  );
};
