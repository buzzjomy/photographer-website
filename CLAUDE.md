# CLAUDE.md

Context for Claude Code (or any future AI assistant) working in this repo. See also `README.md` (human-facing setup/deploy guide) and `ATTRIBUTIONS.md` (photo credits).

## What this is

A static wedding & portrait photography website for a studio branded **"Piper and Muse"**. No build tools — plain HTML/CSS/vanilla JS, 4 pages (Home, Portfolio, About, Contact). Built from scratch in an iterative, chat-driven session; the history below is that build log, kept so future work has the full context without re-deriving it.

- **Live site:** https://buzzjomy.github.io/photographer-website/
- **Repo:** https://github.com/buzzjomy/photographer-website (public), deployed via GitHub Pages from `main`
- **Contact:** infoanishlal@gmail.com · +91 96332 75586

## Deployment method

Hosted on **GitHub Pages**, chosen because `gh` (GitHub CLI) was already authenticated in the working environment — no new account/login needed. Set up once as:

```bash
git init && git branch -M main
git add -A && git commit -m "Initial commit"
gh repo create photographer-website --public --source=. --remote=origin \
  --description "Piper and Muse — wedding & portrait photography site" --push
gh api repos/buzzjomy/photographer-website/pages -X POST \
  -f "source[branch]=main" -f "source[path]=/"
```

That last call turns on Pages, serving `main` from the repo root at `https://buzzjomy.github.io/photographer-website/`.

**Every subsequent deploy is just `git push` to `main`** — Pages rebuilds automatically (~1 minute). To confirm a deploy finished before telling the user to check the live site:

```bash
until page_status=$(gh api repos/buzzjomy/photographer-website/pages/builds/latest --jq .status 2>/dev/null); \
  [ "$page_status" = "built" ] || [ "$page_status" = "errored" ]; do sleep 5; done
echo "FINAL_STATUS=$page_status"
```
(Run this via a backgrounded shell command / task-notification pattern rather than blocking — it can take 30–90s.)

Alternatives considered but not used: **Netlify** and **Vercel** (both would need a fresh CLI login the user would have to complete interactively) — noted in `README.md` in case the site ever needs to move.

## Structure

```
index.html        Home — hero, specialties, featured strip, testimonial, CTA
portfolio.html     Filterable gallery (Weddings / People) + lightbox
about.html         Bio, stats, process
contact.html        Enquiry form (name, phone, email, event type/date, message)
css/style.css      All styling, CSS custom properties at the top
js/script.js        Nav toggle, header scroll state, gallery filters, lightbox, form submit
images/            hero-couple.jpg (desktop hero) + hero-couple-mobile.jpg (rotated mobile variant)
ATTRIBUTIONS.md    Wikimedia Commons photo credits (CC BY-SA — legally required if kept live)
README.md          Setup/customization/deploy instructions for a human
```

## Build history (chronological)

1. **Initial build** — static multi-page site from scratch: responsive layout, mobile hamburger nav, portfolio filter + lightbox gallery, contact form skeleton. Placeholder studio name and picsum.photos stock images throughout.
2. **Rebranded** to "Piper and Muse" across all pages, footers, and meta tags; reworded About/testimonial copy from a solo-photographer voice ("I'm Aurelia...") to a studio voice ("we're Piper and Muse...").
3. **Replaced all placeholder images** with real Kerala / Kerala-wedding photography (Kathakali, Theyyam, Mohiniyattam, Hindu/Christian wedding ceremonies) sourced from Wikimedia Commons under CC BY-SA/CC0 — credited in `ATTRIBUTIONS.md`. These are still stand-ins for the studio's own portfolio, not the real thing.
4. **Deployed to GitHub Pages** — `git init`, created the public repo via `gh repo create`, pushed, enabled Pages via `gh api .../pages`.
5. **Wired the contact form to FormSubmit.co** (`https://formsubmit.co/ajax/infoanishlal@gmail.com`) rather than Formspree, since Formspree requires an account signup that can't be done on the user's behalf non-interactively. Added a honeypot field and hidden subject/template fields. FormSubmit requires a one-time "Activate Form" email click before submissions actually deliver — confirmed pending as of the last session.
6. **Added real contact details** — phone (+91 96332 75586) and email (infoanishlal@gmail.com), replacing all placeholders site-wide.
7. **Swapped the home hero photo** for a real couple portrait provided directly by the user (`images/hero-couple.jpg` — a joyful couple in a water-filled vessel with lotus flowers, shot overhead).
8. **Fixed the Contact page hero crop** (Alleppey houseboats photo) — repositioned to `background-position: center bottom` so the houseboats/palms show instead of empty sky.
9. **Diagnosed a "Send Enquiry does nothing" report** — used a real headless-browser test (Playwright) to inspect the actual network request/response rather than guessing; root cause was the pending FormSubmit activation (not a code bug). Added `scrollIntoView` on the status message so it's never missed.
10. **Added a required Phone Number field** to the contact form.
11. **Fixed the home hero on mobile** — the original landscape photo, cover-cropped into a full-height mobile hero, showed only ~24% of its width (neither person recognizable). Solved by adding a portrait-rotated crop of the same photo (`images/hero-couple-mobile.jpg`) swapped in via a mobile media query.
12. **Fixed buttons covering the photo** (mobile, then desktop on follow-up) — even with the rotated photo, the couple's two faces sit far enough apart vertically that centered overlay text/buttons always ended up hiding one of them (verified empirically with Playwright screenshots at multiple crop positions — text overlap was fine, but solid buttons fully occluded whatever was behind them). **Final fix:** restructured the home hero from "text overlaid on a full-bleed image" into two stacked, non-overlapping blocks — the photo shown in full (`aspect-ratio` matched to the source, so nothing is cropped), then heading/copy/buttons in a separate solid-background (`#1c1712`) block below it. Applied to all screen sizes, not just mobile. Inner-page headers (`hero-sm` — Portfolio/About/Contact, no buttons) kept the original overlay look since they never had this problem.
13. **Cache-busting** — GitHub Pages sets `cache-control: max-age=600` on static assets, which caused real "the fix isn't showing up" confusion after deploys. Added `?v=<timestamp>` to every `css/style.css` and `js/script.js` reference; **bump this on every CSS/JS change** (`date +%Y%m%d%H%M`, sed across all 4 HTML files).

## Current known state / TODO before real launch

- **FormSubmit activation status unknown as of last session** — verify with a real test submission before relying on the contact form.
- Portfolio/hero photos are Wikimedia Commons placeholders, not the studio's real work — swap before launch (see `ATTRIBUTIONS.md`).
- Bio, testimonial, and stats copy (About/Home pages) are still placeholder text.
- Footer social links (Instagram/Pinterest/Facebook) are still `#` anchors.

## Working conventions for this repo

- **No build step.** Edit HTML/CSS/JS directly; test with `python3 -m http.server` locally.
- **Verify visually before claiming a CSS/layout fix works.** This project's hardest bugs (mobile hero crop, button-over-photo) were only actually solvable by rendering real screenshots at real viewport sizes (Playwright is installed at `/Users/jomymooken/node_modules/playwright` — run scripts from that directory, or anywhere with `node_modules` on the path, for `require('playwright')` to resolve) and inspecting pixel positions, not by reasoning about CSS math alone — several early "fixes" looked right on paper and were wrong in practice.
- **Bump the `?v=` cache-busting param** on `css/style.css`/`js/script.js` references in all 4 HTML files whenever either changes.
- **Deploy = commit + push to `main`.** GitHub Pages auto-rebuilds (~1 min). Poll with `gh api repos/buzzjomy/photographer-website/pages/builds/latest --jq .status` until `built` before telling the user to check.
- **Home hero (`#homeHeroMedia`) is responsive-art-directed**: desktop uses `images/hero-couple.jpg` (landscape, `aspect-ratio: 1200/630`), mobile (`max-width: 560px`) swaps to `images/hero-couple-mobile.jpg` (portrait rotation of the same shot, `aspect-ratio: 630/1200`). Both render as full, uncropped photo blocks — never overlaid with text.
