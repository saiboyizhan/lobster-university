import type { Metadata } from "next";

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
  return children;
}
