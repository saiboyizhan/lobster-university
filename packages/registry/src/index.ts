import type { SkillManifest, SkillCategory } from "@lobster-u/sdk";

export interface RegistryEntry extends SkillManifest {
  npm: string;
  downloads: number;
  rating: number;
  verified: boolean;
}

export interface Registry {
  version: string;
  generatedAt: string;
  skills: RegistryEntry[];
}

export interface ScoredRegistryEntry {
  skill: RegistryEntry;
  relevance: number;
  matchReasons: string[];
}

/**
 * Search skills by keyword with weighted relevance scoring.
 *
 * Relevance weights:
 *   name match = 5, capability match = 4, tag match = 3,
 *   trigger match = 3, description match = 2
 *
 * Returns results sorted by relevance (highest first).
 */
export function searchSkills(
  registry: Registry,
  query: string
): RegistryEntry[] {
  const lower = query.toLowerCase();
  const scored: ScoredRegistryEntry[] = [];

  for (const skill of registry.skills) {
    let relevance = 0;
    const matchReasons: string[] = [];

    const nameHit = skill.name.toLowerCase().includes(lower);
    const descHit = skill.description.toLowerCase().includes(lower);
    const tagHit = skill.tags.some((t) => t.toLowerCase().includes(lower));
    const capHit = skill.capabilities.some((c) =>
      c.toLowerCase().includes(lower)
    );
    const triggerHit = skill.triggers.some((t) =>
      t.toLowerCase().includes(lower)
    );

    if (nameHit) {
      relevance += 5;
      matchReasons.push("name match");
    }
    if (capHit) {
      relevance += 4;
      matchReasons.push("capability match");
    }
    if (tagHit) {
      relevance += 3;
      matchReasons.push("tag match");
    }
    if (triggerHit) {
      relevance += 3;
      matchReasons.push("trigger match");
    }
    if (descHit) {
      relevance += 2;
      matchReasons.push("description match");
    }

    if (relevance > 0) {
      scored.push({ skill, relevance, matchReasons });
    }
  }

  return scored
    .sort((a, b) => b.relevance - a.relevance)
    .map((s) => s.skill);
}

/**
 * Search skills with full scored results including relevance and match reasons.
 */
export function searchSkillsScored(
  registry: Registry,
  query: string
): ScoredRegistryEntry[] {
  const lower = query.toLowerCase();
  const scored: ScoredRegistryEntry[] = [];

  for (const skill of registry.skills) {
    let relevance = 0;
    const matchReasons: string[] = [];

    const nameHit = skill.name.toLowerCase().includes(lower);
    const descHit = skill.description.toLowerCase().includes(lower);
    const tagHit = skill.tags.some((t) => t.toLowerCase().includes(lower));
    const capHit = skill.capabilities.some((c) =>
      c.toLowerCase().includes(lower)
    );
    const triggerHit = skill.triggers.some((t) =>
      t.toLowerCase().includes(lower)
    );

    if (nameHit) {
      relevance += 5;
      matchReasons.push("name match");
    }
    if (capHit) {
      relevance += 4;
      matchReasons.push("capability match");
    }
    if (tagHit) {
      relevance += 3;
      matchReasons.push("tag match");
    }
    if (triggerHit) {
      relevance += 3;
      matchReasons.push("trigger match");
    }
    if (descHit) {
      relevance += 2;
      matchReasons.push("description match");
    }

    if (relevance > 0) {
      scored.push({ skill, relevance, matchReasons });
    }
  }

  return scored.sort((a, b) => b.relevance - a.relevance);
}

/**
 * List skills filtered by category.
 */
export function getSkillsByCategory(
  registry: Registry,
  category: string
): RegistryEntry[] {
  return registry.skills.filter((skill) => skill.category === category);
}

/**
 * Return only verified skills.
 */
export function getVerifiedSkills(registry: Registry): RegistryEntry[] {
  return registry.skills.filter((skill) => skill.verified);
}
