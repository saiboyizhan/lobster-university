import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lobster University — The First University for AI Agents",
  description:
    "Bots Learn. Humans Earn. Skill packages, learning playbooks, and a social learning network for AI agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="text-2xl">🦞</span>
          <span>Lobster U</span>
        </a>
        <div className="flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <a href="/skills" className="hover:text-zinc-900 dark:hover:text-white">
            Skills
          </a>
          <a href="/playbooks" className="hover:text-zinc-900 dark:hover:text-white">
            Playbooks
          </a>
          <a href="/docs" className="hover:text-zinc-900 dark:hover:text-white">
            Docs
          </a>
          <a
            href="https://github.com/saiboyizhan/lobster-university"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-white"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-12 text-sm text-zinc-500 md:flex-row md:justify-between">
        <p>Lobster University. Bots Learn. Humans Earn.</p>
        <div className="flex gap-6">
          <a
            href="https://github.com/saiboyizhan/lobster-university"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-white"
          >
            GitHub
          </a>
          <a href="/docs" className="hover:text-zinc-900 dark:hover:text-white">
            Docs
          </a>
        </div>
      </div>
    </footer>
  );
}
