import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import ChapterHeader from '../components/ChapterHeader'
import content from '../data/content.json'

export default function Chapter7Admiration() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { traits, closingLine } = content.chapters.find(c => c.id === 'admiracion')

  return (
    <section
      ref={ref}
      className="chapter-section"
      style={{
        background: 'linear-gradient(160deg, #0a0810 0%, #100a16 50%, #080a10 100%)',
        paddingTop: '80px',
        paddingBottom: '80px',
      }}
    >
      {/* Elegant background detail */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px opacity-20"
          style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-px opacity-20"
          style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
        />
        {/* Radial gold glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.03) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-8">
        <ChapterHeader number={7} title="Cosas que siempre admiré de ti" subtitle="Sin exagerar. Sin editar." />

        <div className="space-y-6">
          {traits.map((trait, i) => (
            <motion.div
              key={trait.id}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.18, duration: 0.9 }}
              className="group flex items-start gap-6 p-6 rounded"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(201,168,76,0.08)',
                transition: 'all 0.3s',
              }}
            >
              {/* Number */}
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <span className="text-3xl">{trait.icon}</span>
                <div className="w-px flex-1 min-h-0" style={{ background: 'rgba(201,168,76,0.2)' }} />
              </div>

              <div className="flex-1">
                <h3
                  className="font-display text-xl"
                  style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}
                >
                  {trait.title}
                </h3>
                <p
                  className="mt-2 font-body text-base leading-relaxed"
                  style={{ color: 'var(--warm-gray)' }}
                >
                  {trait.description}
                </p>
              </div>

              {/* Hover accent */}
              <motion.div
                className="flex-shrink-0 w-1 self-stretch rounded-full opacity-0 group-hover:opacity-100"
                style={{ background: 'var(--gold)', transition: 'opacity 0.3s' }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4, duration: 1 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4">
            <div className="w-12 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--gold))' }} />
            <p className="font-display text-lg italic" style={{ color: 'var(--warm-gray)' }}>
              {closingLine}
            </p>
            <div className="w-12 h-px" style={{ background: 'linear-gradient(270deg, transparent, var(--gold))' }} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
