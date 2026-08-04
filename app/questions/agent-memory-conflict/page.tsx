import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader'
import { defineQuestionArticle } from '@/data/defineQuestionArticle'
import { memoryConflictArticle } from '@/data/memoryConflictContent'
import { memoryConflictQuestions } from '@/data/memoryConflictQuestion'
import { memoryConflictRichText } from '@/data/memoryConflictRichText'
import { getQuestion } from '@/data/questions'
import { getTopicForCategory } from '@/data/topics'
import { QuestionArticleLayout } from '../[slug]/QuestionArticleLayout'
import styles from '../[slug]/QuestionDetail.module.css'
import compactStyles from '../[slug]/QuestionDetailCompact.module.css'
import templateStyles from '../[slug]/QuestionArticleLayout.module.css'

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

const article = defineQuestionArticle({
  ...memoryConflictArticle,
  richText: memoryConflictRichText
})

export default function AgentMemoryConflictPage() {
  const question = memoryConflictQuestions[0]!
  const topic = getTopicForCategory(question.category)
  const previous = getQuestion('agent-memory-types') ?? null
  const next = getQuestion('mcp-vs-function-calling') ?? null

  return (
    <>
      <SiteHeader />
      <main className={`${styles.page} ${compactStyles.compact} ${templateStyles.articlePage}`}>
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
              <strong>Memory Conflict</strong>
            </nav>

            <header className={styles.questionHeader} id="intro">
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
              <p>先独立判断“当前信息优先”是否足够，再从权限、作用域、来源与风险建立可落地的冲突解析策略。</p>
            </header>

            <QuestionArticleLayout
              article={article}
              next={next}
              previous={previous}
              question={question}
            />
          </div>
        </div>
      </main>
    </>
  )
}
