'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { categories, questions } from '@/data/questions'
import { getTopicForCategory } from '@/data/topics'
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
    description: '先理解 Agent 的行为模型，再进入停止条件、失败恢复与运行时控制。'
  },
  {
    id: 'tools-and-knowledge',
    title: '工具、协议与知识',
    categories: ['Tool Calling', 'MCP', 'RAG'],
    description: '理解 Agent 如何调用外部能力，以及协议和检索在系统里的边界。'
  },
  {
    id: 'state-and-context',
    title: '状态、记忆与上下文',
    categories: ['Memory', 'Context Engineering'],
    description: '处理长任务里的状态保留、记忆检索和上下文组织。'
  },
  {
    id: 'reliability-and-design',
    title: '评估与系统设计',
    categories: ['Evaluation', 'System Design'],
    description: '从单点能力进入生产级可靠性、评估与整体架构设计。'
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
  const learningCategories = categories.filter((category) =>
    category !== '全部' && questions.some((question) => question.category === category)
  )

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
    ? '按知识路径整理的 Agent Engineer 面试题。先自己回答，再进入完整解析和追问。'
    : categoryDescriptions[activeCategory] || '按专题整理的 Agent Engineer 面试题。'
  const topicGuide = activeCategory === '全部' ? null : getTopicForCategory(activeCategory)

  return (
    <main className={`${styles.page} container`}>
      <div className={styles.directory}>
        <header className={styles.header}>
          <div>
            <h1>{pageTitle}</h1>
            <p>{pageDescription}</p>
          </div>
          <span>{matchedQuestions.length} 道</span>
        </header>

        <div className={styles.searchBox}>
          <Search size={15} />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜索题目或知识点"
            aria-label="搜索 Agent 面试题"
          />
        </div>

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

        <div className={styles.guideLink}>
          {topicGuide ? (
            <Link href={`/topics/${topicGuide.slug}`}>先读「{topicGuide.title}」专题导读 →</Link>
          ) : (
            <Link href="/topics">不知道从哪开始？按 4 个专题系统学习 →</Link>
          )}
        </div>

        {groups.length ? groups.map((group) => (
          <section className={styles.group} id={group.id} key={group.id}>
            <header className={styles.groupHeader}>
              <div>
                <h2>{group.title}</h2>
                <p>{group.description}</p>
              </div>
              <span>{group.questions.length} 道</span>
            </header>

            <div className={styles.questionList}>
              {group.questions.map((question, questionIndex) => (
                <Link className={styles.questionRow} href={`/questions/${question.slug}`} key={question.slug}>
                  <span className={styles.number}>{String(questionIndex + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{question.title}</h3>
                    <p>{question.category} · {question.frequency} · {question.type} · {difficultyLabel[question.difficulty]}</p>
                  </div>
                  <span className={styles.arrow}>→</span>
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
      </div>
    </main>
  )
}
