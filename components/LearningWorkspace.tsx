'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Eye,
  EyeOff,
  Pause,
  Play,
  RotateCcw,
  Search
} from 'lucide-react'
import type { InterviewQuestion } from '@/data/questions'
import type { TopicGuide } from '@/data/topics'
import { SiteHeader } from './SiteHeader'
import styles from './LearningWorkspace.module.css'

type WorkspaceProps = {
  questions: InterviewQuestion[]
  topics: TopicGuide[]
}

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
    if (!normalized) return topicQuestions
    return questions.filter((question) =>
      [question.title, question.category, question.type, ...question.topics]
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    )
  }, [query, questions, topicQuestions])

  if (!initialQuestion) {
    return <main className={styles.empty}>题库暂时为空。</main>
  }

  const selectedQuestion = questions.find((question) => question.slug === selectedSlug) ?? initialQuestion
  const completedPercent = Math.round((completed.length / Math.max(questions.length, 1)) * 100)

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
    <div className={styles.page}>
      <SiteHeader />

      <main className={`${styles.workspace} container`}>
        <header className={styles.masthead}>
          <div>
            <h1>模拟回答</h1>
            <p>选择一道题，计时作答。需要时再查看参考答案。</p>
          </div>
          <div className={styles.progressNote}>
            <span>本轮进度</span>
            <strong>{completed.length} / {questions.length}</strong>
            <progress value={completedPercent} max="100" aria-label={`训练进度 ${completedPercent}%`} />
          </div>
        </header>

        <div className={styles.topicTabs} aria-label="选择专题">
          {topics.map((topic) => (
            <button
              aria-pressed={selectedTopic === topic.slug}
              className={selectedTopic === topic.slug ? styles.topicActive : ''}
              key={topic.slug}
              onClick={() => chooseTopic(topic.slug)}
              type="button"
            >
              {topic.title}
            </button>
          ))}
        </div>

        <section className={styles.interviewShell} aria-label="模拟回答工作区">
          <aside className={styles.queuePanel}>
            <label className={styles.searchBox}>
              <Search size={16} />
              <span className={styles.visuallyHidden}>搜索训练题</span>
              <input
                name="practice-search"
                autoComplete="off"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索题目"
              />
            </label>

            <div className={styles.queueHeader}>
              <h2>{query ? '搜索结果' : '本专题题目'}</h2>
              <span>{visibleQuestions.length}</span>
            </div>

            <div className={styles.questionList}>
              {visibleQuestions.map((question) => (
                <button
                  aria-pressed={question.slug === selectedQuestion.slug}
                  className={question.slug === selectedQuestion.slug ? styles.questionActive : ''}
                  key={question.slug}
                  onClick={() => chooseQuestion(question.slug)}
                  type="button"
                >
                  <span>{question.category}</span>
                  <strong>{question.title}</strong>
                  {completed.includes(question.slug) ? <Check size={14} /> : <ChevronRight size={14} />}
                </button>
              ))}
            </div>

            {activeTopic ? (
              <Link className={styles.topicLink} href={`/topics/${activeTopic.slug}`}>
                查看专题阅读顺序 <ChevronRight size={14} />
              </Link>
            ) : null}
          </aside>

          <section className={styles.answerPanel} aria-labelledby="current-question-title">
            <header className={styles.questionHeader}>
              <div className={styles.questionMeta}>
                <span>{selectedQuestion.category}</span>
                <span>{selectedQuestion.type}</span>
                <span>建议 {selectedQuestion.estimate}</span>
              </div>
              <h2 id="current-question-title">{selectedQuestion.title}</h2>
            </header>

            <div className={styles.answerToolbar}>
              <label htmlFor="practice-notes">你的回答</label>
              <div className={styles.timer} aria-label="作答计时">
                <Clock3 size={15} />
                <strong>{formatTime(seconds)}</strong>
                <button
                  onClick={() => setTimerRunning((value) => !value)}
                  type="button"
                  aria-label={timerRunning ? '暂停计时' : '开始计时'}
                >
                  {timerRunning ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                  onClick={() => { setSeconds(0); setTimerRunning(false) }}
                  type="button"
                  aria-label="重置计时"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            <textarea
              className={styles.answerBox}
              id="practice-notes"
              name="practice-notes"
              maxLength={2000}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="先写结论，再说明依据、取舍和例子。"
            />
            <div className={styles.answerHint}>{notes.length} / 2000 · 内容仅保存在当前页面</div>

            <div className={styles.answerActions}>
              <button className={styles.revealButton} onClick={() => setShowAnswer((value) => !value)} type="button">
                {showAnswer ? <EyeOff size={16} /> : <Eye size={16} />}
                {showAnswer ? '隐藏参考答案' : '查看参考答案'}
              </button>
              <button
                className={completed.includes(selectedQuestion.slug) ? styles.completedButton : styles.completeButton}
                onClick={toggleComplete}
                type="button"
              >
                <Check size={16} /> {completed.includes(selectedQuestion.slug) ? '已完成' : '标记为完成'}
              </button>
            </div>

            {showAnswer ? (
              <section className={styles.referenceAnswer} aria-live="polite">
                <h3>参考答案</h3>
                <p>{selectedQuestion.shortAnswer}</p>
                <div className={styles.referenceGrid}>
                  <div>
                    <strong>回答要点</strong>
                    <ul>{selectedQuestion.keyPoints.map((point) => <li key={point}>{point}</li>)}</ul>
                  </div>
                  <div>
                    <strong>可能的追问</strong>
                    <ul>{selectedQuestion.followUps.slice(0, 2).map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                </div>
              </section>
            ) : null}

            <footer className={styles.answerFooter}>
              <Link href={`/questions/${selectedQuestion.slug}`}>
                <BookOpen size={15} /> 查看完整解析
              </Link>
            </footer>
          </section>
        </section>
      </main>
    </div>
  )
}
