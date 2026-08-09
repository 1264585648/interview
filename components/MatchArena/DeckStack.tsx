import type { ArenaPhase } from './types'
import styles from './MatchArena.module.css'
import { matchAsset } from './assetPath'

type DeckStackProps = {
  count: number
  phase: ArenaPhase
}

export function DeckStack({ count, phase }: DeckStackProps) {
  return (
    <div className={`${styles.deckStack} ${phase === 'dealing' ? styles.deckStackDealing : ''}`} aria-label={`题目牌库，共 ${count} 道题`}>
      <span className={styles.deckEcho} aria-hidden="true" />
      <span className={styles.deckEcho} aria-hidden="true" />
      <img alt="" draggable="false" src={matchAsset('interview-card-back-square.webp')} />
      <strong>题目牌库</strong>
      <small>{count} 张</small>
    </div>
  )
}
