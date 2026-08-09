import { useEffect, useRef } from 'react'
import styles from './MatchArena.module.css'

type ParticleBurstProps = {
  active: boolean
  reduceMotion: boolean
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  radius: number
  color: string
}

export function ParticleBurst({ active, reduceMotion }: ParticleBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active || reduceMotion) return
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const bounds = canvas.getBoundingClientRect()
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(bounds.width * ratio)
    canvas.height = Math.round(bounds.height * ratio)
    context.scale(ratio, ratio)

    const particles: Particle[] = Array.from({ length: 58 }, (_, index) => {
      const angle = Math.random() * Math.PI * 2
      const velocity = 1.6 + Math.random() * 4.4
      return {
        x: bounds.width / 2,
        y: bounds.height / 2,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
        radius: 1 + Math.random() * 2.6,
        color: index % 3 === 0 ? '#F08B45' : index % 2 === 0 ? '#C89B52' : '#42D9F5'
      }
    })

    let frame = 0
    let previousTime = performance.now()
    const draw = (time: number) => {
      const deltaSeconds = Math.min((time - previousTime) / 1000, 0.05)
      const frameScale = deltaSeconds * 60
      previousTime = time
      context.clearRect(0, 0, bounds.width, bounds.height)
      let alive = false
      particles.forEach((particle) => {
        particle.x += particle.vx * frameScale
        particle.y += particle.vy * frameScale
        const damping = Math.pow(0.982, frameScale)
        particle.vx *= damping
        particle.vy = particle.vy * damping + 0.025 * frameScale
        particle.life -= deltaSeconds / 0.85
        if (particle.life <= 0) return
        alive = true
        context.globalAlpha = particle.life
        context.fillStyle = particle.color
        context.beginPath()
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        context.fill()
      })
      context.globalAlpha = 1
      if (alive) frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [active, reduceMotion])

  return <canvas className={styles.particleCanvas} ref={canvasRef} aria-hidden="true" />
}
