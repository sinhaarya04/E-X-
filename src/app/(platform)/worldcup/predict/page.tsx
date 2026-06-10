"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getMatches,
  getBracket,
  putBracket,
  isApiTeam,
  type ApiMatch,
  type ApiError,
  type GroupPredRow,
  type KnockoutPredRow,
  type PutBracketPayload,
} from "@/lib/wc26/api";
import {
  useBracketDerivation,
  allGroupsComplete,
  type TeamSeed,
} from "@/lib/wc26/useBracketDerivation";
import { useDeadline, formatRemaining } from "@/lib/wc26/useDeadline";
import WC26Tabs from "@/components/worldcup/WC26Tabs";
import GroupPredCard from "@/components/worldcup/GroupPredCard";
import KnockoutSlotCard from "@/components/worldcup/KnockoutSlotCard";

const GROUP_LETTERS = ["A","B","C","D","E","F","G","H","I","J","K","L"] as const;

const ROUNDS: Array<{ label: string; ids: number[] }> = [
  { label: "Round of 32",    ids: range(73, 88) },
  { label: "Round of 16",    ids: range(89, 96) },
  { label: "Quarter-finals",  ids: range(97, 100) },
  { label: "Semi-finals",     ids: [101, 102] },
  { label: "Third-place",     ids: [103] },
  { label: "Final",           ids: [104] },
];

function range(a: number, b: number): number[] {
  const out: number[] = [];
  for (let i = a; i <= b; i++) out.push(i);
  return out;
}

export default function WorldCupPredictPage() {
  const [matches, setMatches] = useState<ApiMatch[] | null>(null);
  const [groupPreds, setGroupPreds] = useState<Map<number, GroupPredRow>>(new Map());
  const [knockoutPicks, setKnockoutPicks] = useState<Map<number, KnockoutPredRow>>(new Map());
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [lockedAt, setLockedAt] = useState<string | null>(null);
  const [lockedFromBracket, setLockedFromBracket] = useState(false);
  const [closedFromSubmit, setClosedFromSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<{ message: string; details?: string[] } | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const dl = useDeadline();
  const closed = lockedFromBracket || closedFromSubmit || (dl.loaded && !dl.isOpen);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const [matchesResp, bracketResp] = await Promise.all([getMatches(), getBracket()]);
        if (cancelled) return;
        setMatches(matchesResp.matches);
        setLockedAt(bracketResp.lockedAt);
        setLockedFromBracket(bracketResp.locked);
        setSubmittedAt(bracketResp.submittedAt);
        setGroupPreds(new Map(bracketResp.groups.map((g) => [g.matchId, g])));
        setKnockoutPicks(new Map(bracketResp.knockouts.map((k) => [k.matchId, k])));
      } catch (err) {
        if (cancelled) return;
        setLoadError((err as ApiError).message || "Failed to load bracket");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, []);

  const teamSeed = useMemo<TeamSeed[]>(() => {
    if (!matches) return [];
    const seen = new Map<string, TeamSeed>();
    for (const m of matches) {
      if (m.type !== "group" || !m.group) continue;
      for (const side of [m.home, m.away]) {
        if (!isApiTeam(side)) continue;
        if (seen.has(side.id)) continue;
        seen.set(side.id, {
          id: side.id, name: side.name, fifa_code: side.fifa_code,
          group: m.group, seed: side.seed,
        });
      }
    }
    return [...seen.values()];
  }, [matches]);

  const derivation = useBracketDerivation({
    matches: matches ?? [],
    teams: teamSeed,
    groupPreds,
    knockoutPicks,
  });

  const groupsDone = useMemo(
    () => allGroupsComplete(derivation.groupMatches, groupPreds),
    [derivation.groupMatches, groupPreds],
  );

  const onGroupChange = useCallback(
    (matchId: number, side: "home" | "away", value: number | null) => {
      setGroupPreds((prev) => {
        const next = new Map(prev);
        const existing = next.get(matchId) ?? { matchId, homeScorePred: null, awayScorePred: null };
        next.set(matchId, {
          ...existing,
          [side === "home" ? "homeScorePred" : "awayScorePred"]: value,
        });
        return next;
      });
      setSubmitSuccess(null);
      setSubmitError(null);
    },
    [],
  );

  const onKoChange = useCallback(
    (matchId: number, update: Partial<{ homeScorePred: number | null; awayScorePred: number | null; winnerPickTeamId: string | null }>) => {
      setKnockoutPicks((prev) => {
        const next = new Map(prev);
        const existing = next.get(matchId) ?? {
          matchId, homeScorePred: null, awayScorePred: null,
          winnerPickTeamId: null, predHomeTeamId: null, predAwayTeamId: null,
        };
        next.set(matchId, { ...existing, ...update });
        return next;
      });
      setSubmitSuccess(null);
      setSubmitError(null);
    },
    [],
  );

  const readiness = useMemo(() => {
    if (!matches) return { ready: false, missing: ["loading"] };
    const missing: string[] = [];
    for (const m of derivation.groupMatches) {
      const p = groupPreds.get(m.id);
      if (!p || p.homeScorePred == null || p.awayScorePred == null) {
        missing.push(`Group match #${m.id}`);
      }
    }
    if (!groupsDone) return { ready: false, missing };
    for (let id = 73; id <= 104; id++) {
      const slot = derivation.bracket.get(id);
      const pick = knockoutPicks.get(id);
      if (!slot?.home || !slot.away) {
        missing.push(`KO slot M${id}`);
        continue;
      }
      if (!pick || pick.homeScorePred == null || pick.awayScorePred == null) {
        missing.push(`KO slot M${id} score`);
      }
      if (!pick?.winnerPickTeamId) {
        missing.push(`KO slot M${id} winner`);
      }
    }
    return { ready: missing.length === 0, missing };
  }, [matches, derivation, groupPreds, knockoutPicks, groupsDone]);

  const onSubmit = useCallback(async () => {
    if (!readiness.ready) return;
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    const payload: PutBracketPayload = {
      groups: [...groupPreds.values()]
        .filter((g) => g.homeScorePred != null && g.awayScorePred != null)
        .map((g) => ({
          matchId: g.matchId,
          homeScorePred: g.homeScorePred as number,
          awayScorePred: g.awayScorePred as number,
        })),
      knockouts: [...knockoutPicks.values()]
        .filter((k) => k.winnerPickTeamId && k.homeScorePred != null && k.awayScorePred != null)
        .map((k) => ({
          matchId: k.matchId,
          homeScorePred: k.homeScorePred as number,
          awayScorePred: k.awayScorePred as number,
          winnerPickTeamId: k.winnerPickTeamId as string,
        })),
    };
    try {
      const resp = await putBracket(payload);
      setSubmittedAt(resp.submittedAt);
      setLockedAt(resp.lockedAt);
      setSubmitSuccess("Bracket saved. You can edit and resubmit until the deadline.");
    } catch (err) {
      const e = err as ApiError;
      if (e.status === 403) {
        setClosedFromSubmit(true);
      } else {
        setSubmitError({ message: e.message || "Submission failed", details: e.details });
      }
    } finally {
      setSubmitting(false);
    }
  }, [readiness.ready, groupPreds, knockoutPicks]);

  if (loading) {
    return (
      <>
        <div className="page-header">
          <p className="page-title">Prediction Game</p>
          <p className="page-heading">World Cup 2026</p>
        </div>
        <WC26Tabs />
        <div className="wc26-status">Loading your bracket...</div>
      </>
    );
  }
  if (loadError) {
    return (
      <>
        <div className="page-header">
          <p className="page-title">Prediction Game</p>
          <p className="page-heading">World Cup 2026</p>
        </div>
        <WC26Tabs />
        <div className="wc26-status">{loadError}</div>
      </>
    );
  }

  const readOnly = closed;

  return (
    <>
      <div className="page-header">
        <p className="page-title">Prediction Game</p>
        <p className="page-heading">World Cup 2026</p>
      </div>
      <WC26Tabs />

      <div className="wc26-bracket-fill">
        {closed ? (
          <div className="wc26-deadline wc26-deadline--locked">
            Submissions closed.{" "}
            {submittedAt
              ? <>Your bracket is shown below (read-only).</>
              : <>You did not submit a bracket before the deadline.</>}
          </div>
        ) : (
          <div className="wc26-deadline">
            You can edit and resubmit until <strong>{lockedAt ? new Date(lockedAt).toLocaleString() : "June 10, 11:59 PM ET"}</strong>.
            {dl.loaded && Number.isFinite(dl.msRemaining) && (
              <> {formatRemaining(dl.msRemaining)} remaining.</>
            )}
            {submittedAt && <> Last saved {new Date(submittedAt).toLocaleString()}.</>}
          </div>
        )}

        <section>
          <h2 className="wc26-section-title">Group Stage</h2>
          <div className="wc26-grp-grid">
            {GROUP_LETTERS.map((g) => {
              const matchesInGroup = derivation.groupMatches.filter((m) => m.group === g);
              const standing = derivation.standingsByGroup.get(g) ?? [];
              return (
                <GroupPredCard
                  key={g}
                  groupLetter={g}
                  matches={matchesInGroup}
                  preds={groupPreds}
                  standing={standing}
                  teamById={derivation.teamById}
                  readOnly={readOnly}
                  onChange={onGroupChange}
                />
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="wc26-section-title">Knockout Bracket</h2>
          {!groupsDone && (
            <div className="wc26-ko-gate">
              Fill in every group score above to derive your knockout matchups.
            </div>
          )}
          {ROUNDS.map((round) => (
            <div key={round.label} className="wc26-ko-round-block">
              <h3 className="wc26-ko-round-label">{round.label}</h3>
              <div className="wc26-ko-round-grid">
                {round.ids.map((id) => (
                  <KnockoutSlotCard
                    key={id}
                    matchId={id}
                    roundLabel={round.label}
                    slot={derivation.bracket.get(id)}
                    pick={knockoutPicks.get(id)}
                    teamById={derivation.teamById}
                    readOnly={readOnly}
                    onChange={onKoChange}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>

        <div className="wc26-submit-bar">
          <div className="wc26-submit-state">
            {closed
              ? "Submissions closed."
              : readiness.ready
                ? "Ready to submit."
                : `${readiness.missing.length} item${readiness.missing.length === 1 ? "" : "s"} left.`}
          </div>
          {submitError && (
            <div className="wc26-submit-error" role="alert">
              <strong>{submitError.message}</strong>
              {submitError.details && submitError.details.length > 0 && (
                <ul>
                  {submitError.details.slice(0, 6).map((d, i) => <li key={i}>{d}</li>)}
                  {submitError.details.length > 6 && <li>...and {submitError.details.length - 6} more</li>}
                </ul>
              )}
            </div>
          )}
          {submitSuccess && (
            <div className="wc26-submit-success" role="status">{submitSuccess}</div>
          )}
          <button
            className="wc26-submit-btn"
            type="button"
            disabled={closed || !readiness.ready || submitting}
            onClick={onSubmit}
          >
            {submitting ? "Submitting..." : closed ? "Closed" : "Submit Bracket"}
          </button>
        </div>
      </div>
    </>
  );
}
