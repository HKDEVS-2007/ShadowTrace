# ShadowTrace Design System — Existing Prototype Baseline

## 1. Source of truth
The supplied existing `index.html` is the baseline. The actual `static/css/style.css` and `static/css/three_bugs.css` files define exact tokens, dimensions and keyframes. Do not invent replacement values. When CSS files are available in the repository, inspect them and append exact token values here.

## 2. Brand and visual direction
- Product: ShadowTrace.
- Team identity: The Three Bugs.
- Characters: Bit (Lead Analyst), Glitch (Exploit Hunter), Cipher (Threat Intel).
- Mood: premium dark cybersecurity/SOC console; technical, cinematic, readable.
- Typography loaded in HTML: Inter for interface text; JetBrains Mono for technical/data text.
- Icons: Lucide.
- Charts: Chart.js.

## 3. Existing shell
- Full-screen landing intro overlay.
- Muted looping `3Bugs.mp4` background/video branding.
- Circular logo with cyan/violet glow treatment.
- Team badge, title, subtitle, three character cards, Enter Console and Skip Intro.
- App shell with left sidebar and main content region.
- Sidebar: video brand mark, ShadowTrace wordmark, team label, Operations navigation, System/Settings, engine status and version.
- Topbar: breadcrumb, page title, latest analysis label, refresh button, team avatar/logo.
- Main views currently represented: Dashboard, Log Analyzer, Threat Detection, Settings.

## 4. Existing motion/animation inventory
Preserve and integrate with the existing implementation:
- Landing intro video loop and intro/skip/enter transition.
- Sidebar brand video loop.
- Animated cyber canvas (`#cyberCanvas`).
- Background grid, three ambient glow orbs and scanline layer.
- Team title animation class (`team-animation-title`).
- Character-card presentation.
- KPI tilt/glow treatment and critical pulse ring.
- Sidebar active/hover glow (`nav-glow`).
- Processing pipeline status transitions.
- Loader overlay with animated rings.
- Toast stack transitions.
- Custom cyber cursor.
- Replay intro action in Settings.
Implementation appears split between `style.css`, `three_bugs.css`, `app.js`, and `three_bugs.js`. Keep script load order and element IDs stable unless refactoring all dependent code together.

## 5. Existing component patterns
- KPI cards: `.kpi`, `.kpi-inner`, `.kpi-head`, `.kpi-label`, `.kpi-value`, `.kpi-foot`, `.kpi-glow`.
- Content cards: `.card`, `.card-head`, `.card-sub`, `.card-chip`.
- Data tables: `.data-table`, `.table-scroll`, `.compact`.
- Buttons: `.btn.primary`, `.btn.ghost`, `.icon-btn`, `.qa`.
- Filters: `.filters`, `.search`, `.select`.
- Status: `.status-pill`, `.status-dot`, `.badge-nav`.
- Feedback: `.toast-stack`, `.loader-overlay`, `.pipeline`.
Reuse these patterns before creating new variants.

## 6. Color and styling guidance
The HTML explicitly uses cyan and violet glow accents in inline styles, with amber, rose and emerald semantic accents on KPI cards. Exact hex values, backgrounds, borders, shadows, radii, spacing and breakpoints must be taken from the CSS source, not guessed from the HTML.
- Cyan: primary interactive/highlight accent.
- Violet: secondary brand/analytics accent.
- Amber: warning/medium severity accent.
- Rose: critical/high attention accent.
- Emerald: healthy/success accent.
Use semantic color consistently; do not use color alone to communicate severity.

## 7. New module design requirements
- Keep same sidebar, topbar, background and content container.
- New module pages should use existing cards, tables, chips, filters, modal/form styles and toast/loader behavior.
- Use consistent page title, breadcrumb and active nav state.
- Tables need responsive horizontal scrolling or a mobile-friendly alternative.
- Forms need visible labels, validation text and focus styles.
- Include loading, empty, error and success states.
- Avoid unapproved global CSS changes.
- Keep all imported log values as text, not HTML.
- Keep animation performance acceptable; avoid adding heavy continuous effects to every row/card.

## 8. Accessibility and motion
- Respect `prefers-reduced-motion: reduce`.
- Provide visible keyboard focus and keyboard-operable controls.
- Do not rely only on hover or color.
- Ensure adequate contrast and readable font sizes.
- The custom cursor must not replace the system cursor for keyboard/touch users.
- Pause or simplify nonessential animation on reduced-motion devices.

## 9. Required design handoff
Before implementing a new component, member should inspect current CSS and record:
1. Existing class/token reused.
2. Any new class added and why.
3. Desktop and narrow-screen behavior.
4. Motion behavior and reduced-motion fallback.
5. Screenshot after integration.
