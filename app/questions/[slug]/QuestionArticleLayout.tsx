import Link from 'next/link'
import { ArrowRight, BookOpenCheck, CheckCircle2, MessageSquareQuote, Target } from 'lucide-react'
import { ArticleRichText } from '@/components/ArticleRichText'
import { QuestionComparison } from '@/components/QuestionComparison'
import { QuestionDiagram } from '@/components/QuestionDiagram'
import type { QuestionArticleDocument, RichTextBlock } from '@/data/articleRichText'
import type { InterviewQuestion } from '@/data/questions'
import { QuestionPracticeWorkspace } from './QuestionPracticeWorkspace'
import styles from './QuestionDetail.module.css'

type Props = {
  question: InterviewQuestion
  article?: QuestionArticleDocument
  previous: InterviewQuestion | null
  next: InterviewQuestion | null
}

export function QuestionArticleLayout({ question, article, previous, next }: Props) {
  const fallbackRichText: RichTextBlock[] = question.deepDive.flatMap((item, index) => [
    {
      type: 'heading' as const,
      level: 2 as const,
      id: `fallback-section-${index + 1}`,
      content: [item.title]
    },
    {
      type: 'paragraph' as const,
      content: [item.content]
    }
  ])
  const articleBody = article?.richText?.length ? article.richText : fallbackRichText
  const coreConclusion = article?.keyConclusion ?? question.shortAnswer
  const noteText = article?.interviewerNote ?? question.commonMistakes[0]

  return (
    <div className={styles.contentGrid}>
      <nav className={styles.articleNav} aria-label="本页内容">
        <span>本页内容</span>
        <a href="#core-conclusion"><i>1</i>核心结论</a>
        <a href="#architecture"><i>2</i>系统结构</a>
        <a href="#judgements"><i>3</i>关键判断</a>
        <a href="#deep-analysis"><i>4</i>深入解析</a>
      </nav>

      <div className={styles.mainColumn}>
        <QuestionPracticeWorkspace question={question} />

        <section className={styles.coreSection} id="core-conclusion">
          <h2>核心结论</h2>
          <p>{coreConclusion}</p>
        </section>

        <section className={styles.articleBlock} id="architecture">
          <header>
            <h2>系统结构</h2>
            <p>把问题放回 Agent 的执行流程中理解。</p>
          </header>
          <QuestionDiagram slug={question.slug} />
        </section>

        <section className={styles.articleBlock} id="judgements">
          <header><h2>关键判断</h2></header>
          <div className={styles.deepDiveList}>
            {question.deepDive.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.content}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.articleBlock} id="deep-analysis">
          <header><h2>深入解析</h2></header>
          <div className={styles.articleBody}><ArticleRichText blocks={articleBody} /></div>
          <QuestionComparison slug={question.slug} />
        </section>

        <footer className={styles.questionFooter}>
          <span>{previous ? <Link href={`/questions/${previous.slug}`}>← {previous.title}</Link> : '这是第一题'}</span>
          <span>{next ? <Link href={`/questions/${next.slug}`}>{next.title} →</Link> : <Link href="/questions">返回题库 →</Link>}</span>
        </footer>
      </div>

      <aside className={styles.supportColumn}>
        <section className={styles.supportSection}>
          <div className={styles.supportHeading}><Target size={16} /><h2>回答要点</h2></div>
          <div className={styles.pointTags}>{question.keyPoints.map((point) => <span key={point}>{point}</span>)}</div>
        </section>

        <section className={styles.supportSection} id="follow-ups">
          <div className={styles.supportHeading}><MessageSquareQuote size={16} /><h2>可能的追问</h2></div>
          <ol className={styles.followupList}>
            {question.followUps.slice(0, 3).map((followup) => <li key={followup}>{followup}</li>)}
          </ol>
        </section>

        <section className={styles.supportSection}>
          <div className={styles.supportHeading}><CheckCircle2 size={16} /><h2>容易遗漏</h2></div>
          <p className={styles.noteText}>{noteText}</p>
        </section>

        <Link className={styles.practiceLink} href="/practice">
          <BookOpenCheck size={16} /> 在练习页回答 <ArrowRight size={15} />
        </Link>
      </aside>
    </div>
  )
}
