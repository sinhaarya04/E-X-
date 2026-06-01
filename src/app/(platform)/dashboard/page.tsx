import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const displayName = profile?.display_name ?? user.email;
  const balance = profile?.husky_balance ?? 1000;

  return (
    <>
      <div className="page-header">
        <p className="page-title">Overview</p>
        <p className="page-heading">Dashboard</p>
      </div>

      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-label">Husky Token Balance</div>
          <div className="dash-card-value">{balance.toLocaleString()}</div>
          <div className="dash-card-sub">Available to trade</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">Open Positions</div>
          <div className="dash-card-value amber">0</div>
          <div className="dash-card-sub">No active bets yet</div>
        </div>
        <div className="dash-card">
          <div className="dash-card-label">Total P&amp;L</div>
          <div className="dash-card-value green">0</div>
          <div className="dash-card-sub">Lifetime profit / loss</div>
        </div>
      </div>

      <div className="dash-section">
        <p className="dash-section-title">Recent Activity</p>
        <div className="dash-empty">
          No trades yet. Head to{" "}
          <a href="/markets" style={{ color: "var(--orange)" }}>
            Markets
          </a>{" "}
          to place your first bet.
        </div>
      </div>

      <div className="dash-section">
        <p className="dash-section-title">Your Profile</p>
        <div style={{ background: "var(--bg-panel)", padding: "16px" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--fg-dim)", marginBottom: 8 }}>
            <span style={{ color: "var(--fg-muted)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Display name</span>
            <br />
            {displayName}
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--fg-dim)" }}>
            <span style={{ color: "var(--fg-muted)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</span>
            <br />
            {user.email}
          </div>
        </div>
      </div>
    </>
  );
}
