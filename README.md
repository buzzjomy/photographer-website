# Piper and Muse Photography — Website

A static, fully responsive website for a wedding & portrait photographer. No build tools or server required — just HTML, CSS, and vanilla JS.

## Structure

```
photographer-website/
├── index.html        Home page
├── portfolio.html     Filterable gallery with lightbox (Weddings / People)
├── about.html         Bio, stats, process
├── contact.html        Enquiry form
├── css/style.css      All styling (colors/fonts as CSS variables at the top)
├── js/script.js        Nav menu, gallery filters, lightbox, form submit
├── ATTRIBUTIONS.md    Credits for the placeholder Kerala photos (see below)
└── images/            (empty — currently using placeholder photos, see below)
```

## Before you launch

1. **Copy** — the studio name is set to "Piper and Muse," but the bio, testimonial, and stats text are still placeholders. Rewrite the intro, about, and testimonial copy in `index.html` and `about.html` with real details.

2. **Photos** — every image currently points to a real Kerala / Kerala-wedding photo hosted on Wikimedia Commons (Kathakali, Theyyam, Mohiniyattam, and Kerala Hindu/Christian wedding ceremonies), e.g.:
   ```html
   <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Kerala%20Christian%20Wedding.jpg?width=750" alt="Wedding photo">
   ```
   These are real, CC BY-SA-licensed photos by independent Kerala photographers — not this studio's own work — used to make the layout look right while real portfolio photos are gathered. **They must be replaced with the actual photographer's images before launch.** If any are kept in a live deployment, you're legally required to credit them per `ATTRIBUTIONS.md` (CC BY-SA requires attribution). To swap: put your images in the `images/` folder and reference them locally, e.g. `images/wedding-01.jpg`. Keep similar aspect ratios to what's there now (tall ~3:4 for most gallery items, wide ~4:3 for the ones marked `wide`) so the grid layout doesn't break.

3. **Contact form → email notifications** — the form on `contact.html` is wired to send submissions straight to your inbox via [Formspree](https://formspree.io) (free tier, no backend needed):
   1. Create a free Formspree account and a new form.
   2. Copy the endpoint it gives you (`https://formspree.io/f/xxxxxxx`).
   3. In `contact.html`, replace `YOUR_FORM_ID` in the `<form action="...">` line with your real ID.
   4. Submissions will now arrive by email, and the page shows a success/error message without reloading.

4. **Contact details & social links** — update the email, phone, and Instagram/Pinterest/Facebook links in `contact.html` and in the footer of every page.

## Running locally

No build step needed. Either:
- Open `index.html` directly in a browser, or
- Serve it locally (recommended, avoids some browser file:// restrictions):
  ```bash
  cd photographer-website
  python3 -m http.server 8000
  ```
  then visit `http://localhost:8000`.

## Deploying (free options)

- **Netlify**: drag-and-drop the whole folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
- **GitHub Pages**: push this folder to a GitHub repo, then enable Pages in repo settings (root or `/docs`).
- **Vercel**: `vercel` CLI or import the repo at vercel.com — zero config needed for static sites.

All of these give you a mobile-friendly, HTTPS URL the photographer can share and check from their phone.

## Notes

- Fully responsive: hamburger nav under 900px, gallery/grid reflow at 900px and 560px breakpoints.
- Gallery lightbox supports click, arrow keys, and swipe-friendly tap targets.
- Fonts (Cormorant Garamond + Jost) load from Google Fonts — requires an internet connection to render correctly.
