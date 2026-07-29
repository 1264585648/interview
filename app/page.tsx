import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { questions } from '@/data/questions'
import styles from './HomePage.module.css'

const chapters = [
  {
    title: 'Agent 基础与运行时',
    categories: ['Agent 基础', 'Agent Runtime'],
    description: '先搞清楚 Agent 为什么和固定 Workflow 不一样，再进入停止条件、失败恢复和运行时控制。'
  },
  {
    title: '工具、协议与知识',
    categories: ['Tool Calling', 'MCP', 'RAG'],
    description: '理解模型怎么调用外部能力，以及 MCP、RAG 在 Agent 系统里分别解决什么问题。'
  },
  {
    title: '状态、记忆与上下文',
    categories: ['Memory', 'Context Engineering'],
    description: '长任务真正难的是状态管理：什么该保留、什么时候检索、什么时候压缩和遗忘。'
  },
  {
    title: '评估与系统设计',
    categories: ['Evaluation', 'System Design'],
    description: '把单点能力组合成生产系统，并说明可靠性、成本、可观测性和架构取舍。'
  }
]

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
              <Link href={`/questions/${questions[0]?.slug}`}>从第一题开始 <span>→</span></Link>
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
              <h2>学习路线</h2>
              <p>不按标签乱刷题，按一条能在面试里逐步讲清楚的知识路径学习。</p>
            </div>

            <div className={styles.chapterList}>
              {chapters.map((chapter, index) => {
                const count = questions.filter((question) => chapter.categories.includes(question.category)).length
                const primaryCategory = chapter.categories.find((category) => questions.some((question) => question.category === category))
                const href = primaryCategory ? `/questions?category=${encodeURIComponent(primaryCategory)}` : '/questions'

                return (
                  <Link className={styles.chapterRow} href={href} key={chapter.title}>
                    <span className={styles.chapterNumber}>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3>{chapter.title}</h3>
                      <p>{chapter.description}</p>
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
