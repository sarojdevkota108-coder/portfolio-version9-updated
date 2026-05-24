'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { COLOR_MAP } from '@/lib/utils'
import {
  IconShield, IconHeart, IconSchool, IconMicrophone,
} from '@tabler/icons-react'

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
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(4,4,10,0.85)', cursor: 'none' }}
      onClick={onClose}
    >
      <div onClick={e => e.stopPropagation()} className="relative">
        <button
          onClick={onClose}
          style={{
            cursor: 'none', position: 'absolute', top: '-14px', right: '-14px',
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'var(--bg4)', border: '1px solid var(--line2)',
            color: 'var(--txt2)', fontSize: '18px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
        >×</button>
        {isPDF ? (
          <iframe
            src={`${src}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            title={name}
            style={{ width: '95vw', height: '85vh', border: 'none', background: '#fff', borderRadius: '8px' }}
          />
        ) : (
          <img src={src} alt={name} style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }} />
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
                              {/* Mobile: tap to open button */}
                              <div
                                className="flex md:hidden items-center justify-center gap-3"
                                style={{ height: 90, background: `${c}08`, fontSize: 13, color: c, fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}
                              >
                                <span style={{ fontSize: 22 }}>📄</span> TAP TO VIEW PDF
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
