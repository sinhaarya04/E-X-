export default function Hero() {
  return (
    <section className="hero" id="tracker">
      <div className="hero-top reveal">
        <div className="hero-status">
          <span className="pulse"></span> Pre-Launch
        </div>
      </div>
      <h1 className="reveal reveal-d1">
        <span className="highlight">E[X]</span>
        <br />
        Northeastern
        <br />
        Prediction Markets
      </h1>
      <p className="hero-sub reveal reveal-d2">
        Forecast real-world events. Sharpen your edge. Compete to be the most
        calibrated mind on campus.
      </p>
      <div className="hero-stats reveal reveal-d3">
        <div>
          <div className="hero-stat-label">Launch</div>
          <div className="hero-stat-value">
            Sep<span className="unit"> 2026</span>
          </div>
        </div>
        <div>
          <div className="hero-stat-label">Markets</div>
          <div className="hero-stat-value">
            8<span className="unit"> active</span>
          </div>
        </div>
        <div>
          <div className="hero-stat-label">Status</div>
          <div className="hero-stat-value" style={{ color: "var(--amber)" }}>
            Building
          </div>
        </div>
      </div>
    </section>
  );
}
