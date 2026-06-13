import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import ChapterHeader from '../components/ChapterHeader'
import GalaxyBackground from '../components/GalaxyBackground'
import content from '../data/content.json'

const HERO_BG = {
  spiderman: 'radial-gradient(circle at center, #8B0000 0%, #2d0a0a 60%, #0a0a1a 100%)',
  ironman: 'radial-gradient(circle at center, #8B1a00 0%, #2d0f0a 60%, #0a0a1a 100%)',
  doctorstrange: 'radial-gradient(circle at center, #4a0080 0%, #1a0028 60%, #0a0a1a 100%)',
  loki: 'radial-gradient(circle at center, #004020 0%, #001a10 60%, #0a0a1a 100%)',
  thanos: 'radial-gradient(circle at center, #3d0060 0%, #150020 60%, #0a0a1a 100%)',
}

const HERO_SYMBOLS = {
  spiderman: '⟨🕷⟩',
  ironman: '⟨⊕⟩',
  doctorstrange: '⟨✦⟩',
  loki: '⟨⚡⟩',
  thanos: '⟨◆⟩',
}

export default function Chapter4Marvel() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const { heroes, subtitle, intro, number } = content.chapters.find(c => c.id === 'multiverso')
  const [openHero, setOpenHero] = useState(null)

  return (
    <section
      ref={ref}
      className="chapter-section"
      style={{
        background: 'linear-gradient(180deg, #08051a 0%, #0a0824 50%, #06050f 100%)',
        paddingTop: '80px',
        paddingBottom: '80px',
      }}
    >
      {/* Multiverse galaxy background */}
      <GalaxyBackground active={inView} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(8,5,26,0.55) 0%, rgba(10,8,36,0.35) 50%, rgba(6,5,15,0.65) 100%)',
          }}
        />
        {/* Comic dot pattern */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-8">
        <ChapterHeader number={number} title="Nuestro Multiverso Marvel" subtitle={subtitle} />

        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-body text-center text-base md:text-lg mb-8 max-w-2xl mx-auto"
            style={{ color: 'var(--warm-gray)', fontStyle: 'italic' }}
          >
            {intro}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-8 flex justify-center"
        >
          <motion.div
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center gap-3 px-5 py-3 rounded-full text-center"
            style={{
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.45)',
              boxShadow: '0 0 24px rgba(201,168,76,0.12)',
            }}
          >
            <span style={{ fontSize: '1.1rem' }} aria-hidden="true">👆</span>
            <p
              className="font-mono text-xs md:text-sm tracking-[0.18em] uppercase"
              style={{ color: 'var(--gold-light)' }}
            >
              Toca cada personaje para abrir su tarjeta
            </p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {heroes.map((hero, i) => (
            <motion.button
              key={hero.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: i * 0.12, duration: 0.7 }}
              onClick={() => setOpenHero(hero)}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="relative p-4 rounded flex flex-col items-center gap-3 cursor-pointer group"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.3s',
              }}
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: HERO_BG[hero.id], opacity: 0 }}
              />
              
              <span style={{ fontSize: '2rem', position: 'relative', zIndex: 1 }}>{hero.emoji}</span>
              
              <div className="relative z-10 text-center">
                <p className="font-mono text-xs tracking-wide" style={{ color: 'var(--gold-light)', fontSize: '0.7rem' }}>
                  {HERO_SYMBOLS[hero.id]}
                </p>
                <p className="font-display text-sm mt-1" style={{ color: 'var(--warm-white)', lineHeight: 1.2 }}>
                  {hero.name}
                </p>
              </div>

              {/* Click hint */}
              <div className="absolute bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="font-mono text-xs" style={{ color: 'var(--gold)', fontSize: '0.55rem', letterSpacing: '0.1em' }}>
                  ABRIR
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Hero modal */}
      <AnimatePresence>
        {openHero && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
            onClick={() => setOpenHero(null)}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-sm w-full rounded overflow-hidden"
              style={{
                background: HERO_BG[openHero.id],
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {/* Top accent */}
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${openHero.color}, transparent)` }} />
              
              <div className="p-8">
                <div className="text-center mb-6">
                  <span style={{ fontSize: '4rem' }}>{openHero.emoji}</span>
                  <h3 className="font-display text-2xl mt-3" style={{ color: 'var(--warm-white)' }}>
                    {openHero.name}
                  </h3>
                  <p className="font-mono text-xs mt-1" style={{ color: 'var(--gold)', letterSpacing: '0.15em' }}>
                    {openHero.tagline}
                  </p>
                </div>
                
                <div className="h-px mb-6" style={{ background: `linear-gradient(90deg, transparent, ${openHero.color}, transparent)`, opacity: 0.4 }} />
                
                <p className="font-body text-base leading-relaxed text-center" style={{ color: 'var(--warm-gray)' }}>
                  {openHero.memory}
                </p>

                <button
                  onClick={() => setOpenHero(null)}
                  className="mt-8 w-full py-2 font-mono text-xs tracking-widest"
                  style={{
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'var(--warm-gray)',
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
