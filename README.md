# E[X] — Northeastern Prediction Markets

A Kalshi-style prediction markets platform for Northeastern University. Students sign up with their NEU email, receive 1,000 Husky Tokens, and can create and bet on markets about campus life, politics, tech, sports, and more.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Backend:** Supabase (Postgres, Auth, Realtime, Edge Functions)
- **Market Engine:** LMSR (Logarithmic Market Scoring Rule) AMM
- **Fonts:** JetBrains Mono + Inter
- **Theme:** Bloomberg Terminal-inspired dark UI

## Getting Started

```bash
cd E-X-
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   └── page.tsx            # Landing page (composes all landing components)
├── components/
│   ├── landing/            # Landing page components
│   │   ├── TickerBar.tsx   # Scrolling market ticker
│   │   ├── Navbar.tsx      # Navigation with live clock + mobile menu
│   │   ├── Hero.tsx        # Hero section with status + stats
│   │   ├── MarketBoard.tsx # Live simulated markets with ticking prices
│   │   ├── Pillars.tsx     # "Four Desks" — what the club does
│   │   ├── Sponsors.tsx    # Sponsor CTA
│   │   ├── JoinCTA.tsx     # Join section with apply/social links
│   │   ├── Footer.tsx      # Footer + disclaimer
│   │   └── ScrollReveal.tsx# IntersectionObserver scroll animations
│   └── ui/                 # shadcn primitives
└── lib/
    └── utils.ts
```

## PR Roadmap

| PR | Branch | Status | Scope |
|----|--------|--------|-------|
| 1 | `feat/project-scaffold` | In Progress | Next.js scaffold + landing page |
| 2 | `feat/supabase-auth` | Planned | Supabase setup, NEU-only auth, Husky Tokens |
| 3 | `feat/app-shell` | Planned | Sidebar, topbar, platform layout |
| 4 | `feat/market-engine` | Planned | LMSR math, markets table, browse + create |
| 5 | `feat/trading` | Planned | Place bets, trade panel, live prices |
| 6 | `feat/portfolio` | Planned | Token balance, positions, P&L |
| 7 | `feat/resolution` | Planned | Admin resolves markets, payouts, disputes |
| 8 | `feat/leaderboard` | Planned | Brier score rankings |
| 9 | `feat/polish-and-deploy` | Planned | Error handling, SEO, Vercel deploy |

## Contact

- Email: contactoracleneu@gmail.com
- Apply: [Google Form](https://forms.gle/FvVqxmq3Qm2QcJ2W9)
