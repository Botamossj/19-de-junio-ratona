import { useState, useEffect } from 'react'
import content from '../data/content.json'
import { isUnlocked, getRemaining } from '../utils/unlockGate'

const unlockConfig = content.meta.unlock

export default function useUnlockCountdown() {
  const [state, setState] = useState(() => {
    const now = new Date()
    return {
      isUnlocked: isUnlocked(now, unlockConfig),
      remaining: getRemaining(now, unlockConfig),
    }
  })

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setState({
        isUnlocked: isUnlocked(now, unlockConfig),
        remaining: getRemaining(now, unlockConfig),
      })
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return state
}
