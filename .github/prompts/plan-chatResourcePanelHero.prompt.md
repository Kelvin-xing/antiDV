## 計畫：Chat 頁面資源面板 + 首頁背景圖片重新設計

**概述**：
1. **任務1 - Chat 頁面更新**：在 chat 頁右側新增**動態資源面板**，根據 AI 回應內容自動推薦相關資源鏈接。面板在手機端從右側滑出；在桌面端呈現 3 列佈局（邊欄 | 聊天 | 資源面板）。

2. **任務2 - 首頁重構**：
   - 功能項目 04 從「非批判陪伴」改為「**心理資源支持庫**」（防治教育資源庫，後期上傳書籍、文檔、網站等）
   - 01「24 小時傾聽」新增「非批判陪伴」的部分描述（合併）
   - 為首頁 hero 區域背景添加**溫暖自然背景圖**，符合 trauma-informed 設計原則

3. **任務3 - 新頁面**：建立 `/psych-resources` 獨立頁面（結合 resources + stories + docs-toolkit 的內容組織模式）

---

## 實現步驟

### Phase 1：首頁 Hero 背景 + 功能項目重構（不依賴）

1. 在 `app/page.tsx` 中：
   - 更新 `features` 陣列：功能 04 改名「心理資源支持庫」，描述改為關於防治教育的內容  
   - 功能 01 描述融合「非批判陪伴」內容
   - 在 hero section 背景添加 Pexels 圖片（低不透明度 10–15%，溫色層）

2. 下載 Pexels 圖片 → `public/images/hero-bg.jpg` （推薦 #574312 或 #15745333）

**Hero 背景圖片建議**：
- Pexels #574312：Forest trees during golden hour
- Pexels #15745333：Sun shining on the walkway in a park with autumnal trees
- Pexels #29561846：Sunlight streaming through forest trees
- 特性：無人物、溫暖自然光、平靜感、不搶焦點

---

### Phase 2：建立 ResourcePanel 元件（不依賴）

1. 新建目錄 `app/components/resource-panel/`

2. 建立 `index.tsx`，功能：
   - 定義資源數據結構：stories、docs、resources、psych-resources 各類別
   - **動態匹配引擎**：掃描最新 AI 回應，提取關鍵詞（如「法律」→ highlight docs，「故事」→ highlight stories）
   - 優先級排序（匹配度高 > 最近訪問）
   - 卡片佈局：資源標題 + 簡述 + "前往" 按鈕
   - 背景圖：柔和植物系，低不透明度

3. Props：
   ```typescript
   interface ResourcePanelProps {
     chatMessage?: string; // 最新 AI 回應，用於動態匹配
     isVisible?: boolean;  // 行動端控制可見性
     onResourceClick?: (url: string, category: string) => void; // 追蹤點擊
   }
   ```

**資源數據結構**：
```typescript
const RESOURCE_KEYWORDS = {
  '法律': ['docs-toolkit', 'resources'],
  '故事': ['stories'],
  '心理': ['psych-resources', 'resources'],
  '安全': ['resources', 'quick-exit'],
  '倾听': ['chat'],
}
```

---

### Phase 3：建立 `/psych-resources` 頁面（不依賴）

1. 新建 `app/psych-resources/` 目錄

2. 建立 `page.tsx`，設計參考：
   - 頂部：深色 masthead（#3D3028），標題「心理資源支持庫」，副標「家暴防治教育資源」
   - 內容區：按主題分類（如「關係健康」、「創傷恢復」、「法律知識」）
   - 卡片佈局：書籍、文章、網站連結，支持外部連結
   - 設計語言與 stories / docs-toolkit 一致（`border-left: 3px solid #E8A87C`、無 card box、`hr` 分隔符）
   - 響應式：手機端單列、平板端 2 列、桌面端 3 列

3. 建立 `data.ts`，結構：
```typescript
export interface PsychResource {
  title: string;
  description: string;
  type: 'article' | 'book' | 'link' | 'video';
  url: string;
  tags?: string[]; // 如 ['創傷恢復', '法律基礎']
}

export interface PsychResourceCategory {
  id: string;
  title: string;
  description: string;
  resources: PsychResource[];
}

export const psychResources: PsychResourceCategory[] = [
  {
    id: 'trauma-recovery',
    title: '創傷恢復與療癒',
    description: '理解與處理家庭暴力創傷的心理資源',
    resources: [
      {
        title: '《從創傷中復原》',
        description: '經典心理創傷療癒指南',
        type: 'book',
        url: '#',
        tags: ['創傷恢復']
      },
      // ... more resources
    ]
  },
  // ... more categories
];
```

4. 頁面佈局：
   - **Masthead**：深色背景 #3D3028，白色文本，左對齊「← 首頁」返回鏈接
   - **Header**：「心理資源支持庫」，副標「家暴防治教育資源」
   - **標籤篩選**：（可選）頂部標籤雲，快速篩選資源
   - **資源網格**：3 列桌面 / 2 列平板 / 1 列手機
   - **資源卡**：
     ```
     [資源標題] — Noto Serif SC 18px, #3D3028
     [簡述] — 16px, #5C4D3E, lineHeight 1.8
     [標籤] — 12px, #7A6B5D, 多個灰色 pill（不填充，僅邊框）
     [前往] — 13px coral, underline
     border-left: 3px solid #E8A87C
     border-bottom: 1px solid #E6DDD5
     ```

---

### Phase 4：整合 ResourcePanel 至 Chat 佈局（依賴 Phase 2）

在 `app/components/index.tsx` 中修改渲染邏輯：

**桌面端** (≥1024px)：
```
3 列網格：[Sidebar 244px] [Chat grow] [ResourcePanel 320px]
ResourcePanel 固定顯示，背景圖、適度邊框分隔
```

**平板端** (768-1023px)：
```
ResourcePanel 變為可摺疊側欄
Header 右上角新增「資源」按鈕（Icon），點擊展開/收起
或改為 2 列：[Chat grow] [ResourcePanel 280px]（可能擠壓 Chat）
```

**行動端** (<768px)：
```
ResourcePanel 從右側滑出，fixed overlay
Header 新增資源按鈕，點擊時 setShowResourcePanel(true)
Overlay 背景半透明 (rgba(35, 56, 118, 0.2))
點擊外部或返回鍵關閉面板
```

**佈局代碼框架**：
```typescript
// In Main component render
const isMobile = media === MediaType.mobile
const isTablet = media === MediaType.tablet

return (
  <div className='bg-gray-100'>
    <Header ... />
    <div className="flex">
      {/* Sidebar */}
      {!isMobile && renderSidebar()}
      {isMobile && isShowSidebar && renderSidebarOverlay()}
      
      {/* Main Chat Area */}
      <div className={cn(
        'flex-grow flex flex-col',
        !isMobile && 'border-r border-gray-200' // Right border if panel visible
      )}>
        <ConfigScene ... />
        {hasSetInputs && (
          <div className='flex gap-4'> {/* Or grid for desktop */}
            {/* Chat Section */}
            <div className='flex-grow'>
              <Chat ... />
            </div>
            
            {/* ResourcePanel */}
            {!isMobile && <ResourcePanel chatMessage={latestAIResponse} />}
            {isMobile && isShowResourcePanel && (
              <div className='fixed inset-0 z-50 overflow-hidden'>
                <ResourcePanel 
                  chatMessage={latestAIResponse}
                  isVisible={isShowResourcePanel}
                  onClose={() => setShowResourcePanel(false)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
)
```

---

### Phase 5：樣式 + 響應式微調（依賴 Phase 4）

1. **ResourcePanel 樣式**：
   - 背景：白色 (#FBF8F4) + 背景圖（植物系，opacity 5-8%，overlay #FBF8F4）
   - 邊框：左側 1px solid #E6DDD5（分隔聊天區）
   - 卡片：`border-left: 3px solid #E8A87C`，`border-bottom: 1px solid #E6DDD5`
   - 無 box-shadow（保持最小化設計）
   - 標題：Noto Serif SC 18px, #3D3028，margin-bottom 24px

2. **動畫**：
   - 滑出（mobile）：200ms ease-out 從右邊進入
   - 卡片懸停：opacity 變更 0.8 → 1.0（200ms）
   - **prefers-reduced-motion**：檢查包裝
   ```css
   @media (prefers-reduced-motion: reduce) {
     * { animation: none !important; transition: none !important; }
   }
   ```

3. **觸碰目標**：
   - 所有資源卡片 > 44×44px 點擊區域
   - 按鈕 > 44×44px

4. **焦點環**：
   - `outline: 2px solid #E8A87C; outline-offset: 2px;`
   - 應用在 `<a>` 及 `<button>:focus-visible`

5. **Pexels 圖片來源**：
   - **Hero bg**：#574312（forest）或 #15745333（autumn path）
   - **ResourcePanel bg**：新搜尋「soft botanical light」/ 「plant leaves warm light」
   - 圖片下載 → `/public/images/hero-bg.jpg` 和 `/public/images/resource-panel-bg.jpg`
   - 使用 Next.js Image 元件優化或 CSS `background-image`（簡單實施）

---

## 設計決策

| 決策 | 理由 | 備註 |
|---|---|---|
| **動態資源推薦** | 提高相關性，降低使用者認知負荷 | 掃描 AI 回應提取關鍵詞，優先級排序 |
| **/psych-resources 獨立頁面** | 長期規劃，支持教育內容擴展 | 可與 resources / stories / docs-toolkit 並列，獨立 URL |
| **右側滑出面板（手機）** | 一致性（同 sidebar），避免干擾聊天區下方 | 使用 fixed overlay，不影響聊天流 |
| **溫暖背景圖（hero）** | 符合 trauma-informed 設計，增強視覺溫度 | 低不透明度 10–15%，不搶焦點 |
| **卡片 border-left（而非 box-shadow）** | 最小化設計，符合既有設計語言 | 保持一致性與可訪問性 |

---

## 修改文件清單

| 文件 | 變更 | 優先級 |
|---|---|---|
| `app/page.tsx` | Feature 陣列改名稱、重寫描述、hero bg 圖片樣式 | P1 |
| `public/images/hero-bg.jpg` | Pexels 圖片下載 | P1 |
| `app/components/resource-panel/index.tsx` | NEW 完整元件（動態匹配、卡片列表） | P2 |
| `app/psych-resources/page.tsx` | NEW 獨立頁面（類似 stories / docs-toolkit） | P3 |
| `app/psych-resources/data.ts` | NEW 資源數據與分類 | P3 |
| `app/components/index.tsx` | 整合 ResourcePanel、調整佈局網格、新增圖標按鈕 | P4 |
| `public/images/resource-panel-bg.jpg` | Pexels 圖片（植物系） | P5 |
| `app/styles/globals.css` | 如需新色系、字體補充（通常不需） | P5 |
| `app/components/header.tsx` | 手機端新增「資源」按鈕 | P4 |

---

## 驗證清單

- [ ] 首頁 hero 背景圖正確加載、不透明度適當（10–15%）、無破裂
- [ ] 功能 01 & 04 文案整合合理、描述清晰
- [ ] `/psych-resources` 頁面可訪問、設計風格一致（dark masthead、border-left、hr 分隔）
- [ ] ResourcePanel 在聊天開始後立即顯示、動態更新（关键词匹配）
- [ ] 行動端 320px → 768px → 桌面端佈局無滾動、無重疊、無裁切
- [ ] 資源面板卡片點擊導航正常（內部鏈接 + 外部連結）
- [ ] 焦點環、觸控目標、動畫符合 WCAG AA + trauma-informed 規範
- [ ] Chrome DevTools → `prefers-reduced-motion: reduce` → 所有動畫禁用
- [ ] 圖片加載速度（使用 Next.js Image 優化或 lazy loading）
- [ ] 文案無錯別字、多語言一致（如涉及國際化）

---

## 後續可選增強

1. **漸進式資源加載**：如果 `/psych-resources` 資源冗長，考慮分頁或無限滾動
2. **資源幣值系統**：使用者可以「收藏」或「稍後閱讀」資源
3. **搜尋功能**：在 ResourcePanel 中搜尋資源（Cmd+K / Ctrl+K）
4. **分析追蹤**：記錄使用者點擊的資源，優化推薦算法
5. **多語言支持**：資源數據 i18n 化（如有需要）

---

## 實施順序建議

**建議從 Phase 1 開始**，逐步進行 Phase 2–5：

1. **週期 1**：Phase 1（首頁 hero 背景 + 功能改名）→ 驗證 & 部署
2. **週期 2**：Phase 2 + 3（ResourcePanel + /psych-resources）→ 驗證 & 部署
3. **週期 3**：Phase 4 + 5（整合佈局、樣式微調、響應式）→ 驗證 & 部署
4. **後續**：可選增強 & 性能優化
