'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Bookmark,
  Building2,
  ChevronDown,
  Clock3,
  Flame,
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

const sourceToneClasses = [
  styles.sourceOrange,
  styles.sourceBlue,
  styles.sourceGold,
  styles.sourceRed,
  styles.sourceGreen,
  styles.sourcePurple
]

function getQuestionSource(question: (typeof questions)[number]) {
  const extendedQuestion = question as typeof question & {
    companies?: string[]
    sourceCompany?: string
  }

  return extendedQuestion.companies?.[0] || extendedQuestion.sourceCompany || '公开整理'
}

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
      const source = getQuestionSource(question)
      const haystack = [
        question.title,
        question.category,
        question.type,
        question.frequency,
        source,
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
            <span className={styles.kicker}>Agent Engineer Interview Library</span>
            <h1>题库</h1>
            <p>搜集大厂面试真题，模拟真实面试场景。</p>
          </div>
          <div className={styles.summary}>
            <strong>{questions.length}</strong>
            <span>道核心题目</span>
          </div>
        </header>

        <section className={styles.controls} aria-label="题库筛选">
          <label className={styles.searchBox}>
            <Search size={18} />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索题目、关键词或公司"
              aria-label="搜索面试题"
            />
          </label>

          <label className={styles.filterSelect}>
            <SlidersHorizontal size={17} />
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
              {difficultyOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <ChevronDown size={15} />
          </label>
        </section>

        <nav className={styles.categoryNav} aria-label="题目专题">
          <Link href="/questions" className={activeCategory === '全部' ? styles.active : ''}>全部</Link>
          {learningCategories.map((category) => (
            <Link
              key={category}
              href={`/questions?category=${encodeURIComponent(category)}`}
              className={category === activeCategory ? styles.active : ''}
            >
              {category}
            </Link>
          ))}
        </nav>

        <div className={styles.resultBar}>
          <p>
            共找到 <strong>{matchedQuestions.length}</strong> 道题
            {activeCategory !== '全部' ? <span> · {activeCategory}</span> : null}
          </p>
          <span>点击卡片查看完整解析与追问</span>
        </div>

        {visibleQuestions.length ? (
          <>
            <section className={styles.cardGrid} aria-label="面试题列表">
              {visibleQuestions.map((question, index) => {
                const source = getQuestionSource(question)
                const toneClass = sourceToneClasses[index % sourceToneClasses.length]

                return (
                  <Link className={styles.card} href={`/questions/${question.slug}`} key={question.slug}>
                    <div className={styles.cardTop}>
                      <span className={`${styles.sourceBadge} ${toneClass}`}>
                        <Building2 size={14} />
                        {source}
                      </span>
                      <span className={styles.bookmark} aria-hidden="true">
                        <Bookmark size={18} />
                      </span>
                    </div>

                    <h2>{question.title}</h2>

                    <div className={styles.metaRow}>
                      <span>{question.category}</span>
                      <span className={question.difficulty >= 4 ? styles.hard : styles.medium}>
                        {difficultyLabel[question.difficulty]}
                      </span>
                    </div>

                    <footer className={styles.cardFooter}>
                      <span><Flame size={14} /> {question.frequency}</span>
                      <span><Clock3 size={14} /> {question.estimate}</span>
                      <span>{question.type}</span>
                    </footer>
                  </Link>
                )
              })}
            </section>

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
      </div>
    </main>
  )
}
