# Ana Batiller — Portfolio Design System

The visual + interaction system behind Ana Batiller's product-design portfolio. A warm, editorial, paper-feeling site: cream ground, deep-brown ink, a cool periwinkle accent and a muted antique-gold, set in a serif/sans/mono trio with quiet, confident motion.

**Sources in this project**
- `Ana Batiller - Case Studies.dc.html` — the landing: hero + work index. Pulls in the shared footer + motion engine.
- `Case Shell.dc.html` — **master chrome** for every case study: back-nav header, shared footer, and the motion wiring. Case pages wrap their content in it via `<dc-import name="Case Shell" accent="…">`. Edit the header/footer/motion here once → every case updates.
- `Site Footer.dc.html` — the contact footer as one component (imported by the shell and the landing).
- `motion.js` — **single source of truth** for all animation (reveal, tilt, magnetism, cursor glow, click-stamp, marquee, hero letters, index hover). Loaded in each page's helmet; each page's DC logic calls `window.ABMotion.initMotion(this.props)`.
- `cases.js` — **single source of truth for case content metadata** (`num`, `href`, `cat`, `title`, `summary`). The homepage work index AND each case page's hero both read from here, so renaming a case or rewriting its summary updates both at once.
- `Case Template.dc.html` — content-only starting point for a new case. Duplicate → fill placeholders → wrap stays in the shell.
- `global-payments.dc.html`, `hybrid-credit-debit-card.dc.html`, `podd.dc.html` — case studies. Each is **content only** inside `Case Shell`.
- `Ana Batiller - Portfolio.dc.html` — redirect into the landing.

**Where to make a change once:** chrome (header/footer) → `Case Shell.dc.html` + `Site Footer.dc.html`; any animation behavior → `motion.js`; a case's number/title/category/summary → `cases.js` (updates the case hero + homepage row together); colors/type/spacing tokens → `tokens/*.css`. All of it propagates to every page.

---

## Content fundamentals

**Voice — first person, plain, evidence-led.** Ana speaks as "I" ("I redesigned…", "I ran two rounds of moderated usability testing"). Confident but never boastful; impact is stated as a number, not an adjective.

**Casing.** Sentence case for headlines and body. ALL-CAPS only for the small mono eyebrows/labels (tracked out). Titles of projects use Title Case.

**Tone.** Calm, specific, outcome-focused. Sentences lead with the problem, then the move, then the result. Numbers do the bragging ("<5% to 80%+ — a 16× lift").

**Punctuation.** Em-dashes for asides, middots (·) as separators in meta lines ("Fintech · GCash"). A friendly emoticon appears in contact links only ("email me :-)", "connect with me :-D") — the single permitted bit of whimsy. No emoji anywhere else.

**Eyebrows** name the phase of the story: `Diagnosis`, `Response`, `Solution`, `Results`, `Research`. They orient the reader inside a case study.

---

## Visual foundations

**Color.** Warm paper base — `--ab-cream #FFFEFA` page, `--ab-ink #371B05` near-black brown for headlines, `--ab-body #5A4632` clay-brown for prose. Two chromatic voices: cool periwinkle (`--ab-accent #6E82DB`, hairline `--ab-sky #D2DDFB`) and antique gold (`--ab-olive #9E8D35`). Cards sit on the palest tints of each — `--ab-sky-tint #EEF2FE` (cool) and `--ab-olive-tint #F7F2E2` (warm), alternated to give sections rhythm. A single clay-coral `--ab-cursor #FB885B` exists only as the blurred cursor glow (multiply blend) — never as fill or text.

**Type.** Strict roles. **Palmios** (local `Palmios.woff2`, via `--font-head`) for all display headers — `base.css` applies it to every `h1`–`h3` (lowercased, relaxed tracking), falling back to **Fraunces** (variable serif, `opsz` 96–144, `SOFT` 50–90) if it fails to load. Non-heading display text (stat numerals, eyebrows, taglines) stays in DM Mono. **DM Sans** for body copy at 17–18px / 1.75. **DM Mono** for every label, eyebrow, tagline, caption and stat-caption — usually 13px, tracked `.2em`, uppercase for eyebrows. (Headings carry inline `font-family:'DM Mono'` + Fraunces variation settings in the markup; the `base.css` `!important` override is what makes them render in Palmios.)

**Layout.** Centered `max-width:1180px` column with fluid `clamp()` gutters. Generous vertical rhythm (`clamp(56px,7vw,104px)` between blocks). Editorial asymmetry: 1.15fr / .85fr hero, alternating image/text 1fr/1fr rows, 3-up card grids.

**Backgrounds.** Flat cream — no gradients, no textures, no patterns. The only "imagery" placeholders are diagonally-striped slots with a mono caption telling you what to drop in. The footer is a full-bleed ink panel.

**Motion.** All behavior lives in one file — `motion.js` (`window.ABMotion.initMotion`). One easing curve, `cubic-bezier(.16,1,.3,1)`, everywhere. On scroll, elements fade up 46px with a slight scale-in (`[data-reveal]`, auto-staggered among siblings); headlines wipe up from a clip mask line-by-line (`[data-mask] > [data-line]`). On hover (fine pointers only): cards tilt in 3D toward the cursor (12°) and lift their shadow, links and titles are magnetic, a coral glow trails the cursor and swells over interactive targets. The footer wordmark marquees, speeding up with scroll velocity. All of it respects `prefers-reduced-motion` and fails open (everything reveals if the observer never fires).

**Hover states.** Index rows fill a full-width tint bar (no rounded corners) and shift title + number to accent. Links draw an underline in from the left. Cards lift via tilt, not shadow change.

**Borders, radii, shadow.** Hairlines are `1.5px solid var(--line)` (periwinkle). Cards and media round to 22px; small thumbnails 14px. Shadows are warm, long and faint — `0 30px 60px -34px rgba(55,27,5,.30)` — used on media only, never on cards.

**Motif.** A soft, blurred periwinkle dot sits beside headlines and after project titles — the recurring brand mark.

---

## Iconography

Effectively icon-free. There are **no icon fonts, no SVG icon sets**. "Icons" are: the blurred periwinkle/coral **dot** (a CSS circle with `filter:blur`), middot separators (·) in mono meta lines, and ASCII emoticons in contact links. Imagery is user-supplied via drag-and-drop `image-slot` placeholders (see `image-slot.js`). Do not introduce an icon library; if a glyph is unavoidable, prefer a tracked mono character over an SVG.

---

## Index / manifest

- `styles.css` — global entry point (link this).
- `tokens/colors.css` · `tokens/typography.css` · `tokens/motion.css` · `tokens/compat.css` — foundations.
- `base.css` — shared resets, motion classes, link treatment, scrapbook motifs.

**To iterate:** tune a token in `tokens/*.css` and it propagates to every page.
