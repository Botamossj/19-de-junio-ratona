import { useState, useEffect, useRef } from 'react'

export function useChapterProgress() {
  const [currentChapter, setCurrentChapter] = useState(0)
  const chapterRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = chapterRefs.current.indexOf(entry.target)
            if (index !== -1) setCurrentChapter(index)
          }
        })
      },
      { threshold: 0.4 }
    )

    chapterRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const registerRef = (index) => (el) => {
    chapterRefs.current[index] = el
  }

  return { currentChapter, registerRef }
}

export function useTypewriter(text, speed = 60, delay = 0) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    const timeout = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1))
          i++
        } else {
          setDone(true)
          clearInterval(interval)
        }
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, speed, delay])

  return { displayed, done }
}

export function useParticles(count = 30) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.6 + 0.2,
  }))
  return particles
}
