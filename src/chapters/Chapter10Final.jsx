import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import content from '../data/content.json'

export default function Chapter10Final() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const finalChapter = content.chapters.find(c => c.id === 'final')
  const { lines, signature, letter, number } = finalChapter
  const year = content.meta.year
  const [letterOpen, setLetterOpen] = useState(false)

  return (
    <section
      ref={ref}
      className="chapter-section flex flex-col items-center justify-center"
      style={{
        background: '#000',
        minHeight: '100vh',
        paddingTop: '60px',
        paddingBottom: '60px',
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 1.5 + 0.5,
              height: Math.random() * 1.5 + 0.5,
              opacity: Math.random() * 0.3,
            }}
            animate={{ opacity: [0.1, Math.random() * 0.4 + 0.1, 0.1] }}
            transition={{ duration: Math.random() * 4 + 2, delay: Math.random() * 5, repeat: Infinity }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="mb-16"
        >
          <span className="font-mono text-xs tracking-[0.4em]" style={{ color: 'var(--gold)', opacity: 0.5 }}>
            CAPÍTULO {String(number).padStart(2, '0')}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-16"
        >
          <motion.button
            onClick={() => setLetterOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="font-mono text-xs tracking-widest uppercase px-8 py-4 cursor-pointer"
            style={{
              border: '1px solid var(--gold)',
              color: 'var(--gold)',
              background: 'rgba(201,168,76,0.06)',
              letterSpacing: '0.25em',
            }}
          >
            {letter.buttonLabel}
          </motion.button>
        </motion.div>

        <div className="space-y-12">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 1.2 + 0.5, duration: 1.5, ease: 'easeOut' }}
            >
              {i < lines.length - 1 ? (
                <p
                  className="font-body text-lg md:text-xl leading-relaxed"
                  style={{ color: 'var(--warm-gray)', fontStyle: 'italic' }}
                >
                  {line}
                </p>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: lines.length * 1.2, duration: 2, ease: 'easeOut' }}
                >
                  <div className="h-px mb-10" style={{
                    background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
                    opacity: 0.4,
                  }} />
                  <h2
                    className="font-display"
                    style={{
                      fontSize: 'clamp(2rem, 6vw, 4rem)',
                      fontStyle: 'italic',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #c9a84c, #e8c97a, #c9a84c)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {line}
                  </h2>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: lines.length * 1.2 + 1.5, duration: 1.5 }}
          className="mt-20"
        >
          <div className="h-px mb-6" style={{
            width: '40px',
            margin: '0 auto 24px',
            background: 'var(--gold)',
            opacity: 0.5,
          }} />
          <p className="font-body italic text-sm" style={{ color: 'var(--text-dim)' }}>
            {signature}
          </p>
          <p className="font-mono text-xs mt-2 tracking-widest" style={{ color: 'var(--text-dim)', opacity: 0.5 }}>
            — {year} —
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: lines.length * 1.2 + 3, duration: 1 }}
          className="mt-16"
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-mono text-xs tracking-widest"
            style={{
              color: 'var(--text-dim)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.3em',
              opacity: 0.5,
              transition: 'opacity 0.3s',
            }}
            onMouseEnter={e => e.target.style.opacity = 1}
            onMouseLeave={e => e.target.style.opacity = 0.5}
          >
            ↑ VOLVER AL INICIO
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {letterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)' }}
            onClick={() => setLetterOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, #120a1e 0%, #0a0814 50%, #080610 100%)',
                border: '1px solid rgba(201,168,76,0.25)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
              }}
            >
              <div className="h-0.5 w-full flex-shrink-0"
                style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
              />

              <div className="flex items-center justify-between px-6 py-5 flex-shrink-0"
                style={{ borderBottom: '1px solid rgba(201,168,76,0.12)' }}
              >
                <h3 className="font-display text-xl italic" style={{ color: 'var(--gold-light)' }}>
                  {letter.title}
                </h3>
                <button
                  onClick={() => setLetterOpen(false)}
                  className="font-mono text-lg leading-none w-8 h-8 flex items-center justify-center"
                  style={{ color: 'var(--warm-gray)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  ×
                </button>
              </div>

              <div
                className="overflow-y-auto px-6 py-6 flex-1"
                style={{ scrollbarWidth: 'thin' }}
              >
                <p
                  className="font-body text-base md:text-lg leading-relaxed whitespace-pre-wrap"
                  style={{ color: 'var(--warm-gray)', fontStyle: 'italic' }}
                >
                  {letter.content}
                </p>
              </div>

              <div className="px-6 py-4 flex-shrink-0"
                style={{ borderTop: '1px solid rgba(201,168,76,0.12)' }}
              >
                <button
                  onClick={() => setLetterOpen(false)}
                  className="w-full py-2 font-mono text-xs tracking-widest"
                  style={{
                    border: '1px solid rgba(201,168,76,0.3)',
                    color: 'var(--gold)',
                    background: 'transparent',
                    cursor: 'pointer',
                    letterSpacing: '0.2em',
                  }}
                >
                  CERRAR
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
