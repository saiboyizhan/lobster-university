import type { SkillManifest, SkillCategory, ValidationResult } from "./types";

const REQUIRED_FIELDS: (keyof SkillManifest)[] = [
  "name",
  "version",
  "description",
  "category",
  "tags",
  "capabilities",
  "triggers",
  "dependencies",
  "compatibility",
];

export const VALID_CATEGORIES: SkillCategory[] = [
  "information-retrieval",
  "content-processing",
  "code-assistance",
  "creative-generation",
  "reasoning",
  "crypto",
  "social",
  "meta",
];

const VERSION_REGEX = /^\d+\.\d+\.\d+$/;
const SEMVER_RANGE_RE =
  /^(?:[~^]?\d+\.\d+\.\d+(?:-[\w.]+)?|>=?\d+\.\d+\.\d+)$/;
const SKILL_NAME_RE = /^@lobster-u\/[a-z][a-z0-9-]*$/;

export function validateManifest(
  manifest: Partial<SkillManifest>,
  knownSkillNames: string[] = []
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const field of REQUIRED_FIELDS) {
    if (manifest[field] === undefined || manifest[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Name format validation
  if (manifest.name) {
    if (!SKILL_NAME_RE.test(manifest.name)) {
      errors.push(
        `Package name must match @lobster-u/<kebab-case>, got: ${manifest.name}`
      );
    }
  }

  if (manifest.version && !VERSION_REGEX.test(manifest.version)) {
    errors.push(`Invalid version format: ${manifest.version}, expected x.y.z`);
  }

  if (manifest.category && !VALID_CATEGORIES.includes(manifest.category)) {
    errors.push(`Invalid category: ${manifest.category}`);
  }

  if (manifest.tags && manifest.tags.length === 0) {
    warnings.push("No tags provided — skill will be harder to discover");
  }

  // Capabilities warning
  if (
    !Array.isArray(manifest.capabilities) ||
    manifest.capabilities.length === 0
  ) {
    if (manifest.capabilities !== undefined) {
      warnings.push(
        "Missing capabilities — declare capabilities so agents can match skills to tasks"
      );
    }
  }

  // Triggers warning
  if (!Array.isArray(manifest.triggers) || manifest.triggers.length === 0) {
    if (manifest.triggers !== undefined) {
      warnings.push(
        "Missing triggers — add trigger phrases for automatic skill activation"
      );
    }
  }

  // Dependencies validation
  if (manifest.dependencies) {
    for (const [dep, depVersion] of Object.entries(manifest.dependencies)) {
      // Validate dependency name format
      if (!SKILL_NAME_RE.test(dep)) {
        errors.push(
          `Dependency name must match @lobster-u/<kebab-case>, got: ${dep}`
        );
      }

      // Validate dependency version as semver range
      if (typeof depVersion !== "string" || !SEMVER_RANGE_RE.test(depVersion)) {
        errors.push(
          `Dependency "${dep}" version must be a valid semver range, got: ${String(depVersion)}`
        );
      }

      // Warn for unknown dependencies
      if (knownSkillNames.length > 0 && !knownSkillNames.includes(dep)) {
        warnings.push(`Unknown dependency: ${dep}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
