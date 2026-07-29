import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ConceptFlow } from '@/components/ConceptFlow'
import { SiteHeader } from '@/components/SiteHeader'
import { questions, type InterviewQuestion } from '@/data/questions'
import { getTopicGuide, topicGuides } from '@/data/topics'
import styles from '../Topics.module.css'

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return topicGuides.map((topic) => ({ slug: topic.slug }))
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params
  const topic = getTopicGuide(slug)

  if (!topic) notFound()

  const topicQuestions = questions.filter((question) => topic.categories.includes(question.category))
  const currentIndex = topicGuides.findIndex((item) => item.slug === topic.slug)
  const previous = currentIndex > 0 ? topicGuides[currentIndex - 1] : null
  const next = currentIndex < topicGuides.length - 1 ? topicGuides[currentIndex + 1] : null

  return (
    <>
      <SiteHeader />
      <main className={`${styles.page} container`}>
        <article className={styles.shell}>
          <Link className={styles.backLink} href="/topics">← 返回专题</Link>

          <header className={styles.header}>
            <div className={styles.headerMeta}>专题 {String(currentIndex + 1).padStart(2, '0')} · {topicQuestions.length} 道题</div>
            <h1>{topic.title}</h1>
            <p>{topic.summary}</p>
          </header>

          <div className={styles.intro}>
            {topic.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>

          <ConceptFlow items={topic.flow} label="这一专题的知识路径" />

          <section className={styles.goals}>
            <h2>学完这一专题，你应该能回答</h2>
            <ul className={styles.goalList}>
              {topic.goals.map((goal) => <li key={goal}>{goal}</li>)}
            </ul>
          </section>

          <div className={styles.phaseList}>
            {topic.phases.map((phase) => {
              const phaseQuestions = phase.questionSlugs
                .map((questionSlug) => questions.find((question) => question.slug === questionSlug))
                .filter((question): question is InterviewQuestion => Boolean(question))

              return (
                <section className={styles.phase} key={phase.title}>
                  <header className={styles.phaseHeader}>
                    <h2>{phase.title}</h2>
                    <p>{phase.description}</p>
                  </header>

                  <div className={styles.questionList}>
                    {phaseQuestions.map((question, index) => (
                      <Link className={styles.questionRow} href={`/questions/${question.slug}`} key={question.slug}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <div>
                          <h3>{question.title}</h3>
                          <p>{question.frequency} · {question.type} · {question.estimate}</p>
                        </div>
                        <span>→</span>
                      </Link>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>

          <footer className={styles.topicFooter}>
            <span>{previous ? <Link href={`/topics/${previous.slug}`}>← {previous.title}</Link> : '这是第一章'}</span>
            <span>{next ? <Link href={`/topics/${next.slug}`}>{next.title} →</Link> : <Link href="/questions">进入完整题库 →</Link>}</span>
          </footer>
        </article>
      </main>
    </>
  )
}
