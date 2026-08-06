'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import styles from './SiteHeader.module.css'

const navigation = [
  { href: '/', label: '首页' },
  { href: '/questions', label: '题库' },
  { href: '/topics', label: '专题' },
  { href: '/practice', label: '练习' }
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className={styles.header}>
      <div className={`${styles.inner} container`}>
        <Link className={styles.brand} href="/" aria-label="Agent Interview 首页">
          <span className={styles.brandMark} aria-hidden="true">A</span>
          <strong>Agent Interview</strong>
        </Link>

        <nav className={styles.nav} aria-label="主导航">
          {navigation.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link aria-current={active ? 'page' : undefined} href={item.href} key={item.href}>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <Link className={styles.practiceLink} href="/practice">
          开始回答 <ArrowUpRight size={15} />
        </Link>
      </div>
    </header>
  )
}
