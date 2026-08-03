import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Code2,
  Lightbulb,
  MessageSquareQuote,
  Sparkles,
  Star,
  Target
} from 'lucide-react'
import { notFound } from 'next/navigation'
import { QuestionComparison } from '@/components/QuestionComparison'
import { QuestionDiagram } from '@/components/QuestionDiagram'
import { QuestionLongform } from '@/components/QuestionLongform'
import { SiteHeader } from '@/components/SiteHeader'
import { getQuestionArticle } from '@/data/questionArticles'
import { getQuestion, questions } from '@/data/questions'
import { getTopicForCategory } from '@/data/topics'
import { QuestionPracticeWorkspace } from './QuestionPracticeWorkspace'
import styles from './QuestionDetail.module.css'
import compactStyles from './QuestionDetailCompact.module.css'
import articleStyles from './QuestionArticle.module.css'

const difficultyLabel: Record<number, string> = {
  1: '入门',
  2: '基础',
  3: '核心',
  4: '进阶',
  5: '系统设计'
}

const learningSteps = [
  ['intro', '引入面试题', '先独立组织答案'],
  ['short-answer', '简要回答', '抓住核心结论'],
  ['detailed-answer', '详细解析', '理解原理与工程取舍'],
  ['summary', '总结与面试建议', '形成自己的回答框架']
] as const

export function QuestionArticlePage({ slug }: { slug: string }) {
  const question = getQuestion(slug)

  if (!question) notFound()

  const article = getQuestionArticle(question.slug)
  const topic = getTopicForCategory(question.category)
  const questionIndex = questions.findIndex((item) => item.slug === question.slug)
  const previous = questionIndex > 0 ? questions[questionIndex - 1] : null
  const next = questionIndex < questions.length - 1 ? questions[questionIndex + 1] : null
  const summaryItems = question.engineeringPractice.slice(0, 3)
  const bonusText = article?.interviewerNote ?? question.commonMistakes[0]

  return (
    <>
      <SiteHeader />
      <main className={`${styles.page} ${compactStyles.compact}`}>
        <div className={styles.workspace}>
          <aside className={styles.stepSidebar}>
            <div className={styles.stepSidebarInner}>
              <span className={styles.stepTitle}>学习步骤</span>
              <nav aria-label="学习步骤">
                {learningSteps.map(([id, label, hint], index) => (
                  <a className={index === 0 ? styles.activeStep : ''} href={`#${id}`} key={id}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>{label}</strong>
                      <small>{hint}</small>
                    </div>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className={styles.body}>
            <nav className={styles.breadcrumb} aria-label="面包屑">
              <Link href="/">首页</Link>
              <span>/</span>
              <Link href="/questions">面试题库</Link>
              {topic ? (
                <>
                  <span>/</span>
                  <Link href={`/topics/${topic.slug}`}>{topic.title}</Link>
                </>
              ) : null}
              <span>/</span>
              <strong>{String(questionIndex + 1).padStart(2, '0')}</strong>
            </nav>

            <header className={styles.questionHeader}>
              <Link className={styles.backLink} href="/questions">
                <ArrowLeft size={14} /> 返回题库
              </Link>
              <div className={styles.questionMeta}>
                <span>{question.category}</span>
                <span>{question.frequency}</span>
                <span>{question.type}</span>
                <span>{difficultyLabel[question.difficulty]}</span>
                <span>建议回答 {question.estimate}</span>
              </div>
              <h1>{question.title}</h1>
              <p>先独立回答，再看简要结论和详细解析，最后把工程判断整理成自己的表达。</p>
            </header>

            <div className={styles.contentGrid}>
              <div className={styles.mainColumn}>
                <QuestionPracticeWorkspace question={question} />

                <section className={`${styles.panel} ${styles.analysisPanel}`} id="detailed-answer">
                  <div className={styles.panelHeader}>
                    <div>
                      <span className={styles.panelEyebrow}>DEEP DIVE</span>
                      <h2>详细解析</h2>
                    </div>
                    <Code2 size={21} />
                  </div>

                  <div className={styles.analysisTabs}>
                    <a href="#concept">概念</a>
                    <a href="#architecture">架构</a>
                    <a href="#scenarios">场景</a>
                    <a href="#tradeoffs">优缺点</a>
                    <a href="#practice">实践</a>
                  </div>

                  {article ? (
                    <div className={styles.keyConclusion} id="concept">
                      <Lightbulb size={18} />
                      <div>
                        <strong>先记住这句话</strong>
                        <p>{article.keyConclusion}</p>
                      </div>
                    </div>
                  ) : null}

                  <div className={styles.diagramSection} id="architecture">
                    <div className={styles.sectionHeading}>
                      <span>技术架构对比</span>
                      <p>把抽象概念放回系统结构中理解。</p>
                    </div>
                    <QuestionDiagram slug={question.slug} />
                  </div>

                  <div className={styles.deepDiveGrid} id="scenarios">
                    {question.deepDive.map((item, index) => (
                      <article key={item.title}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <h3>{item.title}</h3>
                        <p>{item.content}</p>
                      </article>
                    ))}
                  </div>

                  <div className={styles.longformSection} id="tradeoffs">
                    <QuestionLongform question={question} />
                    <QuestionComparison slug={question.slug} />
                  </div>

                  <div className={styles.productionSection} id="practice">
                    <div className={styles.sectionHeading}>
                      <span>工程实践</span>
                      <p>从概念正确走到系统可运行。</p>
                    </div>

                    {article ? (
                      <>
                        <div className={articleStyles.engineeringCase}>
                          <div className={articleStyles.caseRow}>
                            <span>错误现场</span>
                            <p>{article.engineeringCase.problem}</p>
                          </div>
                          <div className={articleStyles.caseRow}>
                            <span>更稳妥的做法</span>
                            <p>{article.engineeringCase.better}</p>
                          </div>
                        </div>

                        <div className={articleStyles.codeExample}>
                          <div className={articleStyles.codeIntro}>
                            <span>把原理落到伪代码</span>
                            <p>{article.codeCaption}</p>
                          </div>
                          <pre><code>{article.pseudoCode}</code></pre>
                        </div>
                      </>
                    ) : null}

                    <ul className={styles.practiceList}>
                      {question.engineeringPractice.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                </section>

                <footer className={styles.questionFooter}>
                  <span>
                    {previous ? <Link href={`/questions/${previous.slug}`}>← 上一题：{previous.title}</Link> : '这是第一题'}
                  </span>
                  <span>
                    {next ? <Link href={`/questions/${next.slug}`}>下一题：{next.title} →</Link> : <Link href="/questions">返回题库 →</Link>}
                  </span>
                </footer>
              </div>

              <aside className={styles.supportColumn}>
                <section className={`${styles.panel} ${styles.referencePanel}`}>
                  <div className={styles.supportHeading}>
                    <Target size={18} />
                    <h2>参考要点</h2>
                  </div>
                  <div className={styles.pointTags}>
                    {question.keyPoints.map((point) => <span key={point}>{point}</span>)}
                  </div>
                </section>

                <section className={`${styles.panel} ${styles.shortAnswerPanel}`} id="short-answer">
                  <div className={styles.supportHeading}>
                    <Lightbulb size={18} />
                    <h2>简要回答</h2>
                  </div>
                  <p>{question.shortAnswer}</p>
                  {article?.answerStructure?.length ? (
                    <ol>
                      {article.answerStructure.slice(0, 3).map((step, index) => (
                        <li key={step}>
                          <span>{index + 1}</span>
                          <p>{step}</p>
                        </li>
                      ))}
                    </ol>
                  ) : null}
                </section>

                <section className={`${styles.panel} ${styles.summaryPanel}`} id="summary">
                  <div className={styles.supportHeading}>
                    <MessageSquareQuote size={18} />
                    <h2>总结与面试建议</h2>
                  </div>
                  <ul>
                    {summaryItems.map((item) => (
                      <li key={item}>
                        <CheckCircle2 size={17} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.followupBlock}>
                    <strong>面试官可能继续问</strong>
                    {question.followUps.slice(0, 3).map((followup) => <p key={followup}>{followup}</p>)}
                  </div>
                </section>

                <section className={styles.bonusPanel}>
                  <div className={styles.supportHeading}>
                    <Star size={18} fill="currentColor" />
                    <h2>面试加分点</h2>
                  </div>
                  <p>{bonusText}</p>
                  <div>
                    <Sparkles size={15} />
                    <span>{question.topics.join(' · ')}</span>
                  </div>
                </section>

                <Link className={styles.practiceLink} href="/practice">
                  <BookOpenCheck size={18} />
                  进入完整模拟面试
                  <ArrowRight size={17} />
                </Link>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
