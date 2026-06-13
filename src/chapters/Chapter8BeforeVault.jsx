import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import ChapterHeader from '../components/ChapterHeader'
import content from '../data/content.json'

export default function Chapter8BeforeVault() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const chapter = content.chapters.find(c => c.id === 'antes-de-abrir')

  return (
    <section
      ref={ref}
      className="chapter-section flex items-center"
      style={{
        background: 'linear-gradient(180deg, #050508 0%, #0a0812 50%, #060608 100%)',
        paddingTop: '80px',
        paddingBottom: '80px',
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(201,168,76,0.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-64"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.04) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-12 py-8 w-full">
        <ChapterHeader number={chapter.number} title={chapter.title} subtitle={chapter.subtitle} />

        <div className="space-y-8">
          {chapter.paragraphs.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.25, duration: 0.9 }}
              className="font-body text-lg md:text-xl leading-relaxed whitespace-pre-line"
              style={{
                color: i === chapter.paragraphs.length - 1 ? 'var(--gold-light)' : 'var(--warm-gray)',
                fontStyle: i >= chapter.paragraphs.length - 2 ? 'italic' : 'normal',
                opacity: i === 0 ? 0.95 : 1,
              }}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-16 flex flex-col items-center"
        >
          <div className="h-px w-24" style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', opacity: 0.35 }} />

          <motion.p
            animate={{ opacity: [0.3, 0.7, 0.3], y: [0, 4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="font-mono text-xs tracking-widest mt-6"
            style={{ color: 'var(--text-dim)' }}
          >
            ↓
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
