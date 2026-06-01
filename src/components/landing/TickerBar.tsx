"use client";

const TICKER_DATA = [
  { sym: "BTC", val: "$197,420", chg: "+2.4%", up: true },
  { sym: "ETH", val: "$8,105", chg: "-0.8%", up: false },
  { sym: "SPX", val: "5,892", chg: "+0.3%", up: true },
  { sym: "TRUMP28", val: "38\u00A2", chg: "+1.2", up: true },
  { sym: "FED CUT", val: "61\u00A2", chg: "-0.5", up: false },
  { sym: "GPT-6", val: "44\u00A2", chg: "+2.1", up: true },
  { sym: "TSLA TAXI", val: "12\u00A2", chg: "-0.3", up: false },
  { sym: "VIX", val: "18.42", chg: "-1.1%", up: false },
  { sym: "GOLD", val: "$3,280", chg: "+0.6%", up: true },
  { sym: "POLY VOL", val: "$1.2B", chg: "+8.4%", up: true },
];

export default function TickerBar() {
  const items = [...TICKER_DATA, ...TICKER_DATA];

  return (
    <div className="ticker-bar">
      <div className="ticker-track">
        {items.map((t, i) => (
          <span key={i} className="ticker-item">
            <span className="t-sym">{t.sym}</span>
            {t.val}{" "}
            <span className={t.up ? "t-up" : "t-down"}>{t.chg}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
