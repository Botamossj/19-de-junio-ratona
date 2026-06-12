const ECUADOR_OFFSET = '-05:00'

export function getUnlockDate(config) {
  if (!config?.date) return new Date(0)
  const hour = String(config.hour ?? 0).padStart(2, '0')
  const minute = String(config.minute ?? 0).padStart(2, '0')
  return new Date(`${config.date}T${hour}:${minute}:00${ECUADOR_OFFSET}`)
}

export function isUnlocked(now, config) {
  if (import.meta.env.DEV && import.meta.env.VITE_UNLOCK_BYPASS === 'true') {
    return true
  }
  return now.getTime() >= getUnlockDate(config).getTime()
}

export function getRemaining(now, config) {
  const diff = getUnlockDate(config).getTime() - now.getTime()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 }
  }

  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds, totalMs: diff }
}
