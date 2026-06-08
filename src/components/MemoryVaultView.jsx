import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import content from '../data/content.json'

function polaroidAngle(index) {
  const angles = [-4, 3, -2, 2, -3, 1, -1, 4]
  return angles[index % angles.length]
}

function VaultPolaroid({ memory, index }) {
  const [videoError, setVideoError] = useState(false)
  const angle = polaroidAngle(index)
  const isVideo = memory.type === 'video' && memory.src && !videoError

  return (
    <motion.article
      initial={{ opacity: 0, y: 30, rotate: angle * 0.5 }}
      animate={{ opacity: 1, y: 0, rotate: angle }}
      transition={{ delay: Math.min(index * 0.03, 1.2), duration: 0.7, type: 'spring', stiffness: 100 }}
      whileHover={{ rotate: 0, scale: 1.03, zIndex: 10, transition: { duration: 0.25 } }}
      className="polaroid"
      style={{
        transformOrigin: 'center bottom',
        background: '#f0ead6',
        padding: '10px 10px 36px 10px',
        boxShadow: '0 10px 32px rgba(0,0,0,0.5), 0 2px 0 rgba(255,255,255,0.05)',
      }}
    >
      <div
        className="w-full overflow-hidden relative flex items-center justify-center bg-black"
        style={{
          aspectRatio: isVideo ? '4/3' : '1',
          minHeight: isVideo ? '160px' : '120px',
        }}
      >
        {isVideo ? (
          <video
            src={memory.src}
            className="w-full h-full object-contain"
            controls
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
          />
        ) : (
          <img
            src={memory.src}
            alt={`Recuerdo ${memory.id}`}
            className="w-full h-full object-cover block"
            decoding="async"
          />
        )}
      </div>

      <div className="mt-2 text-center">
        <p
          style={{
            fontFamily: 'Courier Prime, monospace',
            fontSize: '0.6rem',
            color: '#4a3a28',
            letterSpacing: '0.06em',
          }}
        >
          #{String(memory.id).padStart(2, '0')}
        </p>
        {memory.caption && (
          <p
            className="mt-1 font-body text-xs italic leading-snug px-1"
            style={{ color: '#6a5040' }}
          >
            {memory.caption}
          </p>
        )}
      </div>
    </motion.article>
  )
}

export default function MemoryVaultView({ isOpen, onClose }) {
  const vaultChapter = content.chapters.find(c => c.id === 'caja-fuerte')
  const vaultView = vaultChapter.vaultView
  const memories = vaultView.memories || []

  const audioRef = useRef(null)
  const [musicAvailable, setMusicAvailable] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    document.body.style.overflow = 'hidden'

    const audio = new Audio(vaultView.music)
    audio.loop = true
    audio.volume = 0.35
    audioRef.current = audio

    const handleCanPlay = () => setMusicAvailable(true)
    const handleError = () => setMusicAvailable(false)
    const handlePlay = () => setMusicPlaying(true)
    const handlePause = () => setMusicPlaying(false)

    audio.addEventListener('canplaythrough', handleCanPlay)
    audio.addEventListener('error', handleError)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    audio.play().catch(() => {
      setMusicPlaying(false)
    })

    return () => {
      document.body.style.overflow = ''
      audio.pause()
      audio.removeEventListener('canplaythrough', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audioRef.current = null
    }
  }, [isOpen, vaultView.music])

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio || !musicAvailable) return

    if (musicPlaying) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
  }

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] overflow-y-auto"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, #1a1028 0%, #08060e 45%, #030208 100%)',
          }}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-64"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.12) 0%, transparent 70%)',
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, rgba(201,168,76,0.5) 0px, rgba(201,168,76,0.5) 1px, transparent 1px, transparent 60px)',
              }}
            />
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 opacity-20"
              style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.15), transparent)' }}
            />
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 opacity-20"
              style={{ background: 'linear-gradient(270deg, rgba(201,168,76,0.15), transparent)' }}
            />
          </div>

          <div className="relative z-10 min-h-full flex flex-col px-4 md:px-8 py-6 md:py-10 max-w-6xl mx-auto">
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-center mb-8 md:mb-10"
            >
              <p className="font-mono text-xs tracking-[0.35em] uppercase mb-4" style={{ color: 'var(--gold)', opacity: 0.6 }}>
                Bóveda abierta · {memories.length} recuerdos
              </p>
              <h2
                className="font-display font-bold italic"
                style={{
                  fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                  color: 'var(--warm-white)',
                  lineHeight: 1.15,
                }}
              >
                {vaultView.title}
              </h2>
              <p
                className="mt-4 font-body text-sm md:text-base max-w-xl mx-auto leading-relaxed"
                style={{ color: 'var(--warm-gray)', fontStyle: 'italic' }}
              >
                {vaultView.subtitle}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <motion.button
                  onClick={handleClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="font-mono text-xs tracking-widest uppercase px-6 py-3 cursor-pointer"
                  style={{
                    border: '1px solid rgba(201,168,76,0.4)',
                    color: 'var(--gold-light)',
                    background: 'rgba(201,168,76,0.08)',
                    letterSpacing: '0.2em',
                  }}
                >
                  {vaultView.closeLabel}
                </motion.button>

                {musicAvailable && (
                  <motion.button
                    onClick={toggleMusic}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="font-mono text-xs tracking-widest uppercase px-6 py-3 cursor-pointer"
                    style={{
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: 'var(--warm-gray)',
                      background: 'rgba(255,255,255,0.04)',
                      letterSpacing: '0.15em',
                    }}
                  >
                    {musicPlaying ? vaultView.musicPauseLabel : vaultView.musicPlayLabel}
                  </motion.button>
                )}
              </div>
            </motion.header>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 flex-1 w-full">
              {memories.map((memory, i) => (
                <VaultPolaroid key={memory.id} memory={memory} index={i} />
              ))}
            </div>

            <motion.footer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-12 md:mt-16 mb-8 text-center"
            >
              <div className="h-px max-w-xs mx-auto mb-8" style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', opacity: 0.35 }} />
              <p className="font-display text-lg md:text-xl italic max-w-lg mx-auto leading-relaxed" style={{ color: 'var(--warm-gray)' }}>
                {vaultView.closingNote}
              </p>
              <button
                onClick={handleClose}
                className="mt-10 font-mono text-xs tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: 'var(--text-dim)', background: 'transparent', border: 'none', cursor: 'pointer', letterSpacing: '0.25em' }}
              >
                ↑ {vaultView.closeLabel}
              </button>
            </motion.footer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
