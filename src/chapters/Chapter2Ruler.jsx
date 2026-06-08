import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import ChapterHeader from '../components/ChapterHeader'
import content from '../data/content.json'

const chapter = content.chapters.find(c => c.id === 'la-regla')

const RULER_MARKS = Array.from({ length: 31 }, (_, i) => ({
  val: i,
  big: i % 5 === 0,
  mid: i % 1 === 0,
}))

export default function Chapter2Ruler() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [numberVisible, setNumberVisible] = useState(false)

  return (
    <section
      ref={ref}
      className="chapter-section flex items-center"
      style={{
        background: 'linear-gradient(135deg, #0f0a20 0%, #160a24 50%, #0a0f18 100%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(138,43,226,0.05) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-24 w-full">
        <ChapterHeader number={chapter.number} title={chapter.title} subtitle={chapter.subtitle} />

        {/* The Ruler */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.4 }}
          onAnimationComplete={() => setTimeout(() => setNumberVisible(true), 800)}
          className="relative mb-16"
          style={{ perspective: '1000px' }}
        >
          <motion.div
            initial={{ rotateX: -20, rotateY: 15 }}
            animate={inView ? { rotateX: 0, rotateY: 0 } : {}}
            transition={{ duration: 1.5, delay: 0.4 }}
            className="relative"
          >
            {/* Ruler body — plástico escolar */}
            <div
              className="relative w-full overflow-hidden"
              style={{
                height: '80px',
                background: 'linear-gradient(180deg, #fefce8 0%, #fde047 30%, #facc15 55%, #fde047 80%, #fef9c3 100%)',
                borderRadius: '4px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.08)',
                border: '1px solid rgba(250,204,21,0.4)',
              }}
            >
              {/* Brillo de plástico */}
              <div className="absolute inset-0 opacity-40"
                style={{
                  background: 'linear-gradient(105deg, rgba(255,255,255,0.55) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.15) 100%)',
                }}
              />

              {/* Ruler marks */}
              <div className="absolute bottom-0 left-4 right-4 flex items-end justify-between h-full">
                {RULER_MARKS.map(mark => (
                  <div key={mark.val} className="flex flex-col items-center justify-end pb-1" style={{ flex: 1 }}>
                    <div
                      style={{
                        width: '1.5px',
                        height: mark.big ? '28px' : mark.val % 2 === 0 ? '18px' : '10px',
                        background: 'rgba(30,30,30,0.75)',
                      }}
                    />
                    {mark.big && mark.val > 0 && (
                      <span style={{
                        fontSize: '8px',
                        color: 'rgba(30,30,30,0.85)',
                        fontFamily: 'Courier Prime, monospace',
                        marginTop: '2px',
                        fontWeight: 'bold',
                      }}>
                        {mark.val}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Written number on ruler */}
              <AnimatedRulerText visible={numberVisible} text={chapter.rulerText} />
            </div>

            {/* Ruler shadow */}
            <div
              className="absolute -bottom-4 left-2 right-2 h-4 rounded-full"
              style={{ background: 'rgba(0,0,0,0.4)', filter: 'blur(8px)' }}
            />
          </motion.div>
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.5 }}
          className="relative pl-6 border-l-2"
          style={{ borderColor: 'var(--gold)' }}
        >
          <p className="font-display text-xl md:text-2xl italic leading-relaxed"
            style={{ color: 'var(--warm-white)' }}>
            "{chapter.quote}"
          </p>
        </motion.blockquote>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 2.2, duration: 1 }}
          className="mt-8 font-body"
          style={{ color: 'var(--warm-gray)', fontStyle: 'italic' }}
        >
          {chapter.body}
        </motion.p>
      </div>
    </section>
  )
}

function AnimatedRulerText({ visible, text }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={visible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-4 left-1/2 -translate-x-1/2"
    >
      <motion.span
        initial={{ pathLength: 0 }}
        style={{
          fontFamily: 'Courier Prime, monospace',
          fontSize: '13px',
          color: 'rgba(30,30,30,0.85)',
          fontStyle: 'italic',
          letterSpacing: '0.15em',
          whiteSpace: 'nowrap',
        }}
      >
        {visible && <TypedText text={text} delay={200} />}
      </motion.span>
    </motion.div>
  )
}

function TypedText({ text, delay = 0 }) {
  const [shown, setShown] = useState('')
  useRef(() => {
    setTimeout(() => {
      let i = 0
      const iv = setInterval(() => {
        setShown(text.slice(0, i + 1))
        i++
        if (i >= text.length) clearInterval(iv)
      }, 80)
    }, delay)
  })

  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  if (!started && !ref.current) {
    setTimeout(() => {
      setStarted(true)
      let i = 0
      const iv = setInterval(() => {
        setShown(t => text.slice(0, i + 1))
        i++
        if (i >= text.length) clearInterval(iv)
      }, 80)
    }, delay)
  }

  return <>{shown}</>
}
