import type { Metadata } from "next";
import { getAllSkills } from "@/lib/skills";
import { getAllPlaybooks } from "@/lib/playbooks";
import SkillLeaderboard from "@/components/skills/SkillLeaderboard";

export const metadata: Metadata = {
  title: "Skills Leaderboard — Lobster University",
};

function computeLeaderboards() {
  const skills = getAllSkills();
  const playbooks = getAllPlaybooks();

  // Count how many times each skill is a dependency of another skill
  const depRefCount: Record<string, number> = {};
  for (const skill of skills) {
    for (const dep of Object.keys(skill.dependencies)) {
      const slug = dep.replace("@lobster-u/", "");
      depRefCount[slug] = (depRefCount[slug] ?? 0) + 1;
    }
  }

  // Count how many playbooks reference each skill
  const playbookRefCount: Record<string, number> = {};
  for (const pb of playbooks) {
    for (const s of pb.skills) {
      playbookRefCount[s] = (playbookRefCount[s] ?? 0) + 1;
    }
  }

  // Overall: expectedImprovement * (1 + depRefCount)
  const overall = skills
    .map((s) => ({
      slug: s.slug,
      name: s.name,
      category: s.category,
      score: s.expectedImprovement * (1 + (depRefCount[s.slug] ?? 0)),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  // Learning: by expectedImprovement
  const learning = skills
    .map((s) => ({
      slug: s.slug,
      name: s.name,
      category: s.category,
      score: s.expectedImprovement,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  // Playbook-covered: by playbook reference count
  const playbookCovered = skills
    .map((s) => ({
      slug: s.slug,
      name: s.name,
      category: s.category,
      score: playbookRefCount[s.slug] ?? 0,
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  return { overall, learning, playbookCovered };
}

export default function LeaderboardPage() {
  const { overall, learning, playbookCovered } = computeLeaderboards();

  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
          Skills Leaderboard
        </h1>
        <p className="mb-8 text-lg text-zinc-500">
          Top skills ranked by impact, learning value, and playbook coverage.
        </p>

        <SkillLeaderboard
          overall={overall}
          learning={learning}
          playbookCovered={playbookCovered}
        />
      </div>
    </div>
  );
}
