// lib/markdoc/renderer.ts
// Inspired by flare-stack-blog's content-renderer.tsx
// Markdoc parsing, TOC extraction, and HTML rendering pipeline

import { Markdoc } from "@markdoc/markdoc";
import { estimateReadingTime, extractTocFromMarkdown } from "@/lib/utils";

/**
 * Render Markdoc content to HTML with TOC extraction.
 * Inspired by flare-stack-blog's renderReact + ContentRenderer pattern.
 */
export function renderMarkdoc(content: string): {
  html: string;
  toc: { id: string; text: string; level: number }[];
  readingTimeMinutes: number;
} {
  let html = "";
  try {
    const ast = Markdoc.parse(content);
    const document = new Markdoc.Document(ast);
    const transformed = Markdoc.transform(document, {
      tags: { ...Markdoc.tags },
      functions: { ...Markdoc.functions },
      nodes: { ...Markdoc.nodes },
    });
    html = Markdoc.render.html(transformed, {
      tags: { ...Markdoc.tags },
      functions: { ...Markdoc.functions },
    });
  } catch {
    html = `<pre style="white-space:pre-wrap;word-break:break-word">${escapeHtml(content)}</pre>`;
  }

  const toc = extractTocFromMarkdown(content);
  const readingTimeMinutes = estimateReadingTime(content);

  return { html, toc, readingTimeMinutes };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
