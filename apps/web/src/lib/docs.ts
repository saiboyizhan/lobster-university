import fs from "fs";
import path from "path";

export interface DocPage {
  slug: string;
  title: string;
  content: string;
}

export interface DocNavItem {
  slug: string;
  title: string;
}

const DOCS_DIR = path.resolve(process.cwd(), "../../content/docs");

// Fixed ordering for sidebar navigation
const DOC_ORDER = [
  "index",
  "skill-format",
  "playbook-format",
  "cli",
  "compatibility",
  "campus",
];

const TITLE_MAP: Record<string, string> = {
  index: "Getting Started",
  "skill-format": "Skill Format",
  "playbook-format": "Playbook Format",
  cli: "CLI Reference",
  compatibility: "Compatibility",
  campus: "Campus",
};

function extractTitle(content: string, slug: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : TITLE_MAP[slug] ?? slug;
}

export function getDocSlugs(locale: string): string[] {
  const dir = path.join(DOCS_DIR, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(".md", ""))
    .sort((a, b) => {
      const ai = DOC_ORDER.indexOf(a);
      const bi = DOC_ORDER.indexOf(b);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
}

export function getDocPage(slug: string, locale: string): DocPage | null {
  const filePath = path.join(DOCS_DIR, locale, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    // Fallback to English
    const enPath = path.join(DOCS_DIR, "en", `${slug}.md`);
    if (!fs.existsSync(enPath)) return null;
    const content = fs.readFileSync(enPath, "utf-8");
    return { slug, title: extractTitle(content, slug), content };
  }
  const content = fs.readFileSync(filePath, "utf-8");
  return { slug, title: extractTitle(content, slug), content };
}

export function getDocNav(locale: string): DocNavItem[] {
  const slugs = getDocSlugs(locale.length ? locale : "en");
  return slugs.map((slug) => ({
    slug,
    title: TITLE_MAP[slug] ?? slug,
  }));
}
