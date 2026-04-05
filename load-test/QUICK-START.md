# 🎯 快速启动指南

30 秒快速开始压力测试！

## ⚡ 最快方式

### 步骤 1: 安装依赖 (1 分钟)

```bash
cd /Users/mingjiexing/Desktop/ADVchatbot/frontend

# 安装 Playwright
npm install -D @playwright/test playwright
npx playwright install

# 安装 k6 (可选)
# macOS:
brew install k6
```

### 步骤 2: 启动前端 (第一个终端)

```bash
npm run dev
# 等到看到: ✓ Ready in 2.5s
```

### 步骤 3: 运行 UI 测试 (第二个终端)

```bash
# 最简单的方式
npx ts-node load-test/playwright-ui-test.ts

# 或使用 npm 脚本
npm run test:load:ui
```

### 步骤 4: 查看结果 (第三个或浏览器)

```bash
# 打开可视化仪表板
npm run test:load:report

# 或手动打开
open load-test/dashboard.html
```

---

## 📱 完整流程 (3 分钟)

```bash
# 终端 1: 启动前端
cd /Users/mingjiexing/Desktop/ADVchatbot/frontend
npm run dev

# 等待后... (大约 5 秒看到 ✓ Ready)

# 终端 2: 运行 UI 测试
cd /Users/mingjiexing/Desktop/ADVchatbot/frontend
npm run test:load:ui

# 等待 30-60 秒...看到完成信息

# 终端 3: 运行 API 测试 (可选)
k6 run load-test/k6-api-test.js

# 查看结果
npm run test:load:report
```

---

## 🎨 使用菜单模式 (最简单)

```bash
bash load-test/run-tests.sh
```

然后按菜单提示操作。

---

## 📊 文件说明

| 文件 | 说明 | 何时查看 |
|------|------|----------|
| **playwright-report.json** | UI 测试详细数据 | 运行 UI 测试后 |
| **dashboard.html** | 可视化仪表板 | 随时可以打开 |
| **README.md** | 完整文档 | 需要详细信息时 |
| **k6-api-test.js** | API 压力测试脚本 | 需要测试后端 |

---

## ✅ 成功判断

### 看到这样的输出说明成功了 ✓

```
✅ 压力测试完成！

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

📊 详细报告已保存: /Users/mingjiexing/Desktop/ADVchatbot/frontend/load-test/playwright-report.json
```

---

## 🔧 常见问题

### ❌ "Cannot find module 'ts-node'"

```bash
npm install -D ts-node typescript
```

### ❌ "Cannot find module 'playwright'"

```bash
npm install -D @playwright/test playwright
npx playwright install
```

### ❌ "Connection refused"

确保前端在 <http://localhost:3000> 运行：

```bash
npm run dev
```

### ❌ "Playwright timeout"

前端应用加载缓慢，尝试：

1. 关闭其他程序
2. 增加超时时间（编辑 `playwright-ui-test.ts`）
3. 检查网络

---

## 💡 提示

- 🗂️ 所有测试文件位于 `load-test/` 目录
- 📊 报告会自动生成在 `load-test/playwright-report.json`
- 🎨 仪表板支持实时刷新
- 🔄 可以重复运行测试对比结果

---

## 📞 需要帮助?

查看完整文档：

```bash
cat load-test/README.md
```

或打开可视化仪表板了解更多详情。

---

**准备好了吗？现在就开始测试吧！🚀**
