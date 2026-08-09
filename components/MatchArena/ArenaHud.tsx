import Link from 'next/link'
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react'
import styles from './MatchArena.module.css'

type ArenaHudProps = {
  onToggleSound: () => void
  soundEnabled: boolean
}

export function ArenaHud({ onToggleSound, soundEnabled }: ArenaHudProps) {
  return (
    <header className={styles.arenaHud}>
      <Link href="/questions">
        <ArrowLeft size={16} aria-hidden="true" />
        <span>离开试炼场</span>
      </Link>
      <div className={styles.arenaTitle}>
        <span>Agent Interview</span>
        <h1>星铸试炼</h1>
      </div>
      <button aria-pressed={soundEnabled} onClick={onToggleSound} type="button">
        {soundEnabled ? <Volume2 size={17} aria-hidden="true" /> : <VolumeX size={17} aria-hidden="true" />}
        <span>声音{soundEnabled ? '开' : '关'}</span>
      </button>
    </header>
  )
}
