/**
 * WC26 API client — talks to the Express/MongoDB backend.
 *
 * Auth tokens come from the Supabase session (E[X] platform auth).
 * No localStorage token management — Supabase handles refresh.
 */

import { createClient } from "@/lib/supabase/client";

export interface ApiError extends Error {
  status: number;
  details?: string[];
}

// Calls go through the same-origin Next.js rewrite at /api/wc26/* to avoid
// CORS. The destination upstream is configured in next.config.ts.
// Local override is still supported via NEXT_PUBLIC_WC26_API_URL (e.g.
// http://localhost:3050 when running the backend directly).
const BASE_URL = (
  process.env.NEXT_PUBLIC_WC26_API_URL ?? "/api/wc26"
).replace(/\/+$/, "");

async function getSupabaseToken(): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export async function apiRequest<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const token = await getSupabaseToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const parsed: unknown = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const obj =
      parsed && typeof parsed === "object" && parsed !== null
        ? (parsed as { error?: unknown; details?: unknown })
        : null;
    const message =
      (obj && obj.error != null ? String(obj.error) : null) ||
      res.statusText ||
      `Request failed: ${res.status}`;
    const err = new Error(message) as ApiError;
    err.status = res.status;
    if (obj && Array.isArray(obj.details)) {
      err.details = obj.details.filter((d): d is string => typeof d === "string");
    }
    throw err;
  }

  return parsed as T;
}

// ---------- /deadline ----------

export interface DeadlineResponse {
  deadline: string;
  serverNow: string;
  isOpen: boolean;
}

export function getDeadline(): Promise<DeadlineResponse> {
  return apiRequest<DeadlineResponse>("GET", "/deadline");
}

// ---------- /matches ----------

export interface ApiTeamSummary {
  id: string;
  name: string;
  fifa_code: string;
  seed: number;
}

export interface ApiMatchResult {
  homeScore: number;
  awayScore: number;
  winnerTeamId: string | null;
}

export interface ApiMatch {
  id: number;
  type: "group" | "r32" | "r16" | "qf" | "sf" | "third" | "final";
  group: string | null;
  matchday: number | null;
  kickoffUtc: string;
  status: "finished" | "scheduled";
  home: ApiTeamSummary | { label: string | null };
  away: ApiTeamSummary | { label: string | null };
  result: ApiMatchResult | null;
}

export function getMatches(): Promise<{ matches: ApiMatch[] }> {
  return apiRequest<{ matches: ApiMatch[] }>("GET", "/matches");
}

export function isApiTeam(side: ApiMatch["home"]): side is ApiTeamSummary {
  return typeof (side as ApiTeamSummary).id === "string";
}

// ---------- /predictions/bracket ----------

export interface GroupPredRow {
  matchId: number;
  homeScorePred: number | null;
  awayScorePred: number | null;
}

export interface KnockoutPredRow {
  matchId: number;
  homeScorePred: number | null;
  awayScorePred: number | null;
  winnerPickTeamId: string | null;
  predHomeTeamId: string | null;
  predAwayTeamId: string | null;
}

export interface GetBracketResponse {
  groups: GroupPredRow[];
  knockouts: KnockoutPredRow[];
  submittedAt: string | null;
  lockedAt: string | null;
  locked: boolean;
}

export function getBracket(): Promise<GetBracketResponse> {
  return apiRequest<GetBracketResponse>("GET", "/predictions/bracket");
}

export interface PutBracketPayload {
  groups: Array<{ matchId: number; homeScorePred: number; awayScorePred: number }>;
  knockouts: Array<{
    matchId: number;
    homeScorePred: number;
    awayScorePred: number;
    winnerPickTeamId: string;
  }>;
}

export interface PutBracketResponse {
  submittedAt: string;
  groups: number;
  knockouts: number;
  lockedAt: string;
}

export function putBracket(payload: PutBracketPayload): Promise<PutBracketResponse> {
  return apiRequest<PutBracketResponse>("PUT", "/predictions/bracket", payload);
}

// ---------- /leaderboard ----------

export interface LeaderboardRow {
  rank: number;
  userId: string;
  name: string;
  points: number;
  exactCount: number;
  outcomeCount: number;
}

export async function getLeaderboardOverall(): Promise<LeaderboardRow[]> {
  const res = await apiRequest<{ leaderboard: LeaderboardRow[] }>(
    "GET",
    "/leaderboard/overall",
  );
  return res.leaderboard;
}
