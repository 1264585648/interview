import type { CSSProperties } from 'react'
import { motion, useTransform, type MotionValue } from 'motion/react'
import type { ArenaPhase, MatchProfile } from './types'
import styles from './MatchArena.module.css'
import { matchAsset } from './assetPath'

type ArenaWheelProps = {
  onStart: () => void
  phase: ArenaPhase
  profiles: MatchProfile[]
  reduceMotion: boolean
  rotation: MotionValue<number>
  selectedProfile: MatchProfile | null
  selectedSlot: number | null
}

const resolvedPhases: ArenaPhase[] = ['reveal', 'dealing', 'ready']

type WheelSlotProps = {
  index: number
  profile: MatchProfile
  rotation: MotionValue<number>
  selected: boolean
  slotAngle: number
}

function WheelSlot({ index, profile, rotation, selected, slotAngle }: WheelSlotProps) {
  const angle = index * slotAngle
  const counterRotation = useTransform(rotation, (value) => -(value + angle))
  const slotStyle = { '--slot-angle': `${angle}deg` } as CSSProperties

  return (
    <div className={`${styles.slot} ${selected ? styles.slotSelected : ''}`} style={slotStyle}>
      <motion.div className={styles.slotFace} style={{ rotate: counterRotation }}>
        <span>{profile.kind === 'opponent' ? '对手' : '模式'}</span>
        <strong>{profile.label}</strong>
      </motion.div>
    </div>
  )
}

const coreStatus: Record<Exclude<ArenaPhase, 'idle'>, string> = {
  searching: '巡游中',
  locking: '锁定中',
  reveal: '印记降临',
  dealing: '牌库响应',
  ready: '试炼就绪'
}

export function ArenaWheel({
  onStart,
  phase,
  profiles,
  reduceMotion,
  rotation,
  selectedProfile,
  selectedSlot
}: ArenaWheelProps) {
  const slotAngle = 360 / profiles.length
  const revealed = resolvedPhases.includes(phase)

  return (
    <section className={styles.wheelZone} aria-label="试炼匹配轮">
      <div className={styles.pointer} aria-hidden="true"><span /></div>

      <motion.div className={styles.wheelRotor} style={{ rotate: rotation }}>
        <img
          alt=""
          className={styles.wheelArtwork}
          draggable="false"
          src={matchAsset('interview-wheel-ornament-square.webp')}
        />
        <div className={styles.slotRing} aria-hidden="true">
          {profiles.map((profile, index) => (
            <WheelSlot
              index={index}
              key={profile.id}
              profile={profile}
              rotation={rotation}
              selected={revealed && selectedSlot === index}
              slotAngle={slotAngle}
            />
          ))}
        </div>
      </motion.div>

      <div className={styles.wheelCore}>
        {phase === 'idle' ? (
          <button className={styles.summonButton} onClick={onStart} type="button">
            <span aria-hidden="true">✦</span>
            <strong>召唤试炼</strong>
            <small>匹配对手</small>
          </button>
        ) : revealed && selectedProfile ? (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={styles.coreImprint}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.35, y: '-34vh' }}
            key={selectedProfile.id}
            transition={{ type: 'spring', stiffness: 180, damping: 16 }}
          >
            <span>{selectedProfile.eyebrow}</span>
            <strong>{selectedProfile.label}</strong>
          </motion.div>
        ) : (
          <div className={styles.coreStatus}>
            <span aria-hidden="true">✦</span>
            <strong>{coreStatus[phase]}</strong>
          </div>
        )}
      </div>

      <ol className={styles.visuallyHidden} aria-label="可匹配的对手和挑战模式">
        {profiles.map((profile) => <li key={profile.id}>{profile.eyebrow}：{profile.label}</li>)}
      </ol>
    </section>
  )
}
