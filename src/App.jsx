import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Cover from './components/Cover'
import CinematicLettersIntro from './components/CinematicLettersIntro'
import NavProgress from './components/NavProgress'
import Chapter1Route from './chapters/Chapter1Route'
import Chapter2Ruler from './chapters/Chapter2Ruler'
import Chapter3Park from './chapters/Chapter3Park'
import Chapter4Marvel from './chapters/Chapter4Marvel'
import Chapter6Loki from './chapters/Chapter6Loki'
import Chapter7Admiration from './chapters/Chapter7Admiration'
import Chapter8BeforeVault from './chapters/Chapter8BeforeVault'
import Chapter10Final from './chapters/Chapter10Final'
import content from './data/content.json'

export default function App() {
  const [appStage, setAppStage] = useState('cover')
  const [currentChapter, setCurrentChapter] = useState(0)
  const [introKey, setIntroKey] = useState(0)
  const mainRef = useRef(null)

  const introConfig = useMemo(() => {
    const finalChapter = content.chapters.find((c) => c.id === 'final')
    return {
      ...content.meta.heroIntro,
      ...finalChapter?.timelineMontage,
    }
  }, [])

  useEffect(() => {
    if (appStage !== 'chapters') return

    const handleScroll = () => {
      const sections = document.querySelectorAll('.chapter-section')
      const scrollY = window.scrollY + window.innerHeight * 0.4

      sections.forEach((section, i) => {
        const top = section.offsetTop
        const bottom = top + section.offsetHeight
        if (scrollY >= top && scrollY < bottom) {
          setCurrentChapter(i + 1)
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [appStage])

  const handleOpen = () => {
    if (introConfig.cinematicIntroEnabled === false) {
      setAppStage('chapters')
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 300)
      return
    }
    setIntroKey((k) => k + 1)
    setAppStage('intro')
  }

  const handleIntroComplete = () => {
    setAppStage('chapters')
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 300)
  }

  return (
    <div className="w-full min-h-[100dvh] overflow-x-hidden">
      <AnimatePresence>
        {appStage === 'cover' && (
          <motion.div
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            <Cover onOpen={handleOpen} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {appStage === 'intro' && (
          <CinematicLettersIntro
            key={`cinematic-intro-${introKey}`}
            config={introConfig}
            onComplete={handleIntroComplete}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {appStage === 'chapters' && (
          <motion.div
            ref={mainRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <NavProgress current={currentChapter} />
            <Chapter1Route />
            <Chapter2Ruler />
            <Chapter3Park />
            <Chapter4Marvel />
            <Chapter6Loki />
            <Chapter7Admiration />
            <Chapter8BeforeVault />
            <Chapter10Final />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
