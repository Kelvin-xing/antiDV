## Plan: Redesign All 4 Pages — Warm Minimalist

**Aesthetic**: 溫柔極簡風 — generous whitespace, hairline dividers (1px), refined Noto Serif SC headings, inline SVG line icons replacing all emoji, soft coral/teal accents used sparingly, no heavy gradients/shadows.

**Design System**
- Background: #FBF8F4 (cream)
- Dark text: #3D3028
- Accent coral: #E8A87C (lines, CTAs, phone numbers)
- Teal: #7CB9A8 (secondary accents)
- Border/divider: #E6DDD5 (1px)
- Muted text: #8F7E6E
- Headers: Noto Serif SC 700, letter-spacing: 0.02em
- Body: Noto Sans SC 300/400
- No box-shadow, no gradients (flat)
- Inline SVG icons: 20x20 stroke-based, strokeWidth 1.5

---

## Pages to Redesign

### 1. app/page.tsx (Homepage)
**Hero**
- Light background (#FBF8F4), left-aligned layout (not centered)
- Small tag: "反家庭暴力 AI 助手" — inline pill with thin coral border, dot indicator
- Large "小安" in Noto Serif SC clamp(3rem,8vw,5rem), weight 700
- Tagline with left 3px coral border-left accent bar
- Primary CTA: flat coral rectangle (no border-radius pill), "开始倾诉"
- Secondary links: ghost style, underline only

**Features Section** (title: "小安能为你做什么")
- Replace emoji with inline SVG line icons (20px, stroke #E8A87C)
- Editorial numbered list: large light serif numbers (01–06) in very light #EDE5DC
- Each item: bold title + body text, separated by 1px bottom rule
- 2-column grid on desktop, 1-column mobile
- Linked features: "了解更多 →" in coral

**Safety Statement**
- Full-width section, background #F5E6D3
- Centered, no icon — pull-quote style: large thin serif text
- Small caption: privacy details

**FAQ**
- Minimal details/summary, bottom-border only (no box/card)
- ▸ indicator in coral, rotates on open (CSS)

**Contact Section**
- Left-right split: text description left, ContactForm right
- Clean horizontal rule above section

**Footer**
- Dark footer: #3D3028 background, light text
- Hotlines in coral/teal as before

---

### 2. app/resources/page.tsx (资源导航)
**Header**: Thin nav with back link + page title left  
**Emergency**: Slim coral strip (36px height), 3 hotline numbers inline  
**Category Nav**: Horizontal text links separated by "|" dots, no pill boxes  
**Section Headings**: Left-bordered thin coral 3px + heading text  
**Resource Cards**: No box card — left 2px coral border, padding-left 16px, minimal meta tags below name as small pills. SVG icons: phone (☎), mail (✉), clock (⏱), pin (📍) → replaced with 16px SVG stroke icons

---

### 3. app/stories/page.tsx (受害者故事)
**Header**: 
- Full-width dark (#3D3028) masthead
- Title + italic subtitle in cream text
- Thin coral divider line

**Cards**:
- Replace emoji avatars with geometric initials circles (just the first char of name in a 48px circle, bg #F5E6D3, text #3D3028)
- Left-aligned content (not centered)
- Title + summary + "阅读故事 →" link
- No box shadow, thin bottom border only
- 2-column grid → clean editorial

---

### 4. app/docs-toolkit/page.tsx (文档工具库)
**Header**: Same dark masthead style as Stories for consistency  
**Template Cards**:
- Document icon (SVG: rectangle with folded corner, stroke #8F7E6E)
- Left-aligned: name in serif, description in sans
- Horizontal rule divider between cards (no box border)
- "开始填写 →" in small coral text, right-aligned

---

## Implementation Steps
1. Redesign `app/page.tsx` (most complex, ~400 lines) — *no dependencies*
2. Redesign `app/resources/page.tsx` — *parallel with step 3*
3. Redesign `app/stories/page.tsx` — *parallel with step 2*
4. Redesign `app/docs-toolkit/page.tsx` — *parallel with steps 2/3*
5. `git add -A && git commit -m "design: warm minimalist redesign all 4 pages" && git push`

## Files to Modify
- `app/page.tsx`
- `app/resources/page.tsx`
- `app/stories/page.tsx`
- `app/docs-toolkit/page.tsx`

## Relevant References
- Colors/fonts already defined in `app/styles/globals.css` CSS variables
- `ContactForm` imported in `app/page.tsx` — keep unchanged
- `categories` from `./data` in resources page — keep import unchanged
- `stories` from `./data` in stories — keep import unchanged
- `templates` from `./templates` in docs — keep import unchanged

## Verification
1. `pnpm build` — no TypeScript errors
2. Visual check: homepage hero left-aligned, SVG icons visible
3. Mobile check: single column layout at 375px
4. git push → Vercel deploy check

## Decisions
- NO emojis anywhere — replaced with inline SVG
- Keep same imports/data shape — pure visual redesign
- No CSS modules/Tailwind — inline styles (consistent with existing pattern)
- `<style>` tag for CSS animations (fade-in on load)
