# Plan: 反家暴AI助手前端頁面設計

## TL;DR
基於 Dify webapp-conversation 開源模板 fork 改造，打造一個溫暖、安全、有親和力的反家暴AI助手網站。採用 Next.js + Tailwind CSS 技術棧，包含引導式首頁 + AI對話頁面，參照 sophia.chat 的安全設計模式（快速離開按鈕、安全聲明等），部署到 Vercel。

## 背景信息
- **用戶技術水平**: 前端初學者（基本HTML/CSS）
- **語言**: 簡體中文（中國大陸）
- **部署**: Vercel（免費方案）
- **素材**: 從零開始，無現有品牌素材
- **Dify**: 尚未決定雲端/自架
- **參考**: sophia.chat（反家暴AI助手標杆）

## 設計方向

### 色彩系統（溫暖 + 安全感）
- **主色**: 暖沙色/奶茶色 (#F5E6D3) — 溫暖不刺激
- **輔色**: 柔和珊瑚橘 (#E8A87C) — 親和力
- **安全色**: 溫暖綠 (#7CB9A8) — 希望、安全感
- **文字色**: 深暖灰 (#4A4238) — 非純黑，減少壓迫感
- **背景**: 米白 (#FBF8F4) — 柔和舒適
- **強調**: 暖金 (#D4A574) — 用於按鈕和重要元素

### 字體
- **標題**: 思源宋體 (Noto Serif SC) — 溫暖有人文氣息
- **正文**: 思源黑體 (Noto Sans SC) — 清晰易讀
- **備選**: 霞鶩文楷 (LXGW WenKai) — 手寫感更親切

### 設計原則
- 圓角 > 直角（降低攻擊性）
- 大量留白（呼吸感）
- 插畫 > 攝影圖（避免觸發創傷記憶）
- 柔和陰影和漸變
- 動畫輕緩（避免突然彈出）

---

## 頁面架構

### Phase 1: 核心頁面（MVP）

#### 1.1 首頁 (Landing Page)
- **安全橫幅**: 頂部固定「快速離開」按鈕（必備安全功能，點擊跳轉百度/天氣等無害網站）
- **Hero 區域**: 品牌名稱 + 溫暖標語 + 「開始對話」CTA按鈕
- **功能介紹**: 3-4張卡片介紹AI助手能做什麼（了解你的處境/探索你的選擇/獲取資源幫助）
- **安全聲明**: 隱私保護、匿名、不留痕跡等承諾
- **統計數據**: 服務影響力數字（後期填充）
- **FAQ 折疊面板**: 常見問題
- **底部**: 緊急求助電話 + 版權信息

#### 1.2 AI對話頁面 (Chat Page)
- 基於 webapp-conversation 改造的聊天界面
- 自定義歡迎語和引導提示
- 保留「快速離開」按鈕
- 對話側邊欄（歷史記錄）
- 適配移動端

### Phase 2: 擴展頁面（後期）

#### 2.1 倖存者故事頁 (Survivor Stories)
- 卡片式故事列表
- 故事詳情頁（匿名化處理）
- 真人圖書館板塊

#### 2.2 資源中心 (Resources)
- 視頻內容嵌入
- Q&A知識庫
- 求助機構目錄

---

## 技術方案

### 架構: Fork webapp-conversation + 擴展

```
推薦理由:
- 已有完整的 Dify 對話功能
- Next.js + Tailwind 技術棧成熟
- 只需新增首頁 + 修改樣式
- 適合初學者: 改造比從零建好
```

### 關鍵步驟

**Phase 0: 準備工作**

1. 在 Dify 上創建對話型應用，調試好 prompt 和知識庫
2. 獲取 APP_ID、API_KEY、API_URL 三個憑證
3. 準備品牌名稱和基礎文案

**Phase 1: 項目搭建** (*依賴 Phase 0*)

4. Fork https://github.com/langgenius/webapp-conversation 到自己的 GitHub
5. 克隆到本地，安裝依賴 (`npm install`)
6. 配置 `.env.local` 填入 Dify 憑證
7. 本地運行驗證 (`npm run dev`)

**Phase 2: 樣式改造** (*依賴 Phase 1*)

8. 修改 `tailwind.config.js` — 替換色彩系統為暖色調配色
9. 修改 `app/styles/globals.css` — 添加全局字體和基礎樣式
10. 修改聊天組件樣式 — 圓角化、暖色化消息氣泡
11. 修改 `app/components/header/` — 自定義頭部，加入品牌和快速離開按鈕
12. 修改 `app/components/welcome/` — 自定義歡迎頁面文案和視覺

**Phase 3: 首頁開發** (*可與 Phase 2 並行*)

13. 新建 `app/home/page.tsx` — 首頁路由
14. 開發 Hero 區域組件
15. 開發功能介紹卡片組件
16. 開發安全聲明區域
17. 開發 FAQ 折疊面板
18. 開發底部區域（緊急電話 + 版權）
19. 添加「快速離開」全局按鈕組件

**Phase 4: 國際化與文案** (*依賴 Phase 2, 3*)

20. 修改 `i18n/lang/` 下的中文翻譯文件
21. 確認 `config/index.ts` 默認語言設為 `zh-Hans`

**Phase 5: 部署** (*依賴 Phase 4*)

22. Push 代碼到 GitHub
23. 在 Vercel 導入項目
24. 設置環境變量
25. 部署上線

---

## 用戶需要提供的材料

### 必須提供（開發前）
1. **Dify 應用憑證**: APP_ID, API_KEY, API_URL（在 Dify 創建應用後獲取）
2. **品牌名稱**: AI助手的名字（如「安心」「暖陽」等）
3. **核心文案**: 歡迎語、標語、功能介紹文字

### 建議提供（可後期補充）
4. **Logo**: 如果有品牌標識（沒有可以先用文字logo）
5. **FAQ 內容**: 用戶常見問題及回答
6. **緊急求助信息**: 當地報警電話、婦聯熱線等
7. **隱私政策**: 數據保護說明文案

### 後期擴展需要
8. **倖存者故事**: 匿名化的真實故事（需授權）
9. **視頻資源**: 教育視頻、求助指南視頻
10. **Q&A 內容**: 法律知識、心理健康資源等

---

## 關鍵文件清單（需修改的文件）

- `config/index.ts` — 應用配置（標題、描述、語言）
- `tailwind.config.js` — Tailwind 色彩和字體配置
- `app/styles/globals.css` — 全局樣式
- `app/layout.tsx` — 根佈局（字體引入）
- `app/page.tsx` — 根頁面路由調整
- `app/components/header/index.tsx` — 頭部組件（加快速離開按鈕）
- `app/components/welcome/index.tsx` — 歡迎頁面
- `app/components/chat/index.tsx` — 聊天界面樣式
- `app/components/chat/answer/` — 回答氣泡樣式
- `app/components/chat/question/` — 問題氣泡樣式
- `app/components/sidebar/` — 側邊欄樣式
- `i18n/lang/common.zh-Hans.ts` — 中文翻譯
- `i18n/lang/app.zh-Hans.ts` — 應用中文翻譯
- `.env.local` — 環境變量

### 新增文件
- `app/home/page.tsx` — 首頁
- `app/components/quick-exit/index.tsx` — 快速離開按鈕組件
- `app/components/landing/` — 首頁各區塊組件

---

## 驗證步驟

1. **本地開發驗證**: `npm run dev` 啟動後訪問 localhost:3000 檢查首頁和對話頁
2. **對話功能測試**: 發送消息確認 Dify 連接正常，流式回復正常
3. **快速離開測試**: 點擊按鈕確認跳轉到安全網站
4. **移動端測試**: Chrome DevTools 切換到手機視圖，檢查響應式佈局
5. **Vercel 部署驗證**: 部署後訪問線上地址，確認環境變量生效
6. **性能檢查**: Lighthouse 跑分，確保首頁加載流暢

---

## 決策記錄

- **技術方案**: Fork webapp-conversation 改造（而非從零搭建），降低初學者難度
- **嵌入方式**: 直接改造源碼（而非 iframe 嵌入），保持最佳體驗和完全的樣式控制
- **UI框架**: 沿用 Tailwind CSS（webapp-conversation 原有技術棧）
- **部署**: Vercel 免費方案（注意 Hobby 版有函數響應大小限制）
- **語言**: 默認簡體中文，後期可擴展

## 進一步考慮

1. **Dify 部署選擇**: 建議先用 Dify Cloud 快速驗證，後期如需數據完全自主可遷移到自架版。
2. **域名**: 建議註冊一個有溫暖感的域名（如 xxx-helper.cn），增強品牌信任感。
3. **Vercel Hobby 限制**: 免費版函數響應有截斷限制，如果對話較長可能被截斷，後期可能需要升級或考慮其他部署方式。
