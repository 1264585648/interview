import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { questions } from '@/data/questions'
import { topicGuides } from '@/data/topics'
import styles from './HomePage.module.css'

const featured = questions.find((question) => question.slug === 'agent-tool-loop') ?? questions[0]

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <section className={`${styles.hero} container`}>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <div className={styles.masthead}>Agent Engineer Interview Handbook</div>
              <h1>Agent 工程师面试手册</h1>
              <p>
                不是一份“背答案”的题库，而是一套把 Agent 行为模型、工具、Memory、
                Context、Evaluation 和生产级系统设计串起来的工程面试笔记。
              </p>
              <Link className={styles.startLink} href={`/topics/${topicGuides[0].slug}`}>从第一专题开始 →</Link>
            </div>

            <aside className={styles.heroAside}>
              <span>怎么读</span>
              <p>先看专题，建立知识地图。</p>
              <p>再进单题，先自己回答。</p>
              <p>最后看图解、完整解析和追问。</p>
            </aside>
          </div>
        </section>

        <section className={`${styles.section} container`}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeading}>
              <h2>推荐先读</h2>
              <span>{featured.estimate}</span>
            </div>
            <Link className={styles.featuredQuestion} href={`/questions/${featured.slug}`}>
              <div>
                <div className={styles.meta}>{featured.category} · {featured.frequency} · {featured.type}</div>
                <h3>{featured.title}</h3>
                <p>{featured.shortAnswer}</p>
              </div>
              <span className={styles.readMore}>阅读这题 →</span>
            </Link>
          </div>
        </section>

        <section className={`${styles.section} container`} id="roadmap">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeadingBlock}>
              <h2>专题导读</h2>
              <p>先知道这些概念为什么连在一起，再进入具体题目。四条知识线从基础控制流一直走到生产系统。</p>
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
                    <span className={styles.chapterCount}>{count} 道题</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className={`${styles.section} container`}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeadingBlock}>
              <h2>最近更新</h2>
              <p>优先把少量高频题写深：有问题背景、结构图、参考回答、完整解析、工程实践和追问。</p>
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
            <h2>为什么这样学</h2>
            <div className={styles.aboutCopy}>
              <p>Agent 面试很少停在定义题。真正拉开差距的，是你能不能把控制流、状态、工具结果和失败恢复串成一个系统。</p>
              <p>所以每道题先还原面试现场，再画系统结构，最后才给参考答案。先建立因果关系，再记结论。</p>
              <p>当面试官换一个问法、加一个异常条件时，你仍然能从系统约束重新推导，而不是依赖背过的标准答案。</p>
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
