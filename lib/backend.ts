import 'server-only'

export class BackendError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

/** Server-to-server transport. Protocol mapping belongs in the API routes. */
export async function fetchBackend(path: string, init: RequestInit = {}): Promise<Response> {
  const base = process.env.BACKEND_API_URL?.trim()
  if (!base) { throw new BackendError(503, '聊天服务尚未配置') }

  let url: URL
  try {
    url = new URL(base)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
      throw new Error('Invalid backend URL')
    }
    if (!path.startsWith('/') || path.startsWith('//')) { throw new Error('Invalid backend path') }
    url = new URL(`${url.href.replace(/\/$/, '')}${path}`)
  }
  catch {
    throw new BackendError(503, '聊天服务配置无效')
  }

  const headers = new Headers(init.headers)
  const key = process.env.BACKEND_API_KEY?.trim()
  if (key) {
    const header = process.env.BACKEND_API_KEY_HEADER?.trim().toLowerCase() || 'authorization'
    if (!['authorization', 'api-key', 'x-api-key', 'ocp-apim-subscription-key'].includes(header)) {
      throw new BackendError(503, '聊天服务认证配置无效')
    }
    if (header === 'authorization' && headers.has('authorization')) {
      throw new BackendError(503, '网关密钥不能覆盖用户登录凭证，请使用独立密钥请求头')
    }
    headers.set(header, header === 'authorization' ? `Bearer ${key}` : key)
  }

  let response: Response
  try {
    response = await fetch(url, { ...init, headers, cache: 'no-store', redirect: 'error' })
  }
  catch {
    throw new BackendError(502, '暂时无法连接聊天服务，请稍后重试')
  }
  return response
}
