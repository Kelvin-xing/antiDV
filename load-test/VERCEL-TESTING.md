# 🌐 在 Vercel 上运行压力测试

## ✅ 你可以完全不需要本地前端

直接通过 Vercel URL 进行测试。这样测试的是真实部署的生产环境。

---

## ⚡ 最快开始 (3 步)

### 第 1 步: 修改你的 Vercel URL

找到你的 Vercel 部署 URL，格式通常是:

- `https://your-app.vercel.app`
- `https://custom-domain.com`

### 第 2 步: 运行测试

```bash
# 替换 YOUR_VERCEL_URL 为你的实际地址
TEST_BASE_URL=https://your-app.vercel.app npx ts-node load-test/playwright-ui-test.ts
```

### 第 3 步: 查看结果

```bash
# 自动打开仪表板
npm run test:load:report

# 或手动打开
open load-test/dashboard.html
```

---

## 🎯 三种使用方式

### 方式 1️⃣: 环境变量直接指定 (最简单)

```bash
# UI 测试
TEST_BASE_URL=https://your-app.vercel.app npx ts-node load-test/playwright-ui-test.ts

# API 测试
BASE_URL=https://your-app.vercel.app/api k6 run load-test/k6-api-test.js

# 两个都运行
TEST_BASE_URL=https://your-app.vercel.app npx ts-node load-test/playwright-ui-test.ts &
sleep 3
BASE_URL=https://your-app.vercel.app/api k6 run load-test/k6-api-test.js
```

### 方式 2️⃣: 使用环境切换工具 (推荐)

```bash
bash load-test/test-env-switcher.sh
```

然后按菜单选择 Vercel 环境，工具会自动保存你的 URL。

### 方式 3️⃣: 编辑快速启动脚本

编辑 `load-test/run-on-vercel.sh`:

```bash
VERCEL_URL="https://your-app.vercel.app"  # ← 改成你的 URL
```

然后运行:

```bash
bash load-test/run-on-vercel.sh
```

---

## 📊 命令参考

| 场景 | 命令 |
|------|------|
| **UI 测试** | `TEST_BASE_URL=https://your-app.vercel.app npx ts-node load-test/playwright-ui-test.ts` |
| **API 测试** | `BASE_URL=https://your-app.vercel.app/api k6 run load-test/k6-api-test.js` |
| **查看报告** | `npm run test:load:report` |
| **使用菜单工具** | `bash load-test/test-env-switcher.sh` |
| **自定义脚本** | `bash load-test/run-on-vercel.sh` |

---

## ✨ 优势

### 💚 为什么直接用 Vercel URL？

1. **测试真实环境** - 测试的就是用户访问的网址
2. **无需本地部署** - 省去启动前端服务的步骤
3. **更接近生产** - 包含 CDN、地理位置等真实因素
4. **蕴涵网络延迟** - 测试真实的网络条件
5. **验证部署质量** - 直接检验 Vercel 部署的性能

---

## 🔍 验证步骤

### 1. 确认 Vercel URL 可访问

```bash
# 测试 URL 是否工作
curl https://your-app.vercel.app

# 应该返回 HTML（不会超时）
```

### 2. 验证环境变量正确

在运行测试前，打印环境变量验证：

```bash
# 检查 Playwright 会使用的 URL
echo "TEST_BASE_URL: $TEST_BASE_URL"
TEST_BASE_URL=https://your-app.vercel.app npx ts-node -e "console.log(process.env.TEST_BASE_URL)"

# 检查 k6 会使用的 URL
echo "BASE_URL: $BASE_URL"
BASE_URL=https://your-app.vercel.app/api echo $BASE_URL
```

---

## 🔧 完整示例

假设你的 Vercel URL 是: `https://anti-dv.vercel.app`

### 完整命令

```bash
# 1. UI 性能测试 (模拟 10 个用户)
TEST_BASE_URL=https://anti-dv.vercel.app npx ts-node load-test/playwright-ui-test.ts

# 2. API 压力测试 (并发增加到 10 个)
BASE_URL=https://anti-dv.vercel.app/api k6 run load-test/k6-api-test.js

# 3. 查看结果仪表板
npm run test:load:report
```

### 预期输出

```
🚀 开始压力测试: 10 个并发用户
📍 测试网址: https://anti-dv.vercel.app/chat
💬 测试消息: "你好，我需要帮助"

[用户 1] ✓ 页面加载完成 (1234ms)
[用户 2] ✓ 页面加载完成 (1156ms)
...

✅ 成功: 10 / 10 (100%)
❌ 失败: 0
⏱️  总耗时: 45.23s
```

---

## 🎯 不同场景的使用

### 场景 1: 快速验证部署

```bash
# 检查部署后的应用是否正常
TEST_BASE_URL=https://your-app.vercel.app npx ts-node load-test/playwright-ui-test.ts
```

### 场景 2: 性能基准测试

```bash
# 记录基准性能（用于对比）
TEST_BASE_URL=https://your-app.vercel.app npx ts-node load-test/playwright-ui-test.ts
# 保存 load-test/playwright-report.json 到某处
```

### 场景 3: 前后对比

```bash
# 优化前
TEST_BASE_URL=https://your-app.vercel.app npx ts-node load-test/playwright-ui-test.ts
# 保存结果

# 优化后 (再次运行)
TEST_BASE_URL=https://your-app.vercel.app npx ts-node load-test/playwright-ui-test.ts
# 对比两份报告
```

### 场景 4: 持续监控

```bash
# 定时运行（每小时）
0 * * * * cd /path/to/frontend && TEST_BASE_URL=https://your-app.vercel.app npx ts-node load-test/playwright-ui-test.ts 2>&1 >> /tmp/load-test.log
```

---

## ⚠️ 注意事项

### 1. CORS 问题

如果遇到 CORS 错误，确保 API 配置允许跨域请求。检查 `NEXT_PUBLIC_API_URL`:

```bash
cat .env.local | grep NEXT_PUBLIC_API_URL
```

应该类似:

```
NEXT_PUBLIC_API_URL=https://api.dify.ai/v1
```

### 2. API 认证

确保 `.env.local` 中的 API Key 正确：

```bash
cat .env.local
```

应该包含:

```
NEXT_PUBLIC_APP_ID=...
NEXT_PUBLIC_APP_KEY=...
NEXT_PUBLIC_API_URL=...
```

### 3. 超时问题

如果测试超时，可能是网络延迟。增加超时时间：

编辑 `load-test/playwright-ui-test.ts`:

```typescript
await textarea.waitFor({ timeout: 10000 })  // 从 5000 增加到 10000ms
```

### 4. 流式响应等待

Vercel 可能增加额外延迟，消息响应时间会比本地长，这是正常的。

---

## 📈 解读结果

### 与本地对比

本地 vs Vercel 的差异：

| 指标 | 本地 | Vercel | 原因 |
|------|------|--------|------|
| 页面加载 | 500-1000ms | 1000-2000ms | CDN 延迟 |
| 消息响应 | 2000-3000ms | 3000-5000ms | API 网络延迟 |
| 成功率 | 99-100% | 95-99% | 网络不稳定 |

### 每析性能

```
🟢 优秀
  ✓ Vercel 页面加载 < 2s
  ✓ 消息响应 < 5s
  ✓ 成功率 > 95%

🟡 良好
  - Vercel 页面加载 2-3s
  - 消息响应 5-7s
  - 成功率 90-95%

🔴 需优化
  ✗ Vercel 页面加载 > 3s
  ✗ 消息响应 > 10s
  ✗ 成功率 < 90%
```

---

## 🚀 下一步

1. **获取你的 Vercel URL**
   - 访问 <https://vercel.com/dashboard>
   - 找到你的项目
   - 复制 Production URL

2. **运行第一次测试**

   ```bash
   TEST_BASE_URL=https://your-app.vercel.app npx ts-node load-test/playwright-ui-test.ts
   ```

3. **查看结果**

   ```bash
   npm run test:load:report
   ```

4. **保存基准数据**
   - 复制 `load-test/playwright-report.json`
   - 作为性能基准参考

---

## 🆘 出现问题?

| 问题 | 检查事项 |
|------|----------|
| **连接被拒绝** | URL 是否正确？应用是否部署成功？ |
| **超时** | Vercel 应用是否响应正常？网络是否稳定？ |
| **环境变量未生效** | 确保命令中 `TEST_BASE_URL=` 正确 |
| **报告未生成** | 检查终端是否有错误信息 |

## 📞 更多帮助

- 查看完整文档: `cat load-test/README.md`
- 打开仪表板: `npm run test:load:report`
- 使用菜单工具: `bash load-test/test-env-switcher.sh`

---

**现在就开始在 Vercel 上运行压力测试吧！** 🚀
