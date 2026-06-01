"use client";

import { useEffect, useRef, useState } from "react";

interface Market {
  q: string;
  p: number;
}

const INITIAL_MARKETS: Market[] = [
  { q: "Trump wins 2028 presidential election", p: 38 },
  { q: "Bitcoin above $200K by end of 2027", p: 22 },
  { q: "Fed cuts rates before September 2026", p: 61 },
  { q: "GPT-6 released before January 2027", p: 44 },
  { q: "Huskies make NCAA Tournament 2026\u201327", p: 29 },
  { q: "Northeastern cracks US News Top 30", p: 17 },
  { q: "Tesla delivers Robotaxi in 2026", p: 12 },
  { q: "US TikTok ban upheld through 2027", p: 55 },
];

export default function MarketBoard() {
  const [markets, setMarkets] = useState(INITIAL_MARKETS);
  const [deltas, setDeltas] = useState<(number | null)[]>(
    Array(INITIAL_MARKETS.length).fill(null)
  );
  const [deltaVisible, setDeltaVisible] = useState<boolean[]>(
    Array(INITIAL_MARKETS.length).fill(false)
  );
  const marketsRef = useRef(markets);
  marketsRef.current = markets;

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const id = setInterval(() => {
      const current = marketsRef.current;
      const newMarkets = [...current];
      const newDeltas: (number | null)[] = Array(current.length).fill(null);
      const newVisible: boolean[] = Array(current.length).fill(false);

      current.forEach((m, i) => {
        const d = (Math.random() - 0.5) * 6;
        if (Math.abs(d) < 0.3) return;
        const newP = Math.max(2, Math.min(98, Math.round(m.p + d)));
        newMarkets[i] = { ...m, p: newP };
        newDeltas[i] = d;
        newVisible[i] = true;
      });

      setMarkets(newMarkets);
      setDeltas(newDeltas);
      setDeltaVisible(newVisible);

      setTimeout(() => {
        setDeltaVisible(Array(current.length).fill(false));
      }, 900);
    }, 1400);

    return () => clearInterval(id);
  }, []);

  return (
    <section className="markets-section" id="markets">
      <div className="markets-head">
        <div>
          <p className="section-label reveal">Live Feed</p>
          <p className="section-title reveal reveal-d1">Market Board</p>
        </div>
        <span className="markets-note reveal reveal-d2">
          Simulated &middot; Play money
        </span>
      </div>
      <div className="markets-shell reveal reveal-d2">
        <div className="markets-header-row">
          <span>Contract</span>
          <span className="col-bar">Probability</span>
          <span style={{ textAlign: "right" }}>Price</span>
          <span style={{ textAlign: "right" }}>Chg</span>
        </div>
        <div>
          {markets.map((m, i) => {
            const color = m.p >= 50 ? "var(--green)" : "var(--red)";
            const delta = deltas[i];
            const showDelta = deltaVisible[i] && delta !== null;

            return (
              <div key={i} className="market-row">
                <span className="market-q">{m.q}</span>
                <div className="market-bar">
                  <div
                    className="market-bar-fill"
                    style={{ width: `${m.p}%`, background: color }}
                  />
                </div>
                <span className="market-price" style={{ color }}>
                  {m.p}&cent;
                </span>
                <span
                  className={`market-delta ${
                    showDelta && delta !== null
                      ? delta > 0
                        ? "delta-up"
                        : "delta-down"
                      : ""
                  }`}
                  style={{ opacity: showDelta ? 1 : 0 }}
                >
                  {showDelta && delta !== null
                    ? `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`
                    : "\u00A0"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
