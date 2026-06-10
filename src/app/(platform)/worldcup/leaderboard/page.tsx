"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getLeaderboardOverall, type LeaderboardRow, type ApiError } from "@/lib/wc26/api";
import WC26Tabs from "@/components/worldcup/WC26Tabs";

export default function WorldCupLeaderboardPage() {
  const [rows, setRows] = useState<LeaderboardRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.id) setCurrentUserId(data.session.user.id);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    getLeaderboardOverall()
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch((err) => {
        if (!cancelled) setError((err as ApiError).message || "Failed to load leaderboard");
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <div className="page-header">
        <p className="page-title">Prediction Game</p>
        <p className="page-heading">World Cup 2026</p>
      </div>
      <WC26Tabs />

      <div className="wc26-deadline">
        Submissions close <strong>June 10, 11:59 PM ET</strong>. After that, scoring begins.
      </div>

      <h3 className="wc26-section-title">Leaderboard</h3>

      {error && <div className="wc26-submit-error">{error}</div>}

      <div className="wc26-lb">
        {rows === null ? (
          <div className="wc26-lb-empty">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="wc26-lb-empty">No players yet.</div>
        ) : (
          rows.map((r) => {
            const isMe = r.userId === currentUserId;
            return (
              <div key={r.userId} className={`wc26-lb-row${isMe ? " current" : ""}`}>
                <div className="wc26-lb-rank">#{r.rank}</div>
                <div>
                  <div className="wc26-lb-name">{r.name}</div>
                  <div className="wc26-lb-sub">
                    {r.exactCount} exact &middot; {r.outcomeCount} correct outcomes
                  </div>
                </div>
                <div className="wc26-lb-pts">{r.points}</div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
