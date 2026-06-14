import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

const MARVEL_RED = '#ed1d24'
const FLIP_STAGGER = 0.11
const FLIP_DURATION = 0.34
const FONT = 'Arial Black, Impact, sans-serif'

const DEFAULT_IMAGES = Array.from({ length: 9 }, (_, i) => `/memories/shere${i + 1}.jpeg`)

/** Bloque de letra estilo Marvel: flip 3D + flipbook de fotos dentro del recorte */
function MarvelLetterBlock({ char, images, index }) {
  const clipId = `hero-letter-clip-${index}`
  const chromeId = `hero-letter-chrome-${index}`
  const flipDelay = 0.22 + index * FLIP_STAGGER
  const w = char === 'H' ? 92 : char === 'S' ? 78 : 72
  const h = 108

  const [frame, setFrame] = useState(index % images.length)

  useEffect(() => {
    let interval
    const start = setTimeout(() => {
      interval = setInterval(() => {
        setFrame((f) => (f + 1) % images.length)
      }, 62)
    }, Math.max(0, flipDelay * 1000 - 80))
    return () => {
      clearTimeout(start)
      if (interval) clearInterval(interval)
    }
  }, [flipDelay, images.length, index])

  if (char === ' ') {
    return <span style={{ display: 'inline-block', width: 14 }} />
  }

  return (
    <div
      className="inline-block align-middle"
      style={{
        perspective: 1100,
        width: w,
        height: h,
        margin: '0 1px',
      }}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          position: 'relative',
          transformOrigin: 'center center',
        }}
        initial={{ rotateY: -92, scale: 0.92 }}
        animate={{ rotateY: 0, scale: 1 }}
        transition={{
          delay: flipDelay,
          duration: FLIP_DURATION,
          ease: [0.45, 0.05, 0.2, 1],
        }}
      >
        {/* Cara trasera — borde plateado (se ve al girar) */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg) translateZ(5px)',
            background: 'linear-gradient(180deg, #d8d8d8 0%, #6a6a6a 50%, #3a3a3a 100%)',
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.4)',
          }}
        />

        {/* Cara frontal — letra cromada con fotos */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(5px)',
            filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.55))',
          }}
        >
          <svg
            width={w}
            height={h}
            viewBox={`0 0 ${w} ${h}`}
            style={{ display: 'block', overflow: 'visible' }}
          >
            <defs>
              <clipPath id={clipId}>
                <text
                  x={w / 2}
                  y={h * 0.8}
                  textAnchor="middle"
                  fontSize={h * 0.88}
                  fontWeight="900"
                  fontFamily={FONT}
                >
                  {char}
                </text>
              </clipPath>
              <linearGradient id={chromeId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="18%" stopColor="#e8e8e8" />
                <stop offset="45%" stopColor="#9a9a9a" />
                <stop offset="72%" stopColor="#d0d0d0" />
                <stop offset="100%" stopColor="#606060" />
              </linearGradient>
            </defs>

            {/* Foto dentro de la letra (flipbook) */}
            <image
              href={images[frame]}
              x={-8}
              y={-6}
              width={w + 16}
              height={h + 12}
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipId})`}
            />

            {/* Borde cromado de la letra */}
            <text
              x={w / 2}
              y={h * 0.8}
              textAnchor="middle"
              fontSize={h * 0.88}
              fontWeight="900"
              fontFamily={FONT}
              fill={`url(#${chromeId})`}
              stroke="#1a1a1a"
              strokeWidth="2.2"
              paintOrder="stroke fill"
            />

            {/* Brillo superior */}
            <text
              x={w / 2}
              y={h * 0.8}
              textAnchor="middle"
              fontSize={h * 0.88}
              fontWeight="900"
              fontFamily={FONT}
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="0.8"
            />
          </svg>
        </div>

        {/* Grosor lateral simulado */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: '8% 0',
            transform: 'translateZ(-4px) rotateY(0deg)',
            background: 'linear-gradient(180deg, #888, #333)',
            opacity: 0.85,
            borderRadius: 1,
          }}
        />
      </motion.div>
    </div>
  )
}

export default function HeroNameIntro({ config = {}, onComplete }) {
  const finished = useRef(false)
  const audioRef = useRef(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const heroName = (config.heroName || 'SHERE').toUpperCase()
  const heroSubtitle = config.heroSubtitle || 'Un universo hecho de recuerdos'
  const duration = config.heroIntroDuration ?? 6500
  const letters = heroName.split('')
  const images = config.heroImages?.length ? config.heroImages : DEFAULT_IMAGES

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

    const src = config.heroAudio || '/memories/audiointroMarvel.mp3'
    const vol = config.heroAudioVolume ?? 0.88
    if (src) {
      const a = new Audio(src)
      a.volume = vol
      audioRef.current = a
      a.play().catch(() => {})
    }

    const timer = setTimeout(finish, duration)
    return () => {
      clearTimeout(timer)
      stopAudio()
      document.body.style.overflow = ''
    }
  }, [duration, finish, stopAudio, config.heroAudio, config.heroAudioVolume])

  const lastFlipEnd = 0.22 + (letters.filter((c) => c !== ' ').length - 1) * FLIP_STAGGER + FLIP_DURATION

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ zIndex: 200, background: MARVEL_RED }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      role="dialog"
      aria-label="Intro cinematográfica"
    >
      {/* Rojo Marvel con viñeta suave */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(255,80,80,0.15) 0%, transparent 55%), radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)',
        }}
      />

      {/* Zoom a través del logo (como Marvel) */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        style={{ perspective: 1400, transformStyle: 'preserve-3d' }}
        initial={{ scale: 0.55, z: 0 }}
        animate={{
          scale: [0.55, 1, 1.65],
          z: [0, 0, 280],
        }}
        transition={{
          duration: duration / 1000,
          times: [0, lastFlipEnd / (duration / 1000), 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div
          className="flex items-end justify-center"
          style={{ transformStyle: 'preserve-3d', lineHeight: 1 }}
        >
          {letters.map((char, i) => (
            <MarvelLetterBlock
              key={`${char}-${i}`}
              char={char}
              index={i}
              images={images}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: lastFlipEnd + 0.15, duration: 0.6 }}
          className="uppercase mt-8 md:mt-10 tracking-[0.45em]"
          style={{
            fontFamily: FONT,
            fontSize: 'clamp(0.55rem, 1.8vw, 0.75rem)',
            color: 'rgba(255,255,255,0.55)',
            textShadow: '0 1px 2px rgba(0,0,0,0.4)',
          }}
        >
          {heroSubtitle}
        </motion.p>
      </motion.div>

      {/* Flash blanco al final del giro (stinger Marvel) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: '#fff' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.35, 0] }}
        transition={{
          duration: 0.5,
          delay: duration / 1000 - 0.45,
          times: [0, 0.2, 0.35, 1],
        }}
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
          border: '1px solid rgba(255,255,255,0.25)',
          background: 'rgba(0,0,0,0.25)',
          color: 'rgba(255,255,255,0.75)',
          letterSpacing: '0.18em',
        }}
      >
        Saltar intro
      </button>
    </motion.div>
  )
}
