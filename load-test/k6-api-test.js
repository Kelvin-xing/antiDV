/**
 * 后端API压力测试 - 使用 k6
 * 模拟 10 个并发用户不断发送聊天消息
 * 
 * 运行方式:
 * k6 run load-test/k6-api-test.js
 * 
 * 或者用 Docker:
 * docker run -i grafana/k6 run --vus 10 --duration 30s - < load-test/k6-api-test.js
 */

import http from 'k6/http'
import { check, group, sleep } from 'k6'
import { Rate, Trend, Counter, Gauge } from 'k6/metrics'

// ============ 自定义指标 ============
const errorRate = new Rate('errors')
const chatMessageDuration = new Trend('chat_message_duration')
const conversationDuration = new Trend('conversation_duration')
const messagesDuration = new Trend('messages_duration')
const activeUsers = new Gauge('active_users')
const totalRequests = new Counter('total_requests')

// ============ 配置 ============
export const options = {
    stages: [
        { duration: '5s', target: 5 },   // 5秒内缓慢增加到5个用户
        { duration: '20s', target: 10 },  // 20秒内增加到10个用户
        { duration: '30s', target: 10 },  // 保持10个用户30秒
        { duration: '5s', target: 0 },    // 5秒内逐步降低到0
    ],
    thresholds: {
        'errors': ['rate<0.1'],           // 错误率 < 10%
        'chat_message_duration': ['p(95)<5000', 'p(99)<10000'],  // 95% 请求在 5 秒内完成
        'http_req_duration': ['p(95)<3000'],
    },
    ext: {
        loadimpact: {
            projectID: 0,
            name: '聊天机器人压力测试',
        },
    },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000/api'
const USER_HASH = __ENV.USER_HASH || 'test-user-hash'

// 模拟用户数据
const testMessages = [
    '你好，我需要帮助',
    '我想了解更多信息',
    '这怎么操作？',
    '请给我一些建议',
    '谢谢你的帮助',
]

let conversationId = null

/**
 * 第1步: 获取或创建会话
 */
function setupConversation() {
    return group('获取会话列表', () => {
        const params = {
            headers: {
                'Content-Type': 'application/json',
                'X-User-Hash': USER_HASH,
            },
        }

        const res = http.get(`${BASE_URL}/conversations?limit=10&first_id=`, params)
        const result =
            check(res, {
                '获取会话成功': r => r.status === 200,
                '返回数据有效': r => r.json('data') !== null,
            }) || false

        if (!result) {
            errorRate.add(1)
        } else {
            errorRate.add(0)
        }

        totalRequests.add(1)
        return res
    })
}

/**
 * 第2步: 发送聊天消息（流式响应）
 */
function sendMessage(message) {
    return group(`发送消息: "${message.substring(0, 20)}"`, () => {
        const payload = {
            message: message,
            conversation_id: conversationId || '',
        }

        const params = {
            headers: {
                'Content-Type': 'application/json',
                'X-User-Hash': USER_HASH,
            },
            timeout: '15s', // 流式响应超时
        }

        const startTime = Date.now()
        const res = http.post(`${BASE_URL}/chat-messages`, JSON.stringify(payload), params)
        const duration = Date.now() - startTime

        const result =
            check(res, {
                '消息发送成功': r => r.status === 200 || r.status === 201,
                '有流式响应': r => r.body.includes('data:') || r.body.includes('event'),
            }) || false

        if (!result) {
            errorRate.add(1)
            console.error(`消息发送失败 (${res.status}): ${res.body.substring(0, 100)}`)
        } else {
            errorRate.add(0)
        }

        chatMessageDuration.add(duration)
        totalRequests.add(1)

        // 记录响应内容片段
        if (res.body) {
            const lines = res.body.split('\n')
            for (const line of lines) {
                if (line.startsWith('data:')) {
                    try {
                        const data = JSON.parse(line.substring(5))
                        if (data.id && !conversationId) {
                            conversationId = data.conversation_id
                        }
                    } catch (e) {
                        // 忽略解析错误
                    }
                }
            }
        }

        return res
    })
}

/**
 * 第3步: 获取消息历史
 */
function fetchMessageHistory() {
    return group('获取消息历史', () => {
        const params = {
            headers: {
                'X-User-Hash': USER_HASH,
            },
        }

        const res = http.get(
            `${BASE_URL}/messages?conversation_id=${conversationId || ''}&limit=20&last_id=`,
            params,
        )

        const result =
            check(res, {
                '获取消息成功': r => r.status === 200,
            }) || false

        if (!result) {
            errorRate.add(1)
        } else {
            errorRate.add(0)
        }

        messagesDuration.add(res.timings.duration)
        totalRequests.add(1)
        return res
    })
}

/**
 * 主测试逻辑
 */
export default function () {
    activeUsers.add(__VU)

    // 步骤1: 获取会话
    setupConversation()
    sleep(1)

    // 步骤2: 发送消息（重复多次）
    const messageIndex = Math.floor(Math.random() * testMessages.length)
    sendMessage(testMessages[messageIndex])
    sleep(2)

    // 步骤3: 获取消息历史
    fetchMessageHistory()
    sleep(1)
}

/**
 * 设置和清理
 */
export function setup() {
    console.log('🚀 开始API压力测试...')
    return {}
}

export function teardown() {
    console.log('✅ API压力测试完成！')
}
