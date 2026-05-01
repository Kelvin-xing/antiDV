# Plan: ADVchatbot SEO & Security Fix

## Context
- Repo: /Users/mingjiexing/Desktop/ADVchatbot/frontend
- Live: https://anti-dv.vercel.app/
- Based on: seo_audit_memory/audit_v01052026.md

## Story slugs: xiaomei, ah-fang, lili, wang-jie, xiao-yu
## Template slugs: protection-order, admonishment-letter, police-report-aid

---

## Phase 0 — Security (P0, ~50 min)

### Step 0.1: Protect /feedback with password middleware
- Create middleware.ts at project root
- Check FEEDBACK_PASSWORD env var against a request cookie or query param
- Redirect unauthenticated requests to /feedback-login or return 401
- Alternatively: add `X-Robots-Tag: noindex` header immediately as stopgap

### Step 0.2: Create app/robots.ts
- Next.js App Router robots.ts route handler (MetadataRoute.Robots)
- Disallow: /feedback, /chat, /api/
- Block AI crawlers: GPTBot, ClaudeBot, PerplexityBot
- Add Sitemap reference

---

## Phase 1 — Crawlability (P0, ~30 min)

### Step 1.1: Create app/sitemap.ts
- Use MetadataRoute.Sitemap
- Static pages: /, /resources, /psych-resources, /stories, /docs-toolkit
- Dynamic stories: /stories/xiaomei, /stories/ah-fang, /stories/lili, /stories/wang-jie, /stories/xiao-yu
- Dynamic templates: /docs-toolkit/protection-order, /docs-toolkit/admonishment-letter, /docs-toolkit/police-report-aid
- Exclude: /chat, /feedback, /api/

---

## Phase 2 — Metadata (P1, ~1.5 hr)

### Step 2.1: Add global metadata to app/layout.tsx
- Export const metadata: Metadata
- metadataBase, title template, description, openGraph siteName
- Can be done in same file since layout.tsx is already a Server Component

### Step 2.2: Create per-route layout.tsx (Server Components)
Files to create (all are Server Components with no 'use client'):
- app/resources/layout.tsx
- app/stories/layout.tsx
- app/psych-resources/layout.tsx
- app/docs-toolkit/layout.tsx
- app/chat/layout.tsx (noindex + nofollow)
- app/feedback/layout.tsx (noindex + nofollow)

### Step 2.3: Homepage metadata
- app/page.tsx likely has 'use client' or no metadata export
- Add app/(home)/layout.tsx OR export metadata from a wrapper

---

## Phase 3 — Structured Data (P1, ~45 min)

### Step 3.1: WebSite JSON-LD in root layout
- Add <script type="application/ld+json"> in app/layout.tsx body or head

### Step 3.2: FAQPage JSON-LD in homepage
- Read FAQ items from app/page.tsx and generate FAQPage schema
- Add as inline script in page or its layout wrapper

---

## Phase 4 — Performance & Security Headers (P2, ~1 hr)

### Step 4.1: Migrate Google Fonts to next/font/google
- Remove @import from app/styles/globals.css
- Import Noto_Sans_SC and Noto_Serif_SC in app/layout.tsx
- Apply font.className or CSS variable approach

### Step 4.2: Add security headers to next.config.js
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy
- Add X-Robots-Tag: noindex for /feedback as stopgap

---

## Phase 5 — Code Quality (P2, ~1-4 hr)

### Step 5.1: Remove build error suppression
- next.config.js: remove typescript.ignoreBuildErrors and eslint.ignoreDuringBuilds
- Fix any TS errors that surface (requires build + fix cycle)

---

## Phase 6 — Optional (P3)

### Step 6.1: Hero image self-hosting
### Step 6.2: hreflang (if multi-language routes active)

---

## Files to Create (new)
- middleware.ts
- app/robots.ts
- app/sitemap.ts
- app/resources/layout.tsx
- app/stories/layout.tsx
- app/psych-resources/layout.tsx
- app/docs-toolkit/layout.tsx
- app/chat/layout.tsx
- app/feedback/layout.tsx

## Files to Modify
- app/layout.tsx (add metadata export + JSON-LD + font import)
- app/styles/globals.css (remove @import)
- next.config.js (add headers(), remove ignoreBuildErrors)
- app/page.tsx (add FAQPage JSON-LD)

## Verification
1. curl https://anti-dv.vercel.app/robots.txt → 200, correct Disallow rules
2. curl https://anti-dv.vercel.app/sitemap.xml → 200, all URLs present
3. View page source → <title>, <meta description>, canonical present
4. Google Rich Results Test on homepage → FAQPage schema valid
5. curl -I https://anti-dv.vercel.app/feedback → X-Robots-Tag: noindex
6. curl https://anti-dv.vercel.app/feedback → requires auth / returns 401
7. Lighthouse PWA/SEO score on /resources page → SEO score ≥ 90
