export default function JoinCTA() {
  return (
    <section className="join-section" id="join">
      <div className="join-inner reveal">
        <p className="section-label" style={{ justifyContent: "center" }}>
          Get Involved
        </p>
        <h2>
          The future is a market.
          <br />
          <span className="highlight">Learn to price it.</span>
        </h2>
        <p className="subtitle">
          We launch September 2026. Sign up early or dive into the reading list.
        </p>
        <div className="join-buttons">
          <a
            className="btn btn-primary"
            href="/signup"
          >
            Sign Up &rarr;
          </a>
          <a className="btn btn-outline" href="readings.zip" download>
            Papers &darr;
          </a>
          <a
            className="btn btn-outline"
            href="#"
            target="_blank"
            rel="noopener"
          >
            Instagram
          </a>
          <a
            className="btn btn-outline"
            href="#"
            target="_blank"
            rel="noopener"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
