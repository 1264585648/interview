import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import styles from './SiteHeader.module.css'

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`${styles.inner} container`}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark}><Sparkles size={15} /></span>
          <span className={styles.brandCopy}>
            <strong>Agent Interview</strong>
            <small>Learning workspace</small>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="主导航">
          <Link href="/questions">题库</Link>
          <Link href="/topics">专题</Link>
          <Link href="/#daily-task">今日训练</Link>
        </nav>

        <Link className={styles.workspaceLink} href="/">
          学习工作台 <ArrowRight size={14} />
        </Link>
      </div>
    </header>
  )
}
