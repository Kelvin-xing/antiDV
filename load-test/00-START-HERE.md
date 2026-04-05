# 📊 聊天机器人压力测试套件 - 完整指南

✅ **已完成创建！** 你现在拥有一个完整的压力测试系统。

---

## 🎯 你现在拥有什么?

### 📌 核心测试工具 (3 个)

| 工具 | 类型 | 用途 | 文件 |
|------|------|------|------|
| **Playwright** | 前端 UI 测试 | 模拟 10 个真实浏览器并发访问，测试页面加载和交互性能 | `playwright-ui-test.ts` |
| **k6** | API 压力测试 | 并发 API 调用（逐步增加到 10 个用户），持续 60 秒，测试后端吞吐量 | `k6-api-test.js` |
| **仪表板** | 可视化展示 | 多图表实时展示测试结果，直观易读 | `dashboard.html` |

### 📚 文档和脚本 (4 个)

| 文件 | 说明 |
|------|------|
| **QUICK-START.md** | 🚀 30 秒快速开始 (推荐新手) |
| **README.md** | 📖 完整详细文档 |
| **run-tests.sh** | 🎨 交互式菜单工具 |
| **package.json.snippet** | 📦 npm 脚本配置 |

---

## ⚡ 最快开始方式 (3 步，5 分钟)

### 1️⃣ 安装依赖 (1 分钟)

```bash
cd /Users/mingjiexing/Desktop/ADVchatbot/frontend

# 安装 Playwright (必需)
npm install -D @playwright/test playwright
npx playwright install

# 安装 k6 (可选，用于 API 测试)
# macOS: brew install k6
# Linux: apt-get install k6
# 或访问 https://k6.io/docs/getting-started/installation/
```

### 2️⃣ 启动前端 (第一个终端)

```bash
npm run dev
```

等待看到: ✓ Ready in 2.5s

### 3️⃣ 运行压力测试 (第二个终端)

```bash
# 最简单的方式
npx ts-node load-test/playwright-ui-test.ts

# 或使用菜单（推荐）
bash load-test/run-tests.sh

# 或使用 npm 脚本
npm run test:load:ui
```

---

## 📊 测试流程说明

### 前端 UI 测试 (`playwright-ui-test.ts`)

```
启动 10 个浏览器
    ↓
每个浏览器并发访问 http://localhost:3000/chat
    ↓
记录页面加载时间
    ↓
等待输入框出现
    ↓
发送测试消息: "你好，我需要帮助"
    ↓
等待并接收流式响应
    ↓
记录消息响应时间
    ↓
清理浏览器资源
    ↓
汇总统计数据 → 生成 JSON 报告
```

**耗时:** 约 30-60 秒  
**输出:** `load-test/playwright-report.json` (详细数据)

### 后端 API 测试 (`k6-api-test.js`)

```
模拟 10 个虚拟用户
    ↓
前 5 秒：逐步增加到 5 个用户
    ↓
中间 20 秒：增加到 10 个用户
    ↓
保持 30 秒：维持 10 个并发用户
    ↓
最后 5 秒：逐步降低到 0 个用户
    ↓
每个用户重复: 获取会话 → 发送消息 → 获取历史
    ↓
实时输出测试指标
```

**耗时:** 约 60 秒  
**指标:** 错误率、响应时间、吞吐量等

---

## 📈 查看测试结果

### 方式 1️⃣: 可视化仪表板 (推荐)

```bash
# 自动打开浏览器
npm run test:load:report

# 或手动打开
open load-test/dashboard.html
```

**仪表板展示:**

- ✅ 成功率卡片
- 📊 页面加载时间分布 (柱状图)
- ⚡ 消息响应时间分布 (柱状图)
- ✅ 成功/失败率 (饼图)
- 📈 时间分布 (折线图)
- 📋 详细数据表格 (用户级别)

### 方式 2️⃣: 命令行输出

UI 测试完成后直接在终端显示摘要：

```
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
```

### 方式 3️⃣: JSON 报告

```bash
# 查看完整数据
cat load-test/playwright-report.json | jq '.'

# 查看摘要
cat load-test/playwright-report.json | jq '.summary'

# 查看指标
cat load-test/playwright-report.json | jq '.metrics'

# 查看用户详情
cat load-test/playwright-report.json | jq '.details'
```

---

## 🎨 使用菜单工具 (最简单)

```bash
cd /Users/mingjiexing/Desktop/ADVchatbot/frontend
bash load-test/run-tests.sh
```

**菜单选项:**

```
================================
聊天机器人压力测试工具
================================

选择操作:
1) 检查依赖和环境
2) 运行前端 UI 压力测试
3) 运行后端 API 压力测试
4) 同时运行两种测试
5) 查看测试结果
6) 清除报告文件
7) 打开文档
8) 退出
```

---

## 📊 理解关键指标

| 指标 | 说明 | 理想值 | 范围 |
|------|------|--------|------|
| **成功率** | 成功的请求占比 | > 95% | 判断系统稳定性 |
| **页面加载时间** | 从出请求到页面完全加载 | < 2s | 用户体验 |
| **消息响应时间** | 发送消息到接收完整响应 | < 5s | 聊天流畅度 |
| **P95** | 95% 的请求在这个时间内完成 | < 5000ms | 大多数用户体验 |
| **P99** | 99% 的请求在这个时间内完成 | < 10000ms | 极端情况 |
| **吞吐量** | 每秒处理的请求数 | 越高越好 | 系统容量 |
| **错误率** | 失败请求的占比 | < 5% | 系统可靠性 |

### 性能评级

```
🟢 优秀 (绿色)
  ✓ 成功率 > 99%
  ✓ 页面加载 < 1.5s
  ✓ 消息响应 < 3s

🟡 良好 (黄色)
  ✓ 成功率 90-99%
  ✓ 页面加载 1.5-2.5s
  ✓ 消息响应 3-5s

🔴 需要优化 (红色)
  ✗ 成功率 < 90%
  ✗ 页面加载 > 2.5s
  ✗ 消息响应 > 5s
```

---

## 🔧 自定义测试

### 修改用户数量

**UI 测试:**
编辑 `load-test/playwright-ui-test.ts`

```typescript
const NUM_CONCURRENT_USERS = 10  // 改为 20, 50 等
```

**API 测试:**
编辑 `load-test/k6-api-test.js`

```javascript
export const options = {
  stages: [
    { duration: '5s', target: 5 },   // 改为你想要的并发数
    { duration: '20s', target: 50 },  
    // ...
  ],
}
```

### 修改测试消息

编辑 `load-test/playwright-ui-test.ts`

```typescript
const MESSAGE_TO_SEND = '你好，我需要帮助'  // 改为你的消息
```

### 修改超时限制

```typescript
// UI 测试超时（毫秒）
await textarea.waitFor({ timeout: 5000 })  // 5 秒

// API 测试超时
timeout: '120s'  // 120 秒流式响应超时
```

### 修改测试 URL

```bash
# 使用环境变量
TEST_BASE_URL=http://localhost:8080 npx ts-node load-test/playwright-ui-test.ts
BASE_URL=http://localhost:8080/api k6 run load-test/k6-api-test.js
```

---

## 🐛 故障排除

| 问题 | 解决方案 |
|------|---------|
| ❌ "Cannot find module 'playwright'" | `npm install -D @playwright/test playwright && npx playwright install` |
| ❌ "k6: command not found" | `brew install k6` (macOS) |
| ❌ "Connection refused" | 确保前端在运行: `npm run dev` |
| ❌ "Timeout waiting for textarea" | 前端加载缓慢，增加超时时间 |
| ❌ "Test hangs at message send" | 检查后端 API 是否正常 |
| ❌ "All tests failed" | 检查 <http://localhost:3000>  是否有错误 |

---

## 💡 最佳实践

### ✅ 推荐做法

1. **先检查依赖**

   ```bash
   npm install -D @playwright/test playwright
   npx playwright install
   ```

2. **运行前确认前端在线**

   ```bash
   curl http://localhost:3000
   ```

3. **从 UI 测试开始** (更直观)

   ```bash
   npm run test:load:ui
   ```

4. **查看实时报告**

   ```bash
   npm run test:load:report
   ```

5. **对比多次运行结果** (找性能峰值)

### ❌ 避免

- ❌ 不要在生产环境运行
- ❌ 不要忽视超时错误（可能表示后端有问题）  
- ❌ 不要只看平均值（要看 P95/P99）
- ❌ 不要在其他大型应用运行时测试

---

## 🚀 进阶用法

### 持续监控 (定时运行)

```bash
# 每小时运行一次测试
0 * * * * cd /Users/mingjiexing/Desktop/ADVchatbot/frontend && npm run test:load:ui >> /tmp/load-test.log 2>&1
```

### CI/CD 集成

```yaml
# 在 GitHub Actions 中运行
- name: Load Test
  run: npm run test:load:ui
```

### 生成 HTML 报告 (k6)

```bash
k6 run --out web load-test/k6-api-test.js
```

### Docker 运行

```bash
docker run -v $(pwd)/load-test:/scripts -i grafana/k6 run /scripts/k6-api-test.js
```

---

## 📚 文件清单

```
load-test/
├── 🎯 QUICK-START.md              ← 30秒快速开始
├── 📖 README.md                   ← 完整详细文档
├── 📝 本文件                       ← 你正在读的这个
│
├── 🧪 能立即使用的脚本:
│   ├── playwright-ui-test.ts       ← UI 压力测试 (Playwright)
│   ├── k6-api-test.js              ← API 压力测试 (k6)
│   └── run-tests.sh                ← 交互式菜单工具
│
├── 🎨 结果展示:
│   ├── dashboard.html              ← 可视化仪表板 (打开查看)
│   ├── playwright-report.json      ← UI 测试结果 (自动生成)
│   └── k6-results.json             ← API 测试结果 (自动生成)
│
└── ⚙️ 配置:
    └── package.json.snippet        ← npm 脚本配置
```

---

## 🎓 学习路径

### 🟢 第 1 步: 快速体验 (5 分钟)

1. 阅读 [QUICK-START.md](QUICK-START.md)
2. 运行 `npm run test:load:ui`
3. 打开 `npm run test:load:report`
4. 观察结果

### 🟡 第 2 步: 理解原理 (15 分钟)

1. 阅读本文档中的"测试流程说明"
2. 查看 [README.md](README.md) 中的"理解测试结果"
3. 对比多次运行结果

### 🔴 第 3 步: 自定义测试 (30 分钟)

1. 编辑 `playwright-ui-test.ts` 修改用户数
2. 修改测试消息
3. 尝试不同的并发场景
4. 分析性能瓶颈

### ⚫ 第 4 步: 深度优化 (1+ 小时)

1. 运行 API 测试 (`k6 run load-test/k6-api-test.js`)
2. 与后端开发沟通优化
3. 建立持续监控

---

## ❓ 常见问题

**Q: 测试会对真实系统造成伤害吗?**

A: 不会。只要前端应用和 API 都是本地或测试环境。**不要在生产环境上运行！**

**Q: 可以模拟更多用户吗?**

A: 可以！修改 `NUM_CONCURRENT_USERS` 或 k6 的 `target` 值。但电脑资源有限，建议先用 k6 测试纯 API。

**Q: 测试多久运行一次最好?**

A: 根据你的发布周期。推荐每个版本上线前运行一次。

**Q: 我需要 k6 吗?**

A: 不需要。Playwright UI 测试已经很完整。k6 是可选的 API 层更激进的测试。

**Q: 结果不稳定怎么办?**

A: 正常的。网络波动会影响结果。建议运行 3 次取平均值。

---

## 📞 获取帮助

1. **快速问题** → 查看 [QUICK-START.md](QUICK-START.md)
2. **详细问题** → 查看 [README.md](README.md)
3. **代码问题** → 阅读脚本中的注释
4. **菜单不懂** → 运行 `bash load-test/run-tests.sh`

---

## ✨ 接下来做什么?

### 现在可以

1. ✅ **立即测试**

   ```bash
   npx ts-node load-test/playwright-ui-test.ts
   ```

2. ✅ **使用菜单工具**

   ```bash
   bash load-test/run-tests.sh
   ```

3. ✅ **查看报告**

   ```bash
   npm run test:load:report
   ```

### 推荐操作

1. 🚀 运行一次测试，熟悉流程
2. 📊 打开仪表板，理解指标
3. 🔧 修改参数，尝试不同场景
4. 📈 收集多次结果，找出性能瓶颈
5. 🎯 与后端团队分享结果，讨论优化

---

## 📝 更新日志

**v1.0 (2026-04-03)**

- ✅ 完成 Playwright UI 测试
- ✅ 完成 k6 API 测试
- ✅ 创建可视化仪表板
- ✅ 编写完整文档
- ✅ 创建菜单工具

---

**🎉 现在你已经拥有一个专业级的压力测试工具！**

准备好了吗？现在就开始测试 → `npm run test:load:ui`

---

*最后更新: 2026-04-03 16:00*  
*文件位置: /Users/mingjiexing/Desktop/ADVchatbot/frontend/load-test/*
