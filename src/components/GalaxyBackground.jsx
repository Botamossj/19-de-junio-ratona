import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function createGalaxyGeometry(particleCount) {
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  const colorCore = new THREE.Color('#e8c97a')
  const colorInner = new THREE.Color('#8b5cf6')
  const colorOuter = new THREE.Color('#1e1b4b')
  const branches = 4
  const spin = 1.2
  const radius = 6

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    const branch = i % branches
    const branchAngle = (branch / branches) * Math.PI * 2
    const dist = Math.pow(Math.random(), 1.8) * radius
    const spinAngle = dist * spin
    const spread = Math.pow(Math.random(), 2) * 0.55 * dist

    positions[i3] = Math.cos(branchAngle + spinAngle) * dist + (Math.random() - 0.5) * spread
    positions[i3 + 1] = (Math.random() - 0.5) * 0.35 * dist
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * dist + (Math.random() - 0.5) * spread

    const mixRatio = dist / radius
    const mixed = colorCore.clone()
    mixed.lerp(colorInner, mixRatio * 0.75)
    mixed.lerp(colorOuter, mixRatio)

    colors[i3] = mixed.r
    colors[i3 + 1] = mixed.g
    colors[i3 + 2] = mixed.b
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geometry
}

export default function GalaxyBackground({ active = true }) {
  const containerRef = useRef(null)
  const activeRef = useRef(active)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const isMobile = window.innerWidth < 768
    const particleCount = isMobile ? 4500 : 9000

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2('#06050f', 0.08)

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    )
    camera.position.set(0, 2.8, 7.5)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const geometry = createGalaxyGeometry(particleCount)
    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.028 : 0.022,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    })

    const galaxy = new THREE.Points(geometry, material)
    galaxy.rotation.x = 0.35
    scene.add(galaxy)

    const starGeometry = new THREE.BufferGeometry()
    const starCount = isMobile ? 350 : 700
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3
      starPositions[i3] = (Math.random() - 0.5) * 30
      starPositions[i3 + 1] = (Math.random() - 0.5) * 18
      starPositions[i3 + 2] = (Math.random() - 0.5) * 30
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: '#ffffff',
        size: 0.015,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      }),
    )
    scene.add(stars)

    let frameId = 0

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      if (!activeRef.current) return

      galaxy.rotation.y += 0.00035
      stars.rotation.y -= 0.00008
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      const { clientWidth, clientHeight } = container
      if (!clientWidth || !clientHeight) return
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(clientWidth, clientHeight)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      geometry.dispose()
      material.dispose()
      starGeometry.dispose()
      stars.material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.75 }}
      aria-hidden="true"
    />
  )
}
