import WC26Tabs from "@/components/worldcup/WC26Tabs";

export default function WorldCupRulesPage() {
  return (
    <>
      <div className="page-header">
        <p className="page-title">Prediction Game</p>
        <p className="page-heading">World Cup 2026</p>
      </div>
      <WC26Tabs />
      <div className="wc26-rules">
        <h2 className="wc26-rules-h1">How E[X] World Cup Picks works</h2>
        <p className="wc26-rules-lead">
          Fill in your bracket once before the submission deadline. You predict
          scorelines for every group-stage match and pick the winner of every
          knockout matchup. Your bracket cascades — the team you pick to win each
          round automatically becomes a side in the next round.
        </p>

        <section className="wc26-rules-section">
          <h3 className="wc26-rules-h2">Submission</h3>
          <ul className="wc26-rules-list">
            <li>One bracket per player. Submission requires every group score AND every knockout winner picked.</li>
            <li><strong>Submissions close June 10, 11:59 PM ET.</strong> After that the bracket is locked.</li>
            <li>Knockout sides auto-fill from your group standings and your earlier round picks (cascade).</li>
          </ul>
        </section>

        <section className="wc26-rules-section">
          <h3 className="wc26-rules-h2">Scoring — Group Stage</h3>
          <p>Each group match is scored independently and points stack:</p>
          <table className="wc26-rules-table">
            <thead>
              <tr><th>Component</th><th>Points</th><th>What it means</th></tr>
            </thead>
            <tbody>
              <tr><td>Exact score</td><td className="num">+5</td><td>Both numbers right</td></tr>
              <tr><td>Goal difference</td><td className="num">+4</td><td>Right margin in the right direction</td></tr>
              <tr><td>Outcome</td><td className="num">+3</td><td>Right winner, or both predicted a draw</td></tr>
            </tbody>
          </table>
          <p className="wc26-rules-note">
            Max per group match: <strong>12 points</strong> (5 + 4 + 3).
          </p>
        </section>

        <section className="wc26-rules-section">
          <h3 className="wc26-rules-h2">Scoring — Knockouts (R32 to Final)</h3>
          <p>Knockout matches are <strong>matchup-gated</strong>. Score components only fire if your bracket has the right two teams meeting at that slot:</p>
          <table className="wc26-rules-table">
            <thead>
              <tr><th>Component</th><th>Points</th><th>What it means</th></tr>
            </thead>
            <tbody>
              <tr><td>Exact score</td><td className="num">+5</td><td>Both numbers right AND matchup matches</td></tr>
              <tr><td>Goal difference</td><td className="num">+4</td><td>Right margin AND matchup matches</td></tr>
              <tr><td>Outcome</td><td className="num">+3</td><td>Right 90-min outcome AND matchup matches</td></tr>
              <tr><td>Advancement</td><td className="num">+2</td><td>Picked the team that actually advanced (counts even if matchup didn&apos;t match)</td></tr>
            </tbody>
          </table>
          <p className="wc26-rules-note">
            Max per knockout match: <strong>14 points</strong> (5 + 4 + 3 + 2).
          </p>
        </section>

        <section className="wc26-rules-section">
          <h3 className="wc26-rules-h2">Leaderboard &amp; Tiebreakers</h3>
          <ol className="wc26-rules-list">
            <li>Total points (descending)</li>
            <li>Number of exact-score matches (descending)</li>
            <li>Number of correct outcomes (descending)</li>
            <li>Submission time — earlier wins</li>
          </ol>
        </section>
      </div>
    </>
  );
}
