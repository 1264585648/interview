import { motion } from 'motion/react'
import type { ArenaPhase, MatchProfile } from './types'
import styles from './MatchArena.module.css'

type OpponentSeatProps = {
  phase: ArenaPhase
  profile: MatchProfile | null
  reduceMotion: boolean
}

const revealedPhases: ArenaPhase[] = ['reveal', 'dealing', 'ready']

export function OpponentSeat({ phase, profile, reduceMotion }: OpponentSeatProps) {
  const revealed = revealedPhases.includes(phase) && profile

  return (
    <section className={styles.opponentSeat} aria-label="本局匹配对象">
      <span className={styles.seatLabel}>对手席</span>
      <div className={`${styles.sealSocket} ${revealed ? styles.sealSocketActive : ''}`}>
        {revealed ? (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className={styles.opponentSeal}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.65 }}
            key={profile.id}
          >
            <strong>{profile.label.slice(0, 1)}</strong>
          </motion.div>
        ) : <span className={styles.unknownSeal}>?</span>}
      </div>
      <div className={styles.opponentIdentity}>
        {revealed ? (
          <>
            <span>{profile.eyebrow}</span>
            <h2>{profile.label}</h2>
          </>
        ) : (
          <>
            <span>等待召唤</span>
            <h2>未知印记</h2>
          </>
        )}
      </div>
    </section>
  )
}
