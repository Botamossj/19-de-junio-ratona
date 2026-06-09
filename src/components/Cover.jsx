import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import content from '../data/content.json'

const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.5 + 0.5,
  delay: Math.random() * 6,
  dur: Math.random() * 4 + 2,
}))

export default function Cover({ onOpen }) {
  const [ready, setReady] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 30% 60%, #1a0a2e 0%, #0a0a1a 60%, #000 100%)' }}>
      
      {/* Stars */}
      {STARS.map(s => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(138,43,226,0.06) 0%, transparent 70%)' }} />
      </div>

      {/* Content */}
      <AnimatePresence>
        {ready && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative z-10 text-center px-6 max-w-2xl mx-auto"
          >
            {/* Chapter label */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="font-mono text-xs tracking-[0.4em] uppercase mb-8"
              style={{ color: 'var(--gold)', opacity: 0.7 }}
            >
              Una historia guardada
            </motion.p>

            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1.2 }}
              className="font-display text-gold-gradient mb-2"
              style={{
                fontSize: 'clamp(2.8rem, 8vw, 6rem)',
                lineHeight: 1.1,
                fontStyle: 'italic',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #c9a84c, #e8c97a, #c9a84c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {content.meta.title}
            </motion.h1>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.4, duration: 1 }}
              className="mx-auto my-6"
              style={{
                height: '1px',
                width: '120px',
                background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
              }}
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 1 }}
              className="font-body text-base md:text-lg mb-16"
              style={{ color: 'var(--warm-gray)', letterSpacing: '0.05em' }}
            >
              Una caja fuerte de recuerdos para{' '}
              <span style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>Shere</span>
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.8 }}
            >
              <motion.button
                onClick={onOpen}
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden font-mono tracking-widest uppercase text-sm px-10 py-4 cursor-pointer"
                style={{
                  border: `1px solid var(--gold)`,
                  color: hovered ? 'var(--night)' : 'var(--gold)',
                  background: hovered ? 'var(--gold)' : 'transparent',
                  transition: 'all 0.4s ease',
                  letterSpacing: '0.3em',
                }}
              >
                {/* Shimmer effect */}
                <motion.span
                  className="absolute inset-0 pointer-events-none"
                  initial={{ x: '-100%' }}
                  animate={hovered ? { x: '100%' } : { x: '-100%' }}
                  transition={{ duration: 0.5 }}
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                  }}
                />
                Abrir
              </motion.button>
            </motion.div>

            {/* Bottom hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5, duration: 1 }}
              className="mt-16 font-mono text-xs"
              style={{ color: 'var(--text-dim)', letterSpacing: '0.2em' }}
            >
              ↓ desplázate para explorar
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 opacity-30">
        <div className="w-8 h-px" style={{ background: 'var(--gold)' }} />
        <div className="w-px h-8" style={{ background: 'var(--gold)' }} />
      </div>
      <div className="absolute top-8 right-8 opacity-30">
        <div className="w-8 h-px ml-auto" style={{ background: 'var(--gold)' }} />
        <div className="w-px h-8 ml-auto" style={{ background: 'var(--gold)' }} />
      </div>
      <div className="absolute bottom-8 left-8 opacity-30">
        <div className="w-px h-8" style={{ background: 'var(--gold)' }} />
        <div className="w-8 h-px" style={{ background: 'var(--gold)' }} />
      </div>
      <div className="absolute bottom-8 right-8 opacity-30">
        <div className="w-px h-8 ml-auto" style={{ background: 'var(--gold)' }} />
        <div className="w-8 h-px ml-auto" style={{ background: 'var(--gold)' }} />
      </div>
    </div>
  )
}
