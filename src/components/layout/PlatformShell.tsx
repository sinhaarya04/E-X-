"use client";

import { useEffect, useState, type ReactNode } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { getDeadline } from "@/lib/wc26/api";

interface PlatformShellProps {
  displayName: string;
  balance: number;
  children: ReactNode;
}

export default function PlatformShell({ displayName, balance, children }: PlatformShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fire a single authenticated WC26 ping so the backend lazy-registers this
  // Supabase user into MongoDB. Ensures every signed-in user appears in the
  // leaderboard, even if they never click into the World Cup section.
  useEffect(() => {
    void getDeadline().catch(() => {});
  }, []);

  return (
    <div className="shell">
      <div className="shell-topbar">
        <Topbar
          displayName={displayName}
          balance={balance}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="shell-content">
        {children}
      </main>
    </div>
  );
}
