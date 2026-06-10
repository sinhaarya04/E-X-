/**
 * useDeadline — bracket submission deadline, driven by server time.
 *
 * On mount we fetch GET /deadline once, capture (serverNow - clientNow) as
 * an offset, then tick locally every second.
 */
import { useEffect, useRef, useState } from "react";
import { getDeadline } from "./api";

export interface DeadlineState {
  loaded: boolean;
  deadline: Date | null;
  isOpen: boolean;
  msRemaining: number;
  error: string | null;
}

const INITIAL: DeadlineState = {
  loaded: false,
  deadline: null,
  isOpen: true,
  msRemaining: Number.POSITIVE_INFINITY,
  error: null,
};

export function useDeadline(): DeadlineState {
  const [state, setState] = useState<DeadlineState>(INITIAL);
  const offsetRef = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;
    getDeadline()
      .then((res) => {
        if (cancelled) return;
        const deadline = new Date(res.deadline);
        const serverNowMs = new Date(res.serverNow).getTime();
        offsetRef.current = serverNowMs - Date.now();
        const adjustedNow = Date.now() + offsetRef.current;
        const ms = deadline.getTime() - adjustedNow;
        setState({
          loaded: true,
          deadline,
          isOpen: ms > 0,
          msRemaining: Math.max(0, ms),
          error: null,
        });
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          loaded: true,
          error: err.message || "Failed to load deadline",
        }));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!state.loaded || !state.deadline) return;
    const tick = () => {
      const adjustedNow = Date.now() + offsetRef.current;
      const ms = state.deadline!.getTime() - adjustedNow;
      setState((prev) => ({
        ...prev,
        isOpen: ms > 0,
        msRemaining: Math.max(0, ms),
      }));
    };
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [state.loaded, state.deadline]);

  return state;
}

export function formatRemaining(msRemaining: number): string {
  if (!Number.isFinite(msRemaining) || msRemaining <= 0) return "0s";
  const totalSec = Math.floor(msRemaining / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const parts: string[] = [];
  if (d > 0) parts.push(`${d}d`);
  if (d > 0 || h > 0) parts.push(`${String(h).padStart(2, "0")}h`);
  parts.push(`${String(m).padStart(2, "0")}m`);
  parts.push(`${String(s).padStart(2, "0")}s`);
  return parts.join(" ");
}
