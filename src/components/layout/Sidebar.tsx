"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Trophy,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/markets", label: "Markets", icon: TrendingUp },
  { href: "/portfolio", label: "Portfolio", icon: Wallet },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />
      <aside className={`shell-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-label">Navigate</div>
            <ul className="sidebar-nav">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`sidebar-link ${isActive ? "active" : ""}`}
                      onClick={onClose}
                    >
                      <Icon size={15} className="sidebar-icon" strokeWidth={isActive ? 2.2 : 1.5} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Bottom Info */}
          <div className="sidebar-footer">
            <div className="sidebar-footer-line">NEU · Boston, MA</div>
            <div className="sidebar-footer-line">Fall 2026</div>
          </div>
        </div>
      </aside>
    </>
  );
}
