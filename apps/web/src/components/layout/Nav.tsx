"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_LINKS = [
  { href: "/skills" as const, labelKey: "skills" },
  { href: "/playbooks" as const, labelKey: "playbooks" },
  { href: "/docs" as const, labelKey: "docs" },
  { href: "/community" as const, labelKey: "community" },
  { href: "/get-started" as const, labelKey: "getStarted" },
] as const;

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="text-2xl">🦞</span>
          <span>Lobster U</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex dark:text-zinc-400">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-zinc-900 dark:hover:text-white ${
                pathname === link.href
                  ? "text-zinc-900 dark:text-white"
                  : ""
              }`}
            >
              {t(link.labelKey)}
            </Link>
          ))}
          <a
            href="https://github.com/saiboyizhan/lobster-university"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-white"
          >
            GitHub
          </a>
          <LanguageSwitcher />
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Toggle theme"
          >
            <svg
              className="hidden h-4 w-4 dark:block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 7.66l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <svg
              className="block h-4 w-4 dark:hidden"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.005 9.005 0 0012 21a9.005 9.005 0 008.354-5.646z"
              />
            </svg>
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-md p-2 md:hidden hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-zinc-200 bg-white px-6 py-4 md:hidden dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`transition hover:text-zinc-900 dark:hover:text-white ${
                  pathname === link.href
                    ? "text-zinc-900 dark:text-white"
                    : ""
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
            <a
              href="https://github.com/saiboyizhan/lobster-university"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 dark:hover:text-white"
            >
              GitHub
            </a>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-white"
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
