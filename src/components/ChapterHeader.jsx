import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function ChapterHeader({ number, title, subtitle }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div ref={ref} className="mb-16 md:mb-24">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="flex items-center gap-4 mb-4"
      >
        <span
          className="font-mono text-xs tracking-[0.4em] uppercase"
          style={{ color: 'var(--gold)', opacity: 0.6 }}
        >
          Capítulo {String(number).padStart(2, '0')}
        </span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, var(--gold), transparent)', opacity: 0.3 }} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.2 }}
        className="font-display font-bold"
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          color: 'var(--warm-white)',
          lineHeight: 1.1,
          fontStyle: 'italic',
        }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-3 font-body"
          style={{ color: 'var(--warm-gray)', fontSize: '1rem', fontStyle: 'italic' }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
