export default function Footer() {
  return (
    <>
      <footer>
        <span>E[X] &middot; Boston, MA &middot; Est. 2026</span>
        <div className="footer-links">
          <a
            href="https://www.instagram.com/northeastern_ex/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/in/northeastern-predictions-b2578b405/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
          <a href="mailto:contactoracleneu@gmail.com" aria-label="Email">
            Email
          </a>
        </div>
      </footer>
      <p className="disclaimer">
        E[X] is a student organization at Northeastern University. Not
        affiliated with any real-money trading platform. All markets are
        simulated with play money.
      </p>
    </>
  );
}
