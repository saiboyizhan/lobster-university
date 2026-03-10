"use client";

import { Link, usePathname } from "@/i18n/navigation";

const NAV_ITEMS = [
  { slug: "index", title: "Getting Started", href: "/docs" as const },
  { slug: "skill-format", title: "Skill Format", href: "/docs/skill-format" as const },
  { slug: "playbook-format", title: "Playbook Format", href: "/docs/playbook-format" as const },
  { slug: "cli", title: "CLI Reference", href: "/docs/cli" as const },
  { slug: "compatibility", title: "Compatibility", href: "/docs/compatibility" as const },
  { slug: "campus", title: "Campus", href: "/docs/campus" as const },
];

export default function DocSidebar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-28">
      <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">
        Documentation
      </h3>
      <div className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.slug === "index" && pathname === "/docs");
          return (
            <Link
              key={item.slug}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-white"
              }`}
            >
              {item.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
