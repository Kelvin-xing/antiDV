/**
 * XiaoAn FastAPI load smoke test.
 *
 * Run against the same-origin Next.js route:
 *   k6 run load-test/k6-api-test.js
 *
 * Or directly against FastAPI:
 *   BASE_URL=http://127.0.0.1:8000/v1 k6 run load-test/k6-api-test.js
 */
/* global __ENV */

import http from 'k6/http'
import { check, group, sleep } from 'k6'
import { Counter, Rate, Trend } from 'k6/metrics'

const errorRate = new Rate('errors')
const chatMessageDuration = new Trend('chat_message_duration')
const totalRequests = new Counter('total_requests')

export const options = {
  stages: [
    { duration: '5s', target: 5 },
    { duration: '20s', target: 10 },
    { duration: '30s', target: 10 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    errors: ['rate<0.1'],
    chat_message_duration: ['p(95)<10000', 'p(99)<15000'],
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000/v1'
const testMessages = [
  '你好，我需要帮助',
  '我不确定这算不算家暴',
  '我该如何收集证据？',
]

let conversationId = null

function record(result) {
  errorRate.add(result ? 0 : 1)
  totalRequests.add(1)
}

function createConversation() {
  group('创建匿名会话', () => {
    const response = http.post(`${BASE_URL}/conversations`)
    const result = check(response, {
      '会话创建成功': r => r.status === 201,
      '返回会话 ID': r => typeof r.json('conversation_id') === 'string',
    })
    record(result)
    if (result) {
      conversationId = response.json('conversation_id')
    }
  })
}

function sendMessage(message) {
  group('发送聊天消息', () => {
    const response = http.post(
      `${BASE_URL}/conversations/${conversationId}/responses`,
      JSON.stringify({ message }),
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: '20s',
      },
    )
    const result = check(response, {
      消息发送成功: r => r.status === 200,
      返回完整回答: r => typeof r.json('answer') === 'string',
    })
    record(result)
    chatMessageDuration.add(response.timings.duration)
  })
}

function restoreCurrentConversation() {
  group('恢复当前会话', () => {
    const response = http.get(`${BASE_URL}/conversations/current`)
    const result = check(response, {
      '当前会话恢复成功': r => r.status === 200,
      '会话 ID 一致': r => r.json('conversation_id') === conversationId,
    })
    record(result)
  })
}

export default function () {
  if (!conversationId) {
    createConversation()
  }

  sendMessage(testMessages[Math.floor(Math.random() * testMessages.length)])
  restoreCurrentConversation()
  sleep(1)
}
