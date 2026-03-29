export interface PsychResource {
    title: string
    description: string
    type: 'book' | 'article' | 'website' | 'guide'
    url: string
    tags: string[]
    author?: string
}

export interface PsychResourceCategory {
    id: string
    title: string
    description: string
    resources: PsychResource[]
}

export const psychResources: PsychResourceCategory[] = [
    {
        id: 'understanding-dv',
        title: '认识家庭暴力',
        description: '了解家暴的定义、形式与规律，识别你所经历的是否属于家暴。',
        resources: [
            {
                title: '什么是家庭暴力？',
                description: '中华全国妇女联合会关于家庭暴力定义、类型与法律认定的官方说明，含《反家庭暴力法》要点解读。',
                type: 'guide',
                url: 'https://www.women.org.cn/',
                tags: ['法律基础', '定义'],
                author: '全国妇联',
            },
            {
                title: '暴力循环理论',
                description: '莱诺·沃克（Lenore Walker）提出的「暴力循环」模型，帮助你理解暴力关系中常见的紧张积累 → 爆发 → 蜜月期循环。',
                type: 'article',
                url: '#',
                tags: ['关系规律', '理论'],
                author: 'Lenore Walker',
            },
            {
                title: '隐性控制的识别',
                description: '家暴不只是身体暴力。本文介绍情感操控、经济控制、孤立策略等隐性暴力行为，帮助识别非身体性伤害。',
                type: 'article',
                url: '#',
                tags: ['情感暴力', '识别'],
            },
        ],
    },
    {
        id: 'trauma-recovery',
        title: '创伤疗愈与心理健康',
        description: '理解创伤对心理与身体的影响，找到属于你的疗愈路径。',
        resources: [
            {
                title: '《身体从未忘记》（The Body Keeps the Score）',
                description: '世界顶级创伤专家 Bessel van der Kolk 的经典著作，解释创伤如何影响大脑与身体，以及多种实证疗愈方法。',
                type: 'book',
                url: 'https://book.douban.com/subject/26986763/',
                tags: ['创伤', '疗愈', '推荐'],
                author: 'Bessel van der Kolk',
            },
            {
                title: '《从创伤中复原》（Trauma and Recovery）',
                description: 'Judith Herman 的权威著作，专门讨论家庭暴力、性暴力等复杂创伤的恢复过程，是心理咨询领域的重要参考。',
                type: 'book',
                url: 'https://book.douban.com/subject/11528042/',
                tags: ['创伤', '复杂创伤', '推荐'],
                author: 'Judith Herman',
            },
            {
                title: '创伤后应激障碍（PTSD）的自我识别',
                description: '介绍创伤常见症状：闯入性回忆、噩梦、麻木、高度警觉等，说明何时需要寻求专业帮助，何时自我调节有效。',
                type: 'guide',
                url: '#',
                tags: ['PTSD', '自我识别'],
            },
            {
                title: '正念与身体疗愈练习',
                description: '面向创伤幸存者的正念冥想指导，强调温和与自我慈悲，避免可能再度触发创伤的传统冥想方式。',
                type: 'guide',
                url: '#',
                tags: ['正念', '身体', '练习'],
            },
        ],
    },
    {
        id: 'safety-planning',
        title: '安全规划与离开准备',
        description: '在考虑离开或保护自己时，提前规划可以大幅提升安全性。',
        resources: [
            {
                title: '安全计划：离开前你需要准备什么',
                description: '详细的安全计划指南：包括证据保存、重要文件备份、紧急联系人、财务独立、儿童保护等实操步骤。',
                type: 'guide',
                url: '#',
                tags: ['安全计划', '实操'],
            },
            {
                title: '数字安全：如何保护你的手机与网络隐私',
                description: '施暴者可能监控你的手机、位置和网络活动。本指南介绍如何检查设备隐患，保护数字安全。',
                type: 'guide',
                url: '#',
                tags: ['数字安全', '隐私'],
            },
            {
                title: '向施暴者提出分手的风险与策略',
                description: '离开关系时风险最高。本文介绍如何评估风险等级，以及在不同情境下降低风险的实用策略。',
                type: 'article',
                url: '#',
                tags: ['分离安全', '策略'],
            },
        ],
    },
    {
        id: 'children-parenting',
        title: '儿童保护与亲子关系',
        description: '家暴环境对儿童的影响，以及如何在困难环境中支持孩子。',
        resources: [
            {
                title: '家暴目睹儿童的心理影响',
                description: '研究表明，目睹家暴的儿童同样经历创伤。本文介绍影响机制，以及如何与孩子谈论家庭暴力。',
                type: 'article',
                url: '#',
                tags: ['儿童', '创伤'],
            },
            {
                title: '如何向孩子解释家庭暴力',
                description: '根据孩子年龄阶段，提供沟通话语建议，帮助孩子理解所发生的事，减少自责与混乱感。',
                type: 'guide',
                url: '#',
                tags: ['亲子沟通', '儿童'],
            },
        ],
    },
    {
        id: 'legal-knowledge',
        title: '法律知识与权利意识',
        description: '了解你在法律层面拥有的权利与保护。',
        resources: [
            {
                title: '《中华人民共和国反家庭暴力法》全文',
                description: '2016年施行的中国反家庭暴力专项立法，包括定义、人身安全保护令、强制报告义务等核心条款。',
                type: 'website',
                url: 'http://www.npc.gov.cn/npc/c30834/201603/f99a9f8a01d94546a64bf1a40e1b0ef6.shtml',
                tags: ['法律', '政策'],
                author: '全国人民代表大会',
            },
            {
                title: '人身安全保护令：申请流程详解',
                description: '谁可以申请？向哪个法院申请？需要哪些材料？生效后施暴者必须做什么？本文逐步解答。',
                type: 'guide',
                url: '#',
                tags: ['保护令', '法律', '实操'],
            },
            {
                title: '离婚诉讼中的家暴认定与权益保障',
                description: '家暴证据在离婚诉讼中的证明力、损害赔偿请求权、子女抚养权的裁量标准等核心法律问题。',
                type: 'article',
                url: '#',
                tags: ['离婚', '诉讼', '权益'],
            },
        ],
    },
    {
        id: 'support-communities',
        title: '支持社群与国际资源',
        description: '你不是孤单的。这些社群和平台提供同伴支持与专业资源。',
        resources: [
            {
                title: '白丝带项目（White Ribbon）',
                description: '由男性主导的反对性别暴力倡导项目，提供教育资源、公益活动与倡导工具。',
                type: 'website',
                url: 'https://www.whiteribbon.ca/',
                tags: ['倡导', '男性视角'],
            },
            {
                title: 'Pandora\'s Project（英文）',
                description: '为性暴力与家庭暴力幸存者提供同伴支持与资源的非营利网站，含论坛、文章与热线索引。',
                type: 'website',
                url: 'https://pandys.org/',
                tags: ['同伴支持', '英文'],
            },
            {
                title: '国际家庭暴力热线网络',
                description: '汇集全球各国反家暴组织与热线的目录，适合身处海外或有国际联系需求的使用者。',
                type: 'website',
                url: 'https://www.hotpeachpages.net/',
                tags: ['国际', '热线'],
            },
        ],
    },
]
