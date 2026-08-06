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
            <h1>专题</h1>
            <p>把相互关联的题放在一起，并标出建议的阅读顺序。</p>
          </header>

          <div className={styles.topicList}>
            {topicGuides.map((topic) => {
              const count = questions.filter((question) => topic.categories.includes(question.category)).length
              return (
                <Link className={styles.topicRow} href={`/topics/${topic.slug}`} key={topic.slug}>
                  <div className={styles.topicCopy}>
                    <span className={styles.topicCount}>{count} 道题</span>
                    <h2>{topic.title}</h2>
                    <p>{topic.summary}</p>
                    <div className={styles.flowPreview} aria-label={`${topic.title}知识路径`}>
                      {topic.flow.slice(0, 4).map((step, stepIndex) => (
                        <span key={step}><i>{stepIndex + 1}</i>{step}</span>
                      ))}
                    </div>
                  </div>
                  <span className={styles.rowMeta}>查看专题 →</span>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
    </>
  )
}
