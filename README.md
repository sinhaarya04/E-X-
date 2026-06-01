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
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── page.tsx                # Landing page (composes all landing components)
│   ├── (auth)/
│   │   ├── login/page.tsx      # Sign in page
│   │   ├── signup/page.tsx     # Sign up page (NEU emails only)
│   │   └── callback/route.ts   # Email confirmation handler
│   ├── (platform)/
│   │   ├── layout.tsx          # Authenticated shell (sidebar + topbar)
│   │   ├── dashboard/page.tsx  # User home — balance, positions, P&L
│   │   ├── markets/page.tsx    # Browse markets (placeholder)
│   │   ├── portfolio/page.tsx  # User portfolio (placeholder)
│   │   └── leaderboard/page.tsx# Rankings (placeholder)
│   └── api/auth/signout/       # Sign out endpoint
├── components/
│   ├── landing/                # Landing page components
│   │   ├── TickerBar.tsx       # Scrolling market ticker
│   │   ├── Navbar.tsx          # Navigation with live clock + mobile menu
│   │   ├── Hero.tsx            # Hero section with status + stats
│   │   ├── MarketBoard.tsx     # Live simulated markets with ticking prices
│   │   ├── Pillars.tsx         # "Four Desks" — what the club does
│   │   ├── Sponsors.tsx        # Sponsor CTA
│   │   ├── JoinCTA.tsx         # Join section with signup/social links
│   │   ├── Footer.tsx          # Footer + disclaimer
│   │   └── ScrollReveal.tsx    # IntersectionObserver scroll animations
│   ├── layout/                 # Platform shell components
│   │   ├── PlatformShell.tsx   # Client wrapper (sidebar state)
│   │   ├── Topbar.tsx          # Logo, token balance, sign out
│   │   └── Sidebar.tsx         # Dashboard/Markets/Portfolio/Leaderboard nav
│   └── ui/                     # shadcn primitives
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   ├── server.ts           # Server Supabase client
│   │   ├── middleware.ts       # Session refresh + route protection
│   │   └── database.types.ts   # TypeScript types for DB schema
│   └── utils.ts
├── middleware.ts                # Root middleware (auth guard)
└── supabase/
    └── migrations/
        └── 001_profiles_and_tokens.sql
```

## PR Roadmap

| PR | Branch | Status | Scope |
|----|--------|--------|-------|
| 1 | `feat/project-scaffold` | Done | Next.js scaffold + landing page |
| 2 | `feat/supabase-auth` | Done | Supabase setup, NEU-only auth, Husky Tokens |
| 3 | `feat/app-shell` | Done | Sidebar, topbar, platform layout, dashboard |
| 4 | `feat/market-engine` | Planned | LMSR math, markets table, browse + create |
| 5 | `feat/trading` | Planned | Place bets, trade panel, live prices |
| 6 | `feat/portfolio` | Planned | Token balance, positions, P&L |
| 7 | `feat/resolution` | Planned | Admin resolves markets, payouts, disputes |
| 8 | `feat/leaderboard` | Planned | Brier score rankings |
| 9 | `feat/polish-and-deploy` | Planned | Error handling, SEO, Vercel deploy |

## Contact

- Email: contactoracleneu@gmail.com
- Apply: [Google Form](https://forms.gle/FvVqxmq3Qm2QcJ2W9)
