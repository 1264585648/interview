import Link from 'next/link'
import { ArrowRight, BookOpen, Clock3, MessageSquareText } from 'lucide-react'
import type { InterviewQuestion } from '@/data/questions'
import type { TopicGuide } from '@/data/topics'
import { SiteHeader } from './SiteHeader'
import styles from './LandingPage.module.css'

type LandingPageProps = {
  featuredQuestion: InterviewQuestion
  recentQuestions: InterviewQuestion[]
  questions: InterviewQuestion[]
  topics: TopicGuide[]
}

export function LandingPage({ featuredQuestion, recentQuestions, questions, topics }: LandingPageProps) {
  return (
    <div className={styles.page}>
      <SiteHeader />

      <main>
        <section className={`${styles.hero} container`}>
          <div className={styles.heroIntro}>
            <p className={styles.productLabel}>为 AI Agent 工程面试整理</p>
            <h1>AI Agent 面试题库</h1>
            <p className={styles.heroSummary}>
              目前收录 {questions.length} 道题，覆盖 Planning、可观测性、工具调用和长期记忆。
              每道题包含核心结论、完整解析、相关图示和常见追问。
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href="/questions">
                浏览题目 <ArrowRight size={16} />
              </Link>
              <Link className={styles.textButton} href="/practice">
                模拟回答
              </Link>
            </div>
            <dl className={styles.coverage}>
              <div><dt>{questions.length}</dt><dd>道题目</dd></div>
              <div><dt>{topics.length}</dt><dd>个专题</dd></div>
              <div><dt>4</dt><dd>类解析内容</dd></div>
            </dl>
          </div>

          <article className={styles.startCard}>
            <div className={styles.startCardTop}>
              <span>从这里开始</span>
              <span>{featuredQuestion.estimate}</span>
            </div>
            <div className={styles.startCardBody}>
              <span className={styles.category}>{featuredQuestion.category}</span>
              <h2>{featuredQuestion.title}</h2>
              <p>{featuredQuestion.shortAnswer}</p>
            </div>
            <Link href={`/questions/${featuredQuestion.slug}`}>
              查看解析 <ArrowRight size={16} />
            </Link>
          </article>
        </section>

        <section className={`${styles.topicSection} container`} aria-labelledby="topic-title">
          <header className={styles.sectionHeader}>
            <div>
              <h2 id="topic-title">专题</h2>
              <p>把相互关联的题放在一起阅读。</p>
            </div>
            <Link href="/topics">查看全部专题 <ArrowRight size={15} /></Link>
          </header>

          <div className={styles.topicList}>
            {topics.map((topic) => {
              const count = questions.filter((question) => topic.categories.includes(question.category)).length
              return (
                <Link className={styles.topicItem} href={`/topics/${topic.slug}`} key={topic.slug}>
                  <div className={styles.topicCopy}>
                    <span>{count} 道题</span>
                    <h3>{topic.title}</h3>
                    <p>{topic.summary}</p>
                  </div>
                  <div className={styles.pathPreview} aria-label={`${topic.title}的知识路径`}>
                    {topic.flow.slice(0, 4).map((step, index) => (
                      <span key={step}>
                        <i aria-hidden="true">{index + 1}</i>
                        {step}
                      </span>
                    ))}
                  </div>
                  <ArrowRight className={styles.topicArrow} size={18} />
                </Link>
              )
            })}
          </div>
        </section>

        <section className={`${styles.recentSection} container`} aria-labelledby="recent-title">
          <header className={styles.sectionHeader}>
            <div>
              <h2 id="recent-title">最近整理</h2>
              <p>先看核心结论，再进入完整解析。</p>
            </div>
            <Link href="/questions">进入题库 <ArrowRight size={15} /></Link>
          </header>

          <div className={styles.questionList}>
            {recentQuestions.map((question) => (
              <Link href={`/questions/${question.slug}`} key={question.slug}>
                <div className={styles.questionMeta}>
                  <span>{question.category}</span>
                  <span><Clock3 size={13} /> {question.estimate}</span>
                </div>
                <h3>{question.title}</h3>
                <p>{question.shortAnswer}</p>
                <span className={styles.readLink}>查看解析 <ArrowRight size={15} /></span>
              </Link>
            ))}
          </div>
        </section>

        <section className={`${styles.practiceSection} container`}>
          <div>
            <MessageSquareText size={22} aria-hidden="true" />
            <div>
              <h2>模拟回答</h2>
              <p>选择一道题，计时作答。参考答案默认隐藏。</p>
            </div>
          </div>
          <Link href="/practice">开始回答 <ArrowRight size={16} /></Link>
        </section>
      </main>

      <footer className={`${styles.footer} container`}>
        <Link href="/" className={styles.footerBrand}><BookOpen size={16} /> Agent Interview</Link>
        <span>AI Agent 工程面试题与专题解析</span>
      </footer>
    </div>
  )
}
