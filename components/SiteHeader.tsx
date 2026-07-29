import Link from 'next/link'
import styles from './SiteHeader.module.css'

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`${styles.inner} container`}>
        <Link className={styles.brand} href="/">
          <strong>Agent Interview</strong>
          <span>面试手册</span>
        </Link>

        <nav className={styles.nav} aria-label="主导航">
          <Link href="/questions">题库</Link>
          <Link href="/#roadmap">学习路线</Link>
          <Link href="/#about">关于</Link>
        </nav>

        <Link className={styles.searchLink} href="/questions">
          搜索题目
        </Link>
      </div>
    </header>
  )
}
