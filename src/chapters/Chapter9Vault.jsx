import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import ChapterHeader from '../components/ChapterHeader'
import MemoryVaultView from '../components/MemoryVaultView'
import content from '../data/content.json'

export default function Chapter9Vault() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const chapter = content.chapters.find(c => c.id === 'caja-fuerte')
  const [showVaultView, setShowVaultView] = useState(false)
  const [phase, setPhase] = useState('idle') // idle | clicking | spinning | opening | open

  const handleClick = () => {
    if (showVaultView || phase !== 'idle') return
    setPhase('clicking')
    setTimeout(() => setPhase('spinning'), 300)
    setTimeout(() => setPhase('opening'), 1800)
    setTimeout(() => {
      setPhase('open')
      setTimeout(() => setShowVaultView(true), 500)
    }, 2800)
  }

  const handleCloseVault = () => {
    setShowVaultView(false)
    setPhase('idle')
  }

  return (
    <>
      <section
        ref={ref}
        className="chapter-section flex items-center"
        style={{
          background: 'linear-gradient(180deg, #040408 0%, #080610 50%, #040408 100%)',
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, rgba(201,168,76,0.01) 0px, rgba(201,168,76,0.01) 1px, transparent 1px, transparent 80px)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-12 py-8 w-full">
          <ChapterHeader number={chapter.number} title={chapter.title} subtitle={chapter.subtitle} />

          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1 }}
              className="relative"
            >
              <motion.div
                className="relative cursor-pointer select-none"
                onClick={handleClick}
                whileHover={phase === 'idle' ? { scale: 1.02 } : {}}
                whileTap={phase === 'idle' ? { scale: 0.98 } : {}}
                style={{ width: 'min(320px, 80vw)', aspectRatio: '1' }}
              >
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'linear-gradient(145deg, #2a2a3a, #1a1a28, #0f0f1e)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
                    border: '2px solid rgba(201,168,76,0.3)',
                  }}
                />

                <AnimatePresence>
                  {phase !== 'open' && (
                    <motion.div
                      className="absolute inset-0 rounded-lg overflow-hidden"
                      exit={{
                        rotateY: -100,
                        opacity: 0,
                        transition: { duration: 1, ease: [0.76, 0, 0.24, 1] },
                      }}
                      style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d', perspective: '1000px' }}
                    >
                      <div
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: 'linear-gradient(145deg, #3a3a50, #2a2a40)',
                          border: '2px solid rgba(201,168,76,0.3)',
                        }}
                      />

                      {[[15, 15], [85, 15], [15, 85], [85, 85]].map(([x, y], i) => (
                        <div key={i}
                          className="absolute w-4 h-4 rounded-full"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            transform: 'translate(-50%, -50%)',
                            background: 'radial-gradient(circle, #e8c97a, #a07830)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                          }}
                        />
                      ))}

                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="relative w-28 h-28"
                          animate={phase === 'spinning' ? { rotate: [0, -360, 360, -180, 90] } : {}}
                          transition={phase === 'spinning' ? { duration: 1.5, ease: 'easeInOut' } : {}}
                        >
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: 'conic-gradient(from 0deg, #c9a84c, #8a6030, #c9a84c, #8a6030, #c9a84c)',
                              boxShadow: '0 4px 15px rgba(201,168,76,0.3)',
                            }}
                          />
                          <div
                            className="absolute rounded-full"
                            style={{
                              inset: '8px',
                              background: 'radial-gradient(circle, #3a3a50, #1a1a28)',
                            }}
                          />
                          {Array.from({ length: 12 }, (_, i) => (
                            <div key={i}
                              className="absolute w-0.5 h-3"
                              style={{
                                left: '50%',
                                top: '6px',
                                transformOrigin: 'bottom center',
                                transform: `translateX(-50%) rotate(${i * 30}deg)`,
                                background: i % 3 === 0 ? '#c9a84c' : '#60607a',
                              }}
                            />
                          ))}
                          <div
                            className="absolute rounded-full"
                            style={{
                              inset: '38px',
                              background: 'radial-gradient(circle, #c9a84c, #8a6030)',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                            }}
                          />
                          <div
                            className="absolute top-0 left-1/2 w-1 h-3 rounded"
                            style={{ transform: 'translateX(-50%)', background: '#c9a84c' }}
                          />
                        </motion.div>
                      </div>

                      <div
                        className="absolute right-6 top-1/2 -translate-y-1/2"
                        style={{
                          width: '16px',
                          height: '60px',
                          background: 'linear-gradient(180deg, #e8c97a, #8a6030)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                        }}
                      />

                      {phase === 'idle' && (
                        <motion.p
                          animate={{ opacity: [0.4, 0.8, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute bottom-4 left-0 right-0 text-center font-mono text-xs tracking-widest"
                          style={{ color: 'var(--gold)', letterSpacing: '0.3em' }}
                        >
                          PULSA PARA ABRIR
                        </motion.p>
                      )}

                      {phase === 'spinning' && (
                        <p className="absolute bottom-4 left-0 right-0 text-center font-mono text-xs tracking-widest"
                          style={{ color: 'var(--gold)' }}>
                          DESBLOQUEANDO...
                        </p>
                      )}

                      {phase === 'opening' && (
                        <p className="absolute bottom-4 left-0 right-0 text-center font-mono text-xs tracking-widest"
                          style={{ color: 'var(--gold)' }}>
                          ABRIENDO...
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {phase === 'open' && !showVaultView && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'radial-gradient(ellipse at center, #1a1010 0%, #0a0808 100%)',
                        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.9)',
                      }}
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                        style={{ fontSize: '4rem' }}
                      >
                        ✨
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {(phase === 'opening' || phase === 'open') && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute -inset-8 rounded-full pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)',
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              <div
                className="mx-auto mt-2"
                style={{
                  width: '80%',
                  height: '20px',
                  background: 'rgba(0,0,0,0.6)',
                  filter: 'blur(12px)',
                  borderRadius: '50%',
                }}
              />
            </motion.div>

            {phase === 'idle' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 }}
                className="mt-10 text-center font-body text-sm italic max-w-md"
                style={{ color: 'var(--warm-gray)', opacity: 0.7 }}
              >
                Lo guardado durante años está dentro. Pulsa la caja para entrar.
              </motion.p>
            )}
          </div>
        </div>
      </section>

      <MemoryVaultView isOpen={showVaultView} onClose={handleCloseVault} />
    </>
  )
}
