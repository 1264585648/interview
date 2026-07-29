import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'
import { InterviewTrainer } from '@/components/InterviewTrainer'
import { getQuestion, questions } from '@/data/questions'
import styles from './QuestionDetail.module.css'

type Props = {
  params: Promise<{ slug: string }>
}

const difficultyLabel: Record<number, string> = {
  1: '入门',
  2: '基础',
  3: '核心',
  4: '进阶',
  5: '系统设计'
}

export function generateStaticParams() {
  return questions.map((question) => ({ slug: question.slug }))
}

export default async function QuestionDetailPage({ params }: Props) {
  const { slug } = await params
  const question = getQuestion(slug)

  if (!question) notFound()

  return (
    <>
      <SiteHeader />
      <main className={`${styles.page} container`}>
        <div className={styles.shell}>
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
          </header>

          <section className={styles.practiceSection}>
            <div className={styles.sectionTitle}>
              <span>01</span>
              <div>
                <h2>先回答这道题</h2>
                <p>建议先给结论，再解释原理，最后补一个工程实践判断。</p>
              </div>
            </div>
            <InterviewTrainer question={question} />
          </section>

          <section className={styles.articleSection}>
            <div className={styles.sectionTitle}>
              <span>02</span>
              <div>
                <h2>30 秒参考回答</h2>
                <p>真实面试里，先用一段话把核心结论讲完整。</p>
              </div>
            </div>
            <p className={styles.answer}>{question.shortAnswer}</p>
          </section>

          <section className={styles.articleSection}>
            <div className={styles.sectionTitle}>
              <span>03</span>
              <div>
                <h2>完整解析</h2>
                <p>把短答案拆开，理解每个判断背后的系统设计逻辑。</p>
              </div>
            </div>
            <div className={styles.deepDive}>
              {question.deepDive.map((item) => (
                <article key={item.title} className={styles.deepDiveBlock}>
                  <h3>{item.title}</h3>
                  <p>{item.content}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.articleSection}>
            <div className={styles.sectionTitle}>
              <span>04</span>
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

          <section className={styles.articleSection}>
            <div className={styles.sectionTitle}>
              <span>05</span>
              <div>
                <h2>工程实践</h2>
                <p>真正做进生产系统时，需要把概念落到这些约束和机制上。</p>
              </div>
            </div>
            <ul className={styles.practiceList}>
              {question.engineeringPractice.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className={styles.articleSection}>
            <div className={styles.sectionTitle}>
              <span>06</span>
              <div>
                <h2>面试官在听什么</h2>
                <p>这些关键词决定你的回答是在背概念，还是理解了系统。</p>
              </div>
            </div>
            <ol className={styles.keyPoints}>
              {question.keyPoints.map((point, index) => (
                <li key={point}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{point}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.articleSection}>
            <div className={styles.sectionTitle}>
              <span>07</span>
              <div>
                <h2>面试官可能继续追问</h2>
                <p>第一问只是入口，真正拉开差距的是后续追问。</p>
              </div>
            </div>
            <ol className={styles.followUps}>
              {question.followUps.map((followup, index) => (
                <li key={followup}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{followup}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>
    </>
  )
}
