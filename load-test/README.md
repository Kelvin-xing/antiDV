# 🚀 聊天机器人压力测试套件

完整的负载测试解决方案，用于模拟 10 个并发用户，测试前端 UI 性能和后端 API 性能。

## 📋 目录结构

```
load-test/
├── playwright-ui-test.ts      # 前端 UI 性能测试（Playwright）
├── k6-api-test.js             # 后端 API 压力测试（k6）
├── dashboard.html             # 可视化仪表板
├── playwright-report.json     # UI 测试结果（运行后生成）
├── k6-results.json            # API 测试结果（运行后生成）
└── README.md                   # 本文件
```

---

## 🛠️ 安装依赖

### 前置要求

- Node.js >= 18
- npm 或 pnpm
- 前端应用正在 <http://localhost:3000> 运行

### 1️⃣ 安装 Playwright（UI 测试）

```bash
npm install -D @playwright/test playwright
# 或
pnpm add -D @playwright/test playwright
```

### 2️⃣ 安装 k6（API 测试）

**macOS:**

```bash
brew install k6
```

**Linux:**

```bash
apt-get update && apt-get install -y k6
```

**Windows:**

```bash
choco install k6
```

或访问 <https://k6.io/docs/getting-started/installation/>

---

## 🎯 快速开始

### 方式 1: 只测试前端 UI（推荐新手）

```bash
# 1. 启动前端应用
cd /Users/mingjiexing/Desktop/ADVchatbot/frontend
npm run dev

# 2. 在另一个终端运行 UI 测试
npx ts-node load-test/playwright-ui-test.ts
```

**预期输出:**

```
🚀 开始压力测试: 10 个并发用户
📍 测试网址: http://localhost:3000/chat
💬 测试消息: "你好，我需要帮助"
⏱️  开始时间: 2026-04-03 10:30:45

[用户 1] ✓ 页面加载完成 (1234ms)
[用户 2] ✓ 页面加载完成 (1156ms)
...
✅ 成功: 10 / 10 (100%)
❌ 失败: 0
⏱️  总耗时: 45.23s
```

生成文件: `load-test/playwright-report.json`

### 方式 2: 测试后端 API（更激进的压力测试）

```bash
# 在前端应用运行的状态下，运行 k6 测试
k6 run load-test/k6-api-test.js

# 或指定自定义参数
k6 run -e BASE_URL=http://localhost:3000/api -e USER_HASH=test-user load-test/k6-api-test.js
```

**预期输出:**

```
          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

  execution: local
  script: load-test/k6-api-test.js
  output: -

scenarios:
  default: 
    executor: ramping-vus
    stages:
      { duration: '5s', target: 5 }
      { duration: '20s', target: 10 }
      { duration: '30s', target: 10 }
      { duration: '5s', target: 0 }

     ✓ 消息发送成功
     ✓ 获取会话成功
     ✓ 有流式响应
     ✗ 消息发送失败

...
  Sending 10 requests...
  Completed 10: 1 success, 0 failed, 0 pending
```

### 方式 3: 完整测试流程（同时测试 UI 和 API）

```bash
# 终端 1: 启动前端
cd /Users/mingjiexing/Desktop/ADVchatbot/frontend
npm run dev

# 终端 2: 运行 UI 测试
npx ts-node load-test/playwright-ui-test.ts

# 终端 3: 运行 API 测试
k6 run load-test/k6-api-test.js

# 所有测试完成后，打开仪表板查看结果
open load-test/dashboard.html
# 或在浏览器中打开: file:///Users/mingjiexing/Desktop/ADVchatbot/frontend/load-test/dashboard.html
```

---

## 📊 查看结果

### 方法 1: 命令行输出

UI 测试完成后直接在终端显示摘要：

```
============================================================
📈 压力测试结果摘要
============================================================
✅ 成功: 10 / 10 (100%)
❌ 失败: 0
⏱️  总耗时: 45.23s

📊 页面加载时间:
   平均: 1245ms
   最小: 980ms
   最大: 1890ms
   P95:  1794ms
   P99:  1880ms

💬 消息响应时间:
   平均: 3456ms
   最小: 2100ms
   最大: 5678ms
   P95:  5234ms
   P99:  5600ms
============================================================
```

### 方法 2: 可视化仪表板

```bash
# 打开 HTML 仪表板
open load-test/dashboard.html
```

或在浏览器中打开本地文件：

```
file:///Users/mingjiexing/Desktop/ADVchatbot/frontend/load-test/dashboard.html
```

**仪表板功能:**

- ✅ 显示成功率卡片
- 📈 页面加载时间分布图
- ⚡ 消息响应时间分布图
- ✅ 成功/失败率饼图
- 📊 时间戳分布直方图
- 📋 详细数据表格

### 方法 3: JSON 报告文件

```bash
# 查看 UI 测试结果
cat load-test/playwright-report.json | jq

# 查看指定指标
cat load-test/playwright-report.json | jq '.metrics.pageLoadTime'
```

或用编辑器打开查看。

---

## 🎨 自定义测试

### 修改并发用户数

**UI 测试:** 编辑 `playwright-ui-test.ts`

```typescript
const NUM_CONCURRENT_USERS = 10  // 改为你想要的数字，如 20, 50
```

**API 测试:** 编辑 `k6-api-test.js`

```javascript
export const options = {
  stages: [
    { duration: '5s', target: 5 },   // 改为你想要的数字
    { duration: '20s', target: 50 },  
    { duration: '30s', target: 50 },
    { duration: '5s', target: 0 },
  ],
}
```

### 修改测试消息

**UI 测试:** 编辑 `playwright-ui-test.ts`

```typescript
const MESSAGE_TO_SEND = '你好，我需要帮助'  // 改为你的测试消息
```

### 修改超时时间

**UI 测试:** 编辑 `playwright-ui-test.ts`

```typescript
await textarea.waitFor({ timeout: 5000 })  // 5 秒超时
await page.waitForTimeout(2000)             // 等待 2 秒
```

### 修改目标 URL

**UI 测试:** 编辑 `playwright-ui-test.ts`

```typescript
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'
```

**API 测试:** 编辑 `k6-api-test.js`

```javascript
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000/api'
```

运行时指定：

```bash
TEST_BASE_URL=http://localhost:8080 npx ts-node load-test/playwright-ui-test.ts
k6 run -e BASE_URL=http://localhost:8080/api load-test/k6-api-test.js
```

---

## 📈 理解测试结果

### 关键指标说明

| 指标 | 说明 | 理想值 |
|------|------|--------|
| **成功率** | 成功的请求占比 | > 95% |
| **页面加载时间** | 从发起请求到页面完全加载的时间 | < 2000ms |
| **消息响应时间** | 发送消息到接收完整响应的时间 | < 5000ms |
| **P95** | 95% 的请求的响应时间 | < 5000ms |
| **P99** | 99% 的请求的响应时间 | < 10000ms |

### 性能等级

- 🟢 **绿色** (优秀)
  - 成功率 > 99%
  - 页面加载 < 1500ms
  - 消息响应 < 3000ms
  
- 🟡 **黄色** (良好)
  - 成功率 90-99%
  - 页面加载 1500-2500ms
  - 消息响应 3000-5000ms
  
- 🔴 **红色** (需优化)
  - 成功率 < 90%
  - 页面加载 > 2500ms
  - 消息响应 > 5000ms

---

## 🔧 故障排除

### 问题 1: "Cannot find module 'playwright'"

**解决方案:**

```bash
npm install -D @playwright/test playwright
npx playwright install
```

### 问题 2: "k6: command not found"

**解决方案:**

```bash
# macOS
brew install k6

# 或者验证安装
which k6
```

### 问题 3: 连接被拒绝

**检查清单:**

```bash
# 1. 确运前端应用在运行
curl http://localhost:3000

# 2. 检查端口是否正确
netstat -an | grep 3000

# 3. 如需自定义 URL
TEST_BASE_URL=http://localhost:8080 npx ts-node load-test/playwright-ui-test.ts
```

### 问题 4: Playwright 浏览器启动失败

**解决方案:**

```bash
# 重新安装浏览器
npx playwright install --with-deps

# 或在 M1/M2 Mac 上
npx playwright install --with-deps chromium
```

### 问题 5: 测试运行缓慢

- 减少并发用户数
- 检查网络连接
- 检查后端 API 是否有性能问题
- 查看浏览器控制台是否有错误

---

## 🚀 进阶用法

### 生成 HTML 报告（k6）

安装 k6 扩展：

```bash
k6 run --out web load-test/k6-api-test.js
```

### Docker 运行

```bash
# 使用 Docker 运行 k6
docker run -i grafana/k6 run --vus 10 --duration 30s - < load-test/k6-api-test.js

# 本地挂载文件
docker run -v /Users/mingjiexing/Desktop/ADVchatbot/frontend/load-test:/scripts -i grafana/k6 run /scripts/k6-api-test.js
```

### 持续监控

创建 cron 任务定期运行测试：

```bash
# 每小时运行一次测试
0 * * * * cd /Users/mingjiexing/Desktop/ADVchatbot/frontend && npx ts-node load-test/playwright-ui-test.ts >> /tmp/load-test.log 2>&1
```

### 与 CI/CD 集成

在 GitHub Actions 中运行测试：

```yaml
name: Load Test
on: [push]
jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run dev &
      - run: npx ts-node load-test/playwright-ui-test.ts
```

---

## 📞 常见问题

**Q: 可以同时运行 UI 和 API 测试吗？**

A: 可以！在不同的终端中分别运行，它们独立工作。

**Q: 如何测试特定的用户交互流程？**

A: 编辑 `playwright-ui-test.ts` 的 `runSingleUserTest` 函数，添加更多步骤。

**Q: 支持 HTTPS 吗？**

A: 完全支持，修改 BASE_URL 即可。

**Q: 如何测试预部署环境？**

A: 使用环境变量指定 URL：

```bash
TEST_BASE_URL=https://staging.example.com npx ts-node load-test/playwright-ui-test.ts
```

---

## 📚 相关资源

- [Playwright 官方文档](https://playwright.dev)
- [k6 官方文档](https://k6.io/docs)
- [性能测试最佳实践](https://web.dev/performance)

---

## 📝 许可证

MIT License - 自由使用和修改

---

**最后更新:** 2026-04-03
