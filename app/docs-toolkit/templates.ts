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
        description: '向人民法院申请人身安全保护令，禁止施暴者继续实施暴力、骚扰、跟踪等行为。可向申请人或被申请人居住地、家庭暴力发生地的基层人民法院申请。',
        fields: [
            { key: 'applicantName', label: '申请人姓名', type: 'text', required: true, placeholder: '您的真实姓名' },
            { key: 'applicantGender', label: '申请人性别', type: 'select', required: true, placeholder: '请选择', options: ['女', '男'] },
            { key: 'applicantEthnicity', label: '申请人民族', type: 'text', required: true, placeholder: '例如：汉族' },
            { key: 'applicantBirthDate', label: '申请人出生日期', type: 'date', required: true, placeholder: '' },
            { key: 'applicantIdNumber', label: '申请人身份证号', type: 'text', required: true, placeholder: '18位身份证号码' },
            { key: 'applicantAddress', label: '申请人住址', type: 'text', required: true, placeholder: '现居住地址' },
            { key: 'respondentName', label: '被申请人姓名', type: 'text', required: true, placeholder: '被申请人（加害人）真实姓名' },
            { key: 'respondentGender', label: '被申请人性别', type: 'select', required: true, placeholder: '请选择', options: ['男', '女'] },
            { key: 'respondentEthnicity', label: '被申请人民族', type: 'text', required: true, placeholder: '例如：汉族' },
            { key: 'respondentBirthDate', label: '被申请人出生日期', type: 'date', required: false, placeholder: '' },
            { key: 'respondentIdNumber', label: '被申请人身份证号', type: 'text', required: false, placeholder: '如知晓请填写' },
            { key: 'respondentAddress', label: '被申请人住址', type: 'text', required: false, placeholder: '如知晓请填写' },
            { key: 'otherMeasures', label: '其他保护措施（选填）', type: 'textarea', required: false, placeholder: '如有其他认为有利于保护受害人、停止暴力的措施，可在此列出' },
            { key: 'factsAndReasons', label: '事实与理由', type: 'textarea', required: true, placeholder: '请详细描述遭受家庭暴力的事实经过，包括认识经过、暴力行为的具体表现（身体暴力、言语暴力、经济控制等）、造成的伤害等。申请理由可以是遭受家庭暴力，也可以是存在家暴的现实危险。' },
            { key: 'courtName', label: '申请法院', type: 'text', required: true, placeholder: '例如：XX市XX区人民法院' },
            { key: 'applicationDate', label: '申请日期', type: 'date', required: true, placeholder: '' },
        ],
    },
    {
        id: 'admonishment-letter',
        name: '家庭暴力告诫书',
        icon: '📜',
        description: '家庭暴力告诫书模版，由公安机关出具。填写被告诫人信息和家暴记录后可生成标准格式文档，便于了解告诫书内容或提前准备材料。',
        fields: [
            { key: 'caseNumber', label: '告诫书文号', type: 'text', required: false, placeholder: '例如：公（ ）告诫字[2026]XX号' },
            { key: 'respondentName', label: '被告诫人姓名', type: 'text', required: true, placeholder: '施暴者真实姓名' },
            { key: 'respondentGender', label: '被告诫人性别', type: 'select', required: true, placeholder: '请选择', options: ['男', '女'] },
            { key: 'respondentAge', label: '被告诫人年龄', type: 'text', required: false, placeholder: '例如：35' },
            { key: 'respondentBirthDate', label: '被告诫人出生日期', type: 'date', required: false, placeholder: '' },
            { key: 'respondentIdType', label: '身份证件种类', type: 'text', required: false, placeholder: '例如：居民身份证' },
            { key: 'respondentIdNumber', label: '身份证件号码', type: 'text', required: false, placeholder: '18位身份证号码' },
            { key: 'respondentHukou', label: '户籍所在地', type: 'text', required: false, placeholder: '户籍地址' },
            { key: 'respondentAddress', label: '现住址', type: 'text', required: false, placeholder: '当前居住地址' },
            { key: 'respondentWorkplace', label: '工作单位', type: 'text', required: false, placeholder: '如知晓请填写' },
            { key: 'violenceRecord', label: '实施家庭暴力记录', type: 'textarea', required: true, placeholder: '请详细记录家庭暴力行为的时间、地点、方式、经过等' },
            { key: 'evidence', label: '证据', type: 'textarea', required: false, placeholder: '如有报警记录、伤情照片、医院诊断书、证人证言等证据，请在此说明' },
            { key: 'policeOrgan', label: '公安机关名称', type: 'text', required: false, placeholder: '例如：XX市公安局XX分局' },
            { key: 'issueDate', label: '出具日期', type: 'date', required: false, placeholder: '' },
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
