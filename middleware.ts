import { NextRequest, NextResponse } from 'next/server'

const FEEDBACK_PATH = '/feedback'
const COOKIE_NAME = 'feedback_auth'
// Cookie max-age in seconds: 8 hours
const COOKIE_MAX_AGE = 60 * 60 * 8

/**
 * SHA-256 hash a password using the Web Crypto API (available in Edge Runtime).
 * The hash is stored in the cookie — not the raw password.
 */
async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/** Constant-time string comparison to prevent timing attacks. */
function safeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false
    let result = 0
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i)
    }
    return result === 0
}

function loginPage(errorMsg = ''): NextResponse {
    const html = `<!DOCTYPE html>
<html lang="zh-Hans">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>需要验证 — 小安管理员面板</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #FBF8F4;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
    }
    .card {
      background: #fff;
      border: 1px solid #E6DDD5;
      border-radius: 8px;
      padding: 40px 36px;
      width: 100%;
      max-width: 360px;
      text-align: center;
    }
    h1 { font-size: 18px; color: #3D3028; margin-bottom: 8px; }
    p  { font-size: 14px; color: #7A6B5D; margin-bottom: 24px; }
    .error { color: #C0392B; font-size: 13px; margin-bottom: 16px; }
    input[type="password"] {
      width: 100%;
      border: 1px solid #E6DDD5;
      border-radius: 4px;
      padding: 10px 14px;
      font-size: 15px;
      outline: none;
      margin-bottom: 12px;
    }
    input[type="password"]:focus-visible {
      border-color: #E8A87C;
      box-shadow: 0 0 0 2px rgba(232,168,124,.25);
    }
    button {
      width: 100%;
      background: #E8A87C;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 11px 0;
      font-size: 15px;
      cursor: pointer;
    }
    button:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="card">
    <h1>管理员验证</h1>
    <p>此页面需要密码才能访问</p>
    ${errorMsg ? `<p class="error">${errorMsg}</p>` : ''}
    <form method="POST" action="/feedback?_auth=1">
      <input type="password" name="pwd" placeholder="请输入密码" autofocus autocomplete="current-password" />
      <button type="submit">进入</button>
    </form>
  </div>
</body>
</html>`
    return new NextResponse(html, {
        status: 401,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
}

export async function middleware(request: NextRequest) {
    const { pathname, method } = request.nextUrl

    if (!pathname.startsWith(FEEDBACK_PATH)) {
        return NextResponse.next()
    }

    const password = process.env.FEEDBACK_PASSWORD

    // If FEEDBACK_PASSWORD is not configured, deny all access
    if (!password) {
        return new NextResponse('Access denied: FEEDBACK_PASSWORD environment variable is not configured.', {
            status: 403,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        })
    }

    const expectedHash = await hashPassword(password)

    // Handle POST login form submission
    if (method === 'POST') {
        let formPwd = ''
        try {
            const body = await request.text()
            const params = new URLSearchParams(body)
            formPwd = params.get('pwd') ?? ''
        } catch {
            return loginPage('无法解析提交内容')
        }

        const submittedHash = await hashPassword(formPwd)
        if (!safeEqual(submittedHash, expectedHash)) {
            return loginPage('密码不正确，请重试')
        }

        // Password correct: set auth cookie and redirect to /feedback
        const response = NextResponse.redirect(new URL(FEEDBACK_PATH, request.url))
        response.cookies.set(COOKIE_NAME, expectedHash, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: COOKIE_MAX_AGE,
            path: '/feedback',
        })
        return response
    }

    // GET: check auth cookie
    const authCookie = request.cookies.get(COOKIE_NAME)
    if (authCookie && safeEqual(authCookie.value, expectedHash)) {
        return NextResponse.next()
    }

    return loginPage()
}

export const config = {
    matcher: ['/feedback', '/feedback/:path*'],
}
