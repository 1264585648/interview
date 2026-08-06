import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'
import { getQuestionArticleDocument } from '@/data/articleDocuments'
import { getQuestion, questions } from '@/data/questions'
import { getTopicForCategory } from '@/data/topics'
import { QuestionArticleLayout } from './QuestionArticleLayout'
import styles from './QuestionDetail.module.css'

const difficultyLabel: Record<number, string> = {
  1: '入门',
  2: '基础',
  3: '核心',
  4: '进阶',
  5: '系统设计'
}

export function QuestionArticlePage({ slug }: { slug: string }) {
  const question = getQuestion(slug)

  if (!question) notFound()

  const article = getQuestionArticleDocument(question.slug)
  const topic = getTopicForCategory(question.category)
  const questionIndex = questions.findIndex((item) => item.slug === question.slug)
  const previous = questionIndex > 0 ? questions[questionIndex - 1] : null
  const next = questionIndex < questions.length - 1 ? questions[questionIndex + 1] : null

  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <div className={`${styles.articleShell} container`}>
          <nav className={styles.breadcrumb} aria-label="面包屑">
            <Link href="/questions"><ArrowLeft size={14} /> 题库</Link>
            {topic ? <Link href={`/topics/${topic.slug}`}>{topic.title}</Link> : null}
          </nav>

          <header className={styles.questionHeader} id="intro">
            <div className={styles.questionMeta}>
              <span>{question.category}</span>
              <span>{question.frequency}</span>
              <span>{question.type}</span>
              <span>{difficultyLabel[question.difficulty]}</span>
              <span>建议回答 {question.estimate}</span>
            </div>
            <h1>{question.title}</h1>
          </header>

          <QuestionArticleLayout article={article} next={next} previous={previous} question={question} />
        </div>
      </main>
    </>
  )
}
