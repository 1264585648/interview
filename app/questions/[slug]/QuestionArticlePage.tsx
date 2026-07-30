import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { QuestionComparison } from '@/components/QuestionComparison'
import { QuestionDiagram } from '@/components/QuestionDiagram'
import { QuestionLongform } from '@/components/QuestionLongform'
import { SiteHeader } from '@/components/SiteHeader'
import { InterviewTrainer } from '@/components/InterviewTrainer'
import { getQuestionArticle } from '@/data/questionArticles'
import { getQuestion, questions } from '@/data/questions'
import { getTopicForCategory } from '@/data/topics'
import styles from './QuestionDetail.module.css'
import articleStyles from './QuestionArticle.module.css'

const difficultyLabel: Record<number, string> = {
  1: '入门',
  2: '基础',
  3: '核心',
  4: '进阶',
  5: '系统设计'
}

const sectionLinks = [
  ['scene', '面试现场'],
  ['practice', '先回答'],
  ['answer', '30 秒回答'],
  ['deep-dive', '完整解析'],
  ['mistakes', '常见错误'],
  ['engineering', '工程实践'],
  ['focus', '面试官点评'],
  ['follow-ups', '追问链']
] as const

export function QuestionArticlePage({ slug }: { slug: string }) {
  const question = getQuestion(slug)

  if (!question) notFound()

  const article = getQuestionArticle(question.slug)
  const topic = getTopicForCategory(question.category)
  const questionIndex = questions.findIndex((item) => item.slug === question.slug)
  const previous = questionIndex > 0 ? questions[questionIndex - 1] : null
  const next = questionIndex < questions.length - 1 ? questions[questionIndex + 1] : null

  return (
    <>
      <SiteHeader />
      <main className={`${styles.page} container`}>
        <article className={styles.shell}>
          <Link className={styles.backLink} href="/questions">
            <ArrowLeft size={14} /> 返回题库
          </Link>

          <header className={styles.header}>
            <div className={styles.metaLine}>
              <span>{question.category}</span>
              <span>{question.frequency}</span>
              <span>{question.type}</span>
              <span>{difficultyLabel[question.difficulty]}</span>
              <span>建议回答 {question.estimate}</span>
            </div>

            <h1>{question.title}</h1>
            <p className={styles.lead}>先像真实面试一样回答，再看参考答案和完整解析。目标不是背答案，而是理解面试官为什么问、工程上怎么做。</p>

            <div className={styles.topics}>
              <span>考察：</span>
              <p>{question.topics.join(' · ')}</p>
            </div>

            {topic ? (
              <Link className={styles.topicLink} href={`/topics/${topic.slug}`}>
                属于专题：{topic.title} →
              </Link>
            ) : null}
          </header>

          <nav className={styles.toc} aria-label="本题目录">
            <span>本题目录</span>
            <div>
              {sectionLinks.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}
            </div>
          </nav>

          <section className={styles.articleSection} id="scene">
            <div className={styles.sectionTitle}>
              <span>01</span>
              <div>
                <h2>先看一眼面试现场</h2>
                <p>先建立问题语境和系统结构，再开始组织自己的回答。</p>
              </div>
            </div>

            <div className={styles.scene}>
              <div className={styles.sceneLine}>
                <span>面试官</span>
                <p>{question.title}</p>
              </div>
              <div className={styles.sceneLine}>
                <span>继续追问</span>
                <p>{question.followUps[0]}</p>
              </div>
              <div className={styles.sceneTrap}>
                <span>容易翻车</span>
                <p>{question.commonMistakes[0]}</p>
              </div>
            </div>

            <QuestionDiagram slug={question.slug} />

            {article ? (
              <aside className={articleStyles.callout}>
                <span>先抓住这句话</span>
                <p>{article.keyConclusion}</p>
              </aside>
            ) : null}
          </section>

          <section className={styles.practiceSection} id="practice">
            <div className={styles.sectionTitle}>
              <span>02</span>
              <div>
                <h2>现在自己回答一次</h2>
                <p>建议先给结论，再解释原理，最后补一个工程实践判断。</p>
              </div>
            </div>
            <InterviewTrainer question={question} />
          </section>

          <section className={styles.articleSection} id="answer">
            <div className={styles.sectionTitle}>
              <span>03</span>
              <div>
                <h2>30 秒参考回答</h2>
                <p>真实面试里，先用一段话把核心结论讲完整。</p>
              </div>
            </div>
            <p className={styles.answer}>{question.shortAnswer}</p>

            {article ? (
              <div className={articleStyles.answerStructure}>
                <span>推荐回答顺序</span>
                <ol>
                  {article.answerStructure.map((step, index) => (
                    <li key={step}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <p>{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </section>

          <section className={styles.articleSection} id="deep-dive">
            <div className={styles.sectionTitle}>
              <span>04</span>
              <div>
                <h2>完整解析</h2>
                <p>从控制机制、边界条件和生产取舍一路推导，不只记住结论。</p>
              </div>
            </div>

            <QuestionLongform question={question} />

            <QuestionComparison slug={question.slug} />

            {article ? (
              <div className={articleStyles.codeExample}>
                <div className={articleStyles.codeIntro}>
                  <span>把原理落到伪代码</span>
                  <p>{article.codeCaption}</p>
                </div>
                <pre><code>{article.pseudoCode}</code></pre>
              </div>
            ) : null}
          </section>

          <section className={styles.articleSection} id="mistakes">
            <div className={styles.sectionTitle}>
              <span>05</span>
              <div>
                <h2>常见错误回答</h2>
                <p>这些回答听起来没错，但通常只能拿到“知道概念”的评价。</p>
              </div>
            </div>
            <ul className={styles.mistakeList}>
              {question.commonMistakes.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
          </section>

          <section className={styles.articleSection} id="engineering">
            <div className={styles.sectionTitle}>
              <span>06</span>
              <div>
                <h2>工程实践</h2>
                <p>不要停在原则层，看看同一个问题在生产环境里会怎样失败。</p>
              </div>
            </div>

            {article ? (
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
            ) : null}

            <ul className={styles.practiceList}>
              {question.engineeringPractice.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className={styles.articleSection} id="focus">
            <div className={styles.sectionTitle}>
              <span>07</span>
              <div>
                <h2>面试官在听什么</h2>
                <p>关键词只是表面，更重要的是你有没有回答这道题真正想考的判断。</p>
              </div>
            </div>

            {article ? (
              <aside className={`${articleStyles.callout} ${articleStyles.interviewerCallout}`}>
                <span>面试官点评</span>
                <p>{article.interviewerNote}</p>
              </aside>
            ) : null}

            <ol className={styles.keyPoints}>
              {question.keyPoints.map((point, index) => (
                <li key={point}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{point}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.articleSection} id="follow-ups">
            <div className={styles.sectionTitle}>
              <span>08</span>
              <div>
                <h2>真实追问链</h2>
                <p>把第一问当入口，顺着控制权、边界和生产取舍继续往下答。</p>
              </div>
            </div>
            <ol className={styles.followUps}>
              <li>
                <span>Q1</span>
                <p>{question.title}</p>
              </li>
              {question.followUps.map((followup, index) => (
                <li key={followup}>
                  <span>Q{index + 2}</span>
                  <p>{followup}</p>
                </li>
              ))}
            </ol>
          </section>

          {article ? (
            <aside className={articleStyles.remember}>
              <span>一句话记住</span>
              <strong>{article.takeaway}</strong>
            </aside>
          ) : null}

          <footer className={styles.questionFooter}>
            <span>{previous ? <Link href={`/questions/${previous.slug}`}>← 上一题：{previous.title}</Link> : '这是第一题'}</span>
            <span>{next ? <Link href={`/questions/${next.slug}`}>下一题：{next.title} →</Link> : <Link href="/questions">返回题库 →</Link>}</span>
          </footer>
        </article>
      </main>
    </>
  )
}
