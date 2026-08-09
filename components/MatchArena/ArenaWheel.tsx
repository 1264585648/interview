import type { MatchPhase, MatchResult } from './types'
import styles from './MatchArena.module.css'
import { matchAsset } from './assetPath'

type ArenaWheelProps = {
  onStart: () => void
  phase: MatchPhase
  result: MatchResult | null
}

const phaseClass: Record<MatchPhase, string> = {
  idle: styles.phaseIdle,
  searching: styles.phaseSearching,
  'domain-locked': styles.phaseDomainLocked,
  'type-locked': styles.phaseTypeLocked,
  'level-locked': styles.phaseLevelLocked,
  matched: styles.phaseMatched
}

const coreCopy: Record<Exclude<MatchPhase, 'idle' | 'matched'>, { eyebrow: string; title: string }> = {
  searching: { eyebrow: 'MATCHMAKING', title: '正在分析挑战' },
  'domain-locked': { eyebrow: 'DOMAIN LOCKED', title: '领域已锁定' },
  'type-locked': { eyebrow: 'TYPE LOCKED', title: '题型已锁定' },
  'level-locked': { eyebrow: 'LEVEL LOCKED', title: '难度已锁定' }
}

export function ArenaWheel({ onStart, phase, result }: ArenaWheelProps) {
  return (
    <section className={`${styles.wheelZone} ${phaseClass[phase]}`} aria-label="面试匹配引擎">
      <div className={styles.wheelStage}>
        <img
          alt=""
          aria-hidden="true"
          className={styles.wheelArtwork}
          draggable="false"
          src={matchAsset('interview-wheel-ornament-square.webp')}
        />

        <div className={`${styles.liveRing} ${styles.outerRing}`} aria-hidden="true">
          <span className={styles.ringSweep} />
          <span className={styles.ringLockMark}>DOMAIN</span>
        </div>
        <div className={`${styles.liveRing} ${styles.middleRing}`} aria-hidden="true">
          <span className={styles.ringSweep} />
          <span className={styles.ringLockMark}>TYPE</span>
        </div>
        <div className={`${styles.liveRing} ${styles.innerRing}`} aria-hidden="true">
          <span className={styles.ringSweep} />
          <span className={styles.ringLockMark}>LEVEL</span>
        </div>

        <div className={styles.energyCore} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className={styles.wheelCore}>
          {phase === 'idle' ? (
            <button className={styles.matchButton} onClick={onStart} type="button">
              <span className={styles.matchButtonGlyph} aria-hidden="true">✦</span>
              <strong>开始匹配</strong>
              <small>START MATCH</small>
            </button>
          ) : phase === 'matched' ? (
            result ? (
              <div className={styles.matchFound}>
                <span>MATCH</span>
                <strong>FOUND</strong>
                <small>{result.domain}</small>
              </div>
            ) : null
          ) : (
            <div className={styles.coreStatus}>
              <span>{coreCopy[phase].eyebrow}</span>
              <strong>{coreCopy[phase].title}</strong>
              <i aria-hidden="true" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
