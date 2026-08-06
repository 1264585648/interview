'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  Search,
  SlidersHorizontal
} from 'lucide-react'
import { categories, questions } from '@/data/questions'
import styles from './QuestionsContent.module.css'

const difficultyLabel: Record<number, string> = {
  1: '入门',
  2: '基础',
  3: '核心',
  4: '进阶',
  5: '系统设计'
}

const difficultyOptions = [
  { value: '全部', label: '全部难度' },
  { value: '1-2', label: '入门 / 基础' },
  { value: '3', label: '核心' },
  { value: '4-5', label: '进阶 / 系统设计' }
]

function matchesDifficulty(difficulty: number, filter: string) {
  if (filter === '全部') return true
  if (filter === '1-2') return difficulty <= 2
  if (filter === '3') return difficulty === 3
  return difficulty >= 4
}

export function QuestionsContent() {
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category') || '全部'
  return <QuestionsView activeCategory={activeCategory} />
}

export function QuestionsView({ activeCategory }: { activeCategory: string }) {
  const [keyword, setKeyword] = useState('')
  const [difficulty, setDifficulty] = useState('全部')
  const [visibleCount, setVisibleCount] = useState(12)

  const learningCategories = categories.filter((category) =>
    category !== '全部' && questions.some((question) => question.category === category)
  )

  const matchedQuestions = useMemo(() => {
    const normalized = keyword.trim().toLowerCase()

    return questions.filter((question) => {
      const matchesCategory = activeCategory === '全部' || question.category === activeCategory
      const matchesLevel = matchesDifficulty(question.difficulty, difficulty)
      const haystack = [
        question.title,
        question.category,
        question.type,
        question.frequency,
        ...question.topics,
        ...question.keyPoints
      ].join(' ').toLowerCase()

      return matchesCategory && matchesLevel && (!normalized || haystack.includes(normalized))
    })
  }, [activeCategory, difficulty, keyword])

  useEffect(() => {
    setVisibleCount(12)
  }, [activeCategory, difficulty, keyword])

  const visibleQuestions = matchedQuestions.slice(0, visibleCount)
  const hasMore = visibleCount < matchedQuestions.length

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.hero}>
          <div>
            <h1>题库</h1>
            <p>按主题、难度或关键词查找题目。</p>
          </div>
          <div className={styles.summary}>
            <strong>{questions.length}</strong>
            <span>道题目</span>
          </div>
        </header>

        <section className={styles.controls} aria-label="题库筛选">
          <label className={styles.searchBox}>
            <Search size={18} />
            <span className={styles.controlLabel}>搜索</span>
            <input
              name="question-search"
              autoComplete="off"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="题目或关键词"
            />
          </label>

          <label className={styles.filterSelect}>
            <SlidersHorizontal size={17} />
            <span className={styles.controlLabel}>难度</span>
            <select name="difficulty" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
              {difficultyOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <ChevronDown size={15} />
          </label>
        </section>

        <div className={styles.libraryLayout}>
          <aside className={styles.categoryPanel}>
            <h2>主题</h2>
            <nav className={styles.categoryNav} aria-label="题目专题">
              <Link href="/questions" className={activeCategory === '全部' ? styles.active : ''}>
                <span>全部题目</span><small>{questions.length}</small>
              </Link>
              {learningCategories.map((category) => {
                const count = questions.filter((question) => question.category === category).length
                return (
                  <Link
                    key={category}
                    href={`/questions?category=${encodeURIComponent(category)}`}
                    className={category === activeCategory ? styles.active : ''}
                  >
                    <span>{category}</span><small>{count}</small>
                  </Link>
                )
              })}
            </nav>
          </aside>

          <section className={styles.results} aria-label="面试题列表">
            <div className={styles.resultBar}>
              <p>
                <strong>{matchedQuestions.length}</strong> 道题
                {activeCategory !== '全部' ? <span> · {activeCategory}</span> : null}
              </p>
              <span>核心结论、完整解析、相关图示与追问</span>
            </div>

            {visibleQuestions.length ? (
              <>
                <div className={styles.cardGrid}>
                  {visibleQuestions.map((question) => (
                      <Link className={styles.card} href={`/questions/${question.slug}`} key={question.slug}>
                        <div className={styles.cardCopy}>
                          <div className={styles.cardTop}>
                            <span>{question.category}</span>
                            <span className={question.difficulty >= 4 ? styles.hard : styles.medium}>
                              {difficultyLabel[question.difficulty]}
                            </span>
                          </div>
                          <h2>{question.title}</h2>
                          <p>{question.shortAnswer}</p>
                          <div className={styles.metaRow}>
                            <span>{question.frequency}</span>
                            <span><Clock3 size={13} /> {question.estimate}</span>
                            <span>{question.type}</span>
                          </div>
                        </div>

                        <span className={styles.cardAction}>查看解析 <ArrowRight size={16} /></span>
                      </Link>
                  ))}
                </div>

                {hasMore ? (
                  <button
                    className={styles.loadMore}
                    type="button"
                    onClick={() => setVisibleCount((count) => count + 12)}
                  >
                    加载更多
                    <ChevronDown size={17} />
                  </button>
                ) : null}
              </>
            ) : (
              <div className={styles.empty}>
                <h2>没有找到相关题目</h2>
                <p>换一个关键词或筛选条件试试。</p>
                <button
                  type="button"
                  onClick={() => {
                    setKeyword('')
                    setDifficulty('全部')
                  }}
                >
                  清空筛选
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
