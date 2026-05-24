'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Floor data with PDF paths and render info
const FLOORS = [
  {
    id: 'ground',
    label: 'Ground Floor',
    shortLabel: 'GF',
    pdf: '/images/interior/Ground_floor_design.pdf',
    rooms: ['Living Room', 'Kitchen & Dining', 'Entry Hall', 'Staircase Foyer'],
    description: 'Grand open-plan social living — an expansive living room with luxury chandelier and custom TV wall, open-plan kitchen with navy-blue cabinetry and marble countertops, and a dramatic staircase foyer featuring traditional carved doors and a golden Buddha accent.',
    palette: ['#C8A882', '#F5F0E8', '#2C2C2C', '#8B7355'],
    paletteNames: ['Warm Oak', 'Cream White', 'Charcoal', 'Walnut'],
    highlights: [
      'Multi-tier crystal chandelier centrepiece',
      'Custom wood-slat TV feature wall',
      'Navy & marble open-plan kitchen',
      'Traditional carved entry doors',
      'Curved staircase with wrought-iron railings',
      'White marble tile flooring throughout',
    ],
    pageCount: 7,
    style: 'Contemporary Luxury',
  },
  {
    id: 'first',
    label: 'First Floor',
    shortLabel: 'F1',
    pdf: '/images/interior/first_floor_design.pdf',
    rooms: ['Master Bedroom', 'Bedroom 2', 'Family Lounge', 'Study Area'],
    description: 'A floor of refined personal spaces — the master bedroom in warm taupe with gold pendant lights and slatted feature wall, two additional bedrooms in bold navy-blue and sage-green palettes, plus a stylish family lounge with panel moulding and teal velvet seating.',
    palette: ['#D4B896', '#4A7B9D', '#6B8F6B', '#E8DDD0'],
    paletteNames: ['Taupe', 'Navy Blue', 'Sage Green', 'Ivory'],
    highlights: [
      'Warm taupe master bedroom with gold accents',
      'Bold navy accent wall with fluted panelling',
      'Sage green bedroom with walk-in wardrobe',
      'Elegant family lounge with panel moulding',
      'Integrated study desks and open shelving',
      'LED cove lighting throughout',
    ],
    pageCount: 7,
    style: 'Modern Transitional',
  },
  {
    id: 'second',
    label: 'Second Floor',
    shortLabel: 'F2',
    pdf: '/images/interior/second_floor_design.pdf',
    rooms: ['Bedroom Suite A', 'Bedroom Suite B', 'Study Room', 'Private Lounge'],
    description: 'Serene upper-floor suites with a lighter, airy aesthetic — two well-appointed bedrooms in soft grey and warm cream tones, complete with built-in wardrobes, open bookshelves, and generous natural light from floor-to-ceiling windows.',
    palette: ['#C0B0A0', '#E8E4E0', '#8A8A9A', '#D4CFC8'],
    paletteNames: ['Greige', 'Soft White', 'Cool Grey', 'Sand'],
    highlights: [
      'Soft grey tones with wood accent panels',
      'Integrated wardrobe-to-ceiling storage',
      'Open study nook with built-in shelves',
      'Floor-to-ceiling sheer curtain windows',
      'Upholstered platform bed with bench end',
      'Layered lighting: recessed + LED cove',
    ],
    pageCount: 3,
    style: 'Soft Contemporary',
  },
]

// Individual render page viewer
function FloorViewer({ floor, activePage, setActivePage }: {
  floor: typeof FLOORS[0]
  activePage: number
  setActivePage: (n: number) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Main render — embedded PDF page */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#0a0a14' }}
      >
        <div className="relative" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={`${floor.pdf}#page=${activePage}&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
            className="absolute inset-0 w-full h-full rounded-2xl"
            style={{ border: 'none' }}
            title={`${floor.label} render ${activePage}`}
          />
        </div>

        {/* Floor badge */}
        <div
          className="absolute top-4 left-4 px-3 py-1.5 rounded-lg"
          style={{
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: '#00e599',
            letterSpacing: '.06em',
          }}
        >
          {floor.label} · View {activePage}/{floor.pageCount}
        </div>

        {/* Style badge */}
        <div
          className="absolute top-4 right-4 px-3 py-1.5 rounded-lg"
          style={{
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--txt3)',
            letterSpacing: '.08em',
            textTransform: 'uppercase',
          }}
        >
          {floor.style}
        </div>
      </div>

      {/* Page nav dots */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: floor.pageCount }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            onClick={() => setActivePage(n)}
            style={{ cursor: 'none' }}
            className="transition-all duration-200"
          >
            <div
              style={{
                width: n === activePage ? 24 : 8,
                height: 8,
                borderRadius: 999,
                background: n === activePage ? '#00e599' : 'rgba(255,255,255,0.12)',
                transition: 'all .25s ease',
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export function InteriorDesign() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })
  const [activeFloor, setActiveFloor] = useState(0)
  const [activePage, setActivePage] = useState(1)

  const floor = FLOORS[activeFloor]

  const switchFloor = (i: number) => {
    setActiveFloor(i)
    setActivePage(1)
  }

  return (
    <section id="design" className="section max-w-7xl mx-auto px-6 md:px-10">
      <div ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="section-eyebrow">Interior Design</div>
          <h2 className="section-title">
            SPATIAL<br />
            <span className="gradient-text-green">ARCHITECTURE.</span>
          </h2>
          <p className="section-desc">
            Contemporary luxury residential project spanning three floors — full 3D visualization renders,
            material palette curation, and smart space planning.
          </p>
        </motion.div>

        {/* Floor tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex gap-3 mb-8 flex-wrap"
        >
          {FLOORS.map((f, i) => (
            <button
              key={f.id}
              onClick={() => switchFloor(i)}
              style={{ cursor: 'none' }}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-300 ${
                i === activeFloor
                  ? 'border-[#00e599]/40 bg-[rgba(0,229,153,0.07)]'
                  : 'border-white/5 bg-[var(--bg2)] hover:border-white/10'
              }`}
            >
              <span
                style={{
                  fontFamily: 'var(--font-bebas)',
                  fontSize: '22px',
                  letterSpacing: '.04em',
                  color: i === activeFloor ? '#00e599' : 'var(--txt3)',
                  lineHeight: 1,
                  transition: 'color .3s',
                }}
              >
                {f.shortLabel}
              </span>
              <div className="text-left">
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '.1em',
                    color: i === activeFloor ? '#00e599' : 'var(--txt3)',
                    textTransform: 'uppercase',
                    transition: 'color .3s',
                  }}
                >
                  {f.label}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--txt3)', letterSpacing: '.06em' }}>
                  {f.pageCount} renders
                </div>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Main content area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFloor}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid md:grid-cols-3 gap-6"
          >
            {/* Left: PDF viewer — takes 2 cols */}
            <div className="md:col-span-2">
              <FloorViewer
                floor={floor}
                activePage={activePage}
                setActivePage={setActivePage}
              />
            </div>

            {/* Right: Info panel */}
            <div className="flex flex-col gap-4">
              {/* Description */}
              <div className="card" style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                    letterSpacing: '.14em', color: '#00e599',
                    marginBottom: '10px', textTransform: 'uppercase',
                  }}
                >
                  Space Brief
                </div>
                <p style={{ fontSize: '13px', color: 'var(--txt2)', lineHeight: 1.8, marginBottom: '16px' }}>
                  {floor.description}
                </p>

                {/* Rooms */}
                <div
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                    letterSpacing: '.12em', color: 'var(--txt3)',
                    marginBottom: '8px', textTransform: 'uppercase',
                  }}
                >
                  Spaces
                </div>
                <div className="flex flex-wrap gap-2">
                  {floor.rooms.map(r => (
                    <span key={r} className="tag tag-green" style={{ fontSize: '11px' }}>{r}</span>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="card">
                <div
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                    letterSpacing: '.12em', color: 'var(--txt3)',
                    marginBottom: '10px', textTransform: 'uppercase',
                  }}
                >
                  Design Highlights
                </div>
                <ul className="space-y-2">
                  {floor.highlights.map(h => (
                    <li key={h} className="flex items-start gap-2" style={{ fontSize: '12px', color: 'var(--txt2)' }}>
                      <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#00e599' }} />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Material palette */}
              <div className="card">
                <div
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                    letterSpacing: '.14em', color: 'var(--txt3)',
                    marginBottom: '12px', textTransform: 'uppercase',
                  }}
                >
                  Material Palette
                </div>
                <div className="flex gap-3">
                  {floor.palette.map((c, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                      <div
                        className="w-full rounded-lg border"
                        style={{ height: 36, background: c, borderColor: 'rgba(255,255,255,0.1)' }}
                      />
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)', fontSize: '8px',
                          color: 'var(--txt3)', letterSpacing: '.04em', textAlign: 'center',
                        }}
                      >
                        {floor.paletteNames[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Project stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total Renders', value: '17' },
            { label: 'Floors Designed', value: '3' },
            { label: 'Rooms', value: '10' },
            { label: 'Design Style', value: 'Modern' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="rounded-xl p-4 text-center"
              style={{ background: 'var(--bg2)', border: '1px solid var(--line)' }}
            >
              <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '28px', color: '#00e599', letterSpacing: '.03em', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '.12em', color: 'var(--txt3)', textTransform: 'uppercase', marginTop: '4px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
