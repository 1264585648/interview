import Link from 'next/link'
import { ArrowLeft, Library } from 'lucide-react'
import styles from './MatchArena.module.css'

export function ArenaHud() {
  return (
    <header className={styles.arenaHud}>
      <Link className={styles.hudLink} href="/questions">
        <ArrowLeft size={15} aria-hidden="true" />
        <span>返回</span>
      </Link>

      <div className={styles.arenaTitle}>
        <span>INTERVIEW ARENA</span>
        <strong>面试匹配</strong>
      </div>

      <Link className={styles.hudLink} href="/questions">
        <Library size={15} aria-hidden="true" />
        <span>题库</span>
      </Link>
    </header>
  )
}
