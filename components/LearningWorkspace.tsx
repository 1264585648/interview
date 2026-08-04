'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Library,
  MessageSquareText,
  Pause,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Target
} from 'lucide-react'
import type { InterviewQuestion } from '@/data/questions'
import type { TopicGuide } from '@/data/topics'
import styles from './LearningWorkspace.module.css'

type WorkspaceProps = {
  questions: InterviewQuestion[]
  topics: TopicGuide[]
}

const topicIcons = [Target, BookOpen]

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function LearningWorkspace({ questions, topics }: WorkspaceProps) {
  const initialQuestion = questions[0]
  const [selectedTopic, setSelectedTopic] = useState(topics[0]?.slug ?? '')
  const [selectedSlug, setSelectedSlug] = useState(initialQuestion?.slug ?? '')
  const [completed, setCompleted] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [notes, setNotes] = useState('')
  const [timerRunning, setTimerRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!timerRunning) return
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [timerRunning])

  const activeTopic = topics.find((topic) => topic.slug === selectedTopic) ?? topics[0]

  const topicQuestions = useMemo(() => {
    if (!activeTopic) return questions
    return questions.filter((question) => activeTopic.categories.includes(question.category))
  }, [activeTopic, questions])

  const visibleQuestions = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const source = normalized ? questions : topicQuestions
    if (!normalized) return source

    return source.filter((question) =>
      [question.title, question.category, question.type, ...question.topics]
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    )
  }, [query, questions, topicQuestions])

  if (!initialQuestion) {
    return <main className={styles.workspace}>题库暂时为空。</main>
  }

  const selectedQuestion = questions.find((question) => question.slug === selectedSlug) ?? initialQuestion
  const completedPercent = Math.round((completed.length / Math.max(questions.length, 1)) * 100)
  const topicCompleted = topicQuestions.filter((question) => completed.includes(question.slug)).length

  function resetQuestionState() {
    setShowAnswer(false)
    setNotes('')
    setSeconds(0)
    setTimerRunning(false)
  }

  function chooseTopic(slug: string) {
    const topic = topics.find((item) => item.slug === slug)
    const firstQuestion = questions.find((question) => topic?.categories.includes(question.category))
    setSelectedTopic(slug)
    if (firstQuestion) setSelectedSlug(firstQuestion.slug)
    resetQuestionState()
  }

  function chooseQuestion(slug: string) {
    setSelectedSlug(slug)
    resetQuestionState()
  }

  function toggleComplete() {
    setCompleted((current) =>
      current.includes(selectedQuestion.slug)
        ? current.filter((slug) => slug !== selectedQuestion.slug)
        : [...current, selectedQuestion.slug]
    )
  }

  return (
    <div className={styles.appShell}>
      <aside className={styles.sidebar}>
        <div className={styles.brandRow}>
          <Link className={styles.brand} href="/">
            <span className={styles.brandMark}><Sparkles size={17} /></span>
            <span>
              <strong>Agent Interview</strong>
              <small>Curated workspace</small>
            </span>
          </Link>
        </div>

        <nav className={styles.primaryNav} aria-label="学习导航">
          <Link href="/questions">
            <Library size={17} />
            <span>全部题库</span>
            <small>{questions.length}</small>
          </Link>
          <Link href="/topics">
            <BookOpen size={17} />
            <span>学习路径</span>
          </Link>
          <a href="#coach">
            <MessageSquareText size={17} />
            <span>模拟面试</span>
          </a>
        </nav>

        <div className={styles.sidebarLabel}>当前专题</div>
        <div className={styles.topicNav}>
          {topics.map((topic, index) => {
            const Icon = topicIcons[index % topicIcons.length]
            const count = questions.filter((question) => topic.categories.includes(question.category)).length

            return (
              <button
                className={selectedTopic === topic.slug ? styles.topicNavActive : ''}
                key={topic.slug}
                onClick={() => chooseTopic(topic.slug)}
                type="button"
              >
                <span className={styles.topicIcon}><Icon size={15} /></span>
                <span>
                  <strong>{topic.title}</strong>
                  <small>{count} 道题</small>
                </span>
                <ChevronRight size={14} />
              </button>
            )
          })}
        </div>

        <div className={styles.sidebarProgress}>
          <div>
            <span>本轮进度</span>
            <strong>{completedPercent}%</strong>
          </div>
          <div className={styles.progressTrack}><span style={{ width: `${completedPercent}%` }} /></div>
          <p>已完成 {completed.length} / {questions.length} 道题</p>
        </div>
      </aside>

      <main className={styles.workspace}>
        <header className={styles.topbar}>
          <label className={styles.searchBox}>
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索 Planning、Tracing 或 Memory"
              aria-label="搜索题目"
            />
          </label>
          <div className={styles.topActions}>
            <Link className={styles.libraryButton} href="/questions">打开题库 <ArrowRight size={15} /></Link>
          </div>
        </header>

        <div className={styles.canvas}>
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}><Sparkles size={14} /> Curated Agent Interview Questions</span>
              <h1>逐题打磨，<br />练会系统化表达。</h1>
              <p>
                当前只保留 Planning、可观测性与长期记忆冲突三道重点题。
                先独立回答，再对照完整解析和工程实践。
              </p>
              <div className={styles.heroActions}>
                <a href="#daily-task"><Play size={16} fill="currentColor" /> 开始训练</a>
                <Link href={`/topics/${activeTopic?.slug ?? topics[0]?.slug}`}>查看学习路线 <ArrowRight size={15} /></Link>
              </div>
              <div className={styles.heroMetrics}>
                <span><strong>{questions.length}</strong> 道精选题</span>
                <span><strong>{topics.length}</strong> 条学习路径</span>
                <span><strong>{completed.length}</strong> 已掌握</span>
              </div>
            </div>
          </section>

          <section className={styles.dashboardGrid} id="daily-task">
            <div className={styles.mainColumn}>
              <div className={styles.sectionHeading}>
                <div>
                  <span>Today's focus</span>
                  <h2>当前训练题</h2>
                </div>
                <div className={styles.topicProgress}>
                  <span>{activeTopic?.title}</span>
                  <strong>{topicCompleted}/{topicQuestions.length}</strong>
                </div>
              </div>

              <article className={styles.questionCard}>
                <div className={styles.questionTopline}>
                  <div className={styles.questionMeta}>
                    <span>{selectedQuestion.category}</span>
                    <span>{selectedQuestion.frequency}</span>
                    <span>{selectedQuestion.type}</span>
                  </div>
                  <span className={styles.estimate}><Clock3 size={14} /> {selectedQuestion.estimate}</span>
                </div>

                <h2>{selectedQuestion.title}</h2>
                <p>{selectedQuestion.shortAnswer}</p>

                <div className={styles.keyPoints}>
                  {selectedQuestion.keyPoints.map((point) => <span key={point}>{point}</span>)}
                </div>

                <div className={styles.questionActions}>
                  <a href="#coach"><Play size={15} fill="currentColor" /> 开始作答</a>
                  <Link href={`/questions/${selectedQuestion.slug}`}>阅读完整解析 <ArrowRight size={15} /></Link>
                </div>

                <div className={styles.questionRail}>
                  {topicQuestions.map((question, index) => (
                    <button
                      className={question.slug === selectedQuestion.slug ? styles.railActive : ''}
                      key={question.slug}
                      onClick={() => chooseQuestion(question.slug)}
                      type="button"
                    >
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{question.title}</strong>
                      {completed.includes(question.slug) ? <Check size={13} /> : <ChevronRight size={13} />}
                    </button>
                  ))}
                </div>
              </article>

              <section className={styles.pathSection}>
                <div className={styles.sectionHeading}>
                  <div>
                    <span>Learning map</span>
                    <h2>知识路径</h2>
                  </div>
                  <Link href={`/topics/${activeTopic?.slug ?? topics[0]?.slug}`}>进入专题 <ArrowRight size={14} /></Link>
                </div>

                <div className={styles.pathCard}>
                  <div className={styles.pathIntro}>
                    <span>当前专题</span>
                    <h3>{activeTopic?.title}</h3>
                    <p>{activeTopic?.summary}</p>
                  </div>
                  <div className={styles.pathFlow}>
                    {activeTopic?.flow.map((step, index) => (
                      <div key={step}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <strong>{step}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <aside className={styles.coachPanel} id="coach">
              <div className={styles.coachHeader}>
                <div>
                  <span className={styles.coachAvatar}><Sparkles size={17} /></span>
                  <div><strong>AI Interview Coach</strong><small>先回答，再接受追问</small></div>
                </div>
                <span className={styles.onlineDot}>在线</span>
              </div>

              <div className={styles.coachBody}>
                <div className={styles.coachMessage}>
                  <span>面试官</span>
                  <p>{selectedQuestion.title}</p>
                </div>
                <div className={styles.followUpMessage}>
                  <span>可能继续追问</span>
                  <p>{selectedQuestion.followUps[0]}</p>
                </div>

                <div className={styles.timerRow}>
                  <div>
                    <Clock3 size={15} />
                    <strong>{formatTime(seconds)}</strong>
                    <span>建议 {selectedQuestion.estimate}</span>
                  </div>
                  <div>
                    <button onClick={() => setTimerRunning((value) => !value)} type="button" aria-label={timerRunning ? '暂停计时' : '开始计时'}>
                      {timerRunning ? <Pause size={15} /> : <Play size={15} />}
                    </button>
                    <button onClick={() => { setSeconds(0); setTimerRunning(false) }} type="button" aria-label="重置计时">
                      <RotateCcw size={15} />
                    </button>
                  </div>
                </div>

                <label className={styles.answerBox}>
                  <span>先用自己的话回答</span>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="建议结构：先给结论 → 拆职责或规则 → 补工程实践与边界…"
                  />
                  <small>{notes.length} 字 · 内容仅保存在当前页面</small>
                </label>

                <button className={styles.revealButton} onClick={() => setShowAnswer((value) => !value)} type="button">
                  <CircleHelp size={16} /> {showAnswer ? '收起参考答案' : '对照参考答案'}
                </button>

                {showAnswer ? (
                  <div className={styles.answerPanel}>
                    <span>参考回答</span>
                    <p>{selectedQuestion.shortAnswer}</p>
                    <div>
                      {selectedQuestion.keyPoints.map((point) => <small key={point}><Check size={11} /> {point}</small>)}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className={styles.coachFooter}>
                <button
                  className={completed.includes(selectedQuestion.slug) ? styles.completedButton : ''}
                  onClick={toggleComplete}
                  type="button"
                >
                  <Check size={16} /> {completed.includes(selectedQuestion.slug) ? '已完成本题' : '标记为已掌握'}
                </button>
              </div>
            </aside>
          </section>

          <section className={styles.librarySection}>
            <div className={styles.sectionHeading}>
              <div>
                <span>Question library</span>
                <h2>{query ? `搜索结果 · ${visibleQuestions.length}` : `${activeTopic?.title}题目`}</h2>
              </div>
              <Link href="/questions">浏览全部 <ArrowRight size={14} /></Link>
            </div>

            <div className={styles.questionGrid}>
              {visibleQuestions.map((question, index) => (
                <button key={question.slug} onClick={() => chooseQuestion(question.slug)} type="button">
                  <div>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {completed.includes(question.slug) ? <Check size={14} /> : <ArrowRight size={14} />}
                  </div>
                  <small>{question.category} · {question.type}</small>
                  <strong>{question.title}</strong>
                  <p>{question.shortAnswer}</p>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
