import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useParticles } from '../hooks/useChapterProgress'
import ChapterHeader from '../components/ChapterHeader'
import content from '../data/content.json'

const chapter = content.chapters.find(c => c.id === 'el-parque')

export default function Chapter3Park() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-80px' })
  const particles = useParticles(40)

  return (
    <section
      ref={ref}
      className="chapter-section flex items-center"
      style={{
        background: 'radial-gradient(ellipse at 50% 80%, #0c1820 0%, #050a14 40%, #000810 100%)',
      }}
    >
      {/* Night sky stars */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              opacity: [p.opacity * 0.3, p.opacity, p.opacity * 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Moon */}
        <motion.div
          className="absolute"
          style={{ top: '12%', right: '15%' }}
          animate={{ opacity: inView ? [0.6, 0.9, 0.6] : 0.4 }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div
            className="rounded-full"
            style={{
              width: '60px',
              height: '60px',
              background: 'radial-gradient(circle at 35% 35%, #fffde7, #f0d060)',
              boxShadow: '0 0 40px rgba(240,208,96,0.3), 0 0 80px rgba(240,208,96,0.1)',
            }}
          />
        </motion.div>

        {/* Ground/bench silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: 'linear-gradient(0deg, #020408 0%, transparent 100%)',
          }}
        />

        {/* Tree silhouettes */}
        <svg className="absolute bottom-0 left-0 right-0 w-full" height="200" viewBox="0 0 800 200" preserveAspectRatio="none">
          <path d="M0,200 L0,120 Q20,80 40,120 L40,200Z" fill="#020408" />
          <path d="M30,200 L30,90 Q55,40 80,90 L80,200Z" fill="#020408" />
          <path d="M700,200 L700,100 Q730,50 760,100 L760,200Z" fill="#020408" />
          <path d="M750,200 L750,130 Q770,90 790,130 L790,200Z" fill="#020408" />
          <path d="M0,200 L800,200 L800,180 L0,180Z" fill="#020408" />
        </svg>

        {/* Firefly particles */}
        {particles.slice(0, 8).map(p => (
          <motion.div
            key={`ff-${p.id}`}
            className="absolute rounded-full"
            style={{
              left: `${20 + p.x * 0.6}%`,
              top: `${50 + p.y * 0.35}%`,
              width: 3,
              height: 3,
              background: '#c9a84c',
              boxShadow: '0 0 6px rgba(201,168,76,0.8)',
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 60],
              y: [0, (Math.random() - 0.5) * 40],
              opacity: [0, 0.9, 0],
            }}
            transition={{
              duration: p.duration * 1.5,
              delay: p.delay * 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-12 py-24 w-full">
        <ChapterHeader number={chapter.number} title={chapter.title} subtitle={chapter.subtitle} />

        <div className="space-y-8">
          {chapter.paragraphs.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.4, duration: 1 }}
              className="font-body text-lg md:text-xl leading-relaxed"
              style={{ color: i === 0 ? 'var(--warm-white)' : 'var(--warm-gray)', opacity: i === 0 ? 0.9 : 1 }}
            >
              {paragraph}
            </motion.p>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 1 }}
            className="p-6 rounded"
            style={{
              background: 'rgba(201,168,76,0.05)',
              border: '1px solid rgba(201,168,76,0.15)',
            }}
          >
            <p className="font-display text-xl italic" style={{ color: 'var(--gold-light)' }}>
              "{chapter.quote}"
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
