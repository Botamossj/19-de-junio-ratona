import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import ChapterHeader from '../components/ChapterHeader'
import content from '../data/content.json'

const chapter = content.chapters.find(c => c.id === 'la-ruta')

const LIGHTS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  y: 15 + Math.random() * 70,
  width: 40 + Math.random() * 120,
  height: 3 + Math.random() * 5,
  duration: 2.5 + Math.random() * 2,
  delay: Math.random() * 3,
  color: i % 4 === 0 ? '#c9a84c' : i % 3 === 0 ? '#fff8e7' : i % 2 === 0 ? '#e8d5a0' : '#b8d4f0',
  opacity: 0.3 + Math.random() * 0.5,
}))

export default function Chapter1() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-100px' })

  return (
    <section
      ref={ref}
      className="chapter-section flex items-center"
      style={{
        background: 'linear-gradient(180deg, #050510 0%, #0a0820 40%, #080618 100%)',
      }}
    >
      {/* Moving lights animation - street lights passing */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {inView && LIGHTS.map(light => (
          <motion.div
            key={light.id}
            className="absolute rounded-full"
            style={{
              top: `${light.y}%`,
              height: light.height,
              width: light.width,
              background: `linear-gradient(90deg, transparent, ${light.color}, transparent)`,
              opacity: light.opacity,
              filter: 'blur(2px)',
            }}
            initial={{ x: '110vw' }}
            animate={inView ? {
              x: '-200px',
              transition: {
                duration: light.duration,
                delay: light.delay,
                repeat: Infinity,
                ease: 'linear',
                repeatDelay: Math.random() * 2,
              }
            } : { x: '110vw' }}
          />
        ))}

        {/* Window frame effect */}
        <div className="absolute inset-0"
          style={{
            boxShadow: 'inset 0 0 120px rgba(0,0,0,0.8)',
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,5,16,0.7) 100%)',
          }}
        />

        {/* Reflection on window glass */}
        <div className="absolute inset-0 opacity-10"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 41px)',
          }}
        />
      </div>

      {/* Interior del bus */}
      <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20"
        style={{
          background: 'linear-gradient(0deg, #0a0a1a 0%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-12 py-24">
        <ChapterHeader number={chapter.number} title={chapter.title} subtitle={chapter.subtitle} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-6"
        >
          {chapter.paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="font-body text-lg md:text-xl leading-relaxed"
              style={{ color: i === 0 ? 'var(--warm-white)' : 'var(--warm-gray)', opacity: i === 0 ? 0.9 : 1 }}
            >
              {paragraph}
            </p>
          ))}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2, duration: 1.5 }}
            className="font-display text-xl md:text-2xl italic"
            style={{ color: 'var(--gold-light)' }}
          >
            "{chapter.quote}"
          </motion.p>
        </motion.div>

        {/* Bus number detail */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-16 flex items-center gap-3"
        >
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, var(--gold), transparent)', opacity: 0.3 }} />
          <span className="font-mono text-xs tracking-widest" style={{ color: 'var(--text-dim)' }}>
            {chapter.detail}
          </span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, var(--gold), transparent)', opacity: 0.3 }} />
        </motion.div>
      </div>
    </section>
  )
}
