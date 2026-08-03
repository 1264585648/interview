import Link from 'next/link'
import {
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
import { ArticleRichText } from '@/components/ArticleRichText'
import { QuestionComparison } from '@/components/QuestionComparison'
import { QuestionDiagram } from '@/components/QuestionDiagram'
import { QuestionLongform } from '@/components/QuestionLongform'
import type { QuestionArticleDocument } from '@/data/articleRichText'
import type { InterviewQuestion } from '@/data/questions'
import { QuestionPracticeWorkspace } from './QuestionPracticeWorkspace'
import styles from './QuestionDetail.module.css'
import articleStyles from './QuestionArticle.module.css'
import templateStyles from './QuestionArticleLayout.module.css'

type Props = {
  question: InterviewQuestion
  article?: QuestionArticleDocument
  previous: InterviewQuestion | null
  next: InterviewQuestion | null
}

export function QuestionArticleLayout({ question, article, previous, next }: Props) {
  const summaryItems = question.engineeringPractice.slice(0, 3)
  const bonusText = article?.interviewerNote ?? question.commonMistakes[0]

  return (
    <div className={`${styles.contentGrid} ${templateStyles.articleGrid}`}>
      <div className={`${styles.mainColumn} ${templateStyles.mainArticle}`}>
        <QuestionPracticeWorkspace question={question} />

        <section
          className={`${styles.panel} ${styles.shortAnswerPanel} ${templateStyles.shortAnswerMain}`}
          id="short-answer"
        >
          <div className={templateStyles.shortAnswerTopline}>
            <div className={styles.supportHeading}>
              <Lightbulb size={19} />
              <h2>简要回答</h2>
            </div>
            <span className={templateStyles.shortAnswerBadge}>30 秒回答框架</span>
          </div>

          <div className={templateStyles.shortAnswerBody}>
            <div className={templateStyles.answerCopy}>
              <span>核心结论</span>
              <p>{question.shortAnswer}</p>
            </div>

            {article?.answerStructure?.length ? (
              <div className={templateStyles.answerStructure}>
                <strong>回答结构</strong>
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
          </div>
        </section>

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
            <a href="#tradeoffs">原理</a>
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
              <span>技术架构</span>
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
            <div className={templateStyles.articleBody}>
              {article?.richText?.length ? (
                <ArticleRichText blocks={article.richText} />
              ) : (
                <QuestionLongform question={question} />
              )}
            </div>
            <QuestionComparison slug={question.slug} />
          </div>

          <div className={styles.productionSection} id="practice">
            <div className={styles.sectionHeading}>
              <span>工程实践</span>
              <p>从概念正确走到系统可运行。</p>
            </div>

            <div className={templateStyles.productionBody}>
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

      <aside className={`${styles.supportColumn} ${templateStyles.supportRail}`}>
        <section className={`${styles.panel} ${styles.referencePanel}`}>
          <div className={styles.supportHeading}>
            <Target size={18} />
            <h2>参考要点</h2>
          </div>
          <div className={styles.pointTags}>
            {question.keyPoints.map((point) => <span key={point}>{point}</span>)}
          </div>
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
  )
}