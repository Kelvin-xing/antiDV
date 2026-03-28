# Fix Plan: 小安 Hash Identity Bugs (3 Production Bugs)

## Context

Site is live on Vercel. Three bugs discovered after deploying Phase A (Hash Identity System).
All 3 bugs are in the client-side hash management flow.

---

## Bug 1 — `crypto.randomUUID()` crashes iPhone 7 / Safari < 15.4

**File**: `hooks/use-user-hash.ts`

**Root Cause**: `crypto.randomUUID()` requires Safari 15.4+. iPhone 7 max is iOS 15 → Safari 15.0–15.3. The call throws a TypeError, causing the entire app to crash with "client-side exception".

**Fix**: Add a `generateUUID()` fallback using `Math.random()` polyfill. Replace the direct `crypto.randomUUID()` call.

```ts
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
    return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
```

Also add an `initialized` flag (boolean state, set `true` after the `useEffect` reads localStorage) and include it in the hook's return value:

```ts
// in the hook:
const [initialized, setInitialized] = useState(false)

useEffect(() => {
  const stored = localStorage.getItem(HASH_KEY)
  if (stored) setCurrentHash(stored)
  setInitialized(true)
}, [])

return { currentHash, initialized, generateHash, setHash, clearHash }
```

---

## Bug 2 — Every page load overwrites existing hash

**File**: `app/components/index.tsx`

**Root Cause**: `useState(null)` initializes before `useEffect([])` reads localStorage. The dependency `[currentHash === null]` evaluates to `[true]` on every first render. So `generateHash()` fires and overwrites the stored hash BEFORE it is read from localStorage.

**Fix**: Destructure `initialized` from `useUserHash()`. Change the `useEffect` dependency to `[initialized]` and guard with `if (!initialized) return`:

```ts
// FROM:
const { currentHash, generateHash } = useUserHash()
useEffect(() => {
  if (currentHash === null) {
    const newHash = generateHash()
    Toast.notify({ type: 'success', message: `您的身份識別碼：${newHash}`, duration: 8000 } as any)
  }
}, [currentHash === null])

// TO:
const { currentHash, initialized, generateHash } = useUserHash()
useEffect(() => {
  if (!initialized) return
  if (currentHash === null) {
    const newHash = generateHash()
    Toast.notify({ type: 'success', message: `您的身份識別碼：${newHash}`, duration: 8000 } as any)
  }
}, [initialized])
```

---

## Bug 3 — Inputting hash on new device doesn't restore conversation history

**File**: `app/components/user-hash/index.tsx`

**Root Cause**: `handleSetHash()` saves the hash to localStorage, but the conversation list was already fetched at mount time using the old/empty hash. No re-fetch is triggered after the modal closes, so the sidebar stays empty.

**Fix**: Add `window.location.reload()` after a successful `setHash()` call in `handleSetHash()`:

```ts
const handleSetHash = () => {
  setInputError('')
  const ok = setHash(inputValue)
  if (!ok) { setInputError('請輸入有效的識別碼'); return }
  setInputValue('')
  window.location.reload()   // ← ADD THIS
}
```

---

## Implementation Order

1. Fix `hooks/use-user-hash.ts` (Bug 1 + Bug 2 foundation — `generateUUID` fallback + `initialized` flag)
2. Fix `app/components/index.tsx` (Bug 2 — change useEffect dependency)
3. Fix `app/components/user-hash/index.tsx` (Bug 3 — add reload)

## Post-fix Steps

- Run `pnpm tsc --noEmit` to confirm 0 TypeScript errors
- Push to GitHub → Vercel auto-deploys
- Test on iPhone 7 (Safari 15): confirm no crash, confirm hash persists on reload
- Test cross-device: enter hash on second device, confirm conversation history loads
