import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { ConceptFlow } from '@/components/ConceptFlow'
import { SiteHeader } from '@/components/SiteHeader'
import { InterviewTrainer } from '@/components/InterviewTrainer'
import { getQuestion, questions } from '@/data/questions'
import { getTopicForCategory } from '@/data/topics'
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

const sectionLinks = [
  ['scene', '面试现场'],
  ['practice', '先回答'],
  ['answer', '30 秒回答'],
  ['deep-dive', '完整解析'],
  ['mistakes', '常见错误'],
  ['engineering', '工程实践'],
  ['focus', '考察重点'],
  ['follow-ups', '继续追问']
] as const

export function generateStaticParams() {
  return questions.map((question) => ({ slug: question.slug }))
}

export default async function QuestionDetailPage({ params }: Props) {
  const { slug } = await params
  const question = getQuestion(slug)

  if (!question) notFound()

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
                <p>这道题真正的难点，通常会在第一句追问之后暴露出来。</p>
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

            {topic ? <ConceptFlow items={topic.flow} label="这道题所在的知识线" /> : null}
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
          </section>

          <section className={styles.articleSection} id="deep-dive">
            <div className={styles.sectionTitle}>
              <span>04</span>
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
                <p>真正做进生产系统时，需要把概念落到这些约束和机制上。</p>
              </div>
            </div>
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

          <section className={styles.articleSection} id="follow-ups">
            <div className={styles.sectionTitle}>
              <span>08</span>
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

          <footer className={styles.questionFooter}>
            <span>{previous ? <Link href={`/questions/${previous.slug}`}>← 上一题：{previous.title}</Link> : '这是第一题'}</span>
            <span>{next ? <Link href={`/questions/${next.slug}`}>下一题：{next.title} →</Link> : <Link href="/questions">返回题库 →</Link>}</span>
          </footer>
        </article>
      </main>
    </>
  )
}
