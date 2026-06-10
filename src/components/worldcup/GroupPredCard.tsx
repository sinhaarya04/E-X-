"use client";

import { useMemo } from "react";
import type { ApiMatch, ApiTeamSummary, GroupPredRow } from "@/lib/wc26/api";
import { isApiTeam } from "@/lib/wc26/api";
import type { RankedTeam } from "@/lib/wc26/bracketEngine/types";
import { flagFor } from "@/lib/wc26/flags";

interface Props {
  groupLetter: string;
  matches: ApiMatch[];
  preds: Map<number, GroupPredRow>;
  standing: RankedTeam[];
  teamById: Map<string, ApiTeamSummary>;
  readOnly: boolean;
  onChange: (matchId: number, side: "home" | "away", value: number | null) => void;
}

export default function GroupPredCard({
  groupLetter, matches, preds, standing, teamById, readOnly, onChange,
}: Props) {
  const sortedMatches = useMemo(
    () => [...matches].sort((a, b) => a.id - b.id),
    [matches],
  );

  return (
    <div className="wc26-grp-card">
      <div className="wc26-grp-header">
        <span className="wc26-grp-letter">Group {groupLetter}</span>
        <span className="wc26-grp-progress">{filledCount(matches, preds)}/{matches.length}</span>
      </div>

      <div className="wc26-grp-standings">
        <div className="wc26-grp-standings-head">
          <span />
          <span>P</span><span>W</span><span>D</span><span>L</span>
          <span>GD</span><span className="wc26-bold">Pts</span>
        </div>
        {standing.map((row) => {
          const t = teamById.get(row.team.id);
          const qualified = row.rank <= 2;
          return (
            <div key={row.team.id} className={`wc26-grp-standings-row${qualified ? " qualified" : ""}`}>
              <span className="wc26-grp-team">
                <span className="wc26-grp-flag">{flagFor(t?.fifa_code)}</span>
                <span className="wc26-grp-name">{t?.name ?? row.team.id}</span>
              </span>
              <span>{row.played}</span>
              <span>{row.won}</span>
              <span>{row.drawn}</span>
              <span>{row.lost}</span>
              <span>{row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}</span>
              <span className="wc26-bold">{row.points}</span>
            </div>
          );
        })}
      </div>

      <div className="wc26-grp-matches">
        {sortedMatches.map((m) => {
          const p = preds.get(m.id);
          if (!isApiTeam(m.home) || !isApiTeam(m.away)) return null;
          const home = teamById.get(m.home.id) ?? m.home;
          const away = teamById.get(m.away.id) ?? m.away;
          return (
            <div key={m.id} className="wc26-grp-match">
              <div className="wc26-grp-match-side">
                <span className="wc26-grp-flag">{flagFor(home.fifa_code)}</span>
                <span className="wc26-grp-name">{home.name}</span>
              </div>
              <div className="wc26-grp-match-scores">
                <input
                  type="number"
                  min={0}
                  max={20}
                  className="wc26-score-input"
                  value={p?.homeScorePred == null ? "" : String(p.homeScorePred)}
                  disabled={readOnly}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") return onChange(m.id, "home", null);
                    const n = Number(raw);
                    if (!Number.isInteger(n) || n < 0) return;
                    onChange(m.id, "home", n);
                  }}
                />
                <span className="wc26-grp-vs">-</span>
                <input
                  type="number"
                  min={0}
                  max={20}
                  className="wc26-score-input"
                  value={p?.awayScorePred == null ? "" : String(p.awayScorePred)}
                  disabled={readOnly}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") return onChange(m.id, "away", null);
                    const n = Number(raw);
                    if (!Number.isInteger(n) || n < 0) return;
                    onChange(m.id, "away", n);
                  }}
                />
              </div>
              <div className="wc26-grp-match-side wc26-grp-match-side--away">
                <span className="wc26-grp-name">{away.name}</span>
                <span className="wc26-grp-flag">{flagFor(away.fifa_code)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function filledCount(matches: ApiMatch[], preds: Map<number, GroupPredRow>): number {
  let n = 0;
  for (const m of matches) {
    const p = preds.get(m.id);
    if (p && p.homeScorePred != null && p.awayScorePred != null) n++;
  }
  return n;
}
