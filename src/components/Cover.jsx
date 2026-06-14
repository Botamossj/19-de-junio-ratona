import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import content from '../data/content.json'
import useUnlockCountdown from '../hooks/useUnlockCountdown'

const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.5 + 0.5,
  delay: Math.random() * 6,
  dur: Math.random() * 4 + 2,
}))

const COUNTDOWN_UNITS = [
  { key: 'days', label: 'días' },
  { key: 'hours', label: 'horas' },
  { key: 'minutes', label: 'min' },
  { key: 'seconds', label: 'seg' },
]

function CountdownBox({ value, label }) {
  return (
    <div
      className="flex flex-col items-center justify-center px-3 py-4 md:px-4 md:py-5 min-w-[4.5rem] md:min-w-[5.5rem]"
      style={{
        border: '1px solid rgba(201,168,76,0.35)',
        background: 'rgba(0,0,0,0.35)',
      }}
    >
      <span
        className="font-mono text-2xl md:text-3xl tabular-nums"
        style={{ color: 'var(--gold-light)' }}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span
        className="font-mono text-[0.6rem] md:text-xs mt-1 uppercase tracking-widest"
        style={{ color: 'var(--text-dim)' }}
      >
        {label}
      </span>
    </div>
  )
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
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

export default function Cover({ onOpen }) {
  const unlock = content.meta.unlock
  const { isUnlocked, remaining } = useUnlockCountdown()
  const [hovered, setHovered] = useState(false)
  const isMobile = useIsMobile()
  const reducedMotion = usePrefersReducedMotion()
  const instant = isMobile || reducedMotion

  return (
    <div
      className="cover-scroll fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto w-full max-w-[100vw] min-h-[100dvh]"
      style={{
        background: 'radial-gradient(ellipse at 30% 60%, #1a0a2e 0%, #0a0a1a 60%, #000 100%)',
        padding:
          'max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left))',
      }}
    >
      {STARS.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white star pointer-events-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(138,43,226,0.06) 0%, transparent 70%)' }}
        />
      </div>

      <div
        className={`relative z-10 text-center px-4 sm:px-6 max-w-2xl mx-auto w-full cover-content${instant ? ' cover-content--instant' : ''}`}
      >
        <p
          className="font-mono text-[0.65rem] sm:text-xs tracking-[0.2em] sm:tracking-[0.4em] uppercase mb-6 sm:mb-8"
          style={{ color: 'var(--gold-light)' }}
        >
          Una historia guardada
        </p>

        <h1
          className="font-display mb-2 cover-title"
          style={{
            fontSize: 'clamp(2rem, 10vw, 6rem)',
            lineHeight: 1.1,
            fontStyle: 'italic',
            fontWeight: 700,
            color: 'var(--gold-light)',
          }}
        >
          {content.meta.title}
        </h1>

        <div
          className="mx-auto my-6 cover-line"
          style={{
            height: '1px',
            width: '120px',
            background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          }}
        />

        <p
          className="font-body text-sm sm:text-base md:text-lg mb-10 sm:mb-16"
          style={{ color: 'var(--warm-gray)', letterSpacing: '0.05em' }}
        >
          Una caja fuerte de recuerdos para{' '}
          <span style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>Shere</span>
        </p>

        {!isUnlocked ? (
          <div>
            <p
              className="font-mono text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-4"
              style={{ color: 'var(--gold-light)' }}
            >
              {unlock.countdownLabel}
            </p>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {COUNTDOWN_UNITS.map(({ key, label }) => (
                <CountdownBox key={key} value={remaining[key]} label={label} />
              ))}
            </div>
            <p
              className="mt-6 font-body text-sm max-w-sm mx-auto"
              style={{ color: 'var(--warm-gray)' }}
            >
              {unlock.lockedHint}
            </p>
            <p
              className="mt-2 font-mono text-[0.65rem] uppercase tracking-widest"
              style={{ color: 'var(--text-dim)' }}
            >
              {unlock.timezoneLabel}
            </p>
            <p
              className="mt-12 sm:mt-16 font-mono text-xs"
              style={{ color: 'var(--text-dim)', letterSpacing: '0.2em' }}
            >
              {unlock.waitingHint}
            </p>
          </div>
        ) : (
          <div>
            <p
              className="font-body text-sm mb-6 italic"
              style={{ color: 'var(--gold-light)' }}
            >
              {unlock.unlockedHint}
            </p>
            <motion.button
              onClick={onOpen}
              onHoverStart={() => setHovered(true)}
              onHoverEnd={() => setHovered(false)}
              whileTap={{ scale: 0.97 }}
              className="relative overflow-hidden font-mono tracking-widest uppercase text-sm px-10 py-4 cursor-pointer"
              style={{
                border: '1px solid var(--gold)',
                color: hovered ? 'var(--night)' : 'var(--gold)',
                background: hovered ? 'var(--gold)' : 'transparent',
                transition: 'all 0.4s ease',
                letterSpacing: '0.25em',
              }}
            >
              Abrir
            </motion.button>
          </div>
        )}
      </div>

      <div className="absolute top-8 left-8 opacity-30 pointer-events-none" aria-hidden>
        <div className="w-8 h-px" style={{ background: 'var(--gold)' }} />
        <div className="w-px h-8" style={{ background: 'var(--gold)' }} />
      </div>
      <div className="absolute top-8 right-8 opacity-30 pointer-events-none" aria-hidden>
        <div className="w-8 h-px ml-auto" style={{ background: 'var(--gold)' }} />
        <div className="w-px h-8 ml-auto" style={{ background: 'var(--gold)' }} />
      </div>
      <div className="absolute bottom-8 left-8 opacity-30 pointer-events-none" aria-hidden>
        <div className="w-px h-8" style={{ background: 'var(--gold)' }} />
        <div className="w-8 h-px" style={{ background: 'var(--gold)' }} />
      </div>
      <div className="absolute bottom-8 right-8 opacity-30 pointer-events-none" aria-hidden>
        <div className="w-px h-8 ml-auto" style={{ background: 'var(--gold)' }} />
        <div className="w-8 h-px ml-auto" style={{ background: 'var(--gold)' }} />
      </div>
    </div>
  )
}
