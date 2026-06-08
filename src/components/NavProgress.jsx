import { motion } from 'framer-motion'

const CHAPTERS = [
  'Portada',
  'La Ruta',
  'La Regla',
  'El Parque',
  'Marvel',
  'Personajes',
  'Admiración',
  'Antes de abrir',
  'Caja Fuerte',
  'Final',
]

export default function NavProgress({ current }) {
  return (
    <div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 items-center"
      style={{ display: current === 0 ? 'none' : 'flex' }}
    >
      {CHAPTERS.map((name, i) => (
        <motion.div
          key={i}
          className="relative group cursor-pointer"
          onClick={() => {
            document.querySelectorAll('.chapter-section')[i - 1]?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: i === current
                ? 'var(--gold)'
                : i < current
                ? 'rgba(201,168,76,0.4)'
                : 'rgba(255,255,255,0.15)',
              transform: i === current ? 'scale(1.5)' : 'scale(1)',
            }}
          />
          {/* Tooltip */}
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{
              background: 'rgba(10,10,26,0.9)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '4px',
              padding: '4px 8px',
              whiteSpace: 'nowrap',
            }}
          >
            <span className="font-mono text-xs" style={{ color: 'var(--warm-white)', fontSize: '0.6rem' }}>
              {name}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
