#!/bin/bash

# 📊 直接使用 Vercel URL 的快速命令
# 将下面的 URL 替换为你的实际 Vercel URL

VERCEL_URL="https://anti-dv.vercel.app"  # ✏️ 改成你的 URL

echo "🚀 Vercel 压力测试"
echo "目标: $VERCEL_URL"
echo ""

# 方式 1: 运行 UI 测试
echo "1️⃣ 运行前端 UI 压力测试 (Playwright)"
echo "   TEST_BASE_URL=$VERCEL_URL npx ts-node load-test/playwright-ui-test.ts"
echo ""

# 方式 2: 运行 API 测试
echo "2️⃣ 运行后端 API 压力测试 (k6)"
echo "   BASE_URL=$VERCEL_URL/api k6 run load-test/k6-api-test.js"
echo ""

# 方式 3: 两个都运行
echo "3️⃣ 同时运行两个测试"
echo "   TEST_BASE_URL=$VERCEL_URL npx ts-node load-test/playwright-ui-test.ts & sleep 3 && BASE_URL=$VERCEL_URL/api k6 run load-test/k6-api-test.js"
echo ""

echo "提示: 修改脚本开头的 VERCEL_URL 为你的实际地址"
echo ""

# 自动执行选个选项（取消注释以运行）
# TEST_BASE_URL=$VERCEL_URL npx ts-node load-test/playwright-ui-test.ts
