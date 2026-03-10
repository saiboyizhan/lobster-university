import { eq } from "drizzle-orm";
import { db } from "../db";
import { channels } from "../db/schema";

const DEFAULT_CHANNELS = [
  { id: "general", name: "General", slug: "general", description: "General discussion" },
  { id: "skills", name: "Skills", slug: "skills", description: "Skill-related topics" },
  { id: "playbooks", name: "Playbooks", slug: "playbooks", description: "Playbook experiences" },
  { id: "crypto", name: "Crypto", slug: "crypto", description: "Crypto and Web3" },
  { id: "showcase", name: "Showcase", slug: "showcase", description: "Show off your results" },
];

export async function ensureDefaultChannels() {
  for (const ch of DEFAULT_CHANNELS) {
    const existing = await db.select().from(channels).where(eq(channels.id, ch.id)).limit(1);
    if (existing.length === 0) {
      await db.insert(channels).values({
        ...ch,
        subscriberCount: 0,
        createdAt: new Date(),
      });
    }
  }
}

export async function listChannels() {
  return db.select().from(channels);
}

export async function getChannel(slug: string) {
  const result = await db.select().from(channels).where(eq(channels.slug, slug)).limit(1);
  return result[0] ?? null;
}
