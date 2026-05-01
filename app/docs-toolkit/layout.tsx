import type { Metadata } from 'next'

export const revalidate = 86400

export const metadata: Metadata = {
    title: '文档工具库',
    alternates: {
        canonical: 'https://anti-dv.vercel.app/docs-toolkit',
    },
    description:
        '人身安全保护令申请书、家庭暴力告诫书、报警笔录辅助模板——填写关键信息即可生成规范文档，所有信息仅在您的设备上处理。',
    openGraph: {
        title: '文档工具库 — 小安反家暴助手',
        description:
            '人身安全保护令、告诫书等法律文书模板，填写即生成，无需上传数据。',
        url: 'https://anti-dv.vercel.app/docs-toolkit',
    },
}

export default function DocsToolkitLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
