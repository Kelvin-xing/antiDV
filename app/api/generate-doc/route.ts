import { NextRequest, NextResponse } from 'next/server'
import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    HeadingLevel,
} from 'docx'

interface GenerateDocBody {
    templateId: string
    fields: Record<string, string>
}

function buildProtectionOrder(f: Record<string, string>): Document {
    return new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                    children: [new TextRun({ text: '人身安全保护令申请书', bold: true, size: 36, font: 'SimSun' })],
                }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [new TextRun({ text: `致：${f.courtName || 'XX人民法院'}`, size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 200 },
                    children: [new TextRun({ text: '一、申请人信息', bold: true, size: 28, font: 'SimSun' })],
                }),
                new Paragraph({ children: [new TextRun({ text: `姓名：${f.applicantName || ''}`, size: 24, font: 'SimSun' })] }),
                new Paragraph({ children: [new TextRun({ text: `性别：${f.applicantGender || ''}`, size: 24, font: 'SimSun' })] }),
                new Paragraph({ children: [new TextRun({ text: `身份证号：${f.applicantIdNumber || ''}`, size: 24, font: 'SimSun' })] }),
                new Paragraph({ children: [new TextRun({ text: `住址：${f.applicantAddress || ''}`, size: 24, font: 'SimSun' })] }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [new TextRun({ text: `联系电话：${f.applicantPhone || ''}`, size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 200 },
                    children: [new TextRun({ text: '二、被申请人信息', bold: true, size: 28, font: 'SimSun' })],
                }),
                new Paragraph({ children: [new TextRun({ text: `姓名：${f.respondentName || ''}`, size: 24, font: 'SimSun' })] }),
                new Paragraph({ children: [new TextRun({ text: `与申请人关系：${f.respondentRelation || ''}`, size: 24, font: 'SimSun' })] }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [new TextRun({ text: `住址：${f.respondentAddress || ''}`, size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 200 },
                    children: [new TextRun({ text: '三、申请事项', bold: true, size: 28, font: 'SimSun' })],
                }),
                new Paragraph({
                    spacing: { after: 100 },
                    children: [new TextRun({ text: '申请人因遭受家庭暴力，依据《中华人民共和国反家庭暴力法》第二十三条之规定，向贵院申请人身安全保护令，请求：', size: 24, font: 'SimSun' })],
                }),
                new Paragraph({ children: [new TextRun({ text: `1. 禁止被申请人${f.respondentName || ''}对申请人实施家庭暴力；`, size: 24, font: 'SimSun' })] }),
                new Paragraph({ children: [new TextRun({ text: `2. 禁止被申请人${f.respondentName || ''}骚扰、跟踪、接触申请人及其相关近亲属；`, size: 24, font: 'SimSun' })] }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [new TextRun({ text: '3. 责令被申请人迁出申请人住所。', size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 200 },
                    children: [new TextRun({ text: '四、事实与理由', bold: true, size: 28, font: 'SimSun' })],
                }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [new TextRun({ text: f.violenceDescription || '（请在此补充具体事实）', size: 24, font: 'SimSun' })],
                }),
                ...(f.evidenceDescription ? [
                    new Paragraph({
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 300, after: 200 },
                        children: [new TextRun({ text: '五、证据说明', bold: true, size: 28, font: 'SimSun' })],
                    }),
                    new Paragraph({
                        spacing: { after: 200 },
                        children: [new TextRun({ text: f.evidenceDescription, size: 24, font: 'SimSun' })],
                    }),
                ] : []),
                new Paragraph({
                    spacing: { before: 400 },
                    alignment: AlignmentType.RIGHT,
                    children: [new TextRun({ text: `申请人：${f.applicantName || ''}`, size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [new TextRun({ text: `日期：${f.applicationDate || ''}`, size: 24, font: 'SimSun' })],
                }),
            ],
        }],
    })
}

function buildAdmonishmentLetter(f: Record<string, string>): Document {
    return new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                    children: [new TextRun({ text: '关于出具家庭暴力告诫书的申请', bold: true, size: 36, font: 'SimSun' })],
                }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [new TextRun({ text: `致：${f.policeStation || 'XX派出所'}`, size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 200 },
                    children: [new TextRun({ text: '一、申请人基本信息', bold: true, size: 28, font: 'SimSun' })],
                }),
                new Paragraph({ children: [new TextRun({ text: `姓名：${f.applicantName || ''}`, size: 24, font: 'SimSun' })] }),
                new Paragraph({ children: [new TextRun({ text: `身份证号：${f.applicantIdNumber || ''}`, size: 24, font: 'SimSun' })] }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [new TextRun({ text: `联系电话：${f.applicantPhone || ''}`, size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 200 },
                    children: [new TextRun({ text: '二、施暴者信息', bold: true, size: 28, font: 'SimSun' })],
                }),
                new Paragraph({ children: [new TextRun({ text: `姓名：${f.respondentName || ''}`, size: 24, font: 'SimSun' })] }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [new TextRun({ text: `与申请人关系：${f.respondentRelation || ''}`, size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 200 },
                    children: [new TextRun({ text: '三、暴力事件情况', bold: true, size: 28, font: 'SimSun' })],
                }),
                new Paragraph({ children: [new TextRun({ text: `发生日期：${f.incidentDate || ''}`, size: 24, font: 'SimSun' })] }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [new TextRun({ text: `事件经过：${f.incidentDescription || ''}`, size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 200 },
                    children: [new TextRun({ text: '四、申请事项', bold: true, size: 28, font: 'SimSun' })],
                }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [new TextRun({ text: '依据《中华人民共和国反家庭暴力法》第十六条之规定，申请人请求贵所对施暴者出具告诫书，对其进行批评教育，告诫其不得再次实施家庭暴力。', size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    spacing: { before: 400 },
                    alignment: AlignmentType.RIGHT,
                    children: [new TextRun({ text: `申请人：${f.applicantName || ''}`, size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [new TextRun({ text: `日期：${f.applicationDate || ''}`, size: 24, font: 'SimSun' })],
                }),
            ],
        }],
    })
}

function buildPoliceReportAid(f: Record<string, string>): Document {
    return new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                    children: [new TextRun({ text: '报警笔录辅助——信息整理', bold: true, size: 36, font: 'SimSun' })],
                }),
                new Paragraph({
                    spacing: { after: 100 },
                    children: [new TextRun({ text: '（本文档帮助您在报案前整理关键信息，携带此文档到派出所可提高报案效率）', size: 22, font: 'SimSun', italics: true })],
                }),
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 200 },
                    children: [new TextRun({ text: '一、报案人信息', bold: true, size: 28, font: 'SimSun' })],
                }),
                new Paragraph({ children: [new TextRun({ text: `姓名：${f.reporterName || ''}`, size: 24, font: 'SimSun' })] }),
                new Paragraph({ children: [new TextRun({ text: `联系电话：${f.reporterPhone || ''}`, size: 24, font: 'SimSun' })] }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [new TextRun({ text: `家庭住址：${f.reporterAddress || ''}`, size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 200 },
                    children: [new TextRun({ text: '二、施暴者信息', bold: true, size: 28, font: 'SimSun' })],
                }),
                new Paragraph({ children: [new TextRun({ text: `姓名：${f.suspectName || ''}`, size: 24, font: 'SimSun' })] }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [new TextRun({ text: `与报案人关系：${f.suspectRelation || ''}`, size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 200 },
                    children: [new TextRun({ text: '三、事件详情', bold: true, size: 28, font: 'SimSun' })],
                }),
                new Paragraph({ children: [new TextRun({ text: `发生时间：${f.incidentTime || ''}`, size: 24, font: 'SimSun' })] }),
                new Paragraph({ children: [new TextRun({ text: `发生地点：${f.incidentLocation || ''}`, size: 24, font: 'SimSun' })] }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [new TextRun({ text: `详细经过：`, size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [new TextRun({ text: f.incidentDetail || '（请补充）', size: 24, font: 'SimSun' })],
                }),
                ...(f.injuries ? [
                    new Paragraph({
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 300, after: 200 },
                        children: [new TextRun({ text: '四、受伤情况', bold: true, size: 28, font: 'SimSun' })],
                    }),
                    new Paragraph({
                        spacing: { after: 200 },
                        children: [new TextRun({ text: f.injuries, size: 24, font: 'SimSun' })],
                    }),
                ] : []),
                ...(f.witnesses ? [
                    new Paragraph({
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 300, after: 200 },
                        children: [new TextRun({ text: '五、目击者', bold: true, size: 28, font: 'SimSun' })],
                    }),
                    new Paragraph({
                        spacing: { after: 200 },
                        children: [new TextRun({ text: f.witnesses, size: 24, font: 'SimSun' })],
                    }),
                ] : []),
                ...(f.previousIncidents ? [
                    new Paragraph({
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 300, after: 200 },
                        children: [new TextRun({ text: '六、既往暴力经历', bold: true, size: 28, font: 'SimSun' })],
                    }),
                    new Paragraph({
                        spacing: { after: 200 },
                        children: [new TextRun({ text: f.previousIncidents, size: 24, font: 'SimSun' })],
                    }),
                ] : []),
            ],
        }],
    })
}

export async function POST(req: NextRequest) {
    try {
        const body: GenerateDocBody = await req.json()
        const { templateId, fields } = body

        if (!templateId || !fields) {
            return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
        }

        let doc: Document
        switch (templateId) {
            case 'protection-order':
                doc = buildProtectionOrder(fields)
                break
            case 'admonishment-letter':
                doc = buildAdmonishmentLetter(fields)
                break
            case 'police-report-aid':
                doc = buildPoliceReportAid(fields)
                break
            default:
                return NextResponse.json({ error: '未知模板' }, { status: 400 })
        }

        const buffer = await Packer.toBuffer(doc)

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': `attachment; filename="${encodeURIComponent(templateId)}.docx"`,
            },
        })
    } catch {
        return NextResponse.json({ error: '生成文档时出错' }, { status: 500 })
    }
}
