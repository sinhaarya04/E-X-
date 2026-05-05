# Northeastern Prediction Markets Club — Landing Page

Pre-launch teaser page for the Northeastern Prediction Markets Club (Fall 2026).

## Run locally

```
open index.html
# or
python3 -m http.server 8000
```

## Deploy

Drop `index.html` on **Vercel**, **Netlify**, or **GitHub Pages**. No build step needed.

## Customize

### Logo
Replace the `.logo-mark` div in the header with the official Northeastern "N" SVG. Search for the `<!-- TODO: replace with official NU logo -->` comment.

### Waitlist form
Find the `handleWaitlist()` function in the `<script>` block. Replace the `console.log` with a `fetch()` POST to Mailchimp, ConvertKit, or Formspree.

### Colors & fonts
All design tokens are in `:root` at the top of the `<style>` block:
- `--red` — Northeastern red (`#C8102E`)
- `--bg` — background (`#0a0a0a`)
- `--fg` — foreground (`#fafaf5`)
- `--serif` — headline font (Fraunces)
- `--sans` — body font (Inter)
- `--mono` — numbers/labels (JetBrains Mono)
