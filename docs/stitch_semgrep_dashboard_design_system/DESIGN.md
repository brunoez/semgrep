---
name: Sentinel Executive
colors:
  surface: '#0c1324'
  surface-dim: '#0c1324'
  surface-bright: '#33394c'
  surface-container-lowest: '#070d1f'
  surface-container-low: '#151b2d'
  surface-container: '#191f31'
  surface-container-high: '#23293c'
  surface-container-highest: '#2e3447'
  on-surface: '#dce1fb'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dce1fb'
  inverse-on-surface: '#2a3043'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#bec6e0'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#bcc7de'
  on-tertiary: '#263143'
  tertiary-container: '#8691a7'
  on-tertiary-container: '#1f2a3c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#0c1324'
  on-background: '#dce1fb'
  surface-variant: '#2e3447'
  slate-950: '#020617'
  slate-900: '#0F172A'
  slate-800: '#1E293B'
  slate-300: '#CBD5E1'
  indigo-500: '#6366F1'
  emerald-500: '#10B981'
  amber-500: '#F59E0B'
  rose-500: '#F43F5E'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.05em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  section-header:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  card-title:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.5'
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  section-gap: 5rem
  component-gap: 1rem
  card-padding: 1.5rem
---

## Brand & Style

The design system is engineered for the **Cybersecurity Dark Aesthetic**, specifically tailored for C-Level executives and security engineers. The visual narrative balances technical precision with high-stakes authority.

The style leverages **Minimalism** and **Glassmorphism**. By using deep, nocturnal foundations (Slate/Zinc) and sharp, high-contrast signal colors (Emerald/Amber/Rose), the system directs attention to critical vulnerabilities without overwhelming the user. Subtle frosted-glass overlays and thin, precise borders create a sense of architectural depth, mimicking a high-end security operations center (SOC) dashboard. The emotional response should be one of "Controlled Urgency"—serious, secure, and impeccably organized.

## Colors

The palette is anchored in a multi-layered dark mode. 
- **Primary:** Indigo-500 serves as the brand's technical heartbeat, used for primary actions and decorative accents that denote progress or focus.
- **Surface Strategy:** Backgrounds utilize a "Base-to-Surface" hierarchy. `slate-950` is the absolute floor, while `slate-900` provides the elevation for cards and containers.
- **Signal Colors:** These are strictly reserved for status. **Emerald** indicates safety and compliance; **Amber** signifies medium-risk findings; **Rose** is prioritized for high/critical findings and immediate executive attention.
- **Typography Neutrals:** `slate-300` is the standard for readable body text to reduce eye strain against the dark background, while pure White is reserved for high-level headings.

## Typography

This design system uses a dual-font approach to bridge the gap between executive reporting and technical auditing.

**Inter** is the primary typeface for all UI elements. It is chosen for its exceptional legibility in dark mode and its "corporate-modern" feel. Headlines use tight tracking and heavy weights to command authority.

**JetBrains Mono** is utilized for CLI commands, JSON snippets, and technical data points. Its high-distinction characters ensure that security professionals can read code paths and syntax without ambiguity.

**Hierarchy Note:** 
- **H1 (Headline-xl):** Used for Hero statements.
- **H2 (Section-header):** Always paired with a `border-l-4 border-indigo-500` for visual anchoring.
- **Labels:** Small caps are used for metadata and status pill labels to provide a distinct visual texture compared to body prose.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop to maintain a "dashboard" feel that is predictable for executive review. 

- **Desktop (1280px+):** A 12-column grid with 24px (1.5rem) gutters.
- **Tablet:** 8-column grid with 20px gutters.
- **Mobile:** 4-column grid with 16px margins.

Spacing follows a strict 4px/8px baseline rhythm. Sections are separated by generous 80px (5rem) gaps to prevent visual clutter and allow the "Glassmorphism" effect of cards to breathe. Content reflows vertically on mobile, with specific attention to ensuring horizontal scrolling is never required for code blocks; these should wrap or utilize a dedicated internal scroll container.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Subtle Glows** rather than heavy shadows.

- **Level 0 (Background):** `#020617` (Slate 950).
- **Level 1 (Cards/Sections):** `#0F172A` (Slate 900). Borders are defined by a 1px solid stroke of `#1E293B`.
- **Level 2 (Interaction/Hover):** When a card or element is focused, it gains a subtle outer glow: `0px 0px 15px rgba(99, 102, 241, 0.15)`. 

To achieve the "Glassmorphism" look, use a `backdrop-blur-md` on cards and navigation bars, coupled with a slightly translucent background color (e.g., `rgba(15, 23, 42, 0.8)`). This ensures that background decorative gradients (like the indigo radial blur in the Hero) are softly visible behind the interface layers.

## Shapes

The design system utilizes **Rounded (0.5rem)** corners as the default. This "Semi-Soft" approach takes the edge off the dark aesthetic, making the professional environment feel modern and accessible rather than "hacker-brutalist."

- **Small Components (Buttons, Inputs):** 0.5rem (Rounded).
- **Large Containers (Cards):** 1rem (Rounded-lg).
- **Badges/Pills:** Fully rounded (Pill-shaped) to distinguish them from interactive buttons.

## Components

### Buttons
- **Primary:** Solid `indigo-500` with white text. On hover, increase brightness or add a soft indigo glow.
- **Secondary:** Transparent background with a `slate-800` border. Text in `slate-100`.
- **Action States:** Focus states must use a 2px `indigo-500` ring with a 2px offset in `slate-950`.

### Cards (The "Executive Insight" Card)
Cards are the primary vehicle for information. They must feature a 1px border (`slate-800`) and a subtle background blur. Header sections within cards should be separated by a thin divider.

### Status Chips (Signal Badges)
- **High/Critical:** `rose-500` background (10-20% opacity) with `rose-500` text.
- **Medium:** `amber-500` background (10-20% opacity) with `amber-500` text.
- **Low/Safe:** `emerald-500` background (10-20% opacity) with `emerald-500` text.

### Input Fields & Dropzones
The JSON dropzone should feature a dashed border in `slate-700`. Upon dragging a file over, the border should transition to `indigo-500` with a pulse animation.

### Code Snippets
Code blocks use a darker background than the standard card (`slate-950`) to create an "inset" feel. Line numbers should be rendered in `slate-600`.