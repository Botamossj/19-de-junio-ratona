import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const EASE = [0.22, 1, 0.36, 1]
const FONT = 'Impact, Anton, "Arial Black", sans-serif'
const GOLD = '#e8c97a'
const DURATION_MS = 30000

const DEFAULT_COMIC_IMAGES = [
  ...Array.from({ length: 9 }, (_, i) => `/memories/shere${i + 1}comic.png`),
  '/memories/shere10_comic.png',
  '/memories/shere11_comic.png',
]
const DEFAULT_LETTER_IMAGES = Array.from({ length: 11 }, (_, i) => `/memories/shere${i + 1}.jpeg`)

/* 30s: montaje 0–10s | letras+rojo 10–22s | glow 22–28s | flash 28–30s */
const PHASE_TIMES = {
  letters: 10000,
  glow: 22000,
  flash: 28000,
}

function getComicSources(config = {}) {
  if (config.montageComicImages?.length) return config.montageComicImages
  return DEFAULT_COMIC_IMAGES
}

function getLetterSources(config = {}) {
  if (config.letterImages?.length) return config.letterImages
  if (config.heroImages?.length) return config.heroImages
  return DEFAULT_LETTER_IMAGES
}

function supportsTextClip() {
  if (typeof window === 'undefined' || !window.CSS?.supports) return true
  return CSS.supports('(-webkit-background-clip: text)') || CSS.supports('background-clip', 'text')
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 640px)').matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return isMobile
}

function CinematicLetter({ char, letterImages, index, phase, useClip, letterCount, isMobile }) {
  const [frame, setFrame] = useState(index % Math.max(letterImages.length, 1))
  const visible = phase !== 'montage'
  const glow = phase === 'glow' || phase === 'flash'
  const brightening = phase === 'letters' || glow
  const rotateY = -10 + (index / Math.max(letterCount - 1, 1)) * 20

  useEffect(() => {
    if (!visible || !letterImages.length) return undefined
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % letterImages.length)
    }, 110)
    return () => clearInterval(interval)
  }, [visible, letterImages.length])

  const imageSrc = letterImages[frame % letterImages.length] || letterImages[0]

  if (char === ' ') {
    return <span className="inline-block" style={{ width: '0.22em' }} />
  }

  const baseStyle = {
    display: 'inline-block',
    fontFamily: FONT,
    fontWeight: 900,
    fontSize: isMobile ? 'clamp(5rem, 29vw, 12rem)' : 'clamp(4rem, 18vw, 18rem)',
    lineHeight: isMobile ? 0.82 : 0.9,
    letterSpacing: isMobile ? '-0.13em' : '-0.08em',
    textTransform: 'uppercase',
    whiteSpace: 'pre',
  }

  const faceStyle = useClip
    ? {
        ...baseStyle,
        position: 'relative',
        transform: 'translateZ(12px)',
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%), url(${imageSrc})`,
        backgroundSize: '220% 220%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: useClip ? GOLD : 'transparent',
        WebkitTextFillColor: useClip ? 'transparent' : undefined,
        WebkitTextStroke: glow
          ? `2px ${GOLD}`
          : brightening
            ? `1px rgba(201,168,76,0.65)`
            : '0.5px rgba(255,255,255,0.25)',
        filter: glow
          ? 'drop-shadow(0 0 32px rgba(201,168,76,0.95)) drop-shadow(0 0 60px rgba(201,168,76,0.4))'
          : brightening
            ? 'drop-shadow(0 0 16px rgba(201,168,76,0.4)) drop-shadow(0 6px 16px rgba(0,0,0,0.9))'
            : 'drop-shadow(0 4px 12px rgba(0,0,0,0.85))',
      }
    : {
        ...baseStyle,
        position: 'relative',
        transform: 'translateZ(12px)',
        color: glow ? GOLD : '#f5f0e8',
        textShadow: glow
          ? `0 0 30px rgba(201,168,76,0.9), 0 0 60px rgba(201,168,76,0.4)`
          : '0 2px 16px rgba(0,0,0,0.8)',
        WebkitTextStroke: glow ? `1px ${GOLD}` : 'none',
      }

  const extrusionLayers = isMobile ? [] : [8, 7, 6, 5, 4, 3, 2, 1]

  return (
    <motion.div
      className="inline-block relative"
      style={{
        perspective: isMobile ? undefined : 800,
        transformStyle: isMobile ? undefined : 'preserve-3d',
        margin: isMobile ? '0 -0.07em' : '0 -0.015em',
      }}
      initial={
        isMobile
          ? { opacity: 0, y: 30, scale: 0.9 }
          : { opacity: 0, y: 50, rotateX: 38, rotateY: rotateY - 20, z: -120 }
      }
      animate={
        isMobile
          ? {
              opacity: visible ? 1 : 0,
              y: visible ? 0 : 24,
              scale: visible ? (glow ? 1.08 : 1.03) : 0.9,
            }
          : {
              opacity: visible ? 1 : 0,
              y: visible ? 0 : 36,
              rotateX: visible ? (glow ? 6 : 14) : 38,
              rotateY: visible ? rotateY : rotateY - 20,
              z: visible ? (glow ? 48 : 16) : -120,
              scale: visible ? (glow ? 1.06 : brightening ? 1.02 : 0.88) : 0.88,
            }
      }
      transition={{
        opacity: { duration: 0.9, delay: index * 0.08, ease: EASE },
        y: { duration: 0.9, delay: index * 0.08, ease: EASE },
        rotateX: { duration: 1.1, delay: index * 0.08, ease: EASE },
        rotateY: { duration: 1.1, delay: index * 0.08, ease: EASE },
        z: { duration: glow ? 0.7 : 9, delay: index * 0.08, ease: EASE },
        scale: { duration: glow ? 0.6 : 10, delay: index * 0.08, ease: EASE },
      }}
    >
      {/* Extrusión 3D — capas hacia atrás */}
      {extrusionLayers.map((layer) => (
        <span
          key={layer}
          aria-hidden
          style={{
            ...baseStyle,
            position: 'absolute',
            left: 0,
            top: 0,
            color: glow
              ? `rgba(${120 + layer * 8}, ${90 + layer * 6}, ${30 + layer * 4}, 0.95)`
              : `rgba(${28 + layer * 3}, ${18 + layer * 2}, ${22 + layer}, 0.92)`,
            WebkitTextStroke: 'none',
            transform: `translateZ(${-layer * 3}px) translateY(${layer * 1.4}px)`,
            opacity: visible ? 0.85 : 0,
            pointerEvents: 'none',
          }}
        >
          {char}
        </span>
      ))}

      {/* Borde cromado / dorado en relieve */}
      <span
        aria-hidden
        style={{
          ...baseStyle,
          position: 'absolute',
          left: 0,
          top: 0,
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
          WebkitTextStroke: glow ? `2.5px ${GOLD}` : '1.5px rgba(220,200,160,0.45)',
          transform: 'translateZ(18px)',
          opacity: visible ? (glow ? 0.95 : 0.55) : 0,
          pointerEvents: 'none',
          filter: glow ? 'drop-shadow(0 0 8px rgba(201,168,76,0.8))' : 'none',
        }}
      >
        {char}
      </span>

      {/* Cara frontal con fotos recortadas */}
      {useClip ? (
        <motion.span
          animate={{
            backgroundPosition: visible
              ? [
                  `${20 + index * 5}% 30%`,
                  `${65 + index * 3}% 70%`,
                  `${20 + index * 5}% 30%`,
                ]
              : `${20 + index * 5}% 30%`,
          }}
          transition={{
            backgroundPosition: { duration: 2.8 + index * 0.25, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={faceStyle}
        >
          {char}
        </motion.span>
      ) : (
        <span style={faceStyle}>{char}</span>
      )}
    </motion.div>
  )
}

export default function CinematicLettersIntro({ config = {}, onComplete }) {
  const finished = useRef(false)
  const onCompleteRef = useRef(onComplete)
  const audioRef = useRef(null)
  onCompleteRef.current = onComplete

  const duration = config.cinematicIntroDuration ?? DURATION_MS
  const heroName = (config.heroName || 'SHERE').toUpperCase()
  const birthdayText = config.birthdayRevealText || config.outroTitle || 'Feliz cumpleaños'
  const comicImages = useMemo(() => getComicSources(config), [config])
  const letterImages = useMemo(() => getLetterSources(config), [config])
  const letters = heroName.split('')
  const useClip = useMemo(() => supportsTextClip(), [])
  const isMobile = useIsMobile()

  const [phase, setPhase] = useState('montage')
  const [montageIndex, setMontageIndex] = useState(0)
  const [montageZoom, setMontageZoom] = useState(1.32)
  const [overlayDark, setOverlayDark] = useState(0.72)
  const [failedComic, setFailedComic] = useState(() => new Set())

  const validComic = useMemo(
    () => comicImages.filter((src) => !failedComic.has(src)),
    [comicImages, failedComic],
  )

  const currentComic = validComic.length
    ? validComic[montageIndex % validComic.length]
    : comicImages[0]

  const stopAudio = useCallback(() => {
    const a = audioRef.current
    if (a) {
      a.pause()
      a.currentTime = 0
      audioRef.current = null
    }
  }, [])

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    stopAudio()
    document.body.style.overflow = ''
    onCompleteRef.current?.()
  }, [stopAudio])

  useEffect(() => {
    finished.current = false
    document.body.style.overflow = 'hidden'

    const audioSrc = config.cinematicIntroAudio || config.heroAudio
    if (audioSrc) {
      const a = new Audio(audioSrc)
      a.volume = config.cinematicIntroAudioVolume ?? config.heroAudioVolume ?? 0.88
      audioRef.current = a
      a.play().catch(() => {})
    }

    const scale = duration / DURATION_MS
    const tLetters = setTimeout(() => setPhase('letters'), PHASE_TIMES.letters * scale)
    const tGlow = setTimeout(() => setPhase('glow'), PHASE_TIMES.glow * scale)
    const tFlash = setTimeout(() => setPhase('flash'), PHASE_TIMES.flash * scale)
    const tDone = setTimeout(finish, duration)

    return () => {
      clearTimeout(tLetters)
      clearTimeout(tGlow)
      clearTimeout(tFlash)
      clearTimeout(tDone)
      stopAudio()
      document.body.style.overflow = ''
    }
  }, [duration, finish, stopAudio, config.cinematicIntroAudio, config.heroAudio, config.cinematicIntroAudioVolume, config.heroAudioVolume])

  /* De-zoom progresivo del fondo durante el montaje */
  useEffect(() => {
    if (phase !== 'montage') {
      setMontageZoom(1)
      setOverlayDark(phase === 'letters' ? 0.55 : 0.65)
      return undefined
    }

    const start = performance.now()
    const montageMs = PHASE_TIMES.letters * (duration / DURATION_MS)
    let raf

    const tick = (now) => {
      const t = Math.min(1, (now - start) / montageMs)
      setMontageZoom(isMobile ? 1.18 - t * 0.18 : 1.32 - t * 0.32)
      setOverlayDark(isMobile ? 0.55 - t * 0.25 : 0.72 - t * 0.38)
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase, duration, isMobile])

  /* Montaje de fondo — sigue pasando durante toda la intro */
  useEffect(() => {
    if (!validComic.length) return undefined
    const interval = setInterval(() => {
      setMontageIndex((i) => (i + 1) % validComic.length)
    }, phase === 'montage' ? 200 : 260)
    return () => clearInterval(interval)
  }, [validComic.length, phase])

  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 2,
        dur: Math.random() * 3 + 2,
      })),
    [],
  )

  const handleComicError = (src) => {
    setFailedComic((prev) => new Set(prev).add(src))
  }

  const redIntensity =
    phase === 'montage' ? 0 : phase === 'letters' ? 0.5 : phase === 'glow' ? 0.78 : 0.88

  return (
    <motion.div
      className="fixed inset-0 overflow-x-hidden overflow-y-hidden flex items-center justify-center w-full max-w-[100vw] min-h-[100dvh]"
      style={{ zIndex: 130, background: '#030108' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      role="dialog"
      aria-label="Intro cinematográfica"
    >
      {/* Fondo espacial base */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(124,58,237,0.18) 0%, transparent 45%), radial-gradient(ellipse at 50% 60%, rgba(120,20,30,0.35) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 60%), #030108',
        }}
      />

      {/* Montaje fullscreen — zoom global que se va retirando */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{ transformOrigin: '50% 45%' }}
        animate={{
          scale: phase === 'montage' ? montageZoom : 1,
        }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <AnimatePresence mode="popLayout">
          {currentComic && (
            <motion.div
              key={`${montageIndex}-${currentComic}`}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: phase === 'montage' ? 0.98 : 0.38,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={currentComic}
                alt=""
                className="w-full h-full object-cover"
                onError={() => handleComicError(currentComic)}
              />
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: overlayDark }}
                transition={{ duration: 0.4 }}
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(40,8,20,0.45) 45%, rgba(0,0,0,0.75) 100%)',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Transición a rojo al aparecer SHERE */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 4,
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(180,30,40,0.55) 0%, rgba(90,10,18,0.85) 55%, rgba(30,4,8,0.95) 100%)',
        }}
        animate={{ opacity: redIntensity }}
        transition={{ duration: phase === 'letters' ? 2.8 : 1.2, ease: EASE }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.1]"
        style={{
          zIndex: 5,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.45) 2px, rgba(0,0,0,0.45) 4px)',
        }}
      />

      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            zIndex: 6,
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 2 === 0 ? GOLD : '#a78bfa',
            boxShadow: `0 0 8px ${p.id % 2 === 0 ? 'rgba(201,168,76,0.8)' : 'rgba(167,139,250,0.6)'}`,
          }}
          animate={{ opacity: [0.1, 0.8, 0.1], y: [0, -18, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Letras SHERE — bloque 3D con perspectiva */}
      <motion.div
        className={`relative text-center w-full ${isMobile ? 'px-0' : 'px-4'}`}
        style={{ zIndex: 10, perspective: isMobile ? 1200 : 1400, transformStyle: 'preserve-3d' }}
        initial={{ scale: 0.88, opacity: 0, rotateX: 22 }}
        animate={{
          scale: phase === 'montage'
            ? 0.88
            : isMobile
              ? [1.02, 1.12, phase === 'glow' || phase === 'flash' ? 1.26 : 1.2]
              : [0.94, 1, phase === 'glow' || phase === 'flash' ? 1.08 : 1.04],
          opacity: 1,
          rotateX: phase === 'montage' ? 22 : isMobile ? [8, 5, 3] : [16, 12, phase === 'glow' || phase === 'flash' ? 8 : 10],
        }}
        transition={{ duration: duration / 1000, ease: EASE }}
      >
        <motion.div
          className={`flex justify-center items-center w-full ${isMobile ? 'flex-nowrap' : 'flex-wrap'}`}
          style={{ transformStyle: 'preserve-3d' }}
          animate={{
            rotateX: phase === 'montage' ? 18 : phase === 'glow' || phase === 'flash' ? 8 : 11,
            rotateZ: 0,
            z: phase === 'glow' || phase === 'flash' ? 40 : 0,
          }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          {letters.map((char, i) => (
            <CinematicLetter
              key={`${char}-${i}`}
              char={char}
              index={i}
              phase={phase}
              useClip={useClip}
              letterImages={letterImages}
              letterCount={letters.filter((c) => c !== ' ').length}
              isMobile={isMobile}
            />
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{
            opacity: phase === 'glow' || phase === 'flash' ? 1 : 0,
            y: phase === 'glow' || phase === 'flash' ? 0 : 16,
            scale: phase === 'glow' || phase === 'flash' ? 1 : 0.96,
          }}
          transition={{ duration: 0.9, ease: EASE }}
          className="font-serif italic mt-8 md:mt-12"
          style={{
            fontSize: 'clamp(1.1rem, 4vw, 2.2rem)',
            color: GOLD,
            textShadow: '0 0 24px rgba(201,168,76,0.55), 0 0 48px rgba(201,168,76,0.25)',
            letterSpacing: '0.04em',
          }}
        >
          {birthdayText}
        </motion.p>
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 8,
          background: 'linear-gradient(105deg, transparent 42%, rgba(232,201,122,0.14) 50%, transparent 58%)',
        }}
        animate={{ x: ['-120%', '220%'] }}
        transition={{ duration: 2.2, delay: 1.2, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 9, background: `linear-gradient(180deg, ${GOLD}, #fff8e8)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'flash' ? [0, 0.55, 0] : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 11, boxShadow: 'inset 0 0 120px rgba(0,0,0,0.85)' }}
      />

      <button
        type="button"
        onClick={finish}
        className="absolute font-mono text-xs tracking-widest uppercase cursor-pointer"
        style={{
          top: 'max(20px, env(safe-area-inset-top))',
          right: 'max(20px, env(safe-area-inset-right))',
          zIndex: 20,
          padding: '10px 18px',
          border: '1px solid rgba(201,168,76,0.35)',
          background: 'rgba(0,0,0,0.45)',
          color: 'rgba(245,240,232,0.75)',
          letterSpacing: '0.18em',
          backdropFilter: 'blur(8px)',
        }}
      >
        Saltar intro
      </button>
    </motion.div>
  )
}
