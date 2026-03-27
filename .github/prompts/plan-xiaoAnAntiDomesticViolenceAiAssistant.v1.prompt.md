# Plan: 「小安」反家暴 AI 助手前端搭建

## TL;DR
基於已 fork 的 webapp-conversation 模板，分 5 個階段逐步改造為「小安」反家暴 AI 助手。用戶零基礎但有 Dify 憑證，優先跑通對話功能，再逐步美化和擴展。

---

## Phase 0: 環境準備（跑起來）
> 目標：本地運行項目，確認 Dify 對話能正常工作

1. **安裝 pnpm**（項目使用 pnpm 而非 npm）
   - 終端運行 `npm install -g pnpm`
2. **安裝依賴**
   - 進入項目目錄 `cd /Users/mingjiexing/Desktop/ADVchatbot/frontend`
   - 運行 `pnpm install`
3. **創建 `.env.local` 文件**（從 `.env.example` 複製，填入 Dify 憑證）
   - `NEXT_PUBLIC_APP_ID=你的APP_ID`
   - `NEXT_PUBLIC_APP_KEY=你的API_KEY`
   - `NEXT_PUBLIC_API_URL=你的API地址`
4. **修改 `config/index.ts` 基礎配置**
   - `title` → `'小安'`
   - `default_language` → `'zh-Hans'`（但注意目前 i18n 文件命名是 `app.zh.ts` 不是 `app.zh-Hans.ts`，需確認 i18n 配置中的語言代碼映射）
5. **啟動開發服務器**: `pnpm dev`
6. **驗證**: 瀏覽器打開 `http://localhost:3000`，發送消息確認 Dify 連接正常

**學習要點**: 環境變量、pnpm vs npm、Next.js 開發服務器

---

## Phase 1: 基礎中文化與品牌設置
> 目標：把界面改成中文，加上「小安」品牌標識

7. **修改 `config/index.ts`**
   - `APP_INFO.title` → `'小安 - 反家暴AI助手'`
   - `APP_INFO.description` → `'你不是一個人，小安在這裡陪你'`
   - `APP_INFO.copyright` → `'小安'`
8. **確認 i18n 語言配置**
   - 檢查 `i18n/i18next-config.ts` 中的語言代碼，確認 `zh` 或 `zh-Hans` 正確映射
   - 現有文件 `i18n/lang/app.zh.ts` 和 `common.zh.ts` 已有中文翻譯
9. **修改歡迎文案** — 在 Dify 後台設置 `opening_statement`（開場白），這會自動顯示在聊天界面

**學習要點**: Next.js 配置、i18n 國際化基礎概念

---

## Phase 2: 暖色調樣式改造
> 目標：將冷色調藍灰界面改為溫暖、有安全感的暖色調

10. **修改 `tailwind.config.js` 色彩系統**
    - 替換 `primary` 色系：藍色 → 暖金/珊瑚橘
    - 替換 `gray` 色系：冷灰 → 暖灰 (#4A4238 等)
    - 新增自定義色：`warm`、`safe`、`coral` 等語義化顏色
11. **修改 `app/styles/globals.css` 全局樣式**
    - 替換 CSS 變量為暖色
    - 添加 Google Fonts 引入（思源宋體 + 思源黑體）
12. **修改 `app/layout.tsx`** — 引入字體、設置背景色為米白 (#FBF8F4)
13. **修改 `app/components/header.tsx`** — 暖色背景、品牌名稱「小安」、圓角化
14. **修改 `app/components/sidebar/index.tsx`** — 暖色側邊欄、選中項暖色高亮
15. **修改 `app/components/chat/` 相關樣式** — 消息氣泡圓角化、暖色調
    - `answer/` — AI 回答氣泡改為暖沙色背景
    - `question/` — 用戶問題氣泡改為珊瑚橘
    - `style.module.css` — 輸入框圓角化

**學習要點**: Tailwind CSS 配置、CSS 變量、組件樣式修改、Google Fonts

---

## Phase 3: 安全功能 —「快速離開」按鈕
> 目標：加入反家暴網站必備的安全功能

16. **新建 `app/components/quick-exit/index.tsx`** — 快速離開按鈕組件
    - 固定在頁面右上角
    - 點擊後跳轉到百度首頁（window.location.replace，不留歷史記錄）
    - 同時清除當前頁面的 sessionStorage/localStorage
    - 鍵盤快捷鍵 ESC 觸發
17. **在 `app/layout.tsx` 中全局引入** — 確保每個頁面都有此按鈕
18. **添加安全聲明文案** — 在歡迎界面展示隱私保護承諾

**學習要點**: React 組件創建、事件處理、window API、鍵盤事件監聽

---

## Phase 4: 首頁 Landing Page
> 目標：創建獨立引導頁面，讓用戶了解「小安」後再進入對話

19. **調整路由結構**
    - 當前 `app/page.tsx` 直接渲染聊天組件
    - 改為：`app/page.tsx` → 首頁 Landing | `app/chat/page.tsx` → 對話頁面
    - 需要將現有 `app/page.tsx` 的 `<Main>` 移到 `app/chat/page.tsx`
20. **開發首頁各區塊**（可在 `app/components/landing/` 下）
    - Hero 區域：品牌名 + 標語 + CTA 按鈕
    - 功能介紹卡片（3-4 張，圓角+暖色）
    - 安全聲明區域
    - FAQ 折疊面板
    - 底部：緊急求助電話 + 版權
21. **移動端適配** — 確保首頁在手機上也能正常顯示

**學習要點**: Next.js App Router 路由系統、頁面佈局、響應式設計

---

## Phase 5: 部署上線
> 目標：讓網站上線可訪問（不需要自購域名）

### 首選：Vercel（最簡單，專為 Next.js 優化）
22. **Push 代碼到 GitHub**
23. **Vercel 導入項目** — 連接 GitHub 倉庫，零配置自動識別 Next.js
24. **設置環境變量** — 在 Vercel Dashboard 中配置 `NEXT_PUBLIC_APP_ID`、`NEXT_PUBLIC_APP_KEY`、`NEXT_PUBLIC_API_URL`
25. **部署並驗證** — 訪問分配的 `your-app.vercel.app` 域名，測試對話功能

### 備選：Hugging Face Spaces（項目已有 Dockerfile，可直接使用）
- 部署地址格式：`username-spacename.hf.space`
- 需要在 HF Spaces 設置中添加相同的三個環境變量
- 注意：HF 默認端口為 7860，需在 `Dockerfile` 中確認 `EXPOSE 7860` 或添加 `PORT=7860` 環境變量
- 適合 AI 社群曝光，但免費版冷啟動較慢（30-60 秒）

### 其他備選：Render / Railway
- 均支持 Docker，免費方案提供 `*.onrender.com` / `*.railway.app` 域名

> **自購域名是可選的後期升級，不是必須的。**

**學習要點**: Git 基礎、Vercel 部署流程、環境變量管理、Docker 基礎概念

---

## 關鍵文件清單

### 需修改的文件
- `config/index.ts` — 品牌名稱、語言、配置
- `tailwind.config.js` — 色彩系統替換
- `app/styles/globals.css` — 全局樣式、CSS 變量、字體
- `app/layout.tsx` — 字體引入、背景色、引入快速離開組件
- `app/page.tsx` — 路由調整（Phase 4 時改為首頁）
- `app/components/header.tsx` — 品牌標識、暖色化
- `app/components/sidebar/index.tsx` — 暖色側邊欄
- `app/components/chat/index.tsx` — 聊天界面樣式參考
- `app/components/chat/style.module.css` — 輸入框樣式
- `app/components/chat/answer/` — AI 回答氣泡
- `app/components/chat/question/` — 用戶問題氣泡
- `app/components/welcome/index.tsx` — 歡迎頁面文案（引用 `AppInfoComp`、`ChatBtn` 等子組件）
- `app/components/welcome/massive-component.tsx` — 歡迎頁面核心子組件
- `i18n/lang/app.zh.ts` — 應用中文翻譯

### 需新建的文件
- `.env.local` — 環境變量（Dify 憑證）
- `app/components/quick-exit/index.tsx` — 快速離開按鈕
- `app/chat/page.tsx` — 對話頁面（Phase 4 路由調整後）
- `app/components/landing/hero.tsx` — 首頁 Hero 區域
- `app/components/landing/features.tsx` — 功能介紹卡片
- `app/components/landing/safety.tsx` — 安全聲明
- `app/components/landing/faq.tsx` — FAQ 折疊面板
- `app/components/landing/footer.tsx` — 底部區域

---

## 驗證步驟

1. **Phase 0 驗證**: `pnpm dev` 啟動 → 打開 localhost:3000 → 發送消息 → Dify 正常回復（流式）
2. **Phase 1 驗證**: 頁面標題顯示「小安」、界面文字為中文
3. **Phase 2 驗證**: 主色調為暖色、消息氣泡圓角且暖色、字體為思源系列
4. **Phase 3 驗證**: 快速離開按鈕點擊 → 跳轉百度 → 瀏覽器歷史不留記錄；ESC 鍵同樣觸發
5. **Phase 4 驗證**: 首頁正常顯示各區塊 → 點擊 CTA 進入對話頁 → 對話功能仍正常
6. **Phase 5 驗證**: 部署地址可訪問、對話功能正常、移動端適配

---

## 決策記錄

- 品牌名稱：「小安」
- 優先級：先跑通對話功能 → 再美化 → 再做首頁
- 用戶級別：零基礎，每步需詳細解釋概念
- Dify 憑證：已準備好
- 項目使用 pnpm（非 npm），Next.js 15 + React 19 + Tailwind CSS 3
- 現有中文翻譯文件為 `app.zh.ts`（非 `zh-Hans`），需確認 i18n 語言代碼映射
- 部署：不需要自購域名；首選 Vercel，備選 HF Spaces（已有 Dockerfile）、Render、Railway
