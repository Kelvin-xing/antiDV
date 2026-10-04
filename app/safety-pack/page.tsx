import Link from 'next/link'

export default function SafetyPackPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-gray-800">
      <h1 className="text-2xl font-semibold">生存安全包</h1>
      <p className="mt-5 leading-7">安全包链接尚未设置，这里暂时没有可查看的安全包内容。</p>
      <p className="mt-3 leading-7">离开聊天来到此页不会清除聊天或浏览记录。</p>
      <Link href="/chat" className="mt-8 inline-flex min-h-[48px] items-center rounded-xl border border-gray-500 px-5 font-semibold">返回聊天</Link>
    </main>
  )
}
