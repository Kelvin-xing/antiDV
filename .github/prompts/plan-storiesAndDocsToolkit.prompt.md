# Plan: 故事分享 + 文档工具库 新分页

## TL;DR
在主页 Hero 区的"开始倾诉"按钮旁增加两个平行入口按钮："受害者故事" 和 "文档工具库"，分别链接到 `/stories` 和 `/docs-toolkit` 两个新页面。故事页展示卡片列表→详情页；文档工具页展示模板列表→填写表单→生成可下载 PDF/DOCX。先用占位符数据，模板内容后续上传替换。

---

## Steps

### Phase 1: 路由与页面骨架

1. **创建 `/app/stories/page.tsx`** — 故事列表页  
   - 故事卡片 grid（占位 4-6 个故事）  
   - 每张卡片：头像占位 + 化名 + 一句话简介  
   - 点击跳转 `/stories/[id]`

2. **创建 `/app/stories/[id]/page.tsx`** — 故事详情页  
   - 显示完整人物故事  
   - 返回按钮回到列表  
   - 从占位数据源读取

3. **创建 `/app/docs-toolkit/page.tsx`** — 文档工具库列表页  
   - 文档模板卡片 grid（人身保护令、家庭暴力告诫书 等占位）  
   - 每张卡片：图标 + 模板名称 + 简要说明  
   - 点击跳转 `/docs-toolkit/[templateId]`

4. **创建 `/app/docs-toolkit/[templateId]/page.tsx`** — 模板填写+生成页  
   - 动态表单（姓名、身份证号、地址等字段，由模板配置驱动）  
   - "生成文档" 按钮 → 调用 API 生成 PDF/DOCX  
   - 生成后提供下载链接

5. **创建 `/app/api/generate-doc/route.ts`** — 文档生成 API  
   - POST 接收模板 ID + 用户填写的字段  
   - 使用 docx 库（`docx` npm 包）组装文档，或读取 .docx 模板替换占位符  
   - 返回文件流供前端下载  
   - 占位：先返回简单测试文档

### Phase 2: 主页入口

6a. **修改 `/app/page.tsx` Hero 区** — 在"开始倾诉"下方增加并排按钮  
   - "受害者故事 📖" → `/stories`  
   - "文档工具库 📋" → `/docs-toolkit`  
   - 样式：次级按钮（白底边框 #E8A87C），与主按钮视觉层级区分  

6b. **修改 `/app/page.tsx` Features 模块** — 在 `features` 数组追加两项  
   - `{ icon: '📖', title: '受害者故事', desc: '...幸存者真实经历...', link: '/stories' }`  
   - `{ icon: '📝', title: '文档工具库', desc: '...法律文书模板...', link: '/docs-toolkit' }`  
   - feature 卡片支持可选 `link`：有 link 时包裹 `<Link>` 可点击跳转  
   - Grid 从 4 项变 6 项（桌面 3×2 自动适配）  

### Phase 3: 占位数据

7. **创建 `/app/stories/data.ts`** — 故事占位数据  
   - 数组 of `{ id, name, summary, avatar, fullStory }`  
   - 4-6 个化名人物 + 一句话简介 + 2-3 段详细故事

8. **创建 `/app/docs-toolkit/templates.ts`** — 模板元数据占位  
   - 数组 of `{ id, name, icon, description, fields: FormField[] }`  
   - 每个 field: `{ key, label, type, required, placeholder }`  
   - 占位 3 个模板：人身保护令、家庭暴力告誡書、报警笔录辅助

### Phase 4: 安装依赖 + 文档生成

9. **安装 `docx` npm 包** — 用于在 API route 中生成 .docx 文件  
   *parallel with step 10*

10. **实现 `/app/api/generate-doc/route.ts`** — 模板渲染逻辑  
    - 占位mode：根据 templateId 读取模板配置 → 将用户数据填入 → 输出 .docx blob  
    - 后续可替换为真实 .docx 模板文件

---

## Relevant Files

**新建：**
- `app/stories/page.tsx` — 故事列表页
- `app/stories/[id]/page.tsx` — 故事详情页
- `app/stories/data.ts` — 占位故事数据
- `app/docs-toolkit/page.tsx` — 文档工具库列表页
- `app/docs-toolkit/[templateId]/page.tsx` — 模板填写生成页
- `app/docs-toolkit/templates.ts` — 模板元数据
- `app/api/generate-doc/route.ts` — 文档生成 API

**修改：**
- `app/page.tsx` — Hero 区增加两个入口按钮 + Features 模块追加两项
- `package.json` — 新增 `docx` 依赖

---

## Verification

1. 访问首页 → 能看到"开始倾诉"旁边有"受害者故事"和"文档工具库"两个按钮
2. "小安能为你做什么" grid 显示 6 张卡片，新两张可点击跳转
3. 点击"受害者故事" → 进入 `/stories`，显示卡片列表
4. 点击任一故事卡片 → 进入详情 `/stories/xxx`，返回按钮可回列表
5. 点击"文档工具库" → 进入 `/docs-toolkit`，显示模板卡片
6. 点击模板 → 进入表单页，填写信息后点"生成文档" → 成功下载 .docx 文件
7. 手机端两个按钮正常换行显示，不溢出

## Decisions

- **路由结构**: `/stories` + `/stories/[id]` 和 `/docs-toolkit` + `/docs-toolkit/[templateId]` — 清晰的资源型 URL
- **故事数据存储**: 硬编码在 `data.ts` 中（不需要 CMS/数据库，内容相对静态）
- **文档生成**: 服务端 API route 生成，使用 `docx` npm 包，避免前端处理复杂文档格式
- **PDF 不在初版**: 初版只做 .docx 输出（`docx` 包轻量），PDF 可后续通过 LibreOffice CLI 或 pdfmake 添加
- **占位优先**: 模板内容、故事内容全部占位，等用户后续上传真实内容后替换 `data.ts` 和 `templates.ts`
- **不包含**: 用户评论/互动功能、故事提交功能、模板在线编辑功能
