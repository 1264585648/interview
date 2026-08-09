import { useCallback, useEffect, useRef } from 'react'

export function useArenaAudio(enabled: boolean) {
  const contextRef = useRef<AudioContext | null>(null)
  const enabledRef = useRef(enabled)

  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  useEffect(() => () => {
    void contextRef.current?.close()
  }, [])

  const prime = useCallback(async (force = false) => {
    if ((!enabledRef.current && !force) || typeof window === 'undefined') return
    try {
      contextRef.current ??= new AudioContext()
      if (contextRef.current.state === 'suspended') await contextRef.current.resume()
    } catch {
      contextRef.current = null
    }
  }, [])

  const tone = useCallback((frequency: number, duration: number, volume: number, offset = 0) => {
    if (!enabledRef.current || !contextRef.current) return
    const context = contextRef.current
    const start = context.currentTime + offset
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, start)
    gain.gain.setValueAtTime(volume, start)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(start)
    oscillator.stop(start + duration)
  }, [])

  const tick = useCallback(() => tone(520, 0.045, 0.025), [tone])
  const lock = useCallback(() => {
    tone(220, 0.18, 0.055)
    tone(440, 0.26, 0.04, 0.07)
  }, [tone])
  const deal = useCallback(() => tone(330, 0.2, 0.035), [tone])
  const ready = useCallback(() => {
    tone(494, 0.3, 0.04)
    tone(659, 0.34, 0.035, 0.08)
  }, [tone])

  return { deal, lock, prime, ready, tick }
}
