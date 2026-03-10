import fs from "fs";
import path from "path";

export interface Skill {
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  capabilities: string[];
  triggers: string[];
  dependencies: Record<string, string>;
  expectedImprovement: number;
}

export interface SkillDetail extends Skill {
  skillMd: string;
  knowledge: { filename: string; content: string }[];
  strategies: { filename: string; content: string }[];
}

interface ManifestJson {
  name: string;
  description: string;
  category: string;
  tags?: string[];
  capabilities?: string[];
  triggers?: string[];
  dependencies?: Record<string, string>;
  expectedImprovement?: number;
}

const SKILLS_DIR = path.resolve(process.cwd(), "../../skills");

let _cache: Skill[] | null = null;

function loadSkills(): Skill[] {
  if (_cache) return _cache;

  const dirs = fs.readdirSync(SKILLS_DIR).filter((d) => {
    const manifestPath = path.join(SKILLS_DIR, d, "manifest.json");
    return fs.existsSync(manifestPath);
  });

  _cache = dirs.map((dir) => {
    const raw = fs.readFileSync(
      path.join(SKILLS_DIR, dir, "manifest.json"),
      "utf-8"
    );
    const manifest: ManifestJson = JSON.parse(raw);
    return {
      slug: dir,
      name: manifest.name,
      description: manifest.description,
      category: manifest.category,
      tags: manifest.tags ?? [],
      capabilities: manifest.capabilities ?? [],
      triggers: manifest.triggers ?? [],
      dependencies: manifest.dependencies ?? {},
      expectedImprovement: manifest.expectedImprovement ?? 0,
    };
  });

  return _cache;
}

export function getAllSkills(): Skill[] {
  return loadSkills();
}

export function getSkillBySlug(slug: string): Skill | undefined {
  return loadSkills().find((s) => s.slug === slug);
}

export function getCategories(): string[] {
  return [...new Set(loadSkills().map((s) => s.category))];
}

export function filterSkills(opts: {
  category?: string;
  query?: string;
}): Skill[] {
  let results = loadSkills();

  if (opts.category) {
    results = results.filter((s) => s.category === opts.category);
  }

  if (opts.query) {
    const q = opts.query.toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return results;
}

function readDirFiles(dirPath: string): { filename: string; content: string }[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({
      filename: f,
      content: fs.readFileSync(path.join(dirPath, f), "utf-8"),
    }));
}

export function getSkillDetail(slug: string): SkillDetail | undefined {
  const skill = getSkillBySlug(slug);
  if (!skill) return undefined;

  const skillDir = path.join(SKILLS_DIR, slug);

  const skillMdPath = path.join(skillDir, "SKILL.md");
  const skillMd = fs.existsSync(skillMdPath)
    ? fs.readFileSync(skillMdPath, "utf-8")
    : "";

  const knowledge = readDirFiles(path.join(skillDir, "knowledge"));
  const strategies = readDirFiles(path.join(skillDir, "strategies"));

  return { ...skill, skillMd, knowledge, strategies };
}

export function getAllSkillSlugs(): string[] {
  return loadSkills().map((s) => s.slug);
}
