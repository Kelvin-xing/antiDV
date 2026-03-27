import type { FC } from 'react'
import React from 'react'
import Link from 'next/link'

const EMERGENCY_HOTLINE = '110'
const DOMESTIC_VIOLENCE_HOTLINE = '12338'

const features = [
  {
    icon: '💬',
    title: '24 小時傾聽',
    desc: '無論幾點，小安都在。用文字說出你的困境，我們認真傾聽每一句話。',
  },
  {
    icon: '🛡️',
    title: '隱私保護',
    desc: '對話不留記錄於本設備，頁面右上角「快速離開」可一鍵清除並跳離。',
  },
  {
    icon: '📋',
    title: '資源導航',
    desc: '提供庇護所、法律援助、心理諮詢等資源信息，幫你找到下一步。',
  },
  {
    icon: '❤️',
    title: '非批判陪伴',
    desc: '這裡沒有指責，只有支持。你的感受是真實的，你的選擇值得被尊重。',
  },
]

const faqs = [
  {
    q: '我的對話記錄會被保存嗎？',
    a: '小安不會在你的設備上長期保存對話內容。使用完畢後，建議點擊「快速離開」按鈕清除當前記錄。',
  },
  {
    q: '如果我身處危險，小安能幫我嗎？',
    a: '如果你現在面臨緊急危險，請立即撥打 110 報警。小安可以提供情感支持和資源信息，但無法替代緊急救援服務。',
  },
  {
    q: '我需要先確認自己是不是「家暴受害者」才能使用嗎？',
    a: '不需要。只要你感到不安全、受到傷害或需要傾訴，都可以找小安聊。',
  },
  {
    q: '小安是真人還是AI？',
    a: '小安是一個AI助手，由人工智能驅動。它不能替代專業心理諮詢師或社工，但可以在你需要時第一時間陪伴你。',
  },
]

const LandingPage: FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FBF8F4',
        fontFamily: '\'Noto Sans SC\', system-ui, sans-serif',
        color: '#4A4238',
      }}
    >
      {/* ─── Hero ─────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(160deg, #F5E6D3 0%, #FBF8F4 60%)',
          padding: '80px 24px 60px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>🕊️</div>
          <h1
            style={{
              fontFamily: '\'Noto Serif SC\', serif',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 700,
              color: '#3D3028',
              marginBottom: 16,
              lineHeight: 1.3,
            }}
          >
            小安
          </h1>
          <p
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: '#5C4D3E',
              marginBottom: 8,
              fontWeight: 400,
            }}
          >
            你不是一個人，小安在這裡陪你。
          </p>
          <p style={{ fontSize: 14, color: '#8F7E6E', marginBottom: 40 }}>
            反家庭暴力 AI 助手 · 安全 · 保密 · 隨時在線
          </p>
          <Link
            href="/chat"
            style={{
              display: 'inline-block',
              backgroundColor: '#E8A87C',
              color: '#fff',
              borderRadius: 28,
              padding: '14px 40px',
              fontSize: 16,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(232,168,124,0.4)',
              transition: 'background-color 0.2s',
              letterSpacing: '0.04em',
            }}
          >
            開始傾訴 →
          </Link>
          <p style={{ fontSize: 12, color: '#B5A898', marginTop: 16 }}>
            緊急情況請立撥&nbsp;
            <a href={`tel:${EMERGENCY_HOTLINE}`} style={{ color: '#E8A87C', fontWeight: 700 }}>
              {EMERGENCY_HOTLINE}（報警）
            </a>
            &nbsp;或&nbsp;
            <a href={`tel:${DOMESTIC_VIOLENCE_HOTLINE}`} style={{ color: '#7CB9A8', fontWeight: 700 }}>
              {DOMESTIC_VIOLENCE_HOTLINE}（婦女熱線）
            </a>
          </p>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        <h2
          style={{
            fontFamily: '\'Noto Serif SC\', serif',
            fontSize: 22,
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: 40,
            color: '#3D3028',
          }}
        >
          小安能為你做什麼
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 20,
          }}
        >
          {features.map(f => (
            <div
              key={f.title}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #E6DDD5',
                borderRadius: 16,
                padding: '24px 20px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  marginBottom: 8,
                  color: '#3D3028',
                  fontFamily: '\'Noto Serif SC\', serif',
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 13, color: '#5C4D3E', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Safety Statement ─────────────────────── */}
      <section
        style={{
          backgroundColor: '#EEF7F5',
          borderTop: '1px solid #CCE9E3',
          borderBottom: '1px solid #CCE9E3',
          padding: '40px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
          <h2
            style={{
              fontFamily: '\'Noto Serif SC\', serif',
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 12,
              color: '#2C6B5E',
            }}
          >
            你的隱私是我們的首要承諾
          </h2>
          <p style={{ fontSize: 14, color: '#4A9585', lineHeight: 1.8 }}>
            小安不會收集你的個人身份信息。對話內容僅用於本次會話，不會在你的設備上長期保存。
            如果你擔心被人看到，可以隨時點擊右上角<strong>「快速離開」</strong>，
            它會清除記錄並立即跳轉到其他頁面，瀏覽器也不會留下返回記錄。
          </p>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────── */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <h2
          style={{
            fontFamily: '\'Noto Serif SC\', serif',
            fontSize: 20,
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: 32,
            color: '#3D3028',
          }}
        >
          常見問題
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {faqs.map(faq => (
            <details
              key={faq.q}
              style={{
                backgroundColor: '#fff',
                border: '1px solid #E6DDD5',
                borderRadius: 12,
                padding: '16px 20px',
              }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 14,
                  color: '#3D3028',
                  listStyle: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {faq.q}
                <span style={{ color: '#E8A87C', flexShrink: 0 }}>▾</span>
              </summary>
              <p style={{ fontSize: 13, color: '#5C4D3E', marginTop: 12, lineHeight: 1.8 }}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid #E6DDD5',
          padding: '32px 24px',
          textAlign: 'center',
          backgroundColor: '#F5E6D3',
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 700, color: '#3D3028', marginBottom: 8 }}>
          緊急求助熱線
        </p>
        <p style={{ fontSize: 14, color: '#5C4D3E', marginBottom: 16 }}>
          <a href="tel:110" style={{ color: '#E8A87C', fontWeight: 700, marginRight: 24 }}>
            110 報警
          </a>
          <a href="tel:12338" style={{ color: '#7CB9A8', fontWeight: 700, marginRight: 24 }}>
            12338 婦女熱線
          </a>
          <a href="tel:120" style={{ color: '#C8905A', fontWeight: 700 }}>
            120 急救
          </a>
        </p>
        <p style={{ fontSize: 12, color: '#B5A898' }}>
          © {new Date().getFullYear()} 小安 反家暴AI助手 · 如有需要請聯繫當地社會服務機構
        </p>
      </footer>
    </div>
  )
}

export default LandingPage
