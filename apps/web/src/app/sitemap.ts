import type { MetadataRoute } from "next";
import { getAllSkillSlugs } from "@/lib/skills";

const BASE_URL = "https://lobster-u.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/skills",
    "/playbooks",
    "/docs",
    "/community",
    "/marketplace",
    "/leaderboard",
    "/get-started",
    "/privacy",
    "/terms",
  ];

  const entries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  // Skill detail pages
  try {
    const slugs = getAllSkillSlugs();
    for (const slug of slugs) {
      entries.push({
        url: `${BASE_URL}/skills/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  } catch {
    // Skills not available at build time
  }

  return entries;
}
