import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '资源导航',
    description:
        '汇集全国反家暴热线、法律援助机构、庇护所及专业服务机构，助你在最需要的时候找到帮助。紧急请拨 110 或 12338。',
    openGraph: {
        title: '资源导航 — 小安反家暴助手',
        description:
            '全国反家暴热线、法律援助、庇护所及专业服务机构一站式汇总。',
        url: 'https://anti-dv.vercel.app/resources',
    },
}

export default function ResourcesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
