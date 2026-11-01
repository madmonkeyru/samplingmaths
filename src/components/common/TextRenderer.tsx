import React from 'react';
import katex from 'katex';

interface TextRendererProps {
  content?: string;
  className?: string;
  inline?: boolean;
}

/**
  Normalizes LaTeX math expressions to ensure beautiful fraction rendering.
  Replaces standard \frac with \dfrac (display fraction) when appropriate or ensures displayMode formatting.
 */
function normalizeMathExpr(expr: string): string {
  // Convert \frac to \dfrac for better vertical spacing in inline math unless it's already \dfrac or \cfrac
  return expr.replace(/\\frac\{/g, '\\dfrac{').replace(/−/g, '-');
}

const mathAtom = String.raw`(?:\((?:[^()]|\([^()]*\))*\)|[\p{L}][\p{L}\d]*|\d+(?:[.,]\d+)?)(?:\s*(?:\^|_)\s*(?:\{[^{}]+\}|[\p{L}\d]+))?`;
const mathOperator = String.raw`[+\-−*/×÷=<>≤≥≠]`;
const bareMathPattern = new RegExp(
  String.raw`(?<![\p{L}\d])(${mathAtom}(?:\s*${mathOperator}\s*${mathAtom})*)(?![\p{L}\d])`,
  'gu',
);

function isBareMath(expression: string): boolean {
  // If the expression contains LaTeX delimiters, let delimited parsing handle it.
  if (/[$¥\\]/.test(expression)) return false;
  // If the expression contains multiple spaces with words (prose inside parentheses), ignore it.
  if (/\b\p{L}+\s+\p{L}+\b/u.test(expression)) return false;

  if (/[\^_=<>≤≥≠*/×÷]/u.test(expression)) {
    const withoutParentheses = expression.replace(/\([^()]*\)/g, '');
    return !/[\p{L}]{2,}/u.test(withoutParentheses);
  }
  if (!/[+\-−]/u.test(expression)) return false;

  const withoutParentheses = expression.replace(/\([^()]*\)/g, '');
  return !/[\p{L}]{2,}/u.test(withoutParentheses);
}

export const TextRenderer: React.FC<TextRendererProps> = ({
  content = '',
  className = '',
  inline = false,
}) => {
  if (!content) return null;

  // Recognize explicit LaTeX delimiters and common bare algebra in question text.
  const parts: Array<{ text: string; isMath: boolean; isBlock: boolean }> = [];
  const regex = /(\$\$.*?\$\$|\$.*?\$|\\\(.*?\\\)|\\\[.*?\\\])/gs;

  let lastIndex = 0;
  let match;

  const tokens: Array<{ text: string; index: number; isDelimitedMath: boolean }> = [];
  while ((match = regex.exec(content)) !== null) {
    tokens.push({ text: match[0], index: match.index, isDelimitedMath: true });
  }
  bareMathPattern.lastIndex = 0;
  while ((match = bareMathPattern.exec(content)) !== null) {
    if (isBareMath(match[0])) {
      tokens.push({ text: match[0], index: match.index, isDelimitedMath: false });
    }
  }
  tokens.sort((left, right) => left.index - right.index);

  for (const token of tokens) {
    if (token.index < lastIndex) continue;

    if (token.index > lastIndex) {
      parts.push({
        text: content.substring(lastIndex, token.index),
        isMath: false,
        isBlock: false,
      });
    }

    const matchedStr = token.text;
    let mathExpr = matchedStr;
    let isBlock = false;

    if (!token.isDelimitedMath) {
      parts.push({
        text: normalizeMathExpr(mathExpr),
        isMath: true,
        isBlock: false,
      });
      lastIndex = token.index + matchedStr.length;
      continue;
    }

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
      text: normalizeMathExpr(mathExpr),
      isMath: true,
      isBlock,
    });

    lastIndex = token.index + matchedStr.length;
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
              className={`math-data-badge ${
                part.isBlock
                  ? 'block my-3 text-center p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 shadow-2xs font-semibold text-zinc-950 dark:text-zinc-50'
                  : 'inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60  text-indigo-950 dark:text-indigo-100 font-bold align-baseline transition-colors'
              }`}
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
