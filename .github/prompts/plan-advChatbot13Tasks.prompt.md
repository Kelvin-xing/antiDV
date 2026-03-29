# Plan: 13-Task ADVchatbot Improvements

## Phase A — Quick fixes (independent, no cross-deps)

### Task 9 — Hero image opacity
- `app/page.tsx` hero bg div: `opacity: 0.10` → `opacity: 0.22`

### Task 4 — Quick exit covers resource panel on mobile
- `app/components/quick-exit/index.tsx`: add className `quick-exit-btn`
- Use `<style>` tag inside component: `@media (max-width: 640px) { .quick-exit-btn { right: auto !important; left: 12px !important; } }`
- This moves the button to the left side on mobile so it doesn't overlap the panel (which slides from right)

### Task 5 — Mobile portrait UserHashPanel overflow
- `app/components/user-hash/index.tsx`: add `overflowY: 'auto', maxHeight: 'calc(100dvh - 48px)'` to the modal inner div
- Reduce padding on small heights with a `@media (max-height: 600px)` style rule

### Task 7 — Improved on-exit data clearing
- `app/components/quick-exit/index.tsx`: add `localStorage.removeItem('xiaoAn_user_hash')`? NO — keep hash (user's identity code)
- Improve: scan and remove all localStorage keys EXCEPT `xiaoAn_user_hash`
- Also add `localStorage.clear()` approach but preserve hash: save hash, clear all, restore hash

### Task 6 — Back button blocks after quick exit
- `app/components/quick-exit/index.tsx`: before `location.replace`, call `history.pushState` 5× current URL to pad the history stack
- Create `app/components/back-exit-guard/index.tsx` — 'use client' component that on mount:
  1. `history.pushState(null, '', location.href)`
  2. listens `popstate` → calls `quickEscape`
  3. removes listener on unmount
- Add `<BackExitGuard>` to `app/chat/page.tsx` (chat only, not whole site)

### Task 12 — Double-tap to send on mobile
- `app/components/chat/index.tsx`: add `onTouchEnd={(e) => { e.preventDefault(); handleSend() }}` to the send button div
- This fires `handleSend` immediately on touch without waiting for tooltip

### Task 13 — AI avatar + remove user avatar
- Create `app/components/chat/icons/sister.svg` — SVG: circle background, short-hair silhouette, gentle smile, warm coral-teal palette
- `app/components/chat/style.module.css`: update `.answerIcon { background: url(./icons/sister.svg) }` + adjust background-size/position
- `app/components/chat/question/index.tsx`: remove the right-side avatar div (both branches) — just keep the message bubble

---

## Phase B — Resource panel overhaul (Tasks 1, 2, 3)

### Task 1 — Cumulative history + specific items from data.ts
Files: `app/components/resource-panel/index.tsx`, `app/components/index.tsx`

**Data changes** (`resource-panel/index.tsx`):
- Import `psychResources` from `@/app/psych-resources/data` to get specific items
- Build `SPECIFIC_RESOURCES` array (~14 items) derived from data.ts categories:
  - Each item: `{ id, title, desc, href, keywords[] }`
  - Hrefs use category anchors: `/psych-resources#trauma-recovery`, `/psych-resources#legal-knowledge`, etc.
  - Plus 3 non-psych-resources items: stories `/stories`, docs `/docs-toolkit`, resources `/resources`
- `matchResources(accumulatedText)` → returns only IDs that scored > 0
- Empty state when no matches: "开始倾诉，我会根据对话为你推荐相关资源" with subtle icon

**Prop changes**:
- Remove `chatMessage`, add `accumulatedAIText: string` (all AI messages concatenated)
- Only render resources that are in the matched set (no unmatched resources shown at all)

**index.tsx changes**:
- Replace `latestAIMessage` useMemo with `accumulatedAIText`:
  ```ts
  const accumulatedAIText = useMemo(() =>
    chatList
      .filter(i => i.isAnswer && !i.isOpeningStatement)
      .map(i => i.content)
      .join(' '),
    [chatList])
  ```
- Pass `accumulatedAIText` to ResourcePanel

### Task 3 — Collapse button
Files: `app/components/resource-panel/index.tsx`, `app/components/index.tsx`

**index.tsx**: add `isPanelCollapsed` state (`useBoolean(false)`)
Pass to ResourcePanel: `isCollapsed={isPanelCollapsed}`, `onToggleCollapse={togglePanelCollapse}`

**resource-panel/index.tsx**:
- Add `isCollapsed?: boolean`, `onToggleCollapse?: () => void` props
- Collapsed desktop mode: 48px wide, shows only icons (no text), chevron button on left edge `◀`/`▶`
- A `>` or `<` toggle tab on the left edge always visible
- Full mode: normal 300px panel

### Task 2 — Chat input repositioning
Files: `app/components/chat/index.tsx`, `app/components/index.tsx`

**index.tsx**: compute and pass `inputMarginLeft` to `<Chat>`:
```ts
const inputMarginLeft = useMemo(() => {
  if (isMobile) return 0
  if (!isDesktop) return 96    // tablet: sidebar 192px ÷ 2
  if (!hasSetInputs) return 122 // desktop no panel yet: sidebar 244px ÷ 2
  return (244 - (isPanelCollapsed ? 48 : 300)) / 2  // desktop with panel: sidebar vs panel offset
}, [isMobile, isDesktop, hasSetInputs, isPanelCollapsed])
```

**chat/index.tsx**:
- Add prop `inputMarginLeft?: number`
- On the fixed input div, remove tailwind margin classes `pc:ml-[122px] tablet:ml-[96px] mobile:ml-0`
- Add inline style: `marginLeft: inputMarginLeft !== undefined ? inputMarginLeft : 0`

---

## Phase C — Chat UX (Task 8)

### Task 8 — Incognito mode suggestion
- Create `app/components/incognito-notice.tsx` — 'use client' component
  - Checks `sessionStorage.getItem('incognito_notice_dismissed')`
  - If not dismissed: show top banner in chat area
  - Content: "💡 为了更好保护隐私，建议在无痕浏览模式下使用" + 复制链接 + 关闭按钮
  - Dismiss: sets `sessionStorage.setItem('incognito_notice_dismissed', '1')`, hides banner
- Add to `app/components/index.tsx` above ConfigSence

---

## Phase D — Homepage redesign (Tasks 10, 11)

### Task 10 — Scroll animations
- Create `app/components/scroll-reveal.tsx` — 'use client' wrapper
  - Uses `IntersectionObserver` with `threshold: 0.15`
  - On intersect: adds CSS class `sr-visible` which triggers `opacity: 1, translateY(0)` transition
  - Default: `opacity: 0, translateY(18px)`, `transition: opacity 500ms ease, transform 500ms ease`
  - Supports `delay` prop (e.g., `delay={200}`)
- `app/page.tsx`: wrap feature cards, FAQ items, sections in `<ScrollReveal>`
- Add CSS in reducedMotionStyle block

### Task 11 — Hero animated dialog demo
`app/page.tsx` hero section major restructure:
- New layout: `maxWidth: 720, margin: '0 auto'` single column, text on top, demo below
- **Demo dialog** component (inline, no deps):
  - 3 animated bubbles (CSS keyframe `fadeSlideIn`): user bubble → AI bubble → user bubble
  - `animation-delay`: 0.4s / 1.2s / 2.2s
  - User bubbles: right-aligned, `backgroundColor: rgba(232,168,124,0.15), border: 1px solid #E8A87C`
  - AI bubble: left-aligned, `backgroundColor: #F5EDE6`
  - Sample text:
    - User1: "我不知道该怎么办，他总说都是我的错..."
    - AI: "我听到你了。感到困惑和害怕是真实的。"
    - User2: "但我不知道能不能相信自己的判断..."
  - Below bubbles: mock input row
    - Left: placeholder text input (visual only, not interactive)
    - Right: `<Link href="/chat">开始倾诉 →</Link>` styled as a coral send button
- Remove the standalone "开始倾诉" link button from above (it becomes the send button in the demo)

---

## Files to Modify

- `app/page.tsx` — tasks 9, 10, 11
- `app/components/quick-exit/index.tsx` — tasks 4, 6, 7
- `app/components/resource-panel/index.tsx` — tasks 1, 3
- `app/components/index.tsx` — tasks 1, 2, 3, 8
- `app/components/chat/index.tsx` — task 2, 12
- `app/components/chat/style.module.css` — task 13
- `app/components/chat/question/index.tsx` — task 13
- `app/components/user-hash/index.tsx` — task 5

## Files to Create

- `app/components/chat/icons/sister.svg` — task 13 avatar
- `app/components/back-exit-guard/index.tsx` — task 6
- `app/components/incognito-notice.tsx` — task 8
- `app/components/scroll-reveal.tsx` — task 10

## Implementation Order (with dependencies)

1. Phase A tasks (all independent): 4, 5, 6, 7, 12, 13 — can be done in any order
2. Task 9 — trivial opacity change
3. Task 8 — incognito notice (after Task A done on index.tsx is stable)
4. Tasks 1+3 together (resource panel + collapse, both touch resource-panel and index.tsx)
5. Task 2 — depends on Task 3 state (isPanelCollapsed)
6. Task 10 + 11 — both touch page.tsx, do together

## Verification

1. `pnpm build` — no TypeScript errors
2. Mobile (640px): quick exit on left side, send button 1-tap, no avatar on question bubbles, UserHashPanel scrollable
3. Desktop: ResourcePanel collapses to 48px, chat input re-centers, panel starts empty and fills as chat progresses
4. Back button on chat page → immediately redirects to weather site
5. Hero: dialog bubbles animate in sequence, "开始倾诉" on the mock send button
6. Page scroll: sections fade in gently

## Scope exclusions

- No changes to Dify API integration
- `xiaoAn_user_hash` preserved on escape (user's identity must survive quick exit)
- Scroll animations use CSS transitions only (no Motion library)
