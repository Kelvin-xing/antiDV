# 小安前端：原生 API 迁移记录

> **2026-10-09 更新：** 下文保留为迁移/审查快照。95 个遗留源码/样式及旧 Monaco 资源已按批准清单清理；反馈保留并迁到 Clerk user/admin 权限，评分写入原生会话库，快速退出清 Cookie、保留历史。当前实现与配置以 [Clerk/反馈启用说明](./CLERK_FEEDBACK_SETUP.md) 为准。

2026-10-08。本次将聊天运行链路改为小安自建 API，保留已有品牌与 Figma 界面修改。

## 契约依据

本地 `xiaoan/tech/chatflow/poc/API.md`，并核对 `tech/login/account_server.py` 与
`account_storage.py` 的账号模式接口。文档中的 Azure Pilot 使用 PostgreSQL 会话和 HttpOnly Cookie。
未把旧 `xiaoan_session` 单会话内存模式当作 Pilot 的完整功能。

## 已完成

| 原实现 | 当前实现 |
| --- | --- |
| Dify ChatClient 与浏览器公开 App Key | 原生 fetch、服务端 BACKEND_API_URL / 可选网关密钥 |
| `/api/chat-messages` + inputs/query/user | 同源 `/v1/conversations/{id}/responses/stream` + message/debug:false |
| 本地识别码作为用户标识 | 后端 xiaoan_guest / xiaoan_current Cookie；不再展示跨设备识别码入口 |
| 约 880 行页面控制器混合模板状态、工作流、网络 | 约 180 行布局控制器 + use-chatflow 状态 hook + 原生 service |
| agent_thought、workflow/node 回调 | start/delta/debug/completed/error 状态校验 |
| EOF 当作成功、失败后可能残留半截回答 | completed 才成功；移除未完成轮次，先恢复再手动重试 |
| 删除接口失败仍清空 UI | 仅删除成功或已不存在的会话移出列表，失败保留并提示 |
| 初始消息页固定 20 条 | 账号模式 next_offset / next_after 分页读取 |
| 聊天首屏导入 xlsx、工作流/Monaco、上传器 | xlsx 按需加载，聊天不再引用工作流和上传器 |
| Dify 页面标题与页脚链接 | 小安标题与版权配置 |
| Docker 使用不存在的 yarn 锁和未创建的运行用户 | 固定 pnpm、冻结锁、先创建非 root 用户、排除 .env 与本地副本 |

旧聊天 API 文件保留为明确的 410 响应，避免旧调用悄悄返回假成功。
旧 Dify SDK 已从清单和锁文件中移除；本地 node_modules 没有重装。

## 业务取舍

- 当前接入游客模式。Clerk 登录、认领游客记录、账号设置/注销仍待独立实现。
- 后端没有附件、会话改名、单条删除或评分 API，关闭对应旧聊天入口。
- 不再把每个流式片段自动镜像到独立 `/api/feedback` 数据库。该管理模块仍保留原文件；若继续使用，应另定已完成轮次与身份的接入契约。
- 现有历史数据不会自动从 Dify 迁入 Azure；两者的身份和记录存储不同。
- 历史会话标题暂用短 ID，不假设后端有标题生成接口。
- 切换历史会话按 ID 读取；后端 GET 不更新 current Cookie，刷新恢复后端 current 指向的会话。
- 不自动降级到 JSON 重复生成；本轮结果不明时先恢复记录，用户决定是否重试。
- `safety_level` 保留在完成记录中，debug 不进入气泡或导出。

## 可以继续精简的文件

以下目前已离开聊天运行链路，保留在磁盘上供后续审查；本次未做文件删除：

- `app/components/workflow/`、`public/vs/`（约 12 MB）及 Monaco 依赖。
- `app/components/config-scence/`、`app/components/welcome/`、提示词变量相关工具。
- `hooks/use-conversation.ts`、`hooks/use-user-hash.ts`、`app/components/user-hash/`。
- 旧上传组件与 `service/base.ts`，旧 `/api` 聊天兼容路由。

下一轮可按全项目引用图确认后成组删除；本项目 AGENTS.md 要求删除文件前确认。
许可证和来源记录继续保留。Git upstream 不影响运行，本次未修改远端、分支或提交。

## 仍需处理的工程问题

1. `next.config.js` 仍继承忽略 TypeScript/ESLint 构建错误的配置，应在全量基线修复后关闭。
2. 旧联系表单默认管理员口令和 `/tmp` 文件存储不适合作为独立多副本服务的数据层；需另行修正。
3. `package-lock.json` 原本被忽略且与项目清单存在历史差异，后续统一使用已跟清单核对的 pnpm 锁。
4. Azure 后端必须允许此新前端的精确 Origin。代理保留原始 Origin，不绕过后端检查。
5. 原 `.env.local` 未覆盖。切换前要配置 BACKEND_API_URL / FRONTEND_ORIGIN，并移除旧公开 Key。

## 验证与边界

- `node --test tests/chatflow.test.cjs`：专项 SSE、HTTP、Cookie/Origin、分页与代理测试，全部使用合成数据和本地 mock。
- `npm run check:chatflow`：以变更的聊天入口、hook、service、网关为根的 TypeScript noEmit 检查，包含其传递依赖。
- 变更核心代码的 ESLint 与 diff whitespace 检查。
- manifest 与 pnpm importer 的依赖版本一致性检查。
- 没有安装依赖、执行完整构建/E2E 套件、运行 Docker build、部署或发送线上生成请求。

上线验收应覆盖 HTTPS Cookie、后端 Origin allowlist、真实 SSE 无缓冲、会话刷新/分页、删除、失败恢复及移动端交互。
完整构建与 E2E 需按项目 AGENTS.md 取得确认后运行。
