# Plan: 「小安」新增功能 — Hash 身份 + 刪除對話

## TL;DR（新功能）
在現有聊天應用上新增兩組功能：
1. **Hash 身份系統**：系統生成隨機 Hash 作為用戶身份，不需要傳統帳號密碼，同一 Hash 在任何設備/瀏覽器都能取回對話記錄
2. **刪除功能**：刪除單個對話、刪除單條消息（本地 UI 移除）、清空全部對話

---

## 技術原理（必讀）

### Hash 身份如何工作
- 現在：`user = "user_APPID:" + sessionId`（sessionId 是 cookie 裡的隨機 UUID）
- 新的：`user = "user_APPID:" + userHash`（userHash 是用戶保存的固定值）
- Dify 根據 `user` 字段存儲和隔離對話，**同一 Hash = 同一用戶的對話**
- Hash 不會存入任何新數據庫，只是 Dify API 的 `user` 參數

### 數據流
```
Client localStorage → userHash → X-User-Hash header
→ Server getInfo() → 讀取 header → 傳給 Dify client
→ Dify 存取該用戶的對話記錄
```

---

## Phase A：Hash 身份系統

### A1. 修改服務端 `getInfo()`
**文件**: `app/api/utils/common.ts`
- 新增：優先讀取請求中的 `X-User-Hash` header
- 如有 Hash → `user = userPrefix + hash`
- 如無 Hash → 沿用原有 `session_id` cookie 邏輯（向後兼容）

### A2. 修改客戶端 fetch 工具
**文件**: `service/base.ts`
- 在所有 API 請求的 headers 中，自動附加 `X-User-Hash`（從 localStorage 讀取）

### A3. 創建 Hash 身份管理 Hook
**新文件**: `hooks/use-user-hash.ts`
- `generateHash()`: 用 `crypto.randomUUID()` 生成，存入 localStorage
- `setHash(hash)`: 輸入已有 Hash 並驗證格式
- `clearHash()`: 清除本地 Hash（回到匿名 session 模式）
- `currentHash`: 當前 Hash 值

### A4. 創建 Hash 身份 UI 組件
**新文件**: `app/components/user-hash/index.tsx`
- 一個浮動抽屜或模態框，包含：
  - 顯示當前 Hash（帶複製按鈕）
  - 「生成新 Hash」按鈕（附警告：舊記錄需舊 Hash）
  - 「輸入已有 Hash」輸入框（換設備時使用）
  - 隱私說明文案
- 觸發入口：Sidebar 底部「我的身份」按鈕

### A5. 整合到 Sidebar
**文件**: `app/components/sidebar/index.tsx`
- 底部加入「🔑 我的身份」按鈕，點擊開啟 Hash 管理面板

### A6. 整合到主組件
**文件**: `app/components/index.tsx`
- 初始化時檢查 localStorage 是否有 Hash
- 如無 Hash → 自動生成並提示用戶保存

---

## Phase B：刪除功能

### B1. 新增「刪除對話」API 路由
**新文件**: `app/api/conversations/[conversationId]/route.ts`
- `DELETE` 方法 → 呼叫 `client.deleteConversation(conversationId, user)`
- 需確認 `dify-client` 是否有此方法（探索 `node_modules/dify-client`）

### B2. 新增「刪除對話」服務函數
**文件**: `service/index.ts`
- `deleteConversation(id: string)` → `del(`conversations/${id}`)`

### B3. 刪除單個對話 UI
**文件**: `app/components/sidebar/index.tsx`
- 對話列表每項 hover 時顯示垃圾桶圖標
- 點擊 → 確認對話框 → 呼叫 DELETE API → 從列表移除

### B4. 刪除單條消息（本地 UI 移除）
**注意**：Dify 標準 API 不支持刪除單條消息，僅做本地 UI 移除
**文件**: 
- `app/components/chat/answer/index.tsx` — AI 回答氣泡加刪除按鈕
- `app/components/chat/question/index.tsx` — 用戶消息氣泡加刪除按鈕
- `app/components/chat/index.tsx` — 新增 `onDeleteMessage` 回調，過濾掉對應 chatItem
- `app/components/index.tsx` — 傳入 `onDeleteMessage` handler

### B5. 清空全部對話
**文件**: `app/components/sidebar/index.tsx`
- 頂部加「清空全部」按鈕
- 點擊 → 確認對話框 → 循環呼叫 DELETE → 清空列表

---

## 關鍵文件清單

| 文件 | 操作 | 用途 |
|------|------|------|
| `app/api/utils/common.ts` | 修改 `getInfo()` | 讀取 X-User-Hash header |
| `service/base.ts` | 修改 fetch headers | 附加 X-User-Hash |
| `hooks/use-user-hash.ts` | 新建 | Hash 狀態管理 |
| `app/components/user-hash/index.tsx` | 新建 | Hash 管理 UI |
| `app/components/sidebar/index.tsx` | 修改 | 刪除按鈕 + 身份入口 |
| `app/components/chat/index.tsx` | 修改 | onDeleteMessage 回調 |
| `app/components/chat/answer/index.tsx` | 修改 | 刪除按鈕 |
| `app/components/chat/question/index.tsx` | 修改 | 刪除按鈕 |
| `app/api/conversations/[conversationId]/route.ts` | 新建 | DELETE endpoint |
| `service/index.ts` | 修改 | deleteConversation 函數 |
| `app/components/index.tsx` | 修改 | Hash 初始化 + 刪除 handler |

---

## 驗證步驟

1. Hash 生成：打開「我的身份」→ 點「生成 Hash」→ 複製 Hash → 重新整理頁面 → 對話記錄保留
2. Hash 跨設備：另一瀏覽器輸入相同 Hash → 能看到相同對話記錄
3. 刪除對話：hover 側邊欄項目 → 垃圾桶出現 → 點擊確認 → 對話消失
4. 刪除消息：hover 消息氣泡 → 刪除圖標出現 → 點擊 → 消息從 UI 移除
5. 清空全部：點「清空全部」→ 確認 → 側邊欄清空

---

## 技術決策

- Hash 身份：純 header 傳遞，零新數據庫，利用 Dify 現有 user 隔離機制
- 刪除單條消息：本地 UI 移除（Dify 無此 API），頁面刷新後仍顯示（可接受的限制）
- 刪除對話：調用 Dify DELETE API，永久刪除
- 向後兼容：無 Hash 時沿用原 session_id，不破壞現有匿名用戶體驗
