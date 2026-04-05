# 🌐 Vercel 压力测试 - 30秒快速指南

## ⚡ 最快方式

### 1️⃣ 用菜单工具 (最简单，推荐)

```bash
bash load-test/test-env-switcher.sh
```

**然后:**

1. 选择 "Vercel 环境"
2. 输入你的 Vercel URL (例如: `https://my-app.vercel.app`)
3. 选择要运行的测试
4. 自动保存你的 URL，下次免输入

### 2️⃣ 直接命令 (3 秒输入)

```bash
# 替换成你的 Vercel URL
TEST_BASE_URL=https://your-app.vercel.app npx ts-node load-test/playwright-ui-test.ts
```

### 3️⃣ 编辑脚本文件 (长期使用)

编辑 `load-test/run-on-vercel.sh`:

```bash
VERCEL_URL="https://your-app.vercel.app"  # ← 改这里
```

然后运行:

```bash
bash load-test/run-on-vercel.sh
```

---

## 📊 查看结果

```bash
npm run test:load:report
```

自动打开浏览器显示仪表板。

---

## 🔥 完整示例

假设你的 Vercel URL 是 `https://my-chatbot.vercel.app`:

```bash
# 1. 快速菜单方式（推荐首次）
bash load-test/test-env-switcher.sh

# 或者直接命令（日常使用）
TEST_BASE_URL=https://my-chatbot.vercel.app npx ts-node load-test/playwright-ui-test.ts

# 2. 查看结果
npm run test:load:report
```

**整个过程:** 1 分钟就能看到完整测试报告！

---

## 💡 三种工具对比

| 工具 | 优点 | 适用场景 |
|------|------|---------|
| **菜单工具** `test-env-switcher.sh` | 交互友好，自动保存 URL | 首次使用，切换环境 |
| **直接命令** | 最快，脚本友好 | 日常测试，CI/CD |
| **脚本文件** `run-on-vercel.sh` | 易于编辑，可长期保存 | 定期运行 |

---

## 📍找到你的 Vercel URL

访问: <https://vercel.com/dashboard>

1. 找你的项目
2. 复制 "Production URL"
3. 应该类似: `https://project-name.vercel.app`

---

## ✅ 成功标志

运行测试后看到:

```
✅ 成功: 10 / 10 (100%)
📊 页面加载时间:
   平均: 1500ms
💬 消息响应时间:
   平均: 4500ms
```

---

**需要详细文档？** 查看 [VERCEL-TESTING.md](VERCEL-TESTING.md)
