## Plan: Redesign All 4 Pages — Trauma-Informed Warm Minimalist

**Context**: This is a domestic violence support AI chatbot (小安). Users may be in crisis, high-stress, or hypervigilant states. Design must prioritize **psychological safety, reduced cognitive load, and trust** — not aesthetic novelty.

**Source**: ui-ux-pro-max database matches: Mental Health App (Rows 15, 24), Non-profit/Charity (Row 69), Accessible & Ethical (Row 8). Anti-patterns flagged: bright neon, motion overload, AI purple/pink gradients.

---

## Trauma-Informed Design Principles

These govern ALL four pages:

1. **No sudden movement** — hypervigilant users startle easily. Max 1 gentle animation per view (200ms ease-out), ALL wrapped in `@media (prefers-reduced-motion: reduce) { * { animation: none; transition: none; } }`
2. **Cognitive ease first** — stress reduces cognitive capacity. Single-column mobile layout, short text, large touch targets (44×44px min)
3. **Non-medical warmth** — warm cream + soft coral, not clinical blue/white authority aesthetics
4. **Privacy signals everywhere** — quick exit prominence is a trust signal; privacy reminders near any personal-data fields
5. **No shame in language** — headings use "你不是一个人" framing, not "are you a victim?" crisis framing
6. **Calm, not urgent** — emergency hotlines are present but visually contained; alarm visuals only for the dedicated emergency strip
7. **Consistent layout across pages** — trauma affects executive function; dark masthead on all subpages signals "you are in a safe sub-section"

---

## Design System (Refined)

| Token | Value | Contrast |
|---|---|---|
| `--bg` | `#FBF8F4` | — |
| `--text` | `#3D3028` | 7:1 WCAG AAA ✓ |
| `--text-body` | `#5C4D3E` | 5.2:1 WCAG AA ✓ |
| `--text-muted` | `#7A6B5D` | 4.6:1 WCAG AA ✓ (upgraded from #8F7E6E which fails) |
| `--coral` | `#E8A87C` | CTA, border accents, phone numbers |
| `--teal` | `#7CB9A8` | Secondary, hotline 12338 |
| `--border` | `#E6DDD5` | 1px dividers |
| `--warm-sand` | `#F5E6D3` | Safety section bg, avatar backgrounds |
| `--font-serif` | `'Noto Serif SC'` | Headings |
| `--font-sans` | `'Noto Sans SC'` | Body, 16px minimum |
| `--touch-min` | `44px` | All interactive elements |
| `--focus-ring` | `2px solid #E8A87C` | `:focus-visible` |
| `--transition` | `200ms ease-out` | Wrap in prefers-reduced-motion |

**Anti-patterns to eliminate**: emoji, pill-shaped buttons, centered-everything layouts, card boxes with shadows, body text < 16px, muted text #8F7E6E on body content.

---

## Pages to Redesign

### 1. `app/page.tsx` (Homepage)

**Hero** — left-aligned, max-width 640px container centered on page
- Status pill: "反家庭暴力 AI 助手" — thin coral border, 6px dot indicator, 12px label
- "小安" — Noto Serif SC `clamp(3rem, 8vw, 5rem)`, weight 700, color `#3D3028`
- Tagline "你不是一个人，小安在这里陪你。" — 3px coral `border-left` accent bar, padding-left 16px, 18px, color `#5C4D3E`
- Subtext "安全 · 保密 · 随时在线" — 14px, color `#7A6B5D`
- Primary CTA: flat rect `border-radius: 4px` (not pill), height 48px, bg `#E8A87C`, "开始倾诉 →", 16px bold white
- Secondary links: plain underline text row, 14px, "受害者故事" + "文档工具库"
- Hotline reminder: 13px muted, inline `<a href="tel:">` links
- No decorative emoji

**Features Section** — editorial numbered rows (01–06), max-width 900px
- Decorative serif numbers `aria-hidden="true"`, 48px, color `#EDE5DC`
- Inline SVG icon 20×20 strokeWidth 1.5 fill none (aria-label)
- Title 15px bold `#3D3028` + body 16px `#5C4D3E`, lineHeight 1.8
- Separated by `1px solid #E6DDD5` bottom rule — no card boxes
- 2-column grid ≥768px, 1-column mobile
- Linked items: "了解更多 →" 13px coral, right-aligned

**SVG Icon Set** (all inline, stroke-based, no external dependency):
| Feature | Icon description |
|---|---|
| 24小时倾听 | Chat bubble path |
| 隐私保护 | Shield outline |
| 资源导航 | Map pin |
| 非批判陪伴 | Two overlapping circles |
| 受害者故事 | Open book |
| 文档工具库 | Rectangle with folded top-right corner |

**Safety Statement** — full-width, bg `#F5E6D3`
- Noto Serif SC italic pull-quote, 20px, max-width 580px, centered
- Explicit Quick Exit mention: "随时点击右上角「快速离开」一键清除记录" — bold 14px
- No lock emoji

**FAQ** — max-width 680px
- `<details>/<summary>` with bottom-border ONLY (no card box)
- Summary: 16px semi-bold `#3D3028`
- Answer: 16px `#5C4D3E`, lineHeight 1.8
- `▸` indicator coral, CSS `transform: rotate(90deg)` on `details[open] summary ▸`

**Contact Section** — max-width 720px
- `<hr>` 1px `#E6DDD5` above section
- Desktop: 2-column — left: heading + description + 3 contact info items; right: ContactForm
- Privacy note near form: "留言信息不会公开，仅供团队查看" — 12px muted

**Footer** — dark bg `#3D3028`, text `#FBF8F4`
- Three hotlines: 110 coral, 12338 teal, 120 warm orange
- Copyright 12px `#B5A898`

---

### 2. `app/resources/page.tsx` (资源导航)

**Header** — white, 56px height
- "← 返回首页" coral 14px, `aria-label="返回首页"`
- Page title "资源导航" centered absolute, 16px serif

**Emergency Banner** — bg `#E8A87C`, height 48px, white bold text
- "紧急情况请立即拨打：**110** · **12338** · **120**"
- `role="alert"`, `aria-label="紧急救助热线"`
- All numbers `<a href="tel:...">` color white

**Category Nav** — text links with `·` dot separators (no pill boxes)
- 14px `#5C4D3E`, hover: underline

**Section Headings** — `border-left: 3px solid #E8A87C`, padding-left 12px, Noto Serif SC 18px

**Resource Entries** — no box card
- `border-left: 2px solid #E8A87C`, padding-left 16px, margin-bottom 20px
- Name: 16px semi-bold `#3D3028`
- Description: 16px `#5C4D3E`, lineHeight 1.8
- Meta row: 16px SVG inline icons (phone, mail, clock, pin) + label text, all aria-labeled
- Phone: `<a href="tel:...">` coral 16px font-weight 600

**Disclaimer** — 16px `#7A6B5D`, border-top 1px `#E6DDD5`, no box

---

### 3. `app/stories/page.tsx` (受害者故事)

**Masthead** — bg `#3D3028`, padding 48px 24px
- "← 首页" link in `#E8A87C`
- Title: "受害者故事" — Noto Serif SC 32px, `#FBF8F4`
- Italic subtitle: "每一个故事都是真实的力量" — 16px `#B5A898`, font-style italic
- Thin coral accent line: `<div>` 1px `#E8A87C`, width 64px, margin 16px auto
- **Trauma content notice** (non-alarmist): "以下内容涉及家庭暴力经历，如感到不适请随时暂停" — 13px `#D4C4B8`

**Story Cards** — 2-column ≥768px, 1-column mobile
- Initials circle: 48px, bg `#F5E6D3`, text `#3D3028`, Noto Serif SC 20px bold — first char of name (NO emoji)
- Left-aligned: name 15px bold, summary 16px `#5C4D3E` lineHeight 1.7
- Bottom `1px solid #E6DDD5` rule only (no card box/shadow)
- "阅读故事 →" 13px coral
- `<article>` semantic wrapper per card

---

### 4. `app/docs-toolkit/page.tsx` (文档工具库)

**Masthead** — same dark bg `#3D3028` as Stories (consistent cross-page)
- Title: "文档工具库" — Noto Serif SC 32px, `#FBF8F4`
- Subtitle: "填写关键信息，即可生成规范文档" — 16px `#B5A898`
- **Data privacy note** (critical for DV legal docs): "所有信息仅在您的设备上处理，不会上传至服务器" — 13px `#D4C4B8`, prominent placement

**Template Rows** — `<hr>` 1px dividers between items, no box cards
- SVG doc icon: 24×28 folded-corner rectangle, stroke `#8F7E6E`, strokeWidth 1.5, fill none
- Name: Noto Serif SC 18px `#3D3028`
- Description: 16px `#5C4D3E`, lineHeight 1.7
- "开始填写 →" 13px coral, right-aligned
- `<article>` semantic wrapper per template

**Disclaimer** — 16px `#7A6B5D`, border-top 1px `#E6DDD5`

---

## Accessibility Checklist (all pages)

- [ ] All body text ≥ 16px
- [ ] All interactive elements ≥ 44×44px touch target
- [ ] All SVG icons have `aria-label` or parent element label
- [ ] `@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`
- [ ] `<h1>` → `<h2>` → `<h3>` hierarchy — no skipping
- [ ] Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`
- [ ] Emergency banner: `role="alert"` + `aria-label`
- [ ] All phone numbers: `<a href="tel:...">`
- [ ] Focus ring on `:focus-visible`: `outline: 2px solid #E8A87C; outline-offset: 2px`
- [ ] Contrast: `#5C4D3E` on `#FBF8F4` = 5.2:1 ✓ WCAG AA
- [ ] Contrast: `#3D3028` on `#FBF8F4` = 7:1 ✓ WCAG AAA
- [ ] Contrast: `#7A6B5D` on `#FBF8F4` = 4.6:1 ✓ WCAG AA

---

## Implementation Steps

1. Redesign `app/page.tsx` — no dependencies on subpages
2. Redesign `app/resources/page.tsx` — parallel with step 3
3. Redesign `app/stories/page.tsx` — parallel with step 2
4. Redesign `app/docs-toolkit/page.tsx` — parallel with steps 2/3
5. `pnpm build` — verify zero TypeScript errors
6. `git add -A && git commit -m "design: trauma-informed warm minimalist redesign all 4 pages" && git push`

## Files to Modify
- `app/page.tsx`
- `app/resources/page.tsx`
- `app/stories/page.tsx`
- `app/docs-toolkit/page.tsx`

## Relevant References
- Fonts already loaded in `app/styles/globals.css` — keep Noto Serif SC + Noto Sans SC
- `ContactForm` component in `app/page.tsx` — do not modify
- `categories` from `./data` — import unchanged in resources page
- `stories` from `./data` — import unchanged in stories page
- `templates` from `./templates` — import unchanged in docs-toolkit page

## Verification
1. `pnpm build` — zero TypeScript errors
2. Homepage: left-aligned hero, SVG icons visible, zero emoji
3. Mobile 375px: single column, no horizontal scroll, all text ≥ 16px
4. Tab through page: focus ring visible on all interactive elements
5. Chrome DevTools → Rendering → Emulate `prefers-reduced-motion: reduce` → no animations
6. Vercel deploy: all 4 routes return 200

## Key Decisions
- **Body text**: upgraded sitewide 13–14px → **16px minimum**
- **Muted text**: `#8F7E6E` → **`#7A6B5D`** for WCAG AA compliance on body content
- **No emoji**: 100% replaced with inline SVG stroke icons
- **Trauma content warning**: added to Stories masthead (gentle, 13px, non-alarmist)
- **Data privacy note**: added to Docs Toolkit masthead (critical for DV legal document context)
- **Dark masthead**: Stories + Docs Toolkit share `#3D3028` masthead for consistent cross-page navigation signal
- **Inline styles only**: consistent with project pattern, no new CSS modules
- **`<style>` tag in JSX**: only for `prefers-reduced-motion` block and `details[open]` CSS arrow rotation
- **Semantic HTML**: `<article>`, `<main>`, `<nav>` etc. added throughout — currently missing in existing pages
