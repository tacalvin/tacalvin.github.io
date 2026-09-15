# Portfolio Redesign Implementation Brief

## 1. Purpose

Create an alternative design branch for the existing personal CV / research portfolio site.

The new branch should **preserve the current academic-content workflow and information architecture**—especially publications, CV data, and optional news/updates—while replacing the current visual presentation with a **research-editorial front end inspired by Physical Intelligence (Pi) and Letta**.

The goal is not to clone either site. The goal is to borrow the qualities that make them effective:

- restrained, editorial presentation
- strong typography
- research-first information hierarchy
- minimal visual chrome
- technical/system-like details used sparingly
- modern polish without generic SaaS styling
- distinctive identity without compromising readability

The site should feel like a **carefully designed personal research archive**, not a startup landing page, a fake operating system, or a conventional academic template.

---

## 2. Core Design Goals

### 2.1 Research is the primary content

The site should prioritize:

1. selected publications / selected work
2. research interests or themes
3. CV / experience
4. recent public updates, if available
5. external profile links such as Scholar, GitHub, LinkedIn, etc.

The homepage should immediately communicate:

- who the researcher is
- what areas they work in
- what representative work they have published
- how to access a complete CV / publication list

### 2.2 Preserve the strengths of an al-folio-style site

Retain the useful academic-site behaviors already present in the repo wherever possible, including:

- structured publication data
- BibTeX or equivalent publication management
- CV data
- venue / year metadata
- author lists
- optional project/paper/video/code links
- news or update entries
- responsive layouts
- accessible semantic HTML
- any existing build/deployment pipeline that is already reliable

Do **not** rewrite content plumbing unless necessary for the new presentation.

### 2.3 Build a distinct front end rather than lightly reskinning the current theme

The result should not look like stock al-folio with different colors.

The design system, spacing, typography, navigation, publication presentation, and page rhythm should be deliberately rebuilt around the new visual direction.

---

## 3. Important Content Constraints

These constraints should affect the component design.

### 3.1 Not every publication has public code

Publication components must support arbitrary combinations of public links, for example:

- Paper
- Project page
- Video
- Supplement
- Dataset
- Code
- Slides
- DOI
- arXiv

No link type is required.

Do not render:

- disabled GitHub icons
- empty placeholders
- “Code coming soon” unless explicitly provided in the data
- visual gaps where absent assets would normally appear

A publication with only a paper link should look fully intentional.

### 3.2 Private/internal projects should not be exposed

Do not introduce a general-purpose public **Projects** section unless the repository already contains specifically public project content that the owner wants retained.

Current or private work should instead be communicated at the higher level through **Research Interests / Research Themes**.

Examples:

- Generative Video
- Visual Effects
- Human Motion
- Computer Vision
- Generative Modeling
- Interactive / Agentic Editing

These are thematic descriptions, not project disclosures.

### 3.3 Publications and projects should not be conflated

Use terminology such as:

- Selected Work
- Selected Publications
- Research
- Publications

Avoid framing every paper as a “project.”

---

## 4. Design Character

### 4.1 Reference direction

Primary references:

- **Physical Intelligence (Pi):**
  - editorial restraint
  - sparse but confident typography
  - research-index structure
  - minimal chrome
  - content-first composition

- **Letta:**
  - stronger visual identity
  - modern technical presentation
  - selective playfulness
  - deliberate type and interaction details

Secondary inspiration may come from technical/editorial systems such as Oxide or Odyssey, but these influences should remain subtle.

### 4.2 Target balance

Approximate design balance:

- **80% editorial**
- **15% technical/system interface**
- **5% retro reference**

The site should not rely on nostalgia as the concept.

### 4.3 Avoid

Do not use the following as dominant motifs:

- fake Windows / macOS windows
- terminal emulation
- CRT scanlines
- pixel-art interfaces
- large rounded SaaS cards
- glassmorphism
- gradient-heavy startup styling
- excessive parallax
- gratuitous WebGL
- decorative animations that compete with research content
- generic portfolio hero copy such as “Hi, I’m X, an AI researcher building the future”

---

## 5. Information Architecture

Recommended top-level navigation:

```text
NAME / WORDMARK

WORK or RESEARCH
PUBLICATIONS
CV
ABOUT        (optional if useful)

SCHOLAR
GITHUB
EMAIL
```

A more compact version is also acceptable:

```text
NAME                  WORK   CV   SCHOLAR   GITHUB   EMAIL
```

Do not create more top-level sections than the content supports.

---

## 6. Homepage

The homepage should behave like a curated research index, not a marketing landing page.

### 6.1 Header

Include:

- name
- compact primary navigation
- selected external links

The header may be sticky if it remains visually quiet.

### 6.2 Intro

Use a compact introductory block:

```text
Name

Computer Vision · Generative Models · Graphics

1–3 sentence research statement.
```

Avoid oversized hero typography that forces the research below the fold.

The first selected work should be visible quickly on a normal laptop display.

### 6.3 Selected Work

This should be the primary homepage section.

Suggested structure:

```text
01 / SELECTED WORK
────────────────────────────────────────

2026

[media]   Publication Title
          Authors
          Venue / Year

          One- or two-sentence plain-language description.

          PAPER ↗   VIDEO ↗
```

Each entry should support:

- optional image or video thumbnail
- title
- authors
- venue
- year
- short description
- variable link set

Do not require every publication to have media.

### 6.4 Research Interests

Optional but recommended.

Purpose: communicate present research direction without exposing internal or unpublished projects.

Example:

```text
02 / RESEARCH INTERESTS

GENERATIVE VIDEO
Short description.

VISUAL EFFECTS
Short description.

HUMAN MOTION
Short description.
```

Keep this concise.

### 6.5 Recent / News

Optional.

If existing repo data includes news, retain it in a compact chronological form:

```text
03 / RECENT

SEP 2026   Paper accepted at ...
JUL 2026   Talk at ...
MAY 2026   ...
```

Do not make the homepage feel like a blog unless the site actually contains substantial writing.

---

## 7. Publications Page

Retain the existing publication data pipeline where possible.

The redesign should focus on presentation.

### 7.1 Layout

Favor:

- flat rows
- chronological grouping
- strong title typography
- compact metadata
- narrow venue/year column where appropriate
- consistent visual rhythm

Avoid:

- large cards
- heavy shadows
- oversized thumbnails
- multi-column card grids for scholarly work

### 7.2 Publication entry

Required fields:

- title
- authors
- venue
- year

Optional fields:

- thumbnail
- short description
- paper URL
- arXiv
- DOI
- project page
- code
- video
- supplement
- slides
- dataset
- award / oral / spotlight metadata

Render only fields that exist.

### 7.3 Full vs selected publications

If the site contains many publications:

- homepage = selected work
- publications page = complete public publication record

Selected status should preferably be driven by data rather than hard-coded markup.

### 7.4 Filtering

Only retain filters if they are already useful.

Possible filters:

- year
- research area
- publication type

Do not add elaborate filtering solely as a visual feature.

---

## 8. CV Page

The CV should remain more conventional and information-dense than the homepage.

Recommended section treatment:

```text
01 / EXPERIENCE
02 / EDUCATION
03 / PUBLICATIONS
04 / SERVICE
05 / AWARDS
```

Retain structured CV data if already present.

Prioritize:

- scanability
- printability
- clear date alignment
- simple typography
- strong section hierarchy

If the repo supports downloadable PDF CVs, keep that behavior.

---

## 9. Publication Media

Because the research is visual, media can carry much of the site's identity.

### 9.1 Preferred media treatment

For selected publications, use carefully curated assets such as:

- representative result images
- short muted looping clips
- compositing or editing results
- pose samples
- reconstruction outputs
- optical flow
- model visualizations
- figure crops

### 9.2 Normalize presentation

Where practical, normalize selected-work media to a consistent aspect ratio such as:

- 16:9
- 3:2
- or another ratio already suitable for the existing assets

Use `object-fit` / crop behavior intentionally.

### 9.3 Do not force media

A publication without a suitable public visual should still render cleanly as text.

---

## 10. Visual System

### 10.1 Color

Prefer a restrained palette.

Either:

- warm off-white background + near-black text

or:

- near-black background + warm light text

Accent colors should be sparse and functional.

Avoid large multicolor gradients.

### 10.2 Typography

Use typography as the primary identity system.

Suggested roles:

- **Display / publication title:** expressive serif or characterful grotesk
- **Body:** highly readable serif or sans
- **Metadata:** compact monospace or technical sans

Do not use monospace for all content.

Use mono primarily for:

- dates
- venue tags
- section numbers
- metadata
- small navigation details
- labels

### 10.3 Section language

Use restrained technical/editorial labels such as:

```text
01 / SELECTED WORK
02 / INTERESTS
03 / RECENT

PAPER / 2026
FIG. 01
CVPR 2026
```

These should feel like indexing devices, not decorative gimmicks.

### 10.4 Borders and shapes

Favor:

- 1px rules
- rectangular media frames
- minimal or zero border radius
- simple separators

Avoid floating rounded cards.

### 10.5 Spacing

Use generous macro-spacing but relatively dense information inside individual entries.

The site should feel calm, not empty.

---

## 11. Interaction Design

Interaction should be understated.

Recommended:

- subtle link underline or arrow movement
- modest thumbnail scale/crop changes
- small opacity or border transitions
- animated video playback on hover where appropriate
- sticky navigation only if unobtrusive

Motion should generally be in the 100–300 ms range.

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

No interaction should be necessary to reveal essential information.

---

## 12. Responsive Behavior

Desktop composition may use asymmetric or multi-column layouts.

Mobile should collapse cleanly to a single reading column.

On narrow screens:

- metadata may move above titles
- thumbnails should become full width
- nav can collapse, but avoid complex hamburger interactions if all links fit
- maintain comfortable text measure
- ensure links remain easy to tap

Do not preserve desktop visual quirks at the cost of usability.

---

## 13. Accessibility

Maintain or improve the accessibility of the current repo.

Minimum requirements:

- semantic headings
- proper landmark elements
- keyboard-accessible navigation
- visible focus states
- sufficient contrast
- descriptive alt text for meaningful research figures
- empty alt text for purely decorative imagery
- reduced-motion support
- no hover-only content
- links distinguishable without relying solely on color

Aim for WCAG AA contrast.

---

## 14. Implementation Strategy

### 14.1 Branching

Create a dedicated alternative branch, for example:

```text
design/pi-letta
```

Do not replace the current production design during initial implementation.

### 14.2 First inspect the repository

Before modifying code:

1. identify framework / generator
2. locate publication data source
3. locate CV data source
4. identify existing reusable components
5. identify global styles/theme variables
6. inspect asset pipeline
7. inspect current responsive behavior
8. identify deployment assumptions

Document any major architectural constraints before large refactors.

### 14.3 Preserve data; replace presentation

Prefer:

```text
existing content/data
        ↓
existing parsing/build logic
        ↓
NEW presentation components
        ↓
NEW design system
```

over rewriting the entire data layer.

### 14.4 Component targets

Likely components to create or substantially rewrite:

```text
SiteHeader
SiteFooter
SectionHeader
PublicationEntry
PublicationMedia
PublicationLinks
SelectedWorkList
ResearchInterest
NewsEntry
CVSection
MetadataLabel
ExternalLink
```

Names should follow the conventions of the existing codebase.

### 14.5 Design tokens

Centralize:

- colors
- typography
- font sizes
- line heights
- spacing
- page widths
- rules/borders
- transitions

Avoid distributing arbitrary values through individual components.

---

## 15. Migration Priorities

### Phase 1 — Structural prototype

Implement:

- header
- homepage intro
- selected publications
- publications page
- CV page

Use existing data.

Focus on layout before decorative details.

### Phase 2 — Design system

Finalize:

- fonts
- colors
- type scale
- spacing system
- border/rule conventions
- link states
- responsive breakpoints

### Phase 3 — Media treatment

Add:

- normalized publication visuals
- optional looping media
- responsive loading behavior
- poster/fallback images

Do not block the core redesign on perfect media assets.

### Phase 4 — Polish

Add restrained:

- hover states
- transitions
- metadata labels
- section numbering
- small identity details

### Phase 5 — QA

Check:

- mobile
- tablet
- desktop
- keyboard navigation
- reduced motion
- missing optional publication fields
- publications with very long titles
- long author lists
- entries with no thumbnail
- entries with one link only
- entries with many links

---

## 16. Acceptance Criteria

The branch is successful when all of the following are true.

### Content

- Existing public publication data remains intact.
- Not every publication is forced to expose code.
- Publications with different link combinations render naturally.
- No private or internal projects are introduced.
- Research themes can communicate current interests without exposing project details.
- CV content remains accessible.

### Visual design

- The site no longer resembles stock al-folio or a generic academic template.
- The aesthetic clearly reads as editorial / research-oriented.
- Pi/Letta influence is visible through typography, hierarchy, restraint, and indexing—not through imitation.
- Rounded SaaS-card styling is absent or extremely limited.
- Retro/system cues remain subtle.
- Publication content is visually dominant.

### UX

- A first-time visitor can understand the research focus quickly.
- Selected work is visible without excessive scrolling.
- The full publication record is easy to find.
- The CV is easy to scan.
- Mobile is first-class rather than an afterthought.
- Missing optional links/assets never make an entry look incomplete.

### Engineering

- Existing content/data pipelines are reused where sensible.
- The implementation is isolated to an alternative branch.
- Styling is tokenized rather than scattered.
- New components are reusable.
- Existing deployment remains functional.
- There are no accessibility regressions.

---

## 17. Guiding Principle

When making design decisions, prefer:

> **“A beautifully designed personal research archive.”**

over:

> “A flashy portfolio.”

And prefer:

> **“The research itself provides the visual interest.”**

over:

> “The interface provides the spectacle.”

If a design flourish competes with publication content, remove or reduce it.
