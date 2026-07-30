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
  ['scene', '面试现场', '先答一次'],
  ['answer', '参考回答', '30 秒 / 2 分钟'],
  ['deep-dive', '核心解析', '原理与心智模型'],
  ['engineering', '生产环境', '案例、代码与坑'],
  ['follow-ups', '面试追问', '面试官视角']
] as const

export function QuestionArticlePage({ slug }: { slug: string }) {
  const question = getQuestion(slug)

  if (!question) notFound()

  const article = getQuestionArticle(question.slug)
  const topic = getTopicForCategory(question.category)
  const questionIndex = questions.findIndex((item) => item.slug === question.slug)
  const previous = questionIndex > 0 ? questions[questionIndex - 1] : null
  const next = questionIndex < questions.length - 1 ? questions[questionIndex + 1] : null
  const selfCheck = [question.title, ...question.followUps.slice(0, 3)]

  return (
    <>
      <SiteHeader />
      <main className={`${styles.page} container`}>
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

        <div className={styles.layout}>
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
              <p className={styles.lead}>
                把这道题当成一次真实面试：先组织自己的答案，再对照参考回答，最后用工程场景和追问验证是否真的理解。
              </p>

              <div className={styles.topicStrip}>
                <span>本题考察</span>
                <p>{question.topics.join(' · ')}</p>
              </div>
            </header>

            <section className={styles.chapter} id="scene">
              <div className={styles.chapterHeading}>
                <span>01</span>
                <div>
                  <p className={styles.chapterEyebrow}>INTERVIEW</p>
                  <h2>面试现场</h2>
                  <p>先进入问题语境，不要急着看答案。</p>
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

              <div className={styles.practiceIntro}>
                <span>轮到你了</span>
                <div>
                  <h3>先自己回答一次</h3>
                  <p>建议先给结论，再解释原理，最后补一个生产环境里的判断。</p>
                </div>
              </div>
              <InterviewTrainer question={question} />
            </section>

            <section className={styles.chapter} id="answer">
              <div className={styles.chapterHeading}>
                <span>02</span>
                <div>
                  <p className={styles.chapterEyebrow}>ANSWER</p>
                  <h2>参考回答</h2>
                  <p>先学会短答，再把答案扩展成结构完整的两分钟表达。</p>
                </div>
              </div>

              <div className={styles.answerBlock}>
                <div className={styles.answerLabel}>
                  <strong>30 秒回答</strong>
                  <span>先把核心结论讲完整</span>
                </div>
                <p className={styles.answer}>{question.shortAnswer}</p>
              </div>

              <div className={styles.answerBlock}>
                <div className={styles.answerLabel}>
                  <strong>2 分钟高分回答</strong>
                  <span>沿着“结论 → 原理 → 取舍”展开</span>
                </div>
                <div className={styles.longAnswer}>
                  <p>{question.shortAnswer}</p>
                  {question.deepDive.map((item) => (
                    <p key={item.title}>
                      <strong>{item.title}：</strong>{item.content}
                    </p>
                  ))}
                  {article ? <p><strong>最后落到工程上：</strong>{article.engineeringCase.better}</p> : null}
                </div>
              </div>

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

            <section className={styles.chapter} id="deep-dive">
              <div className={styles.chapterHeading}>
                <span>03</span>
                <div>
                  <p className={styles.chapterEyebrow}>MENTAL MODEL</p>
                  <h2>核心解析</h2>
                  <p>把定义拆成控制机制、边界条件和系统结构，形成可迁移的心智模型。</p>
                </div>
              </div>

              {article ? (
                <aside className={`${articleStyles.callout} ${styles.keyConclusion}`}>
                  <span>先记住这句话</span>
                  <p>{article.keyConclusion}</p>
                </aside>
              ) : null}

              <QuestionDiagram slug={question.slug} />
              <QuestionLongform question={question} />
              <QuestionComparison slug={question.slug} />
            </section>

            <section className={styles.chapter} id="engineering">
              <div className={styles.chapterHeading}>
                <span>04</span>
                <div>
                  <p className={styles.chapterEyebrow}>PRODUCTION</p>
                  <h2>放到生产环境会发生什么？</h2>
                  <p>从“概念正确”走到“系统能跑”，看失败模式、约束和工程取舍。</p>
                </div>
              </div>

              {article ? (
                <>
                  <div className={styles.subsectionHeading}>
                    <span>生产案例</span>
                    <h3>先看一个容易踩坑的现场</h3>
                  </div>
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

              <div className={styles.subsectionHeading}>
                <span>工程检查</span>
                <h3>生产里至少要想到这些</h3>
              </div>
              <ul className={styles.practiceList}>
                {question.engineeringPractice.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className={styles.subsectionHeading}>
                <span>常见失分</span>
                <h3>这些回答听起来没错，但深度不够</h3>
              </div>
              <div className={styles.mistakeStack}>
                {question.commonMistakes.map((mistake, index) => (
                  <div className={styles.mistakeItem} key={mistake}>
                    <span>错误 {String(index + 1).padStart(2, '0')}</span>
                    <p>{mistake}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.chapter} id="follow-ups">
              <div className={styles.chapterHeading}>
                <span>05</span>
                <div>
                  <p className={styles.chapterEyebrow}>INTERVIEW DEPTH</p>
                  <h2>面试追问</h2>
                  <p>第一问只是入口，真正拉开差距的是你能不能接住后面的工程判断。</p>
                </div>
              </div>

              {article ? (
                <aside className={`${articleStyles.callout} ${articleStyles.interviewerCallout}`}>
                  <span>面试官在听什么</span>
                  <p>{article.interviewerNote}</p>
                </aside>
              ) : null}

              <div className={styles.keyPointPanel}>
                <span>判断维度</span>
                <div>
                  {question.keyPoints.map((point) => <strong key={point}>{point}</strong>)}
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

            <section className={styles.selfCheck}>
              <div>
                <span>SELF CHECK</span>
                <h2>学完这题，你应该能回答</h2>
              </div>
              <ul>
                {selfCheck.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

            <footer className={styles.questionFooter}>
              <span>{previous ? <Link href={`/questions/${previous.slug}`}>← 上一题：{previous.title}</Link> : '这是第一题'}</span>
              <span>{next ? <Link href={`/questions/${next.slug}`}>下一题：{next.title} →</Link> : <Link href="/questions">返回题库 →</Link>}</span>
            </footer>
          </article>

          <aside className={styles.sidebar}>
            <div className={styles.sidebarInner}>
              <span className={styles.sidebarTitle}>本题目录</span>
              <nav aria-label="本题目录">
                {sectionLinks.map(([id, label, hint], index) => (
                  <a href={`#${id}`} key={id}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>{label}</strong>
                      <small>{hint}</small>
                    </div>
                  </a>
                ))}
              </nav>
              <div className={styles.sidebarNote}>
                <span>阅读建议</span>
                <p>第一次先做第 01 节，不看答案；复习时直接扫 30 秒回答、核心图和追问链。</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}
