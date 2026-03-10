import { STEPS } from "@/lib/get-started";
import StepNav from "@/components/get-started/StepNav";

export default function GetStartedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white pt-24 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-12">
        {/* Left sidebar - step navigation */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <StepNav steps={STEPS} />
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
