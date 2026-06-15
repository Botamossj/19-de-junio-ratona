/**
 * UniverseTimelineMontage.jsx
 * ─────────────────────────────────────────────────────────────────
 * Línea temporal VIVA del multiverso de recuerdos.
 * Ruta cósmica horizontal de nodos/portales conectados a una línea de
 * energía central. Fondo 3D con Three.js (estrellas, galaxias, nebulosas
 * y universos lejanos). Secuencia final: rewind + cierre de cumpleaños.
 *
 * API pública (sin cambios):
 *   <UniverseTimelineMontage isOpen onClose memories config />
 */

import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

/* ════════════════ PALETA ════════════════ */
const C = {
  gold: '#c9a84c',
  goldL: '#e8c97a',
  purple: '#7c3aed',
  purpleL: '#a78bfa',
  blue: '#3b82f6',
  blueL: '#93c5fd',
  pink: '#f9a8d4',
  white: '#f5f0e8',
  bg: '#05030c',
}
const EASE = [0.22, 1, 0.36, 1]

/** Fade de volumen suave; pausa al llegar a ~0 */
function fadeAudio(audio, targetVol, durationMs, onDone) {
  if (!audio) { onDone?.(); return null }
  const start = audio.volume
  const interval = 80
  const steps = Math.max(1, Math.ceil(durationMs / interval))
  let step = 0
  const id = setInterval(() => {
    step += 1
    const t = step / steps
    audio.volume = start + (targetVol - start) * t
    if (step >= steps) {
      clearInterval(id)
      if (targetVol <= 0.001) {
        audio.pause()
        audio.volume = 0
      }
      onDone?.()
    }
  }, interval)
  return id
}

function getMemoryDuration(memory, index, total, config) {
  const defaultDur = config.durationPerMemory || config.imageDurationMs || 2500
  if (index === total - 1 && memory?.type === 'video') {
    return memory.durationMs ?? config.lastMemoryDurationMs ?? 5000
  }
  return memory?.durationMs ?? defaultDur
}
const TONES = {
  gold: [C.gold, C.goldL],
  cool: [C.blue, C.purpleL],
  warm: [C.gold, C.pink],
  neutral: [C.purple, C.blueL],
}

/* La línea central vive al 45% de la altura (deja zona segura abajo) */
const LINE_TOP = 45 // %

/* ════════════════ LAYOUT RESPONSIVE ════════════════ */
function useLayout() {
  const get = () => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200
    const h = typeof window !== 'undefined' ? window.innerHeight : 800
    const mobile = w < 768
    // Tamaños en px, acotados a la altura disponible (zona segura)
    const activeSize = mobile
      ? Math.min(w * 0.7, h * 0.42, 300)
      : Math.min(w * 0.32, h * 0.46, 380)
    const idleSize = mobile ? activeSize * 0.4 : activeSize * 0.4
    return {
      mobile, vh: h,
      spacing: mobile ? 172 : 330,
      activeSize,
      idleSize,
      // separación vertical desde la línea hasta el centro del portal
      activeOffset: mobile ? 36 : 64,
      idleOffset: mobile ? 96 : 168,
    }
  }
  const [layout, setLayout] = useState(get)
  useEffect(() => {
    let t
    const onResize = () => { clearTimeout(t); t = setTimeout(() => setLayout(get()), 150) }
    window.addEventListener('resize', onResize)
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize) }
  }, [])
  return layout
}

/* ════════════════ FONDO 3D (THREE.JS PURO) ════════════════ */
function CosmicThreeBackground({ activeIndex, total, intensity = 1 }) {
  const mountRef = useRef(null)
  const stateRef = useRef(null)
  const targetRef = useRef({ px: 0, py: 0, travel: 0, intensity: 1 })

  // Crear escena una sola vez
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth
    const H = mount.clientHeight
    const isMobile = W < 768

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x05030c, 0.012)

    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 600)
    camera.position.set(0, 0, 60)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const disposables = []
    const makePoints = (geo, mat) => { disposables.push(geo, mat); return new THREE.Points(geo, mat) }

    /* — Campo de estrellas (3 capas con distinto Z para profundidad) — */
    const starLayers = []
    const layerDefs = isMobile
      ? [{ n: 900, spread: 220, size: 0.5, color: 0xbfd0ff }, { n: 500, spread: 360, size: 0.8, color: 0xffffff }]
      : [{ n: 1800, spread: 240, size: 0.45, color: 0xbfd0ff }, { n: 1100, spread: 380, size: 0.7, color: 0xffffff }, { n: 500, spread: 520, size: 1.0, color: 0xe8c97a }]
    layerDefs.forEach((d) => {
      const pos = new Float32Array(d.n * 3)
      for (let i = 0; i < d.n; i++) {
        pos[i * 3] = (Math.random() - 0.5) * d.spread
        pos[i * 3 + 1] = (Math.random() - 0.5) * d.spread * 0.7
        pos[i * 3 + 2] = -Math.random() * d.spread - 20
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const mat = new THREE.PointsMaterial({ color: d.color, size: d.size, sizeAttenuation: true, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending })
      const pts = makePoints(geo, mat)
      scene.add(pts)
      starLayers.push(pts)
    })

    /* — Galaxias espirales (nubes de partículas) — */
    const galaxies = []
    const galaxyDefs = [
      { x: -70, y: 30, z: -120, n: isMobile ? 1600 : 3200, r: 42, c1: new THREE.Color(0xe8c97a), c2: new THREE.Color(0x7c3aed), tilt: 0.5 },
      { x: 90, y: -40, z: -180, n: isMobile ? 1200 : 2400, r: 36, c1: new THREE.Color(0x93c5fd), c2: new THREE.Color(0x3b82f6), tilt: -0.7 },
    ]
    galaxyDefs.forEach((g) => {
      const pos = new Float32Array(g.n * 3)
      const col = new Float32Array(g.n * 3)
      const branches = 3
      for (let i = 0; i < g.n; i++) {
        const radius = Math.pow(Math.random(), 1.6) * g.r
        const branch = (i % branches) / branches * Math.PI * 2
        const spin = radius * 0.18
        const spread = (Math.pow(Math.random(), 2) - 0.5) * 0.6 * radius
        pos[i * 3] = Math.cos(branch + spin) * radius + (Math.random() - 0.5) * spread
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.4
        pos[i * 3 + 2] = Math.sin(branch + spin) * radius + (Math.random() - 0.5) * spread
        const mixed = g.c1.clone().lerp(g.c2, radius / g.r)
        col[i * 3] = mixed.r; col[i * 3 + 1] = mixed.g; col[i * 3 + 2] = mixed.b
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
      const mat = new THREE.PointsMaterial({ size: isMobile ? 0.7 : 0.55, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending })
      const pts = makePoints(geo, mat)
      pts.position.set(g.x, g.y, g.z)
      pts.rotation.x = g.tilt
      scene.add(pts)
      galaxies.push(pts)
    })

    /* — Universos/esferas lejanas semitransparentes con glow — */
    const orbs = []
    const orbDefs = [
      { x: -40, y: -25, z: -90, r: 10, color: 0x7c3aed },
      { x: 55, y: 35, z: -140, r: 16, color: 0x3b82f6 },
      { x: 10, y: 50, z: -200, r: 22, color: 0xc9a84c },
    ]
    orbDefs.forEach((o) => {
      const geo = new THREE.SphereGeometry(o.r, 24, 24)
      const mat = new THREE.MeshBasicMaterial({ color: o.color, transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending, depthWrite: false })
      disposables.push(geo, mat)
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(o.x, o.y, o.z)
      scene.add(mesh)
      // halo
      const halo = new THREE.SphereGeometry(o.r * 1.5, 16, 16)
      const haloMat = new THREE.MeshBasicMaterial({ color: o.color, transparent: true, opacity: 0.03, blending: THREE.AdditiveBlending, depthWrite: false })
      disposables.push(halo, haloMat)
      const haloMesh = new THREE.Mesh(halo, haloMat)
      haloMesh.position.copy(mesh.position)
      scene.add(haloMesh)
      orbs.push(mesh, haloMesh)
    })

    let raf = 0
    let mouseX = 0, mouseY = 0
    const onMouse = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)

    const clock = new THREE.Clock()
    const animate = () => {
      raf = requestAnimationFrame(animate)
      const dt = clock.getDelta()
      const t = clock.elapsedTime
      const tgt = targetRef.current

      galaxies.forEach((g, i) => { g.rotation.y += dt * (0.04 + i * 0.02) * tgt.intensity })
      starLayers.forEach((s, i) => { s.rotation.y += dt * 0.005 * (i + 1) })
      orbs.forEach((o, i) => { o.rotation.y += dt * 0.05; o.position.y += Math.sin(t * 0.3 + i) * 0.004 })

      // parallax suave: mouse + travel (índice activo)
      tgt.px += ((mouseX * 6 + tgt.travel) - tgt.px) * 0.04
      tgt.py += (-mouseY * 4 - tgt.py) * 0.04
      camera.position.x += (tgt.px - camera.position.x) * 0.05
      camera.position.y += (tgt.py - camera.position.y) * 0.05
      camera.position.z = 60 + Math.sin(t * 0.15) * 2
      camera.lookAt(0, 0, -40)

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight
      if (!w || !h) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(mount)

    stateRef.current = { scene, renderer }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      ro.disconnect()
      disposables.forEach((d) => d.dispose && d.dispose())
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
      stateRef.current = null
    }
  }, [])

  // Actualizar parallax/intensidad según índice activo y fase
  useEffect(() => {
    const tgt = targetRef.current
    tgt.travel = total > 1 ? (activeIndex / (total - 1) - 0.5) * 24 : 0
    tgt.intensity = intensity
  }, [activeIndex, total, intensity])

  return <div ref={mountRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
}

/* Capa CSS sobre el canvas: viñeta + polvo + degradado */
function CosmicOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 35%, rgba(5,3,12,0.55) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,3,12,0.5) 0%, transparent 22%, transparent 70%, rgba(5,3,12,0.7) 100%)' }} />
    </div>
  )
}

/* ════════════════ LÍNEA DE ENERGÍA CENTRAL ════════════════ */
function EnergyTimeline({ progress, boost }) {
  return (
    <div className="absolute left-0 right-0" style={{ top: `${LINE_TOP}%`, transform: 'translateY(-50%)', height: 4, zIndex: 6, pointerEvents: 'none' }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.25) 12%, rgba(201,168,76,0.38) 50%, rgba(59,130,246,0.25) 88%, transparent 100%)', boxShadow: '0 0 18px rgba(124,58,237,0.35)' }} />
      <motion.div className="absolute top-0 bottom-0" style={{ width: '30%', background: 'linear-gradient(90deg, transparent, rgba(232,201,122,0.9), transparent)', filter: 'blur(2px)' }}
        animate={{ left: ['-30%', '100%'] }} transition={{ duration: boost ? 1.6 : 5, repeat: Infinity, ease: 'linear' }} />
      <motion.div className="absolute top-0 bottom-0 left-0" style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.9), rgba(201,168,76,0.95))', boxShadow: '0 0 14px rgba(201,168,76,0.7)' }}
        animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.9, ease: EASE }} />
      {[0, 1, 2, 3].map((i) => (
        <motion.div key={i} className="absolute rounded-full" style={{ top: '50%', width: 5, height: 5, marginTop: -2.5, background: C.white, boxShadow: `0 0 10px ${C.goldL}, 0 0 18px ${C.gold}` }}
          animate={{ left: ['0%', '100%'], opacity: [0, 1, 1, 0] }} transition={{ duration: boost ? 2 : 6, repeat: Infinity, delay: i * (boost ? 0.4 : 1.6), ease: 'linear' }} />
      ))}
    </div>
  )
}

/* ════════════════ MEDIA ════════════════ */
function NodeMedia({ memory, active, videoRef, onError, hasError }) {
  if (hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center px-3" style={{ background: 'radial-gradient(circle, #15102a, #0a0816)' }}>
        <span style={{ fontSize: active ? 30 : 18 }}>✦</span>
      </div>
    )
  }
  const isVideo = memory.type === 'video'
  if (isVideo && active) {
    return <video ref={videoRef} src={memory.src} className="w-full h-full" style={{ objectFit: 'contain', background: '#000' }} playsInline preload="auto" onError={onError} />
  }
  if (isVideo) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: 'radial-gradient(circle, #16112c, #090715)' }}>
        <svg width={active ? 26 : 15} height={active ? 26 : 15} viewBox="0 0 24 24" fill="none" stroke={C.goldL} strokeWidth="1.6"><polygon points="6 4 20 12 6 20 6 4" /></svg>
      </div>
    )
  }
  return <img src={memory.src} alt="" className="w-full h-full" style={{ objectFit: 'contain', background: 'radial-gradient(circle, #120e22, #07050f)' }} loading="lazy" decoding="async" onError={onError} />
}

/* ════════════════ NODO / PORTAL ════════════════ */
function MemoryNode({ memory, i, activeIndex, layout, videoRef, onSelect, rewinding }) {
  const [err, setErr] = useState(false)
  useEffect(() => { setErr(false) }, [memory?.src])

  const active = !rewinding && i === activeIndex
  const dist = Math.abs(i - activeIndex)
  const side = memory.position === 'top' ? -1 : memory.position === 'bottom' ? 1 : (i % 2 === 0 ? -1 : 1)

  const size = active ? layout.activeSize : layout.idleSize
  const offsetMag = active ? layout.activeOffset : layout.idleOffset
  // y del CENTRO del portal respecto a la línea (px). side -1 arriba, +1 abajo.
  const centerY = side * (offsetMag + size / 2)
  const [t1, t2] = TONES[memory.tone] || TONES.neutral

  const opacity = rewinding ? 0.8 : active ? 1 : dist === 1 ? 0.6 : dist === 2 ? 0.32 : 0.14
  const blur = rewinding ? 0.4 : active ? 0 : dist === 1 ? 1.5 : 3
  const scale = rewinding ? 0.85 : active ? 1 : dist === 1 ? 0.9 : 0.72
  const connectorH = offsetMag

  return (
    <div className="absolute left-0" style={{ top: `${LINE_TOP}%`, transform: `translateX(${i * layout.spacing}px)`, zIndex: active ? 20 : 10 - dist }}>
      {/* Conector luminoso (desde la línea hacia el portal) */}
      <div className="absolute left-1/2" style={{
        width: active ? 2 : 1.5, height: connectorH,
        top: side === 1 ? 0 : 'auto', bottom: side === -1 ? 0 : 'auto',
        transform: 'translateX(-50%)',
        background: side === -1 ? `linear-gradient(to top, ${t1}, transparent)` : `linear-gradient(to bottom, ${t1}, transparent)`,
        opacity: active ? 0.95 : opacity * 0.8, boxShadow: active ? `0 0 12px ${t1}` : 'none',
      }} />
      {/* Anclaje en la línea */}
      <motion.div className="absolute left-1/2 rounded-full" style={{ top: 0, width: active ? 12 : 7, height: active ? 12 : 7, marginLeft: active ? -6 : -3.5, marginTop: active ? -6 : -3.5, background: `radial-gradient(circle, ${C.goldL}, ${t1})`, boxShadow: active ? `0 0 16px ${C.gold}, 0 0 30px ${t1}` : `0 0 6px ${t1}` }}
        animate={active ? { scale: [1, 1.25, 1] } : { scale: 1 }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} />

      {/* Portal */}
      <motion.button
        onClick={() => onSelect(i)}
        aria-label={`Recuerdo ${i + 1}`}
        className="absolute left-1/2 rounded-2xl overflow-hidden"
        initial={false}
        animate={{ width: size, height: size, x: '-50%', y: centerY - size / 2, opacity, scale, filter: `blur(${blur}px)` }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{
          transformOrigin: 'center', padding: 2, cursor: 'pointer',
          background: `linear-gradient(135deg, ${t1}, ${t2}, ${t1})`,
          boxShadow: active ? `0 0 40px ${t1}aa, 0 0 90px rgba(0,0,0,0.6), 0 28px 70px rgba(0,0,0,0.55)` : '0 0 18px rgba(0,0,0,0.5)',
        }}
      >
        <div className="w-full h-full rounded-2xl overflow-hidden" style={{ background: '#06040d' }}>
          <NodeMedia memory={memory} active={active} videoRef={videoRef} hasError={err} onError={() => setErr(true)} />
        </div>
        {active && (
          <motion.div className="absolute rounded-full pointer-events-none" style={{ inset: -10, border: `1px dashed ${C.purpleL}55` }} animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />
        )}
      </motion.button>
    </div>
  )
}

/* ════════════════ CONTROLES ════════════════ */
const ctrlBtn = {
  width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.16)',
  color: 'rgba(245,240,232,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)', padding: 0,
}
function Controls({ paused, onToggle, onClose }) {
  return (
    <div className="absolute left-0 right-0 flex items-center justify-center gap-4" style={{ bottom: 'max(20px, env(safe-area-inset-bottom))', zIndex: 40 }}>
      <button aria-label={paused ? 'Reanudar' : 'Pausar'} onClick={onToggle} style={{ ...ctrlBtn, width: 52, height: 52, borderColor: 'rgba(201,168,76,0.5)', color: C.goldL }}>
        {paused ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4" /></svg>
          : <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>}
      </button>
      <button aria-label="Cerrar" onClick={onClose} style={{ ...ctrlBtn }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
    </div>
  )
}

/* ════════════════ INTRO ════════════════ */
function IntroScreen({ config = {} }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
      style={{ zIndex: 50 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(16px)', scale: 1.1 }}
      transition={{ duration: 1, ease: EASE }}
    >
      <motion.h2
        initial={{ opacity: 0, y: 22, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.35, duration: 1, ease: EASE }}
        className="font-serif italic"
        style={{
          fontSize: 'clamp(2rem, 7vw, 3.8rem)',
          lineHeight: 1.12,
          color: C.goldL,
          background: `linear-gradient(135deg, ${C.gold}, ${C.goldL}, ${C.purpleL})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 22px rgba(201,168,76,0.35))',
        }}
      >
        {config.title || 'Universo de Shere'}
      </motion.h2>

      <motion.div
        className="absolute left-0 right-0"
        style={{
          top: '50%',
          height: 2,
          zIndex: -1,
          background: `linear-gradient(90deg, transparent, ${C.gold}, ${C.purpleL}, transparent)`,
          boxShadow: `0 0 20px ${C.gold}`,
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
      />
    </motion.div>
  )
}

/* ════════════════ GLOBOS + CONFETI (CSS/React) ════════════════ */
const BALLOON_COLORS = [C.gold, C.purple, C.blue, C.pink, C.purpleL, C.goldL]
const CONFETTI_COLORS = [C.gold, C.purpleL, C.pink, C.blueL, C.goldL, '#ffffff']

function Balloons() {
  const balloons = useMemo(() => Array.from({ length: 11 }, (_, i) => ({
    id: i, x: 4 + (i * 8.6) % 92, color: BALLOON_COLORS[i % BALLOON_COLORS.length],
    delay: (i % 5) * 0.4, dur: 7 + (i % 4), size: 34 + (i % 4) * 9, sway: (i % 2 ? 1 : -1) * (10 + (i % 3) * 6),
  })), [])
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 12 }}>
      {balloons.map((b) => (
        <motion.div key={b.id} className="absolute" style={{ left: `${b.x}%`, bottom: -120 }}
          initial={{ y: 0, opacity: 0 }} animate={{ y: [-20, -window.innerHeight - 160], x: [0, b.sway, -b.sway, 0], opacity: [0, 1, 1, 0.9] }}
          transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, repeatDelay: 1.5, ease: 'easeOut' }}>
          <div style={{ width: b.size, height: b.size * 1.2, borderRadius: '50% 50% 48% 48%', background: `radial-gradient(circle at 35% 28%, ${b.color}, ${b.color}aa)`, boxShadow: `0 0 18px ${b.color}66, inset -4px -6px 10px rgba(0,0,0,0.25)`, position: 'relative' }}>
            <div style={{ position: 'absolute', top: '16%', left: '24%', width: '24%', height: '30%', borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
            <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: `6px solid ${b.color}` }} />
          </div>
          <div style={{ width: 1, height: b.size * 1.4, margin: '0 auto', background: `linear-gradient(${b.color}88, transparent)` }} />
        </motion.div>
      ))}
    </div>
  )
}

function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 70 }, (_, i) => ({
    id: i, x: (i * 13.7) % 100, color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: (i % 10) * 0.18, dur: 3 + (i % 5) * 0.6, size: 5 + (i % 4) * 3, rot: (i * 47) % 360, shape: i % 3,
  })), [])
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 13 }}>
      {pieces.map((c) => (
        <motion.div key={c.id} className="absolute" style={{ left: `${c.x}%`, top: -20, width: c.size, height: c.shape === 2 ? c.size : c.size * 0.5, background: c.color, borderRadius: c.shape === 0 ? '50%' : c.shape === 1 ? 2 : 0, boxShadow: `0 0 4px ${c.color}88` }}
          initial={{ y: -20, opacity: 0, rotate: 0 }} animate={{ y: window.innerHeight + 40, opacity: [0, 1, 1, 0], rotate: c.rot + 720, x: [0, 20, -20, 0] }}
          transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, repeatDelay: 0.8, ease: 'linear' }} />
      ))}
    </div>
  )
}

/* ════════════════ FINAL DE CUMPLEAÑOS ════════════════ */
function BirthdayFinal({ config, onClose, onReplay }) {
  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8" style={{ zIndex: 50 }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
      <Balloons />
      <Confetti />
      <div className="relative" style={{ zIndex: 20 }}>
        <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2, ease: EASE }} className="rounded-full mb-7 mx-auto overflow-hidden"
          style={{ width: 128, height: 128, border: `2px solid ${C.gold}66`, boxShadow: '0 0 50px rgba(201,168,76,0.35), inset 0 0 40px rgba(124,58,237,0.15)' }}>
          {config.birthdayImage ? (
            <motion.img
              src={config.birthdayImage}
              alt="Shere"
              className="w-full h-full object-cover"
              initial={{ scale: 1.08 }}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <motion.span style={{ fontSize: 44 }} animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 3, repeat: Infinity }}>✦</motion.span>
            </div>
          )}
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.9 }} className="font-serif italic"
          style={{ fontSize: 'clamp(2rem,7vw,4rem)', lineHeight: 1.15, background: `linear-gradient(135deg, ${C.gold}, ${C.purpleL}, ${C.pink}, ${C.goldL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 24px rgba(201,168,76,0.35))' }}>
          {config.outroTitle || 'Feliz cumpleaños'}
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9 }} className="font-serif italic mt-5"
          style={{ fontSize: 'clamp(0.9rem,2.4vw,1.15rem)', color: 'rgba(245,240,232,0.7)', maxWidth: 460, margin: '0 auto', lineHeight: 1.65 }}>
          {config.finalText || config.outroText || 'Todas las líneas del tiempo llegaron a ti.'}
        </motion.p>
        <motion.div className="flex items-center justify-center gap-4 mt-9" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <button onClick={onReplay} aria-label="Volver a ver" className="font-serif" style={{ padding: '10px 26px', borderRadius: 40, border: `1px solid ${C.purpleL}55`, background: 'rgba(124,58,237,0.14)', color: 'rgba(245,240,232,0.85)', cursor: 'pointer', letterSpacing: '0.12em', fontSize: '0.85rem' }}>Volver a ver</button>
          <button onClick={onClose} aria-label="Cerrar" className="font-serif" style={{ padding: '10px 30px', borderRadius: 40, border: `1px solid ${C.gold}66`, background: 'rgba(201,168,76,0.16)', color: C.goldL, cursor: 'pointer', letterSpacing: '0.12em', fontSize: '0.85rem' }}>Cerrar</button>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ════════════════ COMPONENTE PRINCIPAL ════════════════ */
export default function UniverseTimelineMontage({ isOpen, onClose, onReplayFromStart, memories = [], config = {} }) {
  const layout = useLayout()
  const [sessionKey, setSessionKey] = useState(0)
  const [phase, setPhase] = useState('intro') // intro | playing | rewind | birthdayFinal
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const rewindAudioRef = useRef(null)
  const birthdayAudioRef = useRef(null)
  const autoTimer = useRef(null)
  const rewindCtrl = useRef(null)

  const timelineVol = config.timelineMusicVolume ?? 0.18
  const rewindVol = config.rewindMusicVolume ?? 0.62
  const birthdayVol = config.birthdayMusicVolume ?? 0.22

  const total = memories.length
  const current = memories[index]
  const progress = total ? (index + 1) / total : 0
  const rewindDur = config.rewindDuration || 4000
  const threeOn = config.enableThreeBackground !== false

  // Posición del track controlada por un motion value (deslizamiento continuo)
  const trackXMV = useMotionValue(0)
  const rewindProgress = useMotionValue(1)

  const clearAuto = () => { if (autoTimer.current) { clearTimeout(autoTimer.current); autoTimer.current = null } }

  /* — Rewind: el track vuelve suave hasta el inicio, luego cumpleaños — */
  const startRewind = useCallback(() => {
    clearAuto()
    const v = videoRef.current
    if (v) { try { v.pause() } catch { /* noop */ } }

    const bg = audioRef.current
    const rewindSrc = config.rewindMusic || config.rewindAudio

    if (bg && bg.volume > 0.01) {
      fadeAudio(bg, 0, 1000)
    } else if (bg) {
      bg.pause()
      bg.volume = 0
    }

    if (rewindSrc) {
      if (rewindAudioRef.current) {
        rewindAudioRef.current.pause()
        rewindAudioRef.current = null
      }
      const ra = new Audio(rewindSrc)
      ra.volume = 0
      rewindAudioRef.current = ra
      setTimeout(() => {
        ra.play().catch(() => {})
        fadeAudio(ra, rewindVol, 900)
      }, 450)
    }

    setPhase('rewind')
    if (rewindCtrl.current) rewindCtrl.current.stop()
    animate(rewindProgress, 0, { duration: rewindDur / 1000, ease: 'linear' })
    rewindCtrl.current = animate(trackXMV, 0, {
      duration: rewindDur / 1000,
      ease: [0.45, 0, 0.2, 1],
      onComplete: () => {
        const ra = rewindAudioRef.current
        if (ra) {
          fadeAudio(ra, 0, 800, () => {
            ra.pause()
            rewindAudioRef.current = null
          })
        }
        setIndex(0)
        setPhase('birthdayFinal')
      },
    })
  }, [rewindDur, trackXMV, rewindProgress, config.rewindMusic, config.rewindAudio, rewindVol])

  const goNext = useCallback(() => {
    clearAuto()
    setIndex((p) => { if (p >= total - 1) { startRewind(); return p } return p + 1 })
  }, [total, startRewind])
  const goPrev = useCallback(() => { clearAuto(); setIndex((p) => Math.max(0, p - 1)) }, [])
  const goTo = useCallback((i) => { clearAuto(); if (i >= 0 && i < total) setIndex(i) }, [total])

  const toggle = useCallback(() => {
    setPaused((p) => {
      const n = !p
      const a = audioRef.current; if (a) { n ? a.pause() : a.play().catch(() => {}) }
      const v = videoRef.current; if (v) { n ? v.pause() : v.play().catch(() => {}) }
      return n
    })
  }, [])

  const replay = useCallback(() => {
    if (onReplayFromStart) {
      onReplayFromStart()
      return
    }
    if (birthdayAudioRef.current) {
      birthdayAudioRef.current.pause()
      birthdayAudioRef.current = null
    }
    setSessionKey((k) => k + 1)
  }, [onReplayFromStart])

  /* Mover el track suavemente cuando cambia el recuerdo (fase playing) */
  useEffect(() => {
    if (!isOpen || phase !== 'playing') return
    const controls = animate(trackXMV, -index * layout.spacing, { duration: 1, ease: EASE })
    return () => controls.stop()
  }, [isOpen, phase, index, layout.spacing, trackXMV])

  /* Apertura */
  useEffect(() => {
    if (!isOpen) return
    setPhase('intro'); setIndex(0); setPaused(false)
    document.body.style.overflow = 'hidden'
    const introT = setTimeout(() => setPhase('playing'), 2800)
    if (config.music) {
      const a = new Audio(config.music)
      a.loop = true
      a.volume = 0
      audioRef.current = a
      a.play().then(() => fadeAudio(a, timelineVol, 1800)).catch(() => {})
    }
    return () => {
      clearTimeout(introT); clearAuto()
      if (rewindCtrl.current) rewindCtrl.current.stop()
      if (rewindAudioRef.current) { rewindAudioRef.current.pause(); rewindAudioRef.current = null }
      if (birthdayAudioRef.current) { birthdayAudioRef.current.pause(); birthdayAudioRef.current = null }
      document.body.style.overflow = ''
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    }
  }, [isOpen, config.music, timelineVol, sessionKey])

  /* Música de cumpleaños al final */
  useEffect(() => {
    if (phase !== 'birthdayFinal' || !config.birthdayMusic) return
    const a = new Audio(config.birthdayMusic)
    a.loop = false
    a.volume = 0
    birthdayAudioRef.current = a
    a.play().catch(() => {})
    fadeAudio(a, birthdayVol, 1600)
    return () => {
      a.pause()
      if (birthdayAudioRef.current === a) birthdayAudioRef.current = null
    }
  }, [phase, config.birthdayMusic, birthdayVol])

  /* Autoplay: 2,5 s por recuerdo; el último video dura 5 s */
  useEffect(() => {
    if (!isOpen || phase !== 'playing' || !current || paused) return
    clearAuto()

    const v = current.type === 'video' ? videoRef.current : null
    const bg = audioRef.current

    // La canción de la línea de tiempo sigue siempre; el video se superpone encima
    if (bg) {
      if (bg.paused) bg.play().catch(() => {})
      if (Math.abs(bg.volume - timelineVol) > 0.02) fadeAudio(bg, timelineVol, 400)
    }

    if (v) {
      v.muted = false
      v.volume = config.videoVolume ?? 0.85
      try { v.currentTime = 0 } catch { /* noop */ }
      v.play().catch(() => {
        v.muted = true
        v.play().catch(() => {})
      })
    }

    autoTimer.current = setTimeout(
      goNext,
      getMemoryDuration(current, index, total, config),
    )

    return () => {
      clearAuto()
      if (v) {
        try { v.pause() } catch { /* noop */ }
      }
    }
  }, [isOpen, phase, index, current, paused, goNext, total, config, timelineVol])

  /* Teclado */
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === ' ') { e.preventDefault(); toggle() }
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, goNext, goPrev, toggle, onClose])

  const showTrack = phase === 'playing' || phase === 'rewind'
  const rewinding = phase === 'rewind'
  const intensity = rewinding ? 2.4 : 1

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 overflow-hidden w-full max-w-[100vw] min-h-[100dvh]" style={{ zIndex: 120, background: C.bg, fontFamily: 'Georgia, serif' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
        role="dialog" aria-label={config.title || 'Universo de recuerdos'}>

        {threeOn ? <CosmicThreeBackground activeIndex={index} total={total} intensity={intensity} /> : null}
        <CosmicOverlay />

        {showTrack && <EnergyTimeline progress={phase === 'rewind' ? progress : progress} boost={phase === 'rewind'} />}

        {showTrack && (
          <motion.div className="absolute" style={{ left: '50%', top: 0, bottom: 0, width: 0, x: trackXMV }}>
            {memories.map((m, i) => (
              <MemoryNode key={m.id ?? i} memory={m} i={i} activeIndex={index} layout={layout} videoRef={i === index ? videoRef : null} onSelect={goTo} rewinding={rewinding} />
            ))}
          </motion.div>
        )}

        {/* Estelas extra durante el rewind */}
        {phase === 'rewind' && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 8 }}>
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.div key={i} className="absolute" style={{ top: `${10 + (i * 6) % 80}%`, height: 2, background: 'linear-gradient(90deg, transparent, rgba(232,201,122,0.8), transparent)' }}
                initial={{ right: '-20%', width: '20%', opacity: 0 }} animate={{ right: '120%', opacity: [0, 1, 0] }} transition={{ duration: 0.8, delay: i * 0.06, repeat: Infinity, ease: 'linear' }} />
            ))}
          </div>
        )}

        {phase === 'playing' && (
          <Controls paused={paused} onToggle={toggle} onClose={onClose} />
        )}

        <AnimatePresence>
          {phase === 'intro' && <IntroScreen key="intro" config={config} />}
          {phase === 'birthdayFinal' && (
            <BirthdayFinal key="bday" config={config} onClose={onClose} onReplay={replay} />
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
