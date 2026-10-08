/** Retired template endpoints: callers must use the native XiaoAn /v1 contract. */
export function legacyEndpoint() {
  return Response.json({ detail: '此接口已停用，请使用小安 /v1 API' }, {
    status: 410,
    headers: { 'Cache-Control': 'no-store' },
  })
}
