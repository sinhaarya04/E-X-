"use client";

import type { ApiTeamSummary, KnockoutPredRow } from "@/lib/wc26/api";
import type { BracketSlot } from "@/lib/wc26/bracketEngine/types";
import { flagFor } from "@/lib/wc26/flags";

interface Props {
  matchId: number;
  roundLabel: string;
  slot: BracketSlot | undefined;
  pick: KnockoutPredRow | undefined;
  teamById: Map<string, ApiTeamSummary>;
  readOnly: boolean;
  onChange: (
    matchId: number,
    update: Partial<{ homeScorePred: number | null; awayScorePred: number | null; winnerPickTeamId: string | null }>,
  ) => void;
}

export default function KnockoutSlotCard({
  matchId, roundLabel, slot, pick, teamById, readOnly, onChange,
}: Props) {
  const home = slot?.home;
  const away = slot?.away;
  const homeTeam = home ? (teamById.get(home.id) ?? { id: home.id, name: home.id, fifa_code: "", seed: home.seed }) : null;
  const awayTeam = away ? (teamById.get(away.id) ?? { id: away.id, name: away.id, fifa_code: "", seed: away.seed }) : null;

  const resolved = Boolean(home && away);
  const selectedWinner = pick?.winnerPickTeamId ?? null;

  const cardClass = [
    "wc26-ko-card",
    !resolved && "wc26-ko-card--pending",
    selectedWinner && "wc26-ko-card--picked",
  ].filter(Boolean).join(" ");

  return (
    <div className={cardClass}>
      <div className="wc26-ko-card-head">
        <span className="wc26-ko-mid">M{matchId}</span>
        <span>{roundLabel}</span>
      </div>

      {!resolved && (
        <div className="wc26-ko-pending">
          Finish your earlier picks to unlock this matchup.
        </div>
      )}

      {resolved && (
        <>
          <SideRow
            team={homeTeam!}
            score={pick?.homeScorePred ?? null}
            selected={selectedWinner === homeTeam!.id}
            disabled={readOnly}
            onScore={(v) => onChange(matchId, { homeScorePred: v })}
            onPick={() => onChange(matchId, { winnerPickTeamId: homeTeam!.id })}
          />
          <SideRow
            team={awayTeam!}
            score={pick?.awayScorePred ?? null}
            selected={selectedWinner === awayTeam!.id}
            disabled={readOnly}
            onScore={(v) => onChange(matchId, { awayScorePred: v })}
            onPick={() => onChange(matchId, { winnerPickTeamId: awayTeam!.id })}
          />
          {!selectedWinner && (
            <div className="wc26-ko-hint">
              Pick the team you think advances (knockouts can&apos;t draw).
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SideRow({ team, score, selected, disabled, onScore, onPick }: {
  team: ApiTeamSummary;
  score: number | null;
  selected: boolean;
  disabled: boolean;
  onScore: (v: number | null) => void;
  onPick: () => void;
}) {
  return (
    <div className={`wc26-ko-side${selected ? " wc26-ko-side--winner" : ""}`}>
      <button
        type="button"
        className={`wc26-ko-pick${selected ? " wc26-ko-pick--on" : ""}`}
        disabled={disabled}
        onClick={onPick}
        aria-pressed={selected}
      >
        {selected ? "\u2713" : ""}
      </button>
      <span className="wc26-ko-team">
        <span className="wc26-grp-flag">{flagFor(team.fifa_code)}</span>
        <span className="wc26-grp-name">{team.name}</span>
      </span>
      <input
        type="number"
        min={0}
        max={20}
        className="wc26-score-input"
        value={score == null ? "" : String(score)}
        disabled={disabled}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") return onScore(null);
          const n = Number(raw);
          if (!Number.isInteger(n) || n < 0) return;
          onScore(n);
        }}
      />
    </div>
  );
}
