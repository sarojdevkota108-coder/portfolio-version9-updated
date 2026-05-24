'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { COLOR_MAP, STATUS_CONFIG } from '@/lib/utils'
import { IconCheck, IconRefresh, IconClock, IconExternalLink, IconShield } from '@tabler/icons-react'

type Filter = 'all' | 'done' | 'prog' | 'upcoming'

interface Certification {
  id: string
  name: string
  issuer: string
  year: string
  status: 'done' | 'prog' | 'upcoming'
  color: string
  image?: string
  credentialUrl?: string
  credentialId?: string
  description?: string
}

const STATUS_ICONS = {
  done:     <IconCheck size={10} strokeWidth={2.5} />,
  prog:     <IconRefresh size={10} strokeWidth={2.5} />,
  upcoming: <IconClock size={10} strokeWidth={2.5} />,
}

const ISSUER_LOGOS: Record<string, string> = {
  'amazon web services': '☁️',
  'aws': '☁️',
  'cisco': '🌐',
  'google': '🎯',
  'microsoft': '🪟',
  'meta': '🔷',
  'coursera': '📘',
  'udemy': '🎓',
  'simplilearn': '📊',
  'ndg': '🐧',
}

function getIssuerEmoji(issuer: string): string {
  const key = issuer.toLowerCase()
  for (const [match, emoji] of Object.entries(ISSUER_LOGOS)) {
    if (key.includes(match)) return emoji
  }
  return '🏅'
}

// ── Single cert display card ──────────────────────────────────────────────────
function CertCard({ cert, index, onOpen }: { cert: Certification; index: number; onOpen?: (src: string, isPDF: boolean, name: string) => void }) {
  const col = COLOR_MAP[cert.color] || '#4f7fff'
  const st  = STATUS_CONFIG[cert.status]
  const isPDF = cert.image?.endsWith('.pdf')
  const hasFile = !!cert.image

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg2)',
        border: `1px solid ${col}20`,
        opacity: cert.status === 'upcoming' ? 0.72 : 1,
      }}
    >
      {/* Coloured top accent */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${col}, ${col}40, transparent)` }} />

      {/* ── File viewer — always shown if file exists ── */}
      {hasFile && (
        <div
          className="relative w-full overflow-hidden"
          style={{
            background: `${col}06`,
            borderBottom: `1px solid ${col}15`,
          }}
        >
          {isPDF ? (
            <div onClick={() => onOpen?.(cert.image || '', true, cert.name)} style={{ cursor: 'pointer' }}>
              {/* Desktop: inline iframe preview */}
              <iframe
                src={`${cert.image}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                title={cert.name}
                className="hidden md:block"
                style={{ width: '100%', height: 720, border: 'none', display: 'block' }}
              />
              {/* Mobile: tap to open instead of zoomed iframe */}
              <div
                className="flex md:hidden items-center justify-center gap-3"
                style={{ height: 100, background: `${col}08`, fontSize: 13, color: col, fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}
              >
                <span style={{ fontSize: 22 }}>📄</span> TAP TO VIEW PDF
              </div>
            </div>
          ) : (
            <img
              src={cert.image}
              alt={cert.name}
              onClick={() => onOpen?.(cert.image || '', false, cert.name)}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: 720,
                objectFit: 'contain',
                display: 'block',
                padding: '0',
                cursor: 'pointer',
              }}
            />
          )}

          {/* Subtle overlay badge */}
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{
              background: 'rgba(4,4,10,0.75)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${col}30`,
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: col,
              letterSpacing: '.1em',
            }}
          >
            {isPDF ? '📄 PDF' : '🖼 IMAGE'}
          </div>

          {/* External link */}
          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener"
              className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all hover:opacity-90"
              style={{
                background: 'rgba(4,4,10,0.75)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${col}30`,
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: col,
                letterSpacing: '.08em',
                cursor: 'none',
              }}
            >
              <IconShield size={9} />
              Verify
            </a>
          )}
        </div>
      )}

      {/* ── No file: decorative placeholder ── */}
      {!hasFile && (
        <div
          className="flex flex-col items-center justify-center gap-3 py-10"
          style={{
            background: `${col}05`,
            borderBottom: `1px solid ${col}10`,
          }}
        >
          <div style={{ fontSize: 40 }}>{getIssuerEmoji(cert.issuer)}</div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--txt3)',
              letterSpacing: '.12em',
              textTransform: 'uppercase',
            }}
          >
            No file uploaded
          </div>
        </div>
      )}

      {/* ── Info footer ── */}
      <div style={{ padding: '24px 26px 28px' }}>
        {/* Status + year row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-[.08em] ${st.colorClass}`}
          >
            {STATUS_ICONS[cert.status as keyof typeof STATUS_ICONS]}
            {st.label}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--txt3)' }}>
            {cert.year}
          </div>
        </div>

        {/* Issuer */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '.14em',
            color: col,
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          {cert.issuer}
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--txt)',
            lineHeight: 1.2,
            marginBottom: cert.description ? 12 : 0,
          }}
        >
          {cert.name}
        </div>

        {/* Description */}
        {cert.description && (
          <div style={{ fontSize: 15, color: 'var(--txt2)', lineHeight: 1.8 }}>
            {cert.description}
          </div>
        )}

        {/* Credential ID + link */}
        {(cert.credentialId || cert.credentialUrl) && (
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {cert.credentialId && (
              <div style={{ fontSize: 10, color: 'var(--txt3)', fontFamily: 'var(--font-mono)', letterSpacing: '.06em' }}>
                ID: {cert.credentialId}
              </div>
            )}
            {cert.credentialUrl && !hasFile && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-1 text-[10px] font-mono transition-opacity hover:opacity-80"
                style={{ color: col, cursor: 'none', letterSpacing: '.06em' }}
              >
                <IconExternalLink size={10} />
                Verify Credential
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────
export function Certifications() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })
  const [filter, setFilter] = useState<Filter>('all')
  const [certs, setCerts]   = useState<Certification[]>([])
  const [modal, setModal] = useState<{ src: string; isPDF: boolean; name: string } | null>(null)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setModal(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    fetch('/api/cms?section=certifications')
      .then(r => r.json())
      .then(j => setCerts(j.data || []))
      .catch(() => setCerts([]))
  }, [])

  const visible = certs.filter(c => filter === 'all' || c.status === filter)
  const counts = {
    all:      certs.length,
    done:     certs.filter(c => c.status === 'done').length,
    prog:     certs.filter(c => c.status === 'prog').length,
    upcoming: certs.filter(c => c.status === 'upcoming').length,
  }

  return (
    <section id="certifications" className="section max-w-7xl mx-auto px-6 md:px-10">
      <div ref={ref}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="section-eyebrow">Credentials</div>
            <h2 className="section-title">
              CERTIFICATIONS<br />
              <span className="gradient-text-blue">&amp; LEARNING.</span>
            </h2>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-6 pb-1"
          >
            {[
              { label: 'Earned',      count: counts.done,     col: '#00e599' },
              { label: 'In Progress', count: counts.prog,     col: '#ffaa00' },
              { label: 'Upcoming',    count: counts.upcoming, col: '#a78bfa' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div style={{ fontSize: 28, fontWeight: 800, color: s.col, fontFamily: 'var(--font-bebas)', letterSpacing: '.04em' }}>
                  {s.count}
                </div>
                <div style={{ fontSize: 9, color: 'var(--txt3)', fontFamily: 'var(--font-mono)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Filters ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {(['all', 'done', 'prog', 'upcoming'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ cursor: 'none' }}
              className={`px-4 py-2 rounded-lg text-[11px] font-mono tracking-[.08em] border transition-all duration-200 ${
                filter === f
                  ? 'bg-white/8 border-white/15 text-white'
                  : 'bg-transparent border-white/6 text-[var(--txt3)] hover:border-white/12 hover:text-[var(--txt2)]'
              }`}
            >
              {{ all: 'All', done: 'Completed', prog: 'In Progress', upcoming: 'Upcoming' }[f]}
              <span
                className="ml-2 px-1.5 py-0.5 rounded text-[9px]"
                style={{
                  background: filter === f ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.05)',
                  color: filter === f ? '#00d4ff' : 'var(--txt3)',
                }}
              >
                {counts[f]}
              </span>
            </button>
          ))}
        </motion.div>

        {/* ── Certificate list — big full-width posts ── */}
        <div className="space-y-10">
          {visible.map((c, i) => (
            <div key={c.id} className="w-full">
              <CertCard cert={c} index={i} onOpen={(src, isPDF, name) => setModal({ src, isPDF, name })} />
            </div>
          ))}
        </div>

        {/* ── Upcoming roadmap strip ── */}
        {counts.upcoming > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-12 rounded-2xl p-7 relative overflow-hidden"
            style={{ background: 'var(--bg2)', border: '1px solid var(--line)' }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent)' }}
            />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.2em', color: 'var(--violet)', marginBottom: 14, textTransform: 'uppercase' }}>
              🗺 Upcoming Learning Roadmap — 2025–26
            </div>
            <div className="flex flex-wrap gap-3">
              {certs.filter(c => c.status === 'upcoming').map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--line)' }}
                >
                  <IconClock size={11} style={{ color: 'var(--violet)' }} />
                  <span style={{ fontSize: 12, color: 'var(--txt2)' }}>{item.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
      {/* Fullscreen modal */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(4,4,10,0.8)' }}
          onClick={() => setModal(null)}
        >
          <div onClick={e => e.stopPropagation()} className="relative">
            <button
              onClick={() => setModal(null)}
              className="absolute -top-4 -right-4 bg-black/60 rounded-full p-2 text-white"
              style={{ fontSize: 18 }}
            >
              ×
            </button>
            {modal.isPDF ? (
              <iframe
                src={`${modal.src}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                title={modal.name}
                style={{ width: '95vw', height: '85vh', border: 'none', background: '#fff', borderRadius: 8 }}
              />
            ) : (
              <img src={modal.src} alt={modal.name} style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }} />
            )}
          </div>
        </div>
      )}
    </section>
  )
}

