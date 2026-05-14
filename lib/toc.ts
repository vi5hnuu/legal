export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[*_`[\]()]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractToc(content: string): TocEntry[] {
  const headingRe = /^(#{2,4})\s+(.+)$/gm;
  const entries: TocEntry[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRe.exec(content)) !== null) {
    entries.push({
      level: match[1].length,
      text: match[2].trim(),
      id: slugify(match[2]),
    });
  }

  return entries;
}
