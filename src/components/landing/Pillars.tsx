export default function Pillars() {
  return (
    <section className="pillars-section" id="about">
      <div className="pillars-head">
        <p className="section-label reveal">What We Do</p>
        <p className="section-title reveal reveal-d1">Four Desks</p>
      </div>
      <div className="pillars-grid reveal reveal-d2">
        <div className="pillar-card">
          <div className="pillar-num">DESK 01</div>
          <h3>Weekly Markets</h3>
          <p>
            New questions every Monday. Politics, tech, sports, campus life.
            Close dates range from days to months.
          </p>
        </div>
        <div className="pillar-card">
          <div className="pillar-num">DESK 02</div>
          <h3>Speaker Nights</h3>
          <p>
            Forecasters, traders, and researchers at the Interdisciplinary
            Science and Engineering Complex. Learn how professionals think about
            uncertainty.
          </p>
        </div>
        <div className="pillar-card">
          <div className="pillar-num">DESK 03</div>
          <h3>Semester Leaderboard</h3>
          <p>
            Ranked by Brier score. The best-calibrated forecasters win. Bragging
            rights are non-negotiable.
          </p>
        </div>
        <div className="pillar-card">
          <div className="pillar-num">DESK 04</div>
          <h3>Open to All Majors</h3>
          <p>
            Finance, CS, political science, philosophy, undecided. Good judgment
            doesn&rsquo;t require a specific major.
          </p>
        </div>
      </div>
    </section>
  );
}
