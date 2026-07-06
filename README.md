# Handoff: Ana Batiller — Portfolio Site

## Overview
A personal product-design portfolio for Ana Batiller: a landing page (hero + work index) and three case-study pages (GCash Global, Hybrid Credit-Debit Card, PODD), sharing one chrome (header/footer), one motion system, and one content source. Warm, editorial, paper-feeling: cream ground, deep-brown ink, periwinkle + antique-gold accents, serif/sans/mono type trio, quiet confident motion.

## About the Design Files
The files in `design/` are **design references created in HTML** — high-fidelity prototypes showing intended look and behavior, not production code to ship directly. Your task is to **recreate these designs in your target environment** (e.g. Next.js/React, Astro, plain static site — whatever you choose; none exists yet) using that stack's idioms. The `.dc.html` files use a lightweight component runtime (`support.js`) with `{{ }}` template holes — read them as annotated markup: everything visual is in inline styles and the linked CSS/JS, so all exact values are directly liftable.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and interactions are final. Recreate pixel-perfectly.

## Architecture (mirror this structure)
- **One shared chrome** — `Case Shell.dc.html`: back-nav header ("back to work"), wavy divider rule, shared footer, motion wiring. Every case page renders inside it and passes an `accent` color (per-case theme).
- **One shared footer** — `Site Footer.dc.html`: full-bleed ink panel, marquee wordmark ("thank you! · get in touch · …"), contact links with ASCII emoticons.
- **One content source** — `cases.js`: array of `{ id, num, href, cat, title, accent, summary }`. The homepage work index AND each case hero read from it — implement as a single data module so a rename updates both.
- **One motion engine** — `motion.js` (`window.ABMotion.initMotion`): scroll reveal, headline mask-wipe, 3D card tilt, magnetic links, coral cursor glow, click stamp, footer marquee. Port behaviors, not the file.
- **Case pages are content-only** — each case file contains only its sections; chrome comes from the shell.

## Screens / Views

### 1. Landing — `design/Ana Batiller - Case Studies.dc.html`
- **Purpose**: introduce Ana, list the three case studies.
- **Layout**: centered `max-width:1180px`, fluid `clamp()` gutters. Hero is an asymmetric 1.15fr/.85fr grid: display serif intro left, square portrait image right (rounded 26px, drag-drop slot, handwritten-style aside "(that's me, thinkin hard)").
- **Work index**: full-width rows (number · title · summary · category). Hover: row fills with a full-width tint bar (square corners), title + number shift to that case's accent color.

### 2. Case Shell (chrome) — `design/Case Shell.dc.html`
- Header: "back to work" link (mono, lowercase) with blurred accent dot; wavy periwinkle divider below.
- Accepts an `accent` prop that themes the page (PODD `#C98A2E`, GCash Global `#4F63E3`, Hybrid Card `#F2643C`).
- Footer imported from Site Footer.

### 3. Case pages — `design/global-payments.dc.html`, `design/hybrid-credit-debit-card.dc.html`, `design/podd.dc.html`
Common anatomy (see PODD for the fullest example):
- **Hero**: mono eyebrow `{num} {category}` → display title in DM Mono variable settings with blurred accent dot suffix → full-width mono tagline (19–24px).
- **Challenge / Approach**: two-column 1fr/1fr grid, 22px mono headings, 18px/1.75 DM Sans body.
- **Sections** separated by `clamp(56px,7vw,104px)`, each with a 13px tracked lowercase mono eyebrow, a DM Mono `h3` `clamp(30px,4.5vw,56px)`, an intro paragraph max-width 64ch, then 3-up card grids (22px radius, `--sky-tint` or `--olive-tint` backgrounds, alternated per section for rhythm).
- **PODD section order** (the story spine): challenge → testing (3 insight cards + 2 side-by-side prototype photos) → brand direction (1.1fr/.9fr text + 58% stat card, full-width image below) → solution (3 cards + image) → **marketing** (full-width accent-orange band `#C98A2E` with cream text `#FDF9F0`, "Live your life outside." pull-quote, 3 phase cards, 21:9 image slot) → **operations & financial planning** (2 location-rubric cards, 1.05fr/.95fr text + 2×2 stat card: 16 mo / 26% / €1,140 / €684k, scale-plan pill row) → outcome (3 big stats over a hairline rule + final image).
- **Outcome stats**: numerals in DM Mono variable `clamp(48px,6vw,84px)`, first stat in accent color, mono captions max-width 24ch.
- **Images**: all imagery is user-supplied via drop slots; sizes follow the image's natural aspect ratio (auto-aspect) with a 16:9 placeholder fallback, 22px radius, media-only shadow `0 30px 60px -34px rgba(55,27,5,.30)`.

### 4. Footer — `design/Site Footer.dc.html`
Full-bleed ink (`#371B05`) panel; giant serif marquee wordmark that speeds up with scroll velocity; contact links ("email me :-)", "connect with me :-D").

## Interactions & Behavior
- **Easing**: one curve everywhere — `cubic-bezier(.16,1,.3,1)`.
- **Scroll reveal**: elements fade up 46px with slight scale-in, auto-staggered ~80ms among siblings (`[data-reveal]`, IntersectionObserver).
- **Headline wipe**: headings clip-mask and wipe up line-by-line (`[data-mask] > [data-line]`).
- **Card tilt** (fine pointers only): 3D tilt toward cursor up to 12°, `transform-style:preserve-3d`.
- **Magnetic links**: links/titles translate slightly toward the cursor.
- **Cursor glow**: blurred clay-coral (`#FB885B`) dot trails the cursor, multiply blend, swells over interactive targets. Never used as fill or text.
- **Click stamp**: small stamp effect on click.
- **Index row hover**: full-width tint bar, accent-colored title/number, underline draws in from left on links.
- **Accessibility**: everything respects `prefers-reduced-motion` and fails open (content visible if observers never fire).

## State Management
Static site — no app state. Only needs: the shared `cases` data module, and per-page accent theming (CSS custom property set from case data).

## Design Tokens
(Full definitions in `design/tokens/*.css`; summary:)
- **Colors**: page `#FFFEFA` (cream); ink `#371B05`; body `#5A4632`; accent periwinkle `#6E82DB`; hairline `#D2DDFB`; gold `#9E8D35`; tints `#EEF2FE` (sky) / `#F7F2E2` (olive); cursor glow only `#FB885B`. Case accents: `#4F63E3`, `#F2643C`, `#C98A2E`.
- **Type**: Palmios (local `design/Palmios.woff2`, via `--font-head`) for all `h1`–`h3` display headers — applied by a `base.css` override (lowercased, relaxed tracking), with Fraunces (variable serif, opsz 96–144, SOFT 50–90) as fallback; DM Sans body 17–18px/1.75; DM Mono for every eyebrow/label/tagline/caption/stat-caption (13px, tracking .2em) and all non-heading display text (stat numerals, index titles' inline styles). Fraunces, DM Sans, DM Mono load from Google Fonts.
- **Spacing**: 1180px column; `clamp(56px,7vw,104px)` between sections; `clamp(24px,2.4vw,34px)` card padding.
- **Radii**: 22px cards/media, 26px portrait, 14px thumbnails, 999px pills. **Hairlines**: `1.5px solid` periwinkle. **Shadow** (media only): `0 30px 60px -34px rgba(55,27,5,.30)`.
- **Motif**: soft blurred accent dot (CSS circle + `filter:blur`) beside headlines/titles.

## Iconography
None. No icon fonts or SVG sets. The "icons" are the blurred dot, middot separators (·), and ASCII emoticons in contact links. Do not add an icon library.

## Copy & Voice
First person, plain, evidence-led ("I redesigned…"); numbers do the bragging. Sentence case; lowercase tracked mono eyebrows; middots in meta lines; em-dashes for asides; emoticons only in contact links; no emoji. All final copy is in the HTML files and `cases.js`.

## Assets
- `design/Palmios.woff2` — local display font for `h1`–`h3` headers (see `tokens/typography.css` + the `base.css` heading override). Confirm the webfont license covers self-hosting before going live.
- Fraunces, DM Sans, DM Mono — load from Google Fonts.
- `images/` — the final case-study photos/screenshots. Each filename matches the `id` of the `image-slot` element it belongs to in the HTML (e.g. `images/ab-podd-hero.webp` goes where `<image-slot id="ab-podd-hero">` sits), and each slot also carries a `src="../images/…"` fallback so the prototypes render the final imagery as-is. In the production build, replace each slot with a real `<img>` using these files.

## Files
- `DESIGN_SYSTEM.md` — full design-system documentation (read first).
- `design/Ana Batiller - Case Studies.dc.html` — landing page.
- `design/Case Shell.dc.html`, `design/Site Footer.dc.html` — shared chrome.
- `design/global-payments.dc.html`, `design/hybrid-credit-debit-card.dc.html`, `design/podd.dc.html` — case studies.
- `design/Case Template.dc.html` — blank case-page pattern (shows the intended anatomy for future cases).
- `design/cases.js` — case metadata (single source of truth).
- `design/motion.js` — all animation behavior (port these behaviors).
- `design/image-slot.js` — drag-drop image placeholder component (prototype-only; replace with real `<img>`s).
- `design/styles.css`, `design/base.css`, `design/tokens/` — global styles + token definitions.
- `design/support.js` — prototype runtime (lets the `.dc.html` files open in a browser; not part of the design).
- `design/Ana Batiller - Portfolio.dc.html` — redirect stub into the landing.
- `images/` — final imagery, one file per image slot (named by slot id).
