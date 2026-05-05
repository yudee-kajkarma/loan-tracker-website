import type { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { Sidebar, BottomTabs } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <TopBar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-12">
            {children}
          </div>
        </main>
      </div>
      <BottomTabs />
    </div>
  );
}
