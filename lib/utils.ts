// lib/utils.ts
// Inspired by flare-stack-blog's lib/utils.ts
// cn(), formatDate(), formatTimeAgo(), extractTocFromMarkdown()

export function cn(...inputs: (string | undefined | boolean | null | number)[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function formatDate(date: string | Date | number | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTimeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "刚刚";
  if (diffMin < 60) return `${diffMin} 分钟前`;
  if (diffHour < 24) return `${diffHour} 小时前`;
  if (diffDay < 30) return `${diffDay} 天前`;
  return date.toLocaleDateString("zh-CN");
}

export function estimateReadingTime(text: string | undefined | null): number {
  if (!text) return 1;
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  return Math.max(1, Math.ceil(chineseChars / 300 + englishWords / 200));
}

export function extractTocFromMarkdown(content: string): { id: string; text: string; level: number }[] {
  const headings = content.match(/^#{1,6}\s+(.+)$/gm) || [];
  return headings
    .map((h) => {
      const match = h.match(/^(#{1,6})\s+(.+)$/);
      if (!match) return null;
      const level = match[1].length;
      const text = match[2].replace(/[*_`]/g, "").trim();
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\u4e00-\u9fff-]/g, "");
      return { id, text, level };
    })
    .filter(Boolean) as { id: string; text: string; level: number }[];
}
