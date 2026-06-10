"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/worldcup", label: "Rules" },
  { href: "/worldcup/predict", label: "Predict" },
  { href: "/worldcup/leaderboard", label: "Leaderboard" },
];

export default function WC26Tabs() {
  const pathname = usePathname();
  return (
    <div className="wc26-tabs">
      {TABS.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`wc26-tab${pathname === t.href ? " active" : ""}`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
