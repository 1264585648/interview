'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, BookOpenCheck, Search } from 'lucide-react'
import { categories, questions } from '@/data/questions'
import styles from './QuestionsContent.module.css'

const categoryDescriptions: Record<string, string> = {
  'Agent 基础': '先建立 Agent 的行为模型：谁决定下一步、状态如何流动，以及它和固定 Workflow 的边界。',
  'Agent Runtime': '从 Demo 走向生产环境，重点处理停止条件、失败恢复、预算控制和运行时可靠性。',
  'Tool Calling': '理解工具选择、参数生成、执行结果与权限边界，掌握 Agent 真正“做事”的接口层。',
  MCP: '理解 Model Context Protocol 的边界、工具发现、资源接入，以及什么时候值得引入统一协议。',
  RAG: '从固定检索链路走向 Agentic Retrieval，关注查询改写、证据判断、多源路由和停止策略。',
  Memory: '理解短期状态与长期记忆的区别，并掌握写入、检索、更新、过期与遗忘机制。',
  'Context Engineering': '围绕有限上下文组织系统指令、历史、记忆、检索结果与工具反馈，让模型每一步都看到正确的信息。',
  Evaluation: '不只看最终答案，而是从任务成功、轨迹质量、工具调用、成本、延迟和线上指标评估 Agent。',
  'System Design': '把前面的能力串成生产级系统，训练架构拆分、可靠性、可观测性、成本与扩展性。'
}

const learningStages = [
  {
    id: 'agent-foundation',
    title: 'Agent 基础与运行时',
    categories: ['Agent 基础', 'Agent Runtime'],
    description: '先理解 Agent 的控制流和行为模型，再进入停止条件、失败恢复与预算控制。这一阶段决定后面的工程题能不能讲清楚。'
  },
  {
    id: 'tools-and-knowledge',
    title: '工具、协议与知识',
    categories: ['Tool Calling', 'MCP', 'RAG'],
    description: '让 Agent 从“会思考”走向“会做事”。重点理解工具调用、MCP 协议边界，以及检索如何从固定链路升级为可决策动作。'
  },
  {
    id: 'state-and-context',
    title: '状态、记忆与上下文',
    categories: ['Memory', 'Context Engineering'],
    description: '长任务真正困难的是状态管理。需要回答清楚什么该保留、怎么检索、何时压缩，以及有限 Context 应该放什么。'
  },
  {
    id: 'reliability-and-design',
    title: '评估与系统设计',
    categories: ['Evaluation', 'System Design'],
    description: '最后从单点能力进入生产级系统：怎样评价 Agent 是否可靠，以及如何把规划、搜索、状态、引用和可观测性组合成完整架构。'
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
  const onlineCategoryCount = learningCategories.filter((category) => questions.some((question) => question.category === category)).length

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
        description: categoryDescriptions[activeCategory] || '围绕这一专题逐步补齐高频题、工程题与系统设计题。',
        questions: matchedQuestions
      }].filter((group) => group.questions.length > 0)

  return (
    <main className={`${styles.page} container`}>
      <section className={styles.hero}>
        <span className={styles.kicker}>AGENT INTERVIEW HANDBOOK</span>
        <h1>Agent 工程师面试手册</h1>
        <p>从 Agent 基础、工具调用和 Memory，一路学到 Evaluation 与 System Design。不是把题目堆成数据库，而是按真实面试需要建立一条可连续学习的知识路径。</p>
        <div className={styles.summary}>
          <span><strong>{questions.length}</strong> 道 Demo 题</span>
          <i />
          <span><strong>{onlineCategoryCount}</strong> 个已上线专题</span>
          <i />
          <span>持续更新</span>
        </div>
      </section>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <div className={styles.sidebarTitle}>
              <BookOpenCheck size={17} />
              <span>题库导航</span>
            </div>

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
                    <small>{count || '筹备'}</small>
                  </Link>
                )
              })}
            </nav>

            {activeCategory === '全部' && (
              <div className={styles.stageNav}>
                <span>推荐顺序</span>
                {learningStages.map((stage, index) => (
                  <a href={`#${stage.id}`} key={stage.id}>
                    <small>{String(index + 1).padStart(2, '0')}</small>
                    <span>{stage.title}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </aside>

        <section className={styles.reader}>
          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <Search size={17} />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="搜索题目或知识点，例如 Memory、Stop Condition..."
                aria-label="搜索 Agent 面试题"
              />
            </div>
            <span>{matchedQuestions.length} 道题</span>
          </div>

          {!keyword && activeCategory === '全部' && (
            <section className={styles.intro}>
              <span>推荐学习路径</span>
              <h2>先把核心模型讲明白，再逐步进入生产工程。</h2>
              <p>第一遍按顺序阅读，先形成完整知识地图；第二遍进入单题页模拟回答，让追问暴露真正没有掌握的地方。</p>
              <div className={styles.pathLine}>
                {learningStages.map((stage, index) => (
                  <a href={`#${stage.id}`} key={stage.id}>
                    <small>{String(index + 1).padStart(2, '0')}</small>
                    <span>{stage.title}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {groups.length ? groups.map((group, groupIndex) => (
            <section className={styles.topicSection} id={group.id} key={group.id}>
              <header className={styles.topicHeader}>
                <div className={styles.chapterNumber}>{String(groupIndex + 1).padStart(2, '0')}</div>
                <div>
                  <span className={styles.chapterLabel}>{activeCategory === '全部' ? 'LEARNING STAGE' : 'TOPIC'}</span>
                  <h2>{group.title}</h2>
                  <p>{group.description}</p>
                  <div className={styles.topicMeta}>{group.questions.length} 道题 · 建议按顺序学习</div>
                </div>
              </header>

              <div className={styles.questionList}>
                {group.questions.map((question, questionIndex) => (
                  <article className={styles.questionItem} key={question.slug}>
                    <div className={styles.questionNumber}>{String(questionIndex + 1).padStart(2, '0')}</div>
                    <div className={styles.questionBody}>
                      <div className={styles.questionMeta}>
                        <span>{question.category}</span>
                        <span>{question.frequency}</span>
                        <span>{question.type}</span>
                        <span>{difficultyLabel[question.difficulty]}</span>
                      </div>
                      <h3><Link href={`/questions/${question.slug}`}>{question.title}</Link></h3>
                      <p><strong>考察：</strong>{question.topics.join(' · ')}</p>
                    </div>
                    <Link className={styles.questionAction} href={`/questions/${question.slug}`}>
                      <span>进入题目</span>
                      <ArrowRight size={16} />
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )) : (
            <div className={styles.empty}>
              <h2>没有找到相关题目</h2>
              <p>换一个关键词，或者回到全部题目继续浏览。</p>
              <button type="button" onClick={() => setKeyword('')}>清空搜索</button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
