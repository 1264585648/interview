'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, Search } from 'lucide-react'
import { categories, questions } from '@/data/questions'
import styles from './QuestionsContent.module.css'

const categoryDescriptions: Record<string, string> = {
  'Agent 基础': '理解 Agent 的控制流、状态和自主决策边界。',
  'Agent Runtime': '关注停止条件、失败恢复、预算控制和运行时可靠性。',
  'Tool Calling': '理解工具选择、参数生成、执行结果和权限边界。',
  MCP: '理解 MCP 的协议边界、工具发现与资源接入。',
  RAG: '掌握检索、查询改写、多源路由和 Agentic RAG。',
  Memory: '掌握记忆的写入、检索、更新、过期和遗忘。',
  'Context Engineering': '理解有限 Context 下的信息选择、压缩与排序。',
  Evaluation: '从任务成功、轨迹、成本和线上指标评价 Agent。',
  'System Design': '把规划、工具、状态和可靠性组合成生产级系统。'
}

const learningStages = [
  {
    id: 'agent-foundation',
    title: 'Agent 基础与运行时',
    categories: ['Agent 基础', 'Agent Runtime'],
    description: '先理解 Agent 的行为模型，再进入运行时控制。'
  },
  {
    id: 'tools-and-knowledge',
    title: '工具、协议与知识',
    categories: ['Tool Calling', 'MCP', 'RAG'],
    description: '理解 Agent 如何连接工具、协议与外部知识。'
  },
  {
    id: 'state-and-context',
    title: '状态、记忆与上下文',
    categories: ['Memory', 'Context Engineering'],
    description: '解决长任务里的状态保留、记忆和上下文组织。'
  },
  {
    id: 'reliability-and-design',
    title: '评估与系统设计',
    categories: ['Evaluation', 'System Design'],
    description: '进入生产级可靠性、评估和整体架构设计。'
  }
]

const difficultyLabel: Record<number, string> = {
  1: '入门',
  2: '基础',
  3: '核心',
  4: '进阶',
  5: '系统设计'
}

export function QuestionsContent() {
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category') || '全部'

  return <QuestionsView activeCategory={activeCategory} />
}

export function QuestionsView({ activeCategory }: { activeCategory: string }) {
  const [keyword, setKeyword] = useState('')
  const learningCategories = categories.filter((category) => category !== '全部')

  const matchedQuestions = useMemo(() => {
    const normalized = keyword.trim().toLowerCase()
    const categoryQuestions = activeCategory === '全部'
      ? questions
      : questions.filter((question) => question.category === activeCategory)

    if (!normalized) return categoryQuestions

    return categoryQuestions.filter((question) => {
      const haystack = [
        question.title,
        question.category,
        question.type,
        question.frequency,
        ...question.topics,
        ...question.keyPoints
      ].join(' ').toLowerCase()

      return haystack.includes(normalized)
    })
  }, [activeCategory, keyword])

  const groups = activeCategory === '全部'
    ? learningStages
        .map((stage) => ({
          ...stage,
          questions: matchedQuestions.filter((question) => stage.categories.includes(question.category))
        }))
        .filter((stage) => stage.questions.length > 0)
    : [{
        id: `topic-${activeCategory}`,
        title: activeCategory,
        categories: [activeCategory],
        description: categoryDescriptions[activeCategory] || '围绕这一专题整理核心面试题。',
        questions: matchedQuestions
      }].filter((group) => group.questions.length > 0)

  const pageTitle = activeCategory === '全部' ? 'Agent 面试题' : `${activeCategory} 面试题`
  const pageDescription = activeCategory === '全部'
    ? '按知识路径整理，点击题目进入解析与模拟回答。'
    : categoryDescriptions[activeCategory] || '按专题整理的 Agent Engineer 面试题。'

  return (
    <main className={`${styles.page} container`}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <div className={styles.sidebarTitle}>题库</div>
            <nav className={styles.topicNav} aria-label="题目专题">
              <Link href="/questions" className={activeCategory === '全部' ? styles.active : ''}>
                <span>全部题目</span>
                <small>{questions.length}</small>
              </Link>
              {learningCategories.map((category) => {
                const count = questions.filter((question) => question.category === category).length
                return (
                  <Link
                    key={category}
                    href={`/questions?category=${encodeURIComponent(category)}`}
                    className={category === activeCategory ? styles.active : ''}
                  >
                    <span>{category}</span>
                    <small>{count || '—'}</small>
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        <section className={styles.content}>
          <header className={styles.contentHeader}>
            <div className={styles.titleLine}>
              <h1>{pageTitle}</h1>
              <span>{matchedQuestions.length} 道</span>
            </div>
            <p>{pageDescription}</p>
          </header>

          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <Search size={15} />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="搜索题目或知识点"
                aria-label="搜索 Agent 面试题"
              />
            </div>
          </div>

          {groups.length ? groups.map((group) => (
            <section className={styles.topicSection} id={group.id} key={group.id}>
              <header className={styles.topicHeader}>
                <div className={styles.topicTitleLine}>
                  <h2>{group.title}</h2>
                  <span>{group.questions.length}</span>
                </div>
                <p>{group.description}</p>
              </header>

              <div className={styles.questionList}>
                {group.questions.map((question, questionIndex) => (
                  <Link className={styles.questionItem} href={`/questions/${question.slug}`} key={question.slug}>
                    <span className={styles.questionNumber}>{String(questionIndex + 1).padStart(2, '0')}</span>
                    <h3>{question.title}</h3>
                    <div className={styles.questionMeta}>
                      <span className={question.frequency === '高频' ? styles.hot : ''}>{question.frequency}</span>
                      <span>{question.type}</span>
                      <span>{difficultyLabel[question.difficulty]}</span>
                    </div>
                    <ArrowRight className={styles.questionArrow} size={15} />
                  </Link>
                ))}
              </div>
            </section>
          )) : (
            <div className={styles.empty}>
              <h2>没有找到相关题目</h2>
              <p>换一个关键词，或者查看其他专题。</p>
              <button type="button" onClick={() => setKeyword('')}>清空搜索</button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
