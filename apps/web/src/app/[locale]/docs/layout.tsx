import DocSidebar from "@/components/docs/DocSidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-12">
        <aside className="hidden w-56 shrink-0 lg:block">
          <DocSidebar />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
