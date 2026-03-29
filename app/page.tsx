import type { FC } from 'react'
import React from 'react'
import Link from 'next/link'
import ContactForm from '@/app/components/contact-form'

const EMERGENCY_HOTLINE = '110'
const DOMESTIC_VIOLENCE_HOTLINE = '12338'

const features = [
  {
    icon: '💬',
    title: '24 小时倾听',
    desc: '无论几点，小安都在。用文字说出你的困境，我们认真倾听每一句话。',
  },
  {
    icon: '🛡️',
    title: '隐私保护',
    desc: '对话不留记录于本设备，页面右上角「快速离开」可一键清除并跳离。',
  },
  {
    icon: '📋',
    title: '资源导航',
    desc: '提供庇护所、法律援助、心理咨询等资源信息，帮你找到下一步。',
  },
  {
    icon: '❤️',
    title: '非批判陪伴',
    desc: '这里没有指责，只有支持。你的感受是真实的，你的选择值得被尊重。',
  },
  {
    icon: '📖',
    title: '受害者故事',
    desc: '阅读走出困境的真实故事，你并不孤单，她们也曾和你一样。',
    link: '/stories',
  },
  {
    icon: '📄',
    title: '文档工具库',
    desc: '人身保护令、告诫书等法律文书模板，填写即可生成下载。',
    link: '/docs-toolkit',
  },
]

const faqs = [
  {
    q: '我的对话记录会被保存吗？',
    a: '小安不会在你的设备上长期保存对话内容。使用完毕后，建议点击「快速离开」按钮清除当前记录。',
  },
  {
    q: '如果我身处危险，小安能帮我吗？',
    a: '如果你现在面临紧急危险，请立即拨打 110 报警。小安可以提供情感支持和资源信息，但无法替代紧急救援服务。',
  },
  {
    q: '我需要先确认自己是不是「家暴受害者」才能使用吗？',
    a: '不需要。只要你感到不安全、受到伤害或需要倾诉，都可以找小安聊。',
  },
  {
    q: '小安是真人还是AI？',
    a: '小安是一个AI助手，由人工智能驱动。它不能替代专业心理咨询师或社工，但可以在你需要时第一时间陪伴你。',
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
            你不是一个人，小安在这里陪你。
          </p>
          <p style={{ fontSize: 14, color: '#8F7E6E', marginBottom: 40 }}>
            反家庭暴力 AI 助手 · 安全 · 保密 · 随时在线
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
            开始倾诉 →
          </Link>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            <Link
              href="/stories"
              style={{
                display: 'inline-block',
                backgroundColor: '#fff',
                color: '#E8A87C',
                borderRadius: 28,
                padding: '10px 28px',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                border: '1.5px solid #E8A87C',
                transition: 'background-color 0.2s',
              }}
            >
              📖 受害者故事
            </Link>
            <Link
              href="/docs-toolkit"
              style={{
                display: 'inline-block',
                backgroundColor: '#fff',
                color: '#E8A87C',
                borderRadius: 28,
                padding: '10px 28px',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                border: '1.5px solid #E8A87C',
                transition: 'background-color 0.2s',
              }}
            >
              📄 文档工具库
            </Link>
          </div>
          <p style={{ fontSize: 12, color: '#B5A898', marginTop: 16 }}>
            紧急情况请立拨&nbsp;
            <a href={`tel:${EMERGENCY_HOTLINE}`} style={{ color: '#E8A87C', fontWeight: 700 }}>
              {EMERGENCY_HOTLINE}（报警）
            </a>
            &nbsp;或&nbsp;
            <a href={`tel:${DOMESTIC_VIOLENCE_HOTLINE}`} style={{ color: '#7CB9A8', fontWeight: 700 }}>
              {DOMESTIC_VIOLENCE_HOTLINE}（妇女热线）
            </a>
          </p>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: 40,
            color: '#3D3028',
          }}
        >
          小安能为你做什么
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 20,
          }}
        >
          {features.map(f => {
            const card = (
              <div
                key={f.title}
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #E6DDD5',
                  borderRadius: 16,
                  padding: '24px 20px',
                  textAlign: 'center',
                  transition: f.link ? 'box-shadow 0.2s, transform 0.2s' : undefined,
                  cursor: f.link ? 'pointer' : undefined,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    marginBottom: 8,
                    color: '#3D3028',
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: 13, color: '#5C4D3E', lineHeight: 1.7 }}>{f.desc}</p>
                {f.link && (
                  <p style={{ fontSize: 12, color: '#E8A87C', marginTop: 10, fontWeight: 500 }}>了解更多 →</p>
                )}
              </div>
            )
            return f.link
              ? <Link key={f.title} href={f.link} style={{ textDecoration: 'none', color: 'inherit' }}>{card}</Link>
              : card
          })}
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
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 12,
              color: '#2C6B5E',
            }}
          >
            你的隐私是我们的首要承诺
          </h2>
          <p style={{ fontSize: 14, color: '#4A9585', lineHeight: 1.8 }}>
            小安不会收集你的个人身份信息。对话内容仅用于本次会话，不会在你的设备上长期保存。
            如果你担心被人看到，可以随时点击右上角<strong>「快速离开」</strong>，
            它会清除记录并立即跳转到其他页面，浏览器也不会留下返回记录。
          </p>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────── */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: 32,
            color: '#3D3028',
          }}
        >
          常见问题
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

      {/* ─── Contact ──────────────────────────────── */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📬</div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#3D3028', marginBottom: 10 }}>
            联系我们
          </h2>
          <p style={{ fontSize: 14, color: '#8F7E6E', lineHeight: 1.8, maxWidth: 480, margin: '0 auto' }}>
            如有合作意向、问题反馈或需要进一步帮助，欢迎通过以下方式联系我们，或在下方直接留言。
          </p>
        </div>

        {/* Contact info cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 40,
        }}>
          {[
            { icon: '📱', label: '联系电话', value: '请联系机构负责人' },
            { icon: '💬', label: '微信公众号', value: '请联系机构负责人' },
            { icon: '✉️', label: '电子邮件', value: '请联系机构负责人' },
          ].map(item => (
            <div key={item.label} style={{
              backgroundColor: '#fff',
              border: '1px solid #E6DDD5',
              borderRadius: 12,
              padding: '20px 16px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 12, color: '#B5A898', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#5C4D3E' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Leave a message */}
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #E6DDD5',
          borderRadius: 16,
          padding: '32px 28px',
          boxShadow: '0 2px 12px rgba(74,66,56,0.06)',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#3D3028', marginBottom: 4 }}>
            给我们留言
          </h3>
          <p style={{ fontSize: 12, color: '#B5A898', marginBottom: 20 }}>
            留言将由团队查看，不会公开显示。
          </p>
          <ContactForm />
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
          紧急求助热线
        </p>
        <p style={{ fontSize: 14, color: '#5C4D3E', marginBottom: 16 }}>
          <a href="tel:110" style={{ color: '#E8A87C', fontWeight: 700, marginRight: 24 }}>
            110 报警
          </a>
          <a href="tel:12338" style={{ color: '#7CB9A8', fontWeight: 700, marginRight: 24 }}>
            12338 妇女热线
          </a>
          <a href="tel:120" style={{ color: '#C8905A', fontWeight: 700 }}>
            120 急救
          </a>
        </p>
        <p style={{ fontSize: 12, color: '#B5A898' }}>
          © {new Date().getFullYear()} 小安 反家暴AI助手 · 如有需要请联系当地社会服务机构
        </p>
      </footer>
    </div>
  )
}

export default LandingPage
