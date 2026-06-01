"use client";

interface TopbarProps {
  displayName: string;
  balance: number;
  onMenuToggle: () => void;
}

export default function Topbar({ displayName, balance, onMenuToggle }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={onMenuToggle} aria-label="Toggle sidebar">
          <span></span><span></span><span></span>
        </button>
        <a href="/dashboard" className="topbar-logo">
          E[X]<span> // Terminal</span>
        </a>
        <div className="topbar-divider" />
        <span className="topbar-ticker">Prediction Markets</span>
      </div>
      <div className="topbar-right">
        <div className="topbar-balance">
          <span className="topbar-balance-label">Husky Tokens</span>
          <span className="topbar-balance-value">{balance.toLocaleString()}</span>
        </div>
        <form action="/api/auth/signout" method="post">
          <button type="submit" className="topbar-signout">Sign out</button>
        </form>
      </div>
    </header>
  );
}
