/** 在首字立即显示的同时，用帧时间平滑播放后续文本。 */
export function createStreamRenderer(append: (text: string) => void) {
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  let pending = ''
  let frame: number | null = null
  let last = performance.now()
  let credit = 0
  let started = false
  let closed = false
  let stopped = false
  let deadline: number | null = null
  let resolveFinished: (() => void) | undefined
  const finished = new Promise<void>((resolve) => { resolveFinished = resolve })
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const segments = () => Array.from(segmenter.segment(pending), item => item.segment)
  const settle = () => { if (closed && !pending) { resolveFinished?.() } }
  const schedule = () => {
    if (!stopped && pending && frame === null) { frame = requestAnimationFrame(tick) }
    settle()
  }
  function tick(time: number) {
    frame = null
    if (stopped) { return }
    const queue = segments()
    const rate = Math.max(40, queue.length * 1000 / 300,
      deadline === null ? 0 : queue.length * 1000 / Math.max(1, deadline - last))
    credit += Math.max(0, time - last) * rate / 1000
    last = time
    const count = reducedMotion.matches || (deadline !== null && time >= deadline)
      ? queue.length : Math.min(queue.length, Math.floor(credit))
    credit = Math.max(0, credit - count)
    if (count) {
      const text = queue.slice(0, count).join('')
      pending = pending.slice(text.length)
      append(text)
    }
    if (!pending) { credit = 0 }
    schedule()
  }
  return {
    push(text: string) {
      if (closed || stopped || !text) { return }
      const wasEmpty = !pending
      pending += text
      if (reducedMotion.matches) {
        append(pending)
        pending = ''
        started = true
      }
      else if (!started) {
        started = true
        const first = segments()[0]
        pending = pending.slice(first.length)
        append(first)
      }
      if (wasEmpty) { last = performance.now(); credit = 0 }
      schedule()
    },
    finish() {
      if (!closed) { closed = true; deadline = performance.now() + 300; schedule() }
      return finished
    },
    cancel() {
      stopped = true
      closed = true
      pending = ''
      if (frame !== null) { cancelAnimationFrame(frame) }
      frame = null
      resolveFinished?.()
    },
  }
}
