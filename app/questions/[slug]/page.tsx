import Link from 'next/link'
import { ArrowLeft, BookOpenCheck, Clock3, Gauge, Sparkles } from 'lucide-react'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'
import { InterviewTrainer } from '@/components/InterviewTrainer'
import { getQuestion, questions } from '@/data/questions'

type Props = {
  params: Promise<{ slug: string }>
}

function stars(value: number) {
  return '★'.repeat(value) + '☆'.repeat(5 - value)
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
      <main className="container detail-page">
        <Link className="back-link" href="/questions"><ArrowLeft size={15} /> 返回题库</Link>

        <section className="detail-hero">
          <div className="detail-main">
            <div className="question-tags"><span>{question.category}</span><span>{question.frequency}</span><span>{question.type}</span></div>
            <h1>{question.title}</h1>
            <p>先把它当成真实面试来回答。完成追问后，再对照要点和参考答案。</p>
            <div className="detail-meta">
              <span><Gauge size={16} /> {stars(question.difficulty)}</span>
              <span><Clock3 size={16} /> 建议回答 {question.estimate}</span>
            </div>
          </div>
          <div className="topic-stack">
            <span>本题考察</span>
            {question.topics.map((topic) => <strong key={topic}>{topic}</strong>)}
          </div>
        </section>

        <InterviewTrainer question={question} />

        <section className="analysis-grid">
          <article className="analysis-card">
            <span className="eyebrow"><BookOpenCheck size={15} /> 30 秒参考回答</span>
            <h2>先给结论，再解释为什么。</h2>
            <p className="answer-copy">{question.shortAnswer}</p>
          </article>

          <article className="analysis-card">
            <span className="eyebrow"><Sparkles size={15} /> 面试官在听什么</span>
            <h2>不是背定义，而是这些关键判断。</h2>
            <div className="keypoint-list">
              {question.keyPoints.map((point, index) => (
                <div key={point}><span>{String(index + 1).padStart(2, '0')}</span><strong>{point}</strong></div>
              ))}
            </div>
          </article>
        </section>

        <section className="followups-section">
          <div className="section-heading"><div><span className="section-kicker">FOLLOW-UP QUESTIONS</span><h2>面试官可能继续追问</h2><p>真正拉开差距的，通常不是第一问，而是你能不能接住后续。</p></div></div>
          <div className="followup-list">
            {question.followUps.map((followup, index) => (
              <div key={followup}><span>{String(index + 1).padStart(2, '0')}</span><p>{followup}</p></div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
