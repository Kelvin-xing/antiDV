export interface FormField {
    key: string
    label: string
    type: 'text' | 'textarea' | 'date' | 'select'
    required: boolean
    placeholder: string
    options?: string[]
}

export interface DocTemplate {
    id: string
    name: string
    icon: string
    description: string
    fields: FormField[]
}

export const templates: DocTemplate[] = [
    {
        id: 'protection-order',
        name: '人身安全保护令申请书',
        icon: '🛡️',
        description: '向人民法院申请人身安全保护令，禁止施暴者继续实施暴力、骚扰、跟踪等行为。',
        fields: [
            { key: 'applicantName', label: '申请人姓名', type: 'text', required: true, placeholder: '您的真实姓名' },
            { key: 'applicantGender', label: '申请人性别', type: 'select', required: true, placeholder: '请选择', options: ['女', '男', '其他'] },
            { key: 'applicantIdNumber', label: '身份证号', type: 'text', required: true, placeholder: '18位身份证号码' },
            { key: 'applicantAddress', label: '住址', type: 'text', required: true, placeholder: '现居住地址' },
            { key: 'applicantPhone', label: '联系电话', type: 'text', required: true, placeholder: '手机号码' },
            { key: 'respondentName', label: '被申请人姓名', type: 'text', required: true, placeholder: '施暴者姓名' },
            { key: 'respondentRelation', label: '与申请人关系', type: 'select', required: true, placeholder: '请选择', options: ['配偶', '前配偶', '同居者', '父母', '子女', '其他家庭成员', '其他'] },
            { key: 'respondentAddress', label: '被申请人住址', type: 'text', required: false, placeholder: '如知晓请填写' },
            { key: 'violenceDescription', label: '遭受暴力情况', type: 'textarea', required: true, placeholder: '请详细描述遭受家庭暴力的时间、地点、方式、造成的伤害等' },
            { key: 'evidenceDescription', label: '证据说明', type: 'textarea', required: false, placeholder: '如有报警记录、就医记录、照片等证据，请在此说明' },
            { key: 'courtName', label: '申请法院', type: 'text', required: false, placeholder: '例如：XX市XX区人民法院' },
            { key: 'applicationDate', label: '申请日期', type: 'date', required: true, placeholder: '' },
        ],
    },
    {
        id: 'admonishment-letter',
        name: '家庭暴力告诫书（申请模板）',
        icon: '📜',
        description: '向公安机关申请出具家庭暴力告诫书，作为遭受家暴的书面证据留存。',
        fields: [
            { key: 'applicantName', label: '申请人姓名', type: 'text', required: true, placeholder: '您的真实姓名' },
            { key: 'applicantIdNumber', label: '身份证号', type: 'text', required: true, placeholder: '18位身份证号码' },
            { key: 'applicantPhone', label: '联系电话', type: 'text', required: true, placeholder: '手机号码' },
            { key: 'respondentName', label: '施暴者姓名', type: 'text', required: true, placeholder: '施暴者真实姓名' },
            { key: 'respondentRelation', label: '与申请人关系', type: 'select', required: true, placeholder: '请选择', options: ['配偶', '前配偶', '同居者', '父母', '子女', '其他家庭成员', '其他'] },
            { key: 'incidentDate', label: '暴力发生日期', type: 'date', required: true, placeholder: '' },
            { key: 'incidentDescription', label: '暴力事件经过', type: 'textarea', required: true, placeholder: '请描述暴力发生的时间、地点、经过及造成的伤害' },
            { key: 'policeStation', label: '申请派出所', type: 'text', required: false, placeholder: '例如：XX派出所' },
            { key: 'applicationDate', label: '申请日期', type: 'date', required: true, placeholder: '' },
        ],
    },
    {
        id: 'police-report-aid',
        name: '报警笔录辅助模板',
        icon: '🚔',
        description: '帮助您提前整理报警时需要陈述的关键信息，让报案过程更加清晰有效。',
        fields: [
            { key: 'reporterName', label: '报案人姓名', type: 'text', required: true, placeholder: '您的真实姓名' },
            { key: 'reporterPhone', label: '联系电话', type: 'text', required: true, placeholder: '手机号码' },
            { key: 'reporterAddress', label: '家庭住址', type: 'text', required: true, placeholder: '现居住地址' },
            { key: 'suspectName', label: '施暴者姓名', type: 'text', required: true, placeholder: '施暴者真实姓名' },
            { key: 'suspectRelation', label: '与报案人关系', type: 'select', required: true, placeholder: '请选择', options: ['配偶', '前配偶', '同居者', '父母', '子女', '其他家庭成员', '其他'] },
            { key: 'incidentTime', label: '事件发生时间', type: 'text', required: true, placeholder: '例如：2026年3月28日晚上10点左右' },
            { key: 'incidentLocation', label: '事件发生地点', type: 'text', required: true, placeholder: '例如：家中卧室' },
            { key: 'incidentDetail', label: '事件详细经过', type: 'textarea', required: true, placeholder: '请尽可能详细描述事件经过：起因、施暴方式（打、踢、掐、推等）、持续时间、受伤部位等' },
            { key: 'injuries', label: '受伤情况', type: 'textarea', required: false, placeholder: '描述伤处位置和程度，是否就医、拍照等' },
            { key: 'witnesses', label: '是否有目击者', type: 'text', required: false, placeholder: '如邻居、孩子、亲属等' },
            { key: 'previousIncidents', label: '以往暴力经历', type: 'textarea', required: false, placeholder: '如有以往家暴经历请简要描述，包括是否报过警' },
        ],
    },
]
