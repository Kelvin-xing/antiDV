# Plan: ADVchatbot SEO & Security Fix — v3 Upgrade

## Context
- Repo: /Users/mingjiexing/Desktop/ADVchatbot/frontend
- Live: https://anti-dv.vercel.app/
- Based on: seo_audit_memory/audit_v01052026_v3.md
- Previous plan: .github/prompts/plan-seoSecurityAuditFix.prompt.md (all 8 items deployed ✅)

## What Changed Since v2 Plan
All 8 original fixes are live. A **new HTTP 500** was introduced by the latest deployment (RSC error digest changed: `3116509932` → `3549000446`). This blocks all SEO gains — Next.js injects `<meta name="robots" content="noindex"/>` on every 500 page. Fixing the 500 is the single highest-leverage action.

## Story slugs: xiaomei, ah-fang, lili, wang-jie, xiao-yu
## Template slugs: protection-order, admonishment-letter, police-report-aid
## Base URL: https://anti-dv.vercel.app

---

## Phase 0 — Debug & Fix HTTP 500 (P0, ~1 hr) ← UNBLOCKS EVERYTHING

### Step 0.1: Diagnose via Vercel dashboard + live `curl`
Local builds are skipped — the live site renders pages visually, which means the 500 is a server-side RSC render error, not a full crash. Use Vercel's built-in tooling instead:

**A. Read the exact error in Vercel Functions logs**
1. Vercel Dashboard → Project → **Functions** tab
2. Filter by status `5xx` → open the most recent failing invocation
3. The log will contain the full stack trace for digest `3549000446` — this is the authoritative source

**B. Confirm HTTP status vs. visual render mismatch**
```bash
# From any terminal (or use https://reqbin.com / curl.trillworks.com in-browser)
curl -s -I https://anti-dv.vercel.app/
curl -s https://anti-dv.vercel.app/ | grep -E 'noindex|__next_error__|digest'
```
If pages open visually but return 500, the error is thrown inside a Server Component *after* the shell renders — Next.js App Router streams the shell (headers/layout) before the error surfaces.

**C. Check Vercel Build Logs for the latest deployment**
1. Vercel Dashboard → **Deployments** → latest deployment → **Build Logs**
2. Look for any warning/error after the `app/layout.tsx` or `app/page.tsx` compile step

The new error was introduced by the latest deployment. Primary suspects (in order of likelihood):

1. **`getLocaleOnServer()` in `app/layout.tsx`** — uses `cookies()` + `headers()` from `next/headers`; if `negotiator` or `@formatjs/intl-localematcher` has a runtime issue in the standalone build, the entire tree crashes. Verify these deps are in `package.json` and installed.
2. **`ScrollReveal` / `ContactForm` in `app/page.tsx`** — if either is a Client Component that touches `window` / `document` during SSR without a guard, it crashes page render.
3. **Missing `FEEDBACK_PASSWORD` env var on Vercel** — `middleware.ts` uses `process.env.FEEDBACK_PASSWORD`; confirm it is set in Vercel Project Settings → Environment Variables.
4. **`output: 'standalone'` with `@vercel/analytics` / `@vercel/speed-insights`** — standalone mode can conflict with Vercel's auto-injected scripts; check for import errors in build output.

### Step 0.2: Fix root cause
- **If i18n crash**: add `try/catch` in `getLocaleOnServer()` in `i18n/server.ts` to return `'zh-Hans'` as fallback instead of throwing
- **If client component SSR crash**: add `typeof window === 'undefined'` guard or move side effects to `useEffect` inside the offending component
- **If env var**: add `FEEDBACK_PASSWORD` in Vercel dashboard and redeploy

### Step 0.3: Add `app/error.tsx` root error boundary (stopgap — deploy regardless of root fix)
- File: `app/error.tsx`
- Must be a `'use client'` component
- Must render full `<html lang="zh-Hans"><body>...</body></html>` to preserve the lang attribute — Next.js error pages strip layout-level html attributes without this
- Show a user-friendly Chinese message with a reset/retry button
- Reference: Next.js App Router error.tsx docs — receives `{ error: Error, reset: () => void }` props

---

## Phase 1 — Canonical URLs (P1, ~30 min) — parallel with Phase 0 Step 0.3

None of the layouts currently have `alternates.canonical`. Add to each:

- `app/layout.tsx` — `alternates: { canonical: 'https://anti-dv.vercel.app' }` in root metadata
- `app/page.tsx` — `alternates: { canonical: 'https://anti-dv.vercel.app/' }` in page metadata
- `app/resources/layout.tsx` — canonical `https://anti-dv.vercel.app/resources`
- `app/stories/layout.tsx` — canonical `https://anti-dv.vercel.app/stories`
- `app/psych-resources/layout.tsx` — canonical `https://anti-dv.vercel.app/psych-resources`
- `app/docs-toolkit/layout.tsx` — canonical `https://anti-dv.vercel.app/docs-toolkit`

Do NOT add canonicals to `app/chat/layout.tsx` or `app/feedback/layout.tsx` (both noindex).

Pattern to use (TypeScript, `Metadata` type from `next`):
```typescript
alternates: {
  canonical: 'https://anti-dv.vercel.app/resources',
},
```

---

## Phase 2 — JSON-LD & Structured Data (P1, ~20 min) — depends on Phase 0

### Step 2.1: Add Organization JSON-LD to root layout
Current `app/layout.tsx` has `websiteJsonLd` (`@type: 'WebSite'`) as a `<script type="application/ld+json">` in `<head>`. Add a second script alongside it for Organization schema:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "小安反家暴助手",
  "url": "https://anti-dv.vercel.app",
  "description": "专注于反家庭暴力的AI支持助手",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "crisis support",
    "availableLanguage": "zh-Hans"
  }
}
```
Use same `dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}` pattern already in place.

### Step 2.2: FAQPage JSON-LD placement (LOW priority — skip if time-constrained)
Current state in `app/page.tsx`: `<script type="application/ld+json">` is rendered inside a `<div>` wrapper. This is technically valid (Google parses full DOM), but non-standard. If time allows, move it to be the first child of the component's return statement, before the outer `<div>` — this places it at the body root level for cleaner parsing.

---

## Phase 3 — Cache-Control Tuning (P2, ~30 min) — depends on Phase 0 fix being live on Vercel

Pages `/resources`, `/stories`, `/psych-resources`, `/docs-toolkit` are fully static content. Currently they return `cache-control: private, no-cache, no-store` because the HTTP 500 prevents proper rendering. After the 500 is fixed, opt them into ISR to enable CDN edge caching and improve Core Web Vitals:

- Add `export const revalidate = 86400` to `app/resources/page.tsx`, `app/stories/page.tsx`, `app/psych-resources/page.tsx`, `app/docs-toolkit/page.tsx`
- For individual story pages (`app/stories/[id]/page.tsx`) and template pages (`app/docs-toolkit/[templateId]/page.tsx`): use `export const dynamic = 'force-static'` if they have no server-side data fetching
- Do NOT add to `app/page.tsx` (homepage uses RSC data) or `/chat` (always dynamic)

Expected result: `cache-control: s-maxage=86400, stale-while-revalidate` on static pages.

---

## Phase 4 — Google Search Console Submission (P1, manual — do after HTTP 500 is fixed and verified)

1. Go to https://search.google.com/search-console → Add property → URL prefix → `https://anti-dv.vercel.app`
2. Verify ownership by adding the Google verification meta tag to `app/layout.tsx`:
   ```typescript
   verification: {
     google: '<your-verification-token>',
   }
   ```
3. After verification: Sitemaps section → Submit `https://anti-dv.vercel.app/sitemap.xml`
4. Optional (for Chinese audience): Baidu Webmaster Tools (https://ziyuan.baidu.com/) → add site → submit same sitemap URL

---

## Files to Create
- `app/error.tsx` — root error boundary (Phase 0.3)

## Files to Modify
- `app/layout.tsx` — add canonical, add Organization JSON-LD, optionally add GSC verification token
- `app/page.tsx` — add canonical to metadata
- `app/resources/layout.tsx` — add canonical; `app/resources/page.tsx` — add revalidate
- `app/stories/layout.tsx` — add canonical; `app/stories/page.tsx` — add revalidate
- `app/psych-resources/layout.tsx` — add canonical; `app/psych-resources/page.tsx` — add revalidate
- `app/docs-toolkit/layout.tsx` — add canonical; `app/docs-toolkit/page.tsx` — add revalidate
- `i18n/server.ts` — add try/catch fallback if `getLocaleOnServer()` is confirmed as the 500 source
- `app/stories/[id]/page.tsx` — add `export const dynamic = 'force-static'` if no server fetch
- `app/docs-toolkit/[templateId]/page.tsx` — same

## Explicitly Out of Scope
- hreflang (site serves one language: zh-Hans, no active multi-locale routes)
- Hero image self-hosting (low ROI vs. HTTP 500 fix)
- Removing `typescript.ignoreBuildErrors` / `eslint.ignoreDuringBuilds` from `next.config.js` (defer until 500 is resolved to avoid compounding errors)

---

## Verification

All checks run against the live Vercel URL (no local build required):

1. `curl -s -I https://anti-dv.vercel.app/` → must return `HTTP/2 200`
2. `curl -s https://anti-dv.vercel.app/ | grep 'noindex'` → must return empty (no noindex meta on homepage)
3. `curl -s https://anti-dv.vercel.app/ | grep 'canonical'` → must find `<link rel="canonical" href="https://anti-dv.vercel.app"/>`
4. `curl -s https://anti-dv.vercel.app/ | grep 'FAQPage'` → FAQPage JSON-LD present
5. `curl -s https://anti-dv.vercel.app/ | grep 'Organization'` → Organization JSON-LD present
6. Google Rich Results Test on `https://anti-dv.vercel.app/` → FAQPage schema valid
7. Google Search Console → Coverage → verify no "Excluded by noindex" for public pages
8. `curl -s -I https://anti-dv.vercel.app/resources` → check `cache-control` includes `s-maxage` after Phase 3

---

## Decisions
- JSON-LD already uses static `<script type="application/ld+json">` tags in RSC (correct approach) — the v3 audit concern about "RSC payload" is a consequence of HTTP 500, not a code defect
- WebSite schema is already deployed in `app/layout.tsx` — only Organization schema is missing
- FAQPage placement in `<body>` (not `<head>`) is Google-acceptable; deprioritized
- Carry forward from v2 plan Phase 5: remove `ignoreBuildErrors` after 500 is fixed

## Expected Score After All Fixes
| Dimension | v3 current | Expected post-fix |
|---|---|---|
| Crawlability | 6/10 | 8/10 |
| Indexability | 1/10 | 8/10 |
| Page Speed | 4/10 | 7/10 |
| Mobile friendliness | 5/10 | 8/10 |
| Security baseline | 8/10 | 8/10 |
| Structured data | 3/10 | 6/10 |
| International SEO | 3/10 | 7/10 |
| **Overall** | **4/10** | **7/10** |
