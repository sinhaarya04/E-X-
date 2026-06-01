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

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const displayName = profile?.display_name ?? user.email;
  const balance = profile?.husky_balance ?? 1000;

  if (error) {
    console.error("Failed to load profile:", error.message);
  }

  return (
    <div className="platform-page">
      <div className="platform-placeholder">
        <div style={{ marginBottom: 8 }}>
          <strong>E[X]</strong> // Dashboard
        </div>
        <div>Welcome, {displayName}</div>
        <div style={{ marginTop: 8 }}>
          Husky Tokens:{" "}
          <strong style={{ color: "var(--orange)" }}>{balance}</strong>
        </div>
        <div style={{ marginTop: 24, fontSize: 11 }}>
          Platform shell coming in PR 3
        </div>
        <form action="/api/auth/signout" method="post" style={{ marginTop: 24 }}>
          <button
            type="submit"
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--fg-muted)",
              background: "none",
              border: "1px solid var(--lp-border)",
              padding: "6px 16px",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
