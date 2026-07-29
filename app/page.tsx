import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { questions } from '@/data/questions'
import { topicGuides } from '@/data/topics'
import styles from './HomePage.module.css'

const today = questions.find((question) => question.slug === 'agent-tool-loop') ?? questions[0]

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <section className={`${styles.hero} container`}>
          <div className={styles.heroInner}>
            <h1>把 Agent 面试题，真正讲明白。</h1>
            <p>
              一套面向工程师的 Agent Interview 手册。从基础概念到生产级系统设计，
              每道题先自己回答，再看完整解析、工程实践和面试官追问。
            </p>
            <div className={styles.heroLinks}>
              <Link href="/questions">浏览全部题目 <span>→</span></Link>
              <Link href="/topics">按专题系统学习 <span>→</span></Link>
            </div>
          </div>
        </section>

        <section className={`${styles.section} container`}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeading}>
              <h2>今日一题</h2>
              <span>{today.estimate}</span>
            </div>
            <Link className={styles.featuredQuestion} href={`/questions/${today.slug}`}>
              <span className={styles.featuredIndex}>027</span>
              <div>
                <div className={styles.meta}>{today.category} · {today.frequency} · {today.type}</div>
                <h3>{today.title}</h3>
                <p>{today.shortAnswer}</p>
              </div>
              <span className={styles.readMore}>阅读 →</span>
            </Link>
          </div>
        </section>

        <section className={`${styles.section} container`} id="roadmap">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeadingBlock}>
              <h2>专题学习</h2>
              <p>先建立知识地图，再进入具体问题。避免只记住术语，却说不清它们之间的关系。</p>
            </div>

            <div className={styles.chapterList}>
              {topicGuides.map((topic, index) => {
                const count = questions.filter((question) => topic.categories.includes(question.category)).length

                return (
                  <Link className={styles.chapterRow} href={`/topics/${topic.slug}`} key={topic.slug}>
                    <span className={styles.chapterNumber}>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3>{topic.title}</h3>
                      <p>{topic.summary}</p>
                    </div>
                    <span className={styles.chapterCount}>{count} 道</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className={`${styles.section} container`}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeadingBlock}>
              <h2>最近整理</h2>
              <p>先把少量题目做深，再逐步扩展成完整的 Agent Engineer 面试题库。</p>
            </div>

            <div className={styles.articleList}>
              {questions.slice(0, 6).map((question, index) => (
                <Link className={styles.articleRow} href={`/questions/${question.slug}`} key={question.slug}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{question.title}</h3>
                    <p>{question.category} · {question.frequency} · {question.estimate}</p>
                  </div>
                  <span>→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.about} container`} id="about">
          <div className={styles.aboutInner}>
            <h2>这个站怎么用</h2>
            <div className={styles.aboutCopy}>
              <p>第一遍先不要看答案。用 30 秒到 3 分钟把自己的回答说出来，暴露真正不会的地方。</p>
              <p>第二遍再看完整解析和工程实践，理解为什么这样回答，以及生产环境里真正会遇到什么问题。</p>
              <p>最后用追问再测一次。目标不是记住“标准答案”，而是面试官换个问法时，你仍然能自己推导出来。</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <span>Agent Interview</span>
          <span>面向 Agent Engineer 的开源面试手册</span>
        </div>
      </footer>
    </>
  )
}
