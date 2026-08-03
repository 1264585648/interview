'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  Clock3,
  Database,
  ExternalLink,
  GitBranch,
  Lightbulb,
  MessageSquareQuote,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset,
  Wrench
} from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader'
import styles from './page.module.css'

const sourceUrl = 'https://www.nowcoder.com/feed/main/detail/8f700f0b8f5d4a52818ef086744846c1'
const archiveUrl =
  'https://github.com/adongwanai/AgentGuide/blob/main/docs/04-interview/12-company-interview-cases.md'

const answerFramework = [
  {
    index: '01',
    title: '先给结论',
    content: 'LangGraph 的核心价值不是“少写几行 Prompt”，而是把 Agent 的状态、控制流和运行时能力显式化。'
  },
  {
    index: '02',
    title: '讲工程优势',
    content: '围绕状态管理、条件分支、循环、持久化、故障恢复、可观测性和测试展开。'
  },
  {
    index: '03',
    title: '讲效果优势',
    content: '复杂任务更容易保持上下文一致，并能针对失败节点重试、回放和局部优化。'
  },
  {
    index: '04',
    title: '补充边界',
    content: '简单固定流程不一定需要 LangGraph；框架会带来学习、抽象和调试成本。'
  }
]

const dimensions = [
  {
    icon: GitBranch,
    title: '控制流建模',
    description: '是否理解节点、边、条件路由与循环，而不是只会调用 LangGraph API。'
  },
  {
    icon: Database,
    title: '状态管理',
    description: '能否说明多轮上下文、中间结果和 Checkpoint 如何统一进入 State。'
  },
  {
    icon: Activity,
    title: '生产可用性',
    description: '是否考虑 tracing、重试、恢复、超时、人工介入和故障定位。'
  },
  {
    icon: Wrench,
    title: '技术选型',
    description: '能否判断何时该用框架，何时手写 Workflow 反而更轻、更清晰。'
  }
]

const followUps = [
  {
    question: 'LangGraph 的 State 应该存什么，不应该存什么？',
    hint: '区分当前任务状态、原始消息、派生结果、外部资源引用和长期记忆。'
  },
  {
    question: '多用户并发时，Checkpoint 如何隔离？',
    hint: '回答 thread_id / session_id、存储命名空间、幂等性和并发写冲突。'
  },
  {
    question: '节点执行失败后，你会从哪里恢复？',
    hint: '说明持久化边界、可重试错误、不可重试错误和副作用操作的补偿策略。'
  },
  {
    question: '什么时候不应该使用 LangGraph？',
    hint: '固定短链路、无循环、无持久化需求、团队维护成本高于收益时。'
  }
]

const referenceAnswer = `我认为 LangGraph 相比手写 Prompt 流程，最大的优势是把 Agent 的状态和控制流显式化，而不只是把一串模型调用封装起来。

工程上，它可以用图结构表达条件分支、循环和多节点协作；通过统一 State 管理消息、中间结果和工具输出；再结合 Checkpoint 实现中断恢复、人工介入和多轮会话持久化。节点级 tracing 也让测试、回放和故障定位更容易。

效果上，复杂任务的上下文传递会更稳定。某个节点失败时可以局部重试或回退，而不必重新执行整条链路，也更方便针对规划、检索或工具调用等局部模块做评测和优化。

不过它并不一定提升模型本身的能力。对于步骤固定、链路很短的任务，手写 Workflow 可能更简单。我的选型标准是：当系统出现动态路由、循环、长状态、恢复或人工审批需求时，再引入 LangGraph。`

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

export function PilotQuestionDetail() {
  const [answer, setAnswer] = useState('')
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [showReference, setShowReference] = useState(false)

  useEffect(() => {
    if (!running) return

    const timer = window.setInterval(() => {
      setSeconds((value) => value + 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [running])

  const answerStatus = useMemo(() => {
    const length = answer.trim().length
    if (!length) return '还未开始作答'
    if (length < 120) return '结论已有，可以继续补充工程细节'
    if (length < 260) return '结构基本完整，建议补充取舍与边界'
    return '内容较完整，接下来重点压缩表达'
  }, [answer])

  function resetPractice() {
    setAnswer('')
    setSeconds(0)
    setRunning(false)
    setShowReference(false)
  }

  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <div className={styles.shell}>
          <nav className={styles.breadcrumb} aria-label="面包屑">
            <Link href="/questions"><ArrowLeft size={14} /> 面试题库</Link>
            <span>/</span>
            <span>真实面经</span>
            <span>/</span>
            <strong>美团 · LangGraph</strong>
          </nav>

          <header className={styles.hero}>
            <div className={styles.heroMain}>
              <div className={styles.badges}>
                <span className={styles.realBadge}><ShieldCheck size={14} /> 真实面经</span>
                <span>Agent 开发</span>
                <span>项目深挖</span>
                <span>中等</span>
              </div>
              <p className={styles.eyebrow}>MEITUAN · BEIDOU PROGRAM · FIRST ROUND</p>
              <h1>用 LangGraph 实现多轮对话 Agent，相比手写 Prompt 流程有哪些工程和效果优势？</h1>
              <p className={styles.lead}>
                这不是一道 LangGraph API 背诵题。面试官真正想判断的是：你是否理解 Agent 状态机、运行时治理和框架选型边界。
              </p>
              <div className={styles.heroMeta}>
                <span><Building2 size={16} /> 美团北斗 · 大模型算法岗</span>
                <span><Clock3 size={16} /> 建议回答 3 分钟</span>
                <span><Target size={16} /> 一面第 10 题</span>
              </div>
            </div>

            <aside className={styles.sourceCard}>
              <div className={styles.sourceHeader}>
                <div>
                  <span>来源可信度</span>
                  <strong>B 级</strong>
                </div>
                <ShieldCheck size={22} />
              </div>
              <p>候选人公开面经原帖，并由 GitHub 面经仓库二次收录。不是美团官方题库。</p>
              <dl>
                <div><dt>公开时间</dt><dd>2025-12-26</dd></div>
                <div><dt>原始平台</dt><dd>牛客网</dd></div>
                <div><dt>来源类型</dt><dd>候选人自述</dd></div>
              </dl>
              <div className={styles.sourceLinks}>
                <a href={sourceUrl} target="_blank" rel="noreferrer">
                  查看原始面经 <ExternalLink size={14} />
                </a>
                <a href={archiveUrl} target="_blank" rel="noreferrer">
                  GitHub 交叉收录 <ExternalLink size={14} />
                </a>
              </div>
            </aside>
          </header>

          <div className={styles.layout}>
            <div className={styles.mainColumn}>
              <section className={`${styles.panel} ${styles.practicePanel}`}>
                <div className={styles.sectionHeader}>
                  <div>
                    <span>STEP 01 · ANSWER FIRST</span>
                    <h2>先像真实面试一样回答</h2>
                  </div>
                  <div className={styles.timer}><TimerReset size={17} /> {formatTime(seconds)}</div>
                </div>

                <textarea
                  aria-label="输入你的面试回答"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  onFocus={() => setRunning(true)}
                  placeholder="建议结构：先给结论 → 工程优势 → 效果优势 → 适用边界。不要一开始就罗列 LangGraph 的组件名称。"
                />

                <div className={styles.practiceFooter}>
                  <div>
                    <strong>{answerStatus}</strong>
                    <span>{answer.trim().length} 字</span>
                  </div>
                  <div className={styles.actionGroup}>
                    <button className={styles.secondaryButton} type="button" onClick={resetPractice}>
                      <RotateCcw size={15} /> 重置
                    </button>
                    <button className={styles.primaryButton} type="button" onClick={() => setShowReference((value) => !value)}>
                      {showReference ? '收起参考回答' : '提交并对照'} <ArrowRight size={15} />
                    </button>
                  </div>
                </div>

                {showReference ? (
                  <div className={styles.referenceAnswer}>
                    <div className={styles.referenceTitle}>
                      <Sparkles size={17} />
                      <div><strong>3 分钟参考回答</strong><span>先看结构，再比较遗漏点</span></div>
                    </div>
                    {referenceAnswer.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                ) : null}
              </section>

              <section className={styles.panel}>
                <div className={styles.sectionHeader}>
                  <div>
                    <span>STEP 02 · INTERVIEW INTENT</span>
                    <h2>面试官到底在考什么</h2>
                  </div>
                  <Target size={21} />
                </div>
                <div className={styles.dimensionGrid}>
                  {dimensions.map(({ icon: Icon, title, description }) => (
                    <article key={title}>
                      <Icon size={19} />
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className={styles.panel}>
                <div className={styles.sectionHeader}>
                  <div>
                    <span>STEP 03 · ANSWER STRUCTURE</span>
                    <h2>高质量回答框架</h2>
                  </div>
                  <BookOpenCheck size={21} />
                </div>
                <div className={styles.frameworkList}>
                  {answerFramework.map((item) => (
                    <article key={item.index}>
                      <span>{item.index}</span>
                      <div><h3>{item.title}</h3><p>{item.content}</p></div>
                    </article>
                  ))}
                </div>
              </section>

              <section className={styles.panel}>
                <div className={styles.sectionHeader}>
                  <div>
                    <span>STEP 04 · DEEP DIVE</span>
                    <h2>工程优势与效果优势要分开讲</h2>
                  </div>
                  <Lightbulb size={21} />
                </div>

                <div className={styles.comparisonGrid}>
                  <article>
                    <span>ENGINEERING</span>
                    <h3>工程上的优势</h3>
                    <ul>
                      <li><CheckCircle2 size={16} /> State 成为统一的数据契约</li>
                      <li><CheckCircle2 size={16} /> 条件分支和循环不再藏在 Prompt 中</li>
                      <li><CheckCircle2 size={16} /> Checkpoint 支持中断、恢复和人工审批</li>
                      <li><CheckCircle2 size={16} /> 节点级 tracing、回放和单元测试更清晰</li>
                    </ul>
                  </article>
                  <article>
                    <span>QUALITY</span>
                    <h3>效果上的优势</h3>
                    <ul>
                      <li><CheckCircle2 size={16} /> 多轮上下文传递更稳定</li>
                      <li><CheckCircle2 size={16} /> 失败时可以局部重试和回退</li>
                      <li><CheckCircle2 size={16} /> 规划、检索、工具调用可分别评测</li>
                      <li><CheckCircle2 size={16} /> 复杂任务更容易做持续迭代</li>
                    </ul>
                  </article>
                </div>

                <div className={styles.boundaryNote}>
                  <MessageSquareQuote size={19} />
                  <div>
                    <strong>关键边界：框架不会自动提升模型智力</strong>
                    <p>LangGraph 提升的是系统的可控性、可恢复性和可迭代性。模型是否会规划、是否会正确调用工具，仍取决于模型、上下文、工具设计与评测闭环。</p>
                  </div>
                </div>
              </section>

              <section className={styles.panel}>
                <div className={styles.sectionHeader}>
                  <div>
                    <span>STEP 05 · FOLLOW UPS</span>
                    <h2>面试官可能继续追问</h2>
                  </div>
                  <MessageSquareQuote size={21} />
                </div>
                <div className={styles.followupList}>
                  {followUps.map((item, index) => (
                    <details key={item.question}>
                      <summary><span>{String(index + 1).padStart(2, '0')}</span>{item.question}</summary>
                      <p>{item.hint}</p>
                    </details>
                  ))}
                </div>
              </section>
            </div>

            <aside className={styles.sidebar}>
              <section className={styles.sidePanel}>
                <span className={styles.sideEyebrow}>题目归属</span>
                <h2>Agent 开发</h2>
                <p>核心不是模型训练，而是 Agent 工作流、状态和运行时设计。</p>
                <div className={styles.tagList}>
                  <span>LangGraph</span><span>多轮对话</span><span>状态管理</span><span>框架选型</span>
                </div>
              </section>

              <section className={styles.sidePanel}>
                <span className={styles.sideEyebrow}>答题检查</span>
                <ul className={styles.checklist}>
                  <li><CheckCircle2 size={16} /> 是否先给出核心结论</li>
                  <li><CheckCircle2 size={16} /> 是否区分工程与效果</li>
                  <li><CheckCircle2 size={16} /> 是否提到 State 与 Checkpoint</li>
                  <li><CheckCircle2 size={16} /> 是否说明不适用场景</li>
                </ul>
              </section>

              <section className={`${styles.sidePanel} ${styles.warningPanel}`}>
                <span className={styles.sideEyebrow}>常见失分点</span>
                <strong>只罗列组件名称</strong>
                <p>“有节点、有边、有状态”只是介绍框架。面试官更关心这些能力解决了什么生产问题。</p>
              </section>

              <Link className={styles.nextAction} href="/practice">
                <Sparkles size={17} />
                <span><strong>进入模拟面试</strong><small>让 AI 根据回答连续追问</small></span>
                <ArrowRight size={16} />
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}
