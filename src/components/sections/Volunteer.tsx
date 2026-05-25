'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { COLOR_MAP } from '@/lib/utils'
import {
  IconShield, IconHeart, IconSchool, IconMicrophone,
} from '@tabler/icons-react'

// ── Mobile-first PDF viewer (shared with Certifications) ─────────────────────
function PDFViewer({ src, name }: { src: string; name: string }) {
  const [useFallback, setUseFallback] = useState(false)
  const absUrl = typeof window !== 'undefined'
    ? new URL(src, window.location.href).href
    : src

  if (useFallback) {
    return (
      <div className="w-full h-full flex flex-col">
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(absUrl)}&embedded=true`}
          title={name}
          style={{ flex: 1, border: 'none', background: '#fff' }}
        />
        <div style={{ padding: '10px 16px', background: 'rgba(4,4,10,0.9)', textAlign: 'center' }}>
          <a href={src} download style={{ fontSize: 12, color: '#00d4ff', fontFamily: 'var(--font-mono)' }}>
            Can&apos;t see it? Download PDF
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      <object
        data={`${src}#toolbar=1&navpanes=0&scrollbar=1&view=FitH&zoom=page-width`}
        type="application/pdf"
        style={{ flex: 1, width: '100%', border: 'none' }}
        onError={() => setUseFallback(true)}
      >
        <div className="flex flex-col items-center justify-center gap-4 h-full" style={{ padding: 32, textAlign: 'center' }}>
          <span style={{ fontSize: 48 }}>📄</span>
          <p style={{ fontSize: 14, color: 'var(--txt2)', lineHeight: 1.6 }}>Your browser can&apos;t display PDFs inline.</p>
          <button
            onClick={() => setUseFallback(true)}
            style={{ padding: '10px 22px', borderRadius: 10, background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff', fontSize: 13, fontFamily: 'var(--font-mono)', cursor: 'pointer' }}
          >
            Try Google Docs Viewer
          </button>
          <a href={src} download style={{ padding: '10px 22px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--txt)', fontSize: 13, fontFamily: 'var(--font-mono)', textDecoration: 'none' }}>
            Download PDF instead
          </a>
        </div>
      </object>
    </div>
  )
}

const ICON_MAP: Record<string, React.ReactNode> = {
  shield:     <IconShield size={18} />,
  heart:      <IconHeart size={18} />,
  school:     <IconSchool size={18} />,
  microphone: <IconMicrophone size={18} />,
}

const STRENGTHS = [
  'Leadership', 'Communication', 'Mentorship',
  'Team Coordination', 'Public Speaking',
  'Social Responsibility', 'Training & Facilitation',
]

const STATS = [
  { num: '40+', label: 'People Trained',   color: 'cyan'  },
  { num: '4',   label: 'Initiatives',      color: 'green' },
  { num: '2+',  label: 'Years Active',     color: 'amber' },
  { num: '3',   label: 'Domains Served',   color: 'violet'},
]

interface VolunteerItem {
  id: string
  year: string
  title: string
  org: string
  description: string
  tag: string
  color: string
  icon: string
  image?: string
}

function CertModal({ src, isPDF, name, onClose }: { src: string; isPDF: boolean; name: string; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(4,4,10,0.96)' }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between flex-shrink-0"
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(4,4,10,0.9)',
        }}
      >
        <div style={{ fontSize: 13, color: 'var(--txt2)', fontFamily: 'var(--font-mono)', letterSpacing: '.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 'calc(100vw - 120px)' }}>
          {name}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {isPDF && (
            <a
              href={src}
              download
              style={{ fontSize: 11, color: '#00d4ff', fontFamily: 'var(--font-mono)', letterSpacing: '.06em', padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.08)', textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              ↓ Save
            </a>
          )}
          <button
            onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--txt)', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >×</button>
        </div>
      </div>

      {/* Viewer — fills remaining height */}
      <div className="flex-1 relative overflow-hidden">
        {isPDF ? (
          <PDFViewer src={src} name={name} />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4">
            <img src={src} alt={name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8 }} />
          </div>
        )}
      </div>
    </div>
  )
}

export function Volunteer() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 })
  const [items, setItems] = useState<VolunteerItem[]>([])
  const [modal, setModal] = useState<{ src: string; isPDF: boolean; name: string } | null>(null)

  useEffect(() => {
    fetch('/api/cms?section=volunteer')
      .then(r => r.json())
      .then(j => setItems(j.data || []))
      .catch(() => setItems([]))
  }, [])

  return (
    <section id="volunteer" className="section max-w-7xl mx-auto px-6 md:px-10">
      <div ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="section-eyebrow">Community</div>
          <h2 className="section-title">
            LEADERSHIP<br />
            <span className="gradient-text-amber">&amp; IMPACT.</span>
          </h2>
          <p className="section-desc">
            Technical growth must go hand-in-hand with community contribution.
            Actively engaged in education, public awareness and cybersecurity training.
          </p>
        </motion.div>

        {/* Impact stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14"
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              className="card text-center glass-hover"
              style={{ borderColor: `${COLOR_MAP[s.color]}25` }}
            >
              <div style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '48px',
                letterSpacing: '.03em',
                color: COLOR_MAP[s.color],
                lineHeight: 1,
                marginBottom: '4px',
              }}>
                {s.num}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '.14em',
                color: 'var(--txt3)',
                textTransform: 'uppercase',
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Timeline */}
          <div className="md:col-span-2">
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '.18em',
              color: 'var(--txt3)',
              textTransform: 'uppercase',
              marginBottom: '28px',
            }}>
              Activity Timeline
            </div>

            <div className="relative pl-8 space-y-8">
              {/* Vertical line */}
              <div
                className="absolute left-0 top-2 bottom-2 w-px"
                style={{ background: 'linear-gradient(to bottom, var(--cyan), rgba(0,212,255,0.1))' }}
              />

              {items.map((item, i) => {
                const c = COLOR_MAP[item.color]
                const hasFile = !!item.image
                const isPDF = item.image?.endsWith('.pdf')

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
                    className="relative"
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute -left-8 top-2 w-3 h-3 rounded-full border-2"
                      style={{
                        borderColor: c,
                        background: 'var(--bg)',
                        boxShadow: `0 0 10px ${c}50`,
                        transform: 'translateX(-4px)',
                      }}
                    />

                    <div className="card glass-hover overflow-hidden" style={{ borderColor: `${c}20`, padding: 0 }}>

                      {/* ── Certificate image/PDF inline ── */}
                      {hasFile && (
                        <div
                          className="relative w-full overflow-hidden"
                          style={{ background: `${c}06`, borderBottom: `1px solid ${c}15` }}
                        >
                          {isPDF ? (
                            <div onClick={() => setModal({ src: item.image!, isPDF: true, name: item.title })} style={{ cursor: 'pointer' }}>
                              {/* Desktop: inline iframe */}
                              <iframe
                                src={`${item.image}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                title={item.title}
                                className="hidden md:block"
                                style={{ width: '100%', height: 480, border: 'none', display: 'block', pointerEvents: 'none' }}
                              />
                              {/* Mobile: prominent tap-to-open button */}
                              <div
                                className="flex md:hidden flex-col items-center justify-center gap-2"
                                style={{ height: 110, background: `${c}10`, cursor: 'pointer' }}
                              >
                                <span style={{ fontSize: 30 }}>📄</span>
                                <span style={{ fontSize: 12, color: c, fontFamily: 'var(--font-mono)', letterSpacing: '.08em', padding: '5px 14px', borderRadius: 8, background: `${c}18`, border: `1px solid ${c}35` }}>
                                  TAP TO VIEW PDF
                                </span>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={item.image}
                              alt={item.title}
                              onClick={() => setModal({ src: item.image!, isPDF: false, name: item.title })}
                              style={{
                                width: '100%', height: 'auto', maxHeight: 480,
                                objectFit: 'contain', display: 'block', cursor: 'pointer',
                              }}
                            />
                          )}
                          <div
                            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                            style={{
                              background: 'rgba(4,4,10,0.75)',
                              backdropFilter: 'blur(10px)',
                              border: `1px solid ${c}30`,
                              fontFamily: 'var(--font-mono)',
                              fontSize: 9,
                              color: c,
                              letterSpacing: '.1em',
                            }}
                          >
                            {isPDF ? '📄 PDF' : '🖼 Certificate'}
                          </div>
                        </div>
                      )}

                      {/* ── Card info ── */}
                      <div style={{ padding: '20px 24px 22px' }}>
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <span style={{ color: c }}>{ICON_MAP[item.icon]}</span>
                            <span style={{
                              fontFamily: 'var(--font-bebas)',
                              fontSize: '18px',
                              letterSpacing: '.03em',
                              color: 'var(--txt)',
                            }}>
                              {item.title}
                            </span>
                          </div>
                          <span className={`tag tag-${item.color} flex-shrink-0 hidden sm:inline-flex`}>
                            {item.year}
                          </span>
                        </div>

                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          letterSpacing: '.06em',
                          color: 'var(--txt3)',
                          marginBottom: '8px',
                        }}>
                          {item.org}
                        </div>

                        <p style={{ fontSize: '13px', color: 'var(--txt2)', lineHeight: 1.7, marginBottom: '10px' }}>
                          {item.description}
                        </p>

                        <span className={`tag tag-${item.color}`}>{item.tag}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Strengths sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-col gap-4"
          >
            {/* Motto */}
            <div className="card" style={{ borderColor: 'rgba(255,170,0,0.2)', background: 'rgba(255,170,0,0.03)' }}>
              <div style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '22px',
                letterSpacing: '.04em',
                color: 'var(--amber)',
                lineHeight: 1.25,
                marginBottom: '8px',
              }}>
                "Selfless Action, Endless Impact."
              </div>
              <p style={{ fontSize: '13px', color: 'var(--txt2)', lineHeight: 1.7 }}>
                Actively engaged in community development, educational support, public awareness
                initiatives, and cybersecurity training programmes.
              </p>
            </div>

            {/* Core strengths */}
            <div className="card">
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '.14em',
                color: 'var(--txt3)',
                marginBottom: '14px',
                textTransform: 'uppercase',
              }}>
                Core Strengths
              </div>
              <div className="space-y-3">
                {STRENGTHS.map((s, i) => (
                  <motion.div
                    key={s}
                    initial={{ opacity: 0, width: 0 }}
                    animate={inView ? { opacity: 1, width: '100%' } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.07 }}
                    className="flex items-center gap-3"
                  >
                    <span style={{ fontSize: '13px', color: 'var(--txt2)', minWidth: '140px' }}>{s}</span>
                    <div className="flex-1 metric-bar">
                      <div
                        className="metric-fill"
                        style={{
                          background: 'linear-gradient(90deg, var(--amber), var(--rose))',
                          transform: inView ? 'scaleX(1)' : 'scaleX(0)',
                          transitionDelay: `${0.6 + i * 0.07}s`,
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Highlight */}
            <div className="card" style={{ borderColor: 'rgba(0,229,153,0.15)', background: 'rgba(0,229,153,0.03)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="status-dot" style={{ background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.1em', color: 'var(--green)' }}>
                  ACTIVELY CONTRIBUTING
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--txt2)', lineHeight: 1.65 }}>
                Ongoing educational tutoring and community leadership participation across Kathmandu.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fullscreen modal */}
      {modal && (
        <CertModal
          src={modal.src}
          isPDF={modal.isPDF}
          name={modal.name}
          onClose={() => setModal(null)}
        />
      )}
    </section>
  )
}
