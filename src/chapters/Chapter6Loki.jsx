import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import ChapterHeader from '../components/ChapterHeader'
import content from '../data/content.json'

export default function Chapter6Loki() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const chapter = content.chapters.find(c => c.id === 'loki-chapter')
  const { characters, closingNote } = chapter

  return (
    <section
      ref={ref}
      className="chapter-section"
      style={{
        background: 'linear-gradient(160deg, #040a0c 0%, #06100a 30%, #070510 60%, #040608 100%)',
        paddingTop: '80px',
        paddingBottom: '80px',
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-5"
          style={{
            backgroundImage: 'linear-gradient(45deg, transparent 40%, rgba(39,174,96,0.3) 50%, transparent 60%)',
            backgroundSize: '200px 200px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-8">
        <ChapterHeader number={chapter.number} title={chapter.title} subtitle={chapter.subtitle} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {characters.map((char, i) => (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 30, x: i % 2 === 0 ? -20 : 20 }}
              animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative overflow-hidden rounded"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, transparent, ${char.color}, transparent)` }} />

              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded flex items-center justify-center text-3xl"
                    style={{
                      background: `${char.color}15`,
                      border: `1px solid ${char.color}30`,
                    }}
                  >
                    {char.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-lg" style={{ color: 'var(--warm-white)' }}>
                        {char.name}
                      </h3>
                      <span className="font-mono text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: `${char.color}20`,
                          border: `1px solid ${char.color}30`,
                          color: char.color,
                        }}
                      >
                        {char.badge}
                      </span>
                    </div>
                    <p className="font-mono text-xs mt-1" style={{ color: char.color, opacity: 0.7, letterSpacing: '0.1em' }}>
                      {char.title}
                    </p>
                  </div>
                </div>

                <blockquote className="mt-4 pl-4 border-l" style={{ borderColor: `${char.color}60` }}>
                  <p className="font-body text-sm italic" style={{ color: 'var(--warm-gray)' }}>
                    {char.quote}
                  </p>
                </blockquote>

                <p className="mt-3 font-body text-sm" style={{ color: 'var(--warm-gray)', opacity: 0.7 }}>
                  {char.note}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-10 p-6 text-center rounded"
          style={{
            background: 'rgba(39,174,96,0.04)',
            border: '1px solid rgba(39,174,96,0.12)',
          }}
        >
          <span className="font-mono text-xs tracking-widest" style={{ color: 'rgba(39,174,96,0.6)' }}>
            NOTA DEL UNIVERSO
          </span>
          <p className="font-display text-lg italic mt-2" style={{ color: 'var(--warm-white)' }}>
            "{closingNote}"
          </p>
        </motion.div>
      </div>
    </section>
  )
}
