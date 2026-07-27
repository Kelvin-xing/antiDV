# XiaoAn Web

Responsive Next.js frontend for the XiaoAn FastAPI service. The browser calls
same-origin `/v1/*` routes; Next.js rewrites them to `XIAOAN_API_ORIGIN`.

The anonymous session token is an HttpOnly cookie owned by FastAPI. Chat
transcripts and browser identity tokens are not persisted in local storage.
Chat answers stream as SSE through `fetch()` so the UI can render guarded
clauses as they arrive. The Stop control aborts the upstream request; incomplete
turns are not retained. The complete-JSON endpoint remains a compatibility
fallback when the streaming endpoint is unavailable.

## Local development

Install the locked dependencies:

```bash
npx pnpm@9.15.9 install --frozen-lockfile
```

Start the XiaoAn backend from the sibling `xiaoan` repository:

```bash
XIAOAN_OFFLINE=true \
XIAOAN_COOKIE_SECURE=false \
XIAOAN_ENABLE_DEBUG=true \
.venv/bin/python -m uvicorn \
  --app-dir tech/chatflow/poc \
  server:app \
  --reload
```

`XIAOAN_OFFLINE=true` uses deterministic templates and does not call a real
LLM. Follow `tech/chatflow/poc/TESTING.md` in the backend repository for online
LLM mode.

Then start this frontend:

```bash
cp .env.example .env.local
npx pnpm@9.15.9 dev
```

Open <http://localhost:3000/chat>.

## Configuration

- `XIAOAN_API_ORIGIN`: private FastAPI origin used by the server-side rewrite.
  It defaults to `http://127.0.0.1:8000`.
- `NEXT_PUBLIC_ENABLE_DEBUG_EXPORT`: shows a client-side export button when
  set to `true`. Export is explicit and downloads only the currently rendered
  conversation; it does not upload or persist the transcript.
- `NEXT_PUBLIC_ENABLE_CHAT_DEBUG`: shows a developer-only toggle that requests
  structured Chatflow debug metadata and displays capsule routing, confidence,
  ground details, and segmented server timings. The backend must also start
  with `XIAOAN_ENABLE_DEBUG=true`; both settings default to disabled. Restart
  the backend and Next.js after changing these environment variables.

Debug metadata is delivered in a separate SSE event and is not appended to the
assistant answer or persisted in conversation history. Timing values are
server-side measurements:

- `router_ms`: complete capsule-router call
- `response_ttft_ms`: answer-model request start to its first text token
- `first_guarded_delta_ms`: complete turn start to the first guarded text chunk
  emitted by the backend
- `response_generation_ms`: answer-model request start through stream completion
- `total_ms`: complete Chatflow processing time; browser rendering and network
  transit after backend emission are not included

Attachments, accounts, and Dify workflow events are intentionally unsupported
by the current XiaoAn API.

Production proxies and CDNs in front of `/v1/*/responses/stream` must preserve
streaming and disable response buffering or transformation.

## Validation

```bash
npx pnpm@9.15.9 exec tsc --noEmit
npx pnpm@9.15.9 build
```
