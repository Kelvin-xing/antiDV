import type { FC } from 'react'
import React from 'react'
import Link from 'next/link'
import ContactForm from '@/app/components/contact-form'

/* ── Inline SVG Icons (stroke 1.5, 20×20, no external deps) ── */
const IconChat = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label="对话">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)
const IconShield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label="隐私保护">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const IconMapPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label="资源导航">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)
const IconBook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label="受害者故事">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
)
const IconDoc = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label="文档工具库">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label="电话">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label="邮件">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="22,7 12,13 2,7" />
  </svg>
)
const IconWechat = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label="微信">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="10" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const IconMindBook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-label="心理资源">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
    <path d="M12 8v4l3 3" />
  </svg>
)

const features = [
  {
    icon: <IconChat />,
    title: '24 小时倾听，非批判陪伴',
    desc: '无论几点，小安都在。没有指责，只有支持。用文字说出你的困境，你的感受是真实的，你的选择值得被尊重。',
    num: '01',
  },
  {
    icon: <IconShield />,
    title: '隐私保护',
    desc: '对话不留记录于本设备，页面右上角「快速离开」可一键清除并跳离。',
    num: '02',
  },
  {
    icon: <IconMapPin />,
    title: '资源导航',
    desc: '提供庇护所、法律援助、心理咨询等资源信息，帮你找到下一步。',
    link: '/resources',
    num: '03',
  },
  {
    icon: <IconMindBook />,
    title: '心理资源支持库',
    desc: '整合家暴防治教育资源：心理疗愈书籍、专业文章、支持性网站，帮助你了解、理解、走出困境。',
    link: '/psych-resources',
    num: '04',
  },
  {
    icon: <IconBook />,
    title: '受害者故事',
    desc: '阅读走出困境的真实故事，你并不孤单，她们也曾和你一样。',
    link: '/stories',
    num: '05',
  },
  {
    icon: <IconDoc />,
    title: '文档工具库',
    desc: '人身保护令、告诫书等法律文书模板，填写即可生成下载。',
    link: '/docs-toolkit',
    num: '06',
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

const reducedMotionStyle = `
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
details[open] summary .faq-arrow { transform: rotate(90deg); }
details summary .faq-arrow { transition: transform 200ms ease-out; display: inline-block; }
summary::-webkit-details-marker { display: none; }
summary::marker { display: none; }
a:focus-visible, button:focus-visible, summary:focus-visible {
  outline: 2px solid #E8A87C; outline-offset: 2px;
}
`

const LandingPage: FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FBF8F4',
        fontFamily: "'Noto Sans SC', system-ui, sans-serif",
        color: '#3D3028',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: reducedMotionStyle }} />

      {/* ─── Hero ─────────────────────────────────── */}
      <section style={{ padding: '96px 24px 72px', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle background image */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(https://images.pexels.com/photos/574312/pexels-photo-574312.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            opacity: 0.10,
            zIndex: 0,
          }}
        />
        {/* Warm cream overlay for legibility */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(251,248,244,0.92) 0%, rgba(245,230,211,0.75) 60%, rgba(251,248,244,0.88) 100%)',
            zIndex: 1,
          }}
        />
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              border: '1px solid #E8A87C',
              borderRadius: 4,
              padding: '6px 14px',
              marginBottom: 32,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#E8A87C', display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: '#5C4D3E', letterSpacing: '0.06em' }}>反家庭暴力 AI 助手</span>
          </div>

          <h1
            style={{
              fontFamily: "'Noto Serif SC', serif",
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              fontWeight: 700,
              color: '#3D3028',
              marginBottom: 24,
              lineHeight: 1.1,
            }}
          >
            小安
          </h1>

          <div style={{ borderLeft: '3px solid #E8A87C', paddingLeft: 16, marginBottom: 12 }}>
            <p
              style={{
                fontSize: 18,
                color: '#5C4D3E',
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              你不是一个人，小安在这里陪你。
            </p>
          </div>

          <p style={{ fontSize: 14, color: '#7A6B5D', marginBottom: 40 }}>
            安全 · 保密 · 随时在线
          </p>

          <Link
            href="/chat"
            style={{
              display: 'inline-block',
              backgroundColor: '#E8A87C',
              color: '#fff',
              borderRadius: 4,
              padding: '14px 36px',
              fontSize: 16,
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'opacity 200ms ease-out',
              minHeight: 48,
            }}
          >
            开始倾诉 →
          </Link>

          <div style={{ marginTop: 20 }}>
            <Link href="/stories" style={{ fontSize: 14, color: '#5C4D3E', textDecoration: 'underline', textUnderlineOffset: 3, marginRight: 24 }}>
              受害者故事
            </Link>
            <Link href="/docs-toolkit" style={{ fontSize: 14, color: '#5C4D3E', textDecoration: 'underline', textUnderlineOffset: 3 }}>
              文档工具库
            </Link>
          </div>

          <p style={{ fontSize: 13, color: '#7A6B5D', marginTop: 24 }}>
            紧急情况请拨&nbsp;
            <a href="tel:110" style={{ color: '#E8A87C', fontWeight: 600 }}>110</a>
            &nbsp;或&nbsp;
            <a href="tel:12338" style={{ color: '#7CB9A8', fontWeight: 600 }}>12338（妇女热线）</a>
          </p>
        </div>
      </section>

      {/* ─── Features (Editorial Rows) ────────────── */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 72px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 0,
          }}
        >
          {features.map(f => {
            const row = (
              <div
                key={f.title}
                style={{
                  borderBottom: '1px solid #E6DDD5',
                  padding: '28px 0',
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: "'Noto Serif SC', serif",
                    fontSize: 48,
                    fontWeight: 300,
                    color: '#EDE5DC',
                    lineHeight: 1,
                    flexShrink: 0,
                    width: 56,
                  }}
                >
                  {f.num}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ color: '#7A6B5D' }}>{f.icon}</span>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#3D3028', margin: 0 }}>{f.title}</h3>
                  </div>
                  <p style={{ fontSize: 16, color: '#5C4D3E', lineHeight: 1.8, margin: 0 }}>{f.desc}</p>
                  {f.link && (
                    <p style={{ fontSize: 13, color: '#E8A87C', marginTop: 8, fontWeight: 500, textAlign: 'right' }}>了解更多 →</p>
                  )}
                </div>
              </div>
            )
            return f.link
              ? <Link key={f.title} href={f.link} style={{ textDecoration: 'none', color: 'inherit' }}>{row}</Link>
              : row
          })}
        </div>
      </section>

      {/* ─── Safety Statement ─────────────────────── */}
      <section style={{ backgroundColor: '#F5E6D3', padding: '56px 24px' }}>
        <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center' }}>
          <p
            style={{
              fontFamily: "'Noto Serif SC', serif",
              fontSize: 20,
              fontStyle: 'italic',
              color: '#3D3028',
              lineHeight: 1.8,
              marginBottom: 20,
            }}
          >
            你的隐私是我们的首要承诺。对话内容仅用于本次会话，不会长期保存。
          </p>
          <p style={{ fontSize: 14, color: '#5C4D3E', lineHeight: 1.8 }}>
            如果你担心被人看到，可以随时点击右上角<strong>「快速离开」</strong>一键清除记录并跳转。浏览器不会留下返回记录。
          </p>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────── */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '72px 24px' }}>
        <h2
          style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: 22,
            fontWeight: 600,
            marginBottom: 36,
            color: '#3D3028',
          }}
        >
          常见问题
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {faqs.map(faq => (
            <details
              key={faq.q}
              style={{ borderBottom: '1px solid #E6DDD5', padding: '20px 0' }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 16,
                  color: '#3D3028',
                  listStyle: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                  minHeight: 44,
                }}
              >
                {faq.q}
                <span className="faq-arrow" style={{ color: '#E8A87C', flexShrink: 0, fontSize: 14 }}>▸</span>
              </summary>
              <p style={{ fontSize: 16, color: '#5C4D3E', marginTop: 12, lineHeight: 1.8 }}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ─── Contact ──────────────────────────────── */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 72px' }}>
        <hr style={{ border: 'none', borderTop: '1px solid #E6DDD5', marginBottom: 48 }} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 40,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Noto Serif SC', serif",
                fontSize: 22,
                fontWeight: 600,
                color: '#3D3028',
                marginBottom: 12,
              }}
            >
              联系我们
            </h2>
            <p style={{ fontSize: 16, color: '#5C4D3E', lineHeight: 1.8, marginBottom: 28 }}>
              如有合作意向、问题反馈或需要进一步帮助，欢迎联系我们。
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: <IconPhone />, label: '联系电话', value: '请联系机构负责人' },
                { icon: <IconWechat />, label: '微信公众号', value: '请联系机构负责人' },
                { icon: <IconMail />, label: '电子邮件', value: '请联系机构负责人' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: '#7A6B5D' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, color: '#7A6B5D', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#3D3028' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#3D3028', marginBottom: 4 }}>
              给我们留言
            </h3>
            <p style={{ fontSize: 12, color: '#7A6B5D', marginBottom: 20 }}>
              留言信息不会公开，仅供团队查看。
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────── */}
      <footer
        style={{
          backgroundColor: '#3D3028',
          padding: '40px 24px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 600, color: '#FBF8F4', marginBottom: 12 }}>
          紧急求助热线
        </p>
        <p style={{ fontSize: 16, color: '#FBF8F4', marginBottom: 20 }}>
          <a href="tel:110" style={{ color: '#E8A87C', fontWeight: 700, marginRight: 24 }}>
            110 报警
          </a>
          <a href="tel:12338" style={{ color: '#7CB9A8', fontWeight: 700, marginRight: 24 }}>
            12338 妇女热线
          </a>
          <a href="tel:120" style={{ color: '#D4A574', fontWeight: 700 }}>
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
