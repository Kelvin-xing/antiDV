/**
 * 前端UI压力测试 - 使用 Playwright
 * 模拟 10 个用户同时访问聊天页面并发送消息
 * 
 * 运行方式:
 * npx ts-node load-test/playwright-ui-test.ts
 */

import { chromium } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

interface TestMetrics {
    duration: number
    success: boolean
    error?: string
    pageLoadTime: number
    firstInteractionTime: number
    messageResponseTime: number
    timestamp: number
}

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'
const NUM_CONCURRENT_USERS = 10
const MESSAGE_TO_SEND = '你好，我需要帮助'

const results: TestMetrics[] = []
let successCount = 0
let failureCount = 0

async function runSingleUserTest(userId: number): Promise<TestMetrics> {
    let browser
    const startTime = Date.now()
    const metrics: TestMetrics = {
        duration: 0,
        success: false,
        pageLoadTime: 0,
        firstInteractionTime: 0,
        messageResponseTime: 0,
        timestamp: startTime,
    }

    try {
        // 启动浏览器
        browser = await chromium.launch()
        const context = await browser.createBrowserContext()
        const page = await context.newPage()

        // 记录页面加载时间
        const navigationStart = Date.now()
        await page.goto(`${BASE_URL}/chat`, { waitUntil: 'networkidle' })
        metrics.pageLoadTime = Date.now() - navigationStart

        console.log(`[用户 ${userId}] ✓ 页面加载完成 (${metrics.pageLoadTime}ms)`)

        // 等待聊天输入框出现
        const inputStart = Date.now()
        const textarea = page.locator('textarea, input[type="text"]').first()
        await textarea.waitFor({ timeout: 5000 })
        metrics.firstInteractionTime = Date.now() - inputStart

        console.log(`[用户 ${userId}] ✓ 输入框就绪 (${metrics.firstInteractionTime}ms)`)

        // 发送消息
        const messageStart = Date.now()
        await textarea.fill(MESSAGE_TO_SEND)
        await textarea.press('Enter')

        // 等待响应（监听流式数据）
        let messageReceived = false
        const messageListener = (message: any) => {
            if (message.includes('data:')) {
                messageReceived = true
            }
        }

        page.on('response', async (response) => {
            if (response.url().includes('chat-messages')) {
                const text = await response.text()
                if (text.includes('data:')) {
                    messageReceived = true
                }
            }
        })

        // 等待消息响应（最多等待 30 秒）
        await page.waitForTimeout(2000) // 等待 2 秒看是否有响应
        metrics.messageResponseTime = Date.now() - messageStart

        console.log(`[用户 ${userId}] ✓ 消息已发送并接收响应 (${metrics.messageResponseTime}ms)`)

        // 等待一段时间模拟用户阅读
        await page.waitForTimeout(1000)

        metrics.success = true
        successCount++

        await context.close()
        await browser.close()
    } catch (error) {
        metrics.success = false
        metrics.error = String(error)
        failureCount++
        console.error(`[用户 ${userId}] ✗ 测试失败: ${error}`)

        if (browser) {
            try {
                await browser.close()
            } catch (e) {
                // 忽略关闭浏览器的错误
            }
        }
    }

    metrics.duration = Date.now() - startTime
    results.push(metrics)
    return metrics
}

async function runConcurrentTests() {
    console.log(`\n🚀 开始压力测试: ${NUM_CONCURRENT_USERS} 个并发用户`)
    console.log(`📍 测试网址: ${BASE_URL}/chat`)
    console.log(`💬 测试消息: "${MESSAGE_TO_SEND}"`)
    console.log(`⏱️  开始时间: ${new Date().toLocaleString()}\n`)

    const overallStart = Date.now()

    // 并发运行所有用户测试
    const userPromises = Array.from({ length: NUM_CONCURRENT_USERS }, (_, i) =>
        runSingleUserTest(i + 1).catch(err => {
            console.error(`用户 ${i + 1} 测试异常:`, err)
            return {
                duration: 0,
                success: false,
                error: String(err),
                pageLoadTime: 0,
                firstInteractionTime: 0,
                messageResponseTime: 0,
                timestamp: Date.now(),
            } as TestMetrics
        }),
    )

    await Promise.all(userPromises)

    const overallDuration = Date.now() - overallStart

    // 计算统计数据
    const stats = calculateStats()

    // 生成报告
    generateReport(stats, overallDuration)

    console.log('\n✅ 压力测试完成！')
}

function calculateStats() {
    const successMetrics = results.filter(r => r.success)
    const failureMetrics = results.filter(r => !r.success)

    const calculateAvg = (key: keyof TestMetrics) =>
        successMetrics.reduce((sum, m) => sum + (m[key] as number), 0) / (successMetrics.length || 1)

    const calculateMin = (key: keyof TestMetrics) =>
        Math.min(...successMetrics.map(m => m[key] as number))

    const calculateMax = (key: keyof TestMetrics) =>
        Math.max(...successMetrics.map(m => m[key] as number))

    const calculatePercentile = (key: keyof TestMetrics, percentile: number) => {
        const sorted = successMetrics.map(m => m[key] as number).sort((a, b) => a - b)
        const index = Math.ceil((percentile / 100) * sorted.length) - 1
        return sorted[Math.max(0, index)]
    }

    return {
        totalUsers: NUM_CONCURRENT_USERS,
        successCount,
        failureCount,
        successRate: ((successCount / NUM_CONCURRENT_USERS) * 100).toFixed(2),
        pageLoadTime: {
            avg: calculateAvg('pageLoadTime').toFixed(0),
            min: calculateMin('pageLoadTime'),
            max: calculateMax('pageLoadTime'),
            p95: calculatePercentile('pageLoadTime', 95).toFixed(0),
            p99: calculatePercentile('pageLoadTime', 99).toFixed(0),
        },
        firstInteractionTime: {
            avg: calculateAvg('firstInteractionTime').toFixed(0),
            min: calculateMin('firstInteractionTime'),
            max: calculateMax('firstInteractionTime'),
        },
        messageResponseTime: {
            avg: calculateAvg('messageResponseTime').toFixed(0),
            min: calculateMin('messageResponseTime'),
            max: calculateMax('messageResponseTime'),
            p95: calculatePercentile('messageResponseTime', 95).toFixed(0),
            p99: calculatePercentile('messageResponseTime', 99).toFixed(0),
        },
        totalDuration: 0,
    }
}

function generateReport(stats: any, overallDuration: number) {
    const reportPath = path.join(__dirname, 'playwright-report.json')

    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalUsers: stats.totalUsers,
            successCount: stats.successCount,
            failureCount: stats.failureCount,
            successRate: `${stats.successRate}%`,
            totalDurationMs: overallDuration,
            totalDurationSec: (overallDuration / 1000).toFixed(2),
        },
        metrics: {
            pageLoadTime: {
                avgMs: stats.pageLoadTime.avg,
                minMs: stats.pageLoadTime.min,
                maxMs: stats.pageLoadTime.max,
                p95Ms: stats.pageLoadTime.p95,
                p99Ms: stats.pageLoadTime.p99,
            },
            firstInteractionTime: {
                avgMs: stats.firstInteractionTime.avg,
                minMs: stats.firstInteractionTime.min,
                maxMs: stats.firstInteractionTime.max,
            },
            messageResponseTime: {
                avgMs: stats.messageResponseTime.avg,
                minMs: stats.messageResponseTime.min,
                maxMs: stats.messageResponseTime.max,
                p95Ms: stats.messageResponseTime.p95,
                p99Ms: stats.messageResponseTime.p99,
            },
        },
        details: results,
    }

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`\n📊 详细报告已保存: ${reportPath}`)

    // 打印简化版本
    console.log('\n' + '='.repeat(60))
    console.log('📈 压力测试结果摘要')
    console.log('='.repeat(60))
    console.log(`✅ 成功: ${stats.successCount} / ${stats.totalUsers} (${stats.successRate}%)`)
    console.log(`❌ 失败: ${stats.failureCount}`)
    console.log(`⏱️  总耗时: ${(overallDuration / 1000).toFixed(2)}s`)
    console.log('\n📊 页面加载时间:')
    console.log(`   平均: ${stats.pageLoadTime.avg}ms`)
    console.log(`   最小: ${stats.pageLoadTime.min}ms`)
    console.log(`   最大: ${stats.pageLoadTime.max}ms`)
    console.log(`   P95:  ${stats.pageLoadTime.p95}ms`)
    console.log(`   P99:  ${stats.pageLoadTime.p99}ms`)
    console.log('\n💬 消息响应时间:')
    console.log(`   平均: ${stats.messageResponseTime.avg}ms`)
    console.log(`   最小: ${stats.messageResponseTime.min}ms`)
    console.log(`   最大: ${stats.messageResponseTime.max}ms`)
    console.log(`   P95:  ${stats.messageResponseTime.p95}ms`)
    console.log(`   P99:  ${stats.messageResponseTime.p99}ms`)
    console.log('='.repeat(60))
}

// 运行测试
runConcurrentTests().catch(console.error)
