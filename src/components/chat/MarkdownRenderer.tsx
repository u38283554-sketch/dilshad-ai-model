import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Simple and robust parser for markdown elements
  const renderFormattedText = () => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeBuffer: string[] = [];
    let codeBlockIndex = 0;
    let inTable = false;
    let tableRows: string[][] = [];

    const flushTable = (key: string) => {
      if (tableRows.length > 0) {
        const headerRow = tableRows[0];
        const bodyRows = tableRows.slice(1).filter((r) => !r.every((cell) => cell.startsWith('---') || cell.startsWith(':---')));

        elements.push(
          <div key={`table-${key}`} className="my-4 overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/40">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead className="border-b border-neutral-800 bg-neutral-900/80 text-xs font-semibold uppercase tracking-wider text-neutral-200">
                <tr>
                  {headerRow.map((cell, cIdx) => (
                    <th key={cIdx} className="px-4 py-3 font-semibold">
                      {parseInlineFormatting(cell.trim())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-neutral-800/20 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-2.5">
                        {parseInlineFormatting(cell.trim())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code Block Start/End
      if (line.trim().startsWith('```')) {
        if (inTable) flushTable(`before-code-${i}`);

        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.trim().replace('```', '') || 'code';
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          const fullCode = codeBuffer.join('\n');
          const currentIdx = codeBlockIndex++;
          elements.push(
            <div
              key={`code-${i}`}
              className="group relative my-4 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 font-mono text-sm shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/80 px-4 py-2 text-xs text-neutral-400">
                <div className="flex items-center gap-2 font-medium">
                  <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="text-neutral-300">{codeLanguage}</span>
                </div>
                <button
                  id={`btn-copy-code-${currentIdx}`}
                  onClick={() => handleCopyCode(fullCode, currentIdx)}
                  className="flex items-center gap-1.5 rounded-md bg-neutral-800/80 px-2.5 py-1 text-xs text-neutral-300 transition hover:bg-neutral-700 hover:text-white"
                >
                  {copiedIndex === currentIdx ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto p-4 text-neutral-200 leading-relaxed font-mono">
                <code>{fullCode}</code>
              </pre>
            </div>
          );
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Markdown Tables
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        inTable = true;
        const cells = line
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim());
        tableRows.push(cells);
        continue;
      } else if (inTable) {
        flushTable(`after-table-${i}`);
      }

      // Headings
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} className="mt-5 mb-2 text-lg font-bold text-neutral-100 tracking-tight">
            {parseInlineFormatting(line.replace('### ', ''))}
          </h3>
        );
        continue;
      }
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${i}`} className="mt-6 mb-3 text-xl font-bold text-neutral-100 tracking-tight">
            {parseInlineFormatting(line.replace('## ', ''))}
          </h2>
        );
        continue;
      }
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${i}`} className="mt-7 mb-4 text-2xl font-extrabold text-neutral-100 tracking-tight">
            {parseInlineFormatting(line.replace('# ', ''))}
          </h1>
        );
        continue;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote
            key={`quote-${i}`}
            className="my-3 border-l-2 border-indigo-500/80 bg-indigo-950/20 px-4 py-2 text-sm text-neutral-300 italic rounded-r-lg"
          >
            {parseInlineFormatting(line.replace('> ', ''))}
          </blockquote>
        );
        continue;
      }

      // Horizontal rules
      if (line.trim() === '---' || line.trim() === '***') {
        elements.push(<hr key={`hr-${i}`} className="my-6 border-neutral-800" />);
        continue;
      }

      // Bullet lists
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        const itemText = line.trim().replace(/^[\*\-]\s+/, '');
        elements.push(
          <div key={`li-${i}`} className="my-1.5 flex items-start gap-2.5 pl-2 text-neutral-300">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
            <div className="leading-relaxed">{parseInlineFormatting(itemText)}</div>
          </div>
        );
        continue;
      }

      // Numbered lists
      const numberMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numberMatch) {
        elements.push(
          <div key={`num-li-${i}`} className="my-1.5 flex items-start gap-2.5 pl-2 text-neutral-300">
            <span className="shrink-0 font-mono text-xs font-semibold text-indigo-400 mt-0.5">
              {numberMatch[1]}.
            </span>
            <div className="leading-relaxed">{parseInlineFormatting(numberMatch[2])}</div>
          </div>
        );
        continue;
      }

      // Empty line
      if (!line.trim()) {
        elements.push(<div key={`empty-${i}`} className="h-2" />);
        continue;
      }

      // Regular paragraph
      elements.push(
        <p key={`p-${i}`} className="my-2 leading-relaxed text-neutral-300">
          {parseInlineFormatting(line)}
        </p>
      );
    }

    if (inTable) flushTable('trailing-table');

    return elements;
  };

  const parseInlineFormatting = (text: string): React.ReactNode => {
    // Process inline code, bold, italics, links
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Inline Code: `code`
      const codeMatch = remaining.match(/`([^`]+)`/);
      // Bold: **text**
      const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
      // Italic: *text* or _text_
      const italicMatch = remaining.match(/\*([^*]+)\*/);
      // Link: [text](url)
      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

      const matches = [
        codeMatch ? { type: 'code', index: codeMatch.index!, length: codeMatch[0].length, content: codeMatch[1] } : null,
        boldMatch ? { type: 'bold', index: boldMatch.index!, length: boldMatch[0].length, content: boldMatch[1] } : null,
        italicMatch ? { type: 'italic', index: italicMatch.index!, length: italicMatch[0].length, content: italicMatch[1] } : null,
        linkMatch ? { type: 'link', index: linkMatch.index!, length: linkMatch[0].length, text: linkMatch[1], href: linkMatch[2] } : null,
      ].filter(Boolean) as Array<{ type: string; index: number; length: number; content?: string; text?: string; href?: string }>;

      if (matches.length === 0) {
        parts.push(remaining);
        break;
      }

      // Find the earliest match
      matches.sort((a, b) => a.index - b.index);
      const first = matches[0];

      if (first.index > 0) {
        parts.push(remaining.substring(0, first.index));
      }

      if (first.type === 'code') {
        parts.push(
          <code
            key={`inline-code-${key++}`}
            className="rounded-md bg-neutral-800/80 px-1.5 py-0.5 font-mono text-xs text-indigo-300 border border-neutral-700/50"
          >
            {first.content}
          </code>
        );
      } else if (first.type === 'bold') {
        parts.push(
          <strong key={`bold-${key++}`} className="font-semibold text-neutral-100">
            {first.content}
          </strong>
        );
      } else if (first.type === 'italic') {
        parts.push(
          <em key={`italic-${key++}`} className="italic text-neutral-200">
            {first.content}
          </em>
        );
      } else if (first.type === 'link') {
        parts.push(
          <a
            key={`link-${key++}`}
            href={first.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 underline underline-offset-2 hover:text-indigo-300 transition-colors"
          >
            {first.text}
          </a>
        );
      }

      remaining = remaining.substring(first.index + first.length);
    }

    return parts;
  };

  return <div className="space-y-1 text-sm md:text-base leading-relaxed break-words">{renderFormattedText()}</div>;
};
