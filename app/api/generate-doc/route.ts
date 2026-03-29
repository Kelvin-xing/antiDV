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
                // Title
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                    children: [new TextRun({ text: '人身安全保护申请书', bold: true, size: 36, font: 'SimSun' })],
                }),
                // 申请人信息
                new Paragraph({
                    spacing: { after: 120 },
                    children: [
                        new TextRun({ text: `申请人：${f.applicantName || ''}，${f.applicantGender || ''}，${f.applicantEthnicity || ''}，出生于：${f.applicantBirthDate || ''}，身份证号：${f.applicantIdNumber || ''}，住址${f.applicantAddress || ''}。`, size: 24, font: 'SimSun' }),
                    ],
                }),
                // 被申请人信息
                new Paragraph({
                    spacing: { after: 200 },
                    children: [
                        new TextRun({ text: `被申请人：${f.respondentName || ''}，${f.respondentGender || ''}，${f.respondentEthnicity || ''}，出生于：${f.respondentBirthDate || ''}，身份证号：${f.respondentIdNumber || ''}，住址${f.respondentAddress || ''}。`, size: 24, font: 'SimSun' }),
                    ],
                }),
                // 申请事项
                new Paragraph({
                    spacing: { before: 200, after: 200 },
                    children: [new TextRun({ text: '申请事项：', bold: true, size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    spacing: { after: 120 },
                    children: [new TextRun({ text: '请求人民法院依法签发人身安全保护令。', size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    spacing: { after: 80 },
                    children: [new TextRun({ text: `1、禁止被申请人殴打、威胁申请人及申请人的亲属；`, size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    spacing: { after: 80 },
                    children: [new TextRun({ text: `2、禁止被申请人骚扰、跟踪申请人及申请人的亲属；`, size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    spacing: { after: 80 },
                    children: [new TextRun({ text: `3、责令被申请人迁出申请人住所；`, size: 24, font: 'SimSun' })],
                }),
                ...(f.otherMeasures ? [
                    new Paragraph({
                        spacing: { after: 80 },
                        children: [new TextRun({ text: `4、${f.otherMeasures}`, size: 24, font: 'SimSun' })],
                    }),
                ] : []),
                // 事实与理由
                new Paragraph({
                    spacing: { before: 300, after: 200 },
                    children: [new TextRun({ text: '事实与理由：', bold: true, size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    spacing: { after: 120 },
                    indent: { firstLine: 480 },
                    children: [new TextRun({ text: f.factsAndReasons || '（请在此补充具体事实与理由）', size: 24, font: 'SimSun' })],
                }),
                // 结尾
                new Paragraph({
                    spacing: { before: 200, after: 120 },
                    indent: { firstLine: 480 },
                    children: [new TextRun({ text: `被申请人的种种行为对申请人造成了极大的伤害与威胁。为了保障申请人的人身安全以及诉讼的顺利进行，现根据《反家庭暴力法》和最高人民法院《涉及家庭暴力婚姻案件审理指南》的规定，特向贵院申请上述人身安全保护令，请依法审查批准！`, size: 24, font: 'SimSun' })],
                }),
                // 此致
                new Paragraph({
                    spacing: { before: 300, after: 80 },
                    indent: { firstLine: 480 },
                    children: [new TextRun({ text: '此致', size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    spacing: { after: 300 },
                    indent: { firstLine: 480 },
                    children: [new TextRun({ text: `${f.courtName || '****人民法院'}`, size: 24, font: 'SimSun' })],
                }),
                // 签名
                new Paragraph({
                    spacing: { before: 200 },
                    alignment: AlignmentType.RIGHT,
                    children: [new TextRun({ text: `申请人：${f.applicantName || ''}`, size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [new TextRun({ text: f.applicationDate || '    年  月  日', size: 24, font: 'SimSun' })],
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
                // Title
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                    children: [new TextRun({ text: '家庭暴力告诫书（模版）', bold: true, size: 36, font: 'SimSun' })],
                }),
                // 文号
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                    children: [new TextRun({ text: f.caseNumber || '公（  ）告诫字[    ]号', size: 24, font: 'SimSun' })],
                }),
                // 致被告诫人
                new Paragraph({
                    spacing: { after: 200 },
                    children: [new TextRun({ text: `${f.respondentName || '________'}：`, size: 24, font: 'SimSun' })],
                }),
                // 正文开头
                new Paragraph({
                    spacing: { after: 200 },
                    indent: { firstLine: 480 },
                    children: [new TextRun({ text: '国家依法保护妇女、儿童、老年人的合法权益，维护平等、和睦、文明的婚姻家庭关系，你实施的家庭暴力行为，破坏了婚姻家庭关系，违反了《婚姻法》、《治安管理处罚法》等的相关规定，根据《家庭暴力案件处置及告诫办法》现对你告诫如下：', size: 24, font: 'SimSun' })],
                }),
                // 被告诫人信息
                new Paragraph({
                    spacing: { before: 200, after: 120 },
                    indent: { firstLine: 480 },
                    children: [
                        new TextRun({ text: '现查明被告诫人（姓名', size: 24, font: 'SimSun' }),
                        new TextRun({ text: ` ${f.respondentName || '______'} `, size: 24, font: 'SimSun', underline: {} }),
                        new TextRun({ text: '性别', size: 24, font: 'SimSun' }),
                        new TextRun({ text: ` ${f.respondentGender || '____'} `, size: 24, font: 'SimSun', underline: {} }),
                        new TextRun({ text: '年龄', size: 24, font: 'SimSun' }),
                        new TextRun({ text: ` ${f.respondentAge || '____'} `, size: 24, font: 'SimSun', underline: {} }),
                        new TextRun({ text: '出生日期', size: 24, font: 'SimSun' }),
                        new TextRun({ text: ` ${f.respondentBirthDate || '________'} `, size: 24, font: 'SimSun', underline: {} }),
                    ],
                }),
                new Paragraph({
                    spacing: { after: 120 },
                    children: [
                        new TextRun({ text: '身份证件种类及号码', bold: true, size: 24, font: 'SimSun' }),
                        new TextRun({ text: ` ${f.respondentIdType || '________'} ${f.respondentIdNumber || '________________'} `, size: 24, font: 'SimSun', underline: {} }),
                        new TextRun({ text: '  户籍所在地', bold: true, size: 24, font: 'SimSun' }),
                        new TextRun({ text: ` ${f.respondentHukou || '________________'} `, size: 24, font: 'SimSun', underline: {} }),
                    ],
                }),
                new Paragraph({
                    spacing: { after: 200 },
                    children: [
                        new TextRun({ text: '现住址', bold: true, size: 24, font: 'SimSun' }),
                        new TextRun({ text: ` ${f.respondentAddress || '________________'} `, size: 24, font: 'SimSun', underline: {} }),
                        new TextRun({ text: '  工作单位', bold: true, size: 24, font: 'SimSun' }),
                        new TextRun({ text: ` ${f.respondentWorkplace || '________________'} `, size: 24, font: 'SimSun', underline: {} }),
                    ],
                }),
                // 家暴记录
                new Paragraph({
                    spacing: { before: 200, after: 120 },
                    children: [new TextRun({ text: '实施家庭暴力记录：', bold: true, size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    spacing: { after: 200 },
                    indent: { firstLine: 480 },
                    children: [new TextRun({ text: f.violenceRecord || '________________________________________________________', size: 24, font: 'SimSun' })],
                }),
                // 证据
                new Paragraph({
                    spacing: { before: 200, after: 120 },
                    children: [
                        new TextRun({ text: '以上事实有', size: 24, font: 'SimSun' }),
                        new TextRun({ text: ` ${f.evidence || '________________________________________'} `, size: 24, font: 'SimSun', underline: {} }),
                        new TextRun({ text: '等证据证实。', size: 24, font: 'SimSun' }),
                    ],
                }),
                // 告诫内容
                new Paragraph({
                    spacing: { before: 200, after: 200 },
                    indent: { firstLine: 480 },
                    children: [new TextRun({ text: '现对你依以书面告诫，告诫后若再次实施家庭暴力违法行为，将依据《治安管理处罚法》等法律法规对你从重处罚。', size: 24, font: 'SimSun' })],
                }),
                // 公安机关签章
                new Paragraph({
                    spacing: { before: 400 },
                    alignment: AlignmentType.RIGHT,
                    children: [new TextRun({ text: `${f.policeOrgan || '公安机关'}（印）`, size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    spacing: { after: 400 },
                    children: [new TextRun({ text: f.issueDate || '    年  月  日', size: 24, font: 'SimSun' })],
                }),
                // 送达确认
                new Paragraph({
                    spacing: { before: 200, after: 200 },
                    children: [new TextRun({ text: '家庭暴力告诫书已向我宣告并送达。', size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [new TextRun({ text: '被告诫人（签字）：', size: 24, font: 'SimSun' })],
                }),
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    spacing: { after: 400 },
                    children: [new TextRun({ text: '    年  月  日', size: 24, font: 'SimSun' })],
                }),
                // 备注
                new Paragraph({
                    spacing: { before: 200 },
                    children: [new TextRun({ text: '本告诫书一式四份，被告诫人、家暴受害人、被告诫人居住地的居委会（村委会）、公安机关各留存一份。', size: 20, font: 'SimSun' })],
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
