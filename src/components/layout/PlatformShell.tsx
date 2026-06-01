"use client";

import { useState, type ReactNode } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

interface PlatformShellProps {
  displayName: string;
  balance: number;
  children: ReactNode;
}

export default function PlatformShell({ displayName, balance, children }: PlatformShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
