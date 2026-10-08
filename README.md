# 小安前端

小安的 Next.js 前端，直接对接自建 Chatflow API，可部署到 Azure 等 Node.js 容器环境。
聊天使用原生 `/v1` 契约，不再使用 Dify SDK、应用 Key、提示词表单或工作流事件。

## 当前接入状态（2026-10-09）

聊天现已要求 Clerk 登录；普通用户可给自己的回答评分，admin 可查看对话与反馈。退出清除本地登录，保留服务端历史。角色、数据库迁移与环境配置见 [Clerk/反馈启用说明](docs/CLERK_FEEDBACK_SETUP.md)。本地尚未注入所需配置，真实 Clerk/数据库/HTTPS 浏览器联调待完成。

## 项目文档

- [模块职责、调用关系与数据流](docs/PROJECT_GUIDE.md)
- [可删除内容与依赖清理清单](docs/CLEANUP_CANDIDATES.md)
- [原生 API 迁移记录](docs/CHATFLOW_MIGRATION.md)

## 运行与配置

使用 Node.js 22。复制 `.env.example` 为 `.env.local`，配置：

- `BACKEND_API_URL`：小安后端的**源地址**，如 `http://127.0.0.1:8000`；不附加 `/v1`。
- `FRONTEND_ORIGIN`：此站点的完整源地址，如 `http://localhost:3000`。后端的 Origin allowlist 必须包含相同值。
- `BACKEND_API_KEY`：仅在自设 API 网关要求密钥时填写，保存在服务端。Pilot 游客模式依靠 Cookie，无需 Dify Key。
- `BACKEND_API_KEY_HEADER`：使用 `api-key`、`x-api-key` 或 `ocp-apim-subscription-key`；Authorization 保留给 Clerk 身份。

旧的 `NEXT_PUBLIC_APP_KEY`、`NEXT_PUBLIC_API_URL` 已不再使用，请从部署配置中移除。
`.env.local` 不提交到 Git；已有真实配置未被本次重构覆盖。

使用 `pnpm-lock.yaml` 统一依赖。已安装 Clerk/pg 并清理旧依赖；干净容器构建仍待验证。
已有依赖环境可运行 `npm run dev`；专项契约测试运行 `npm run test:chatflow`，定向类型检查运行 `npm run check:chatflow`。

## 聊天结构

```text
页面与聊天组件 → hooks/use-chatflow.ts → service/index.ts
                  同源 /v1/* → app/v1/[...path]/route.ts
                               → 服务端网关 → Azure Chatflow
```

- 浏览器只访问本站 `/v1/*`，不接触服务端密钥。
- 网关逐条转发 `xiaoan_guest`、`xiaoan_current`、`xiaoan_session` 的 Set-Cookie，保留 HttpOnly 与 `/v1` 路径。
- 刷新恢复当前会话，列表和消息历史按原生接口分页读取。切换历史会话不会修改后端 current Cookie；刷新回到后端当前会话。
- 消息发送 `{message, debug:false}`，默认模型由后端选择。
- 只有 SSE `completed` 才确认成功；错误、断流、超时、取消均移除未完成回复，保留独立错误和原消息。
- 失败后先刷新服务端记录再手动重试，不自动重复生成，也不自动转 JSON 再生成。
- 已接入 Clerk 登录、旧游客记录明确认领与退出；账号删除 UI 尚未实现。
- 附件、会话重命名仍未接入。评分使用受保护的 `/api/reviews`；旧 `/api` 聊天路由返回 410。
- 保留原有页面、品牌图、资源面板和成功聊天导出；导出库按需加载。

`/api/feedback` 已改为 admin 专用查询，普通用户提交走 `/api/reviews`。数据库在需要时连接，未配置时返回服务不可用。

## 部署与验收

运行时注入后端源地址和本站 Origin，并在后端同步配置允许来源。使用 HTTPS，保留 Cookie 和 SSE 无缓冲转发。
Next.js 已使用 `output: standalone`。现有 Dockerfile/锁文件需按 [迁移记录](docs/CHATFLOW_MIGRATION.md) 完成构建验收后部署。

真实 Azure 联调前，先运行专项测试，再用合成文本核验：创建 → Cookie → 流式完成 → 刷新恢复 → 删除；另外覆盖断流与错误分支。
本次本地测试不代表已部署或已验证 Azure 服务。

## 来源与许可

项目最初基于 `langgenius/webapp-conversation`，现在以小安业务和自建 API 独立维护。
原有 MIT 许可与版权声明保留在 `LICENSE`。Git upstream 仅是历史关联，不参与运行。
