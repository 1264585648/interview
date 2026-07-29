import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { questions } from '@/data/questions'
import { topicGuides } from '@/data/topics'
import styles from './Topics.module.css'

export default function TopicsPage() {
  return (
    <>
      <SiteHeader />
      <main className={`${styles.page} container`}>
        <div className={styles.shell}>
          <header className={styles.header}>
            <div className={styles.headerMeta}>Agent Interview · 专题学习</div>
            <h1>按一条知识线，把题目真正串起来。</h1>
            <p>
              题库适合查题，专题更适合系统学习。每个专题先建立知识地图，再按阶段进入具体问题，
              避免只记住零散术语却说不清它们之间的关系。
            </p>
          </header>

          <div className={styles.topicList}>
            {topicGuides.map((topic, index) => {
              const count = questions.filter((question) => topic.categories.includes(question.category)).length
              return (
                <Link className={styles.topicRow} href={`/topics/${topic.slug}`} key={topic.slug}>
                  <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h2>{topic.title}</h2>
                    <p>{topic.summary}</p>
                  </div>
                  <span className={styles.rowMeta}>{count} 道 · 阅读专题 →</span>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
    </>
  )
}
