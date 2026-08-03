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
import styles from '../meituan-langgraph-agent/page.module.css'

const sources = [
  {
    label: '京东 Agent 二面面经',
    url: 'https://www.nowcoder.com/feed/main/detail/b51047e32faa44678b3e0fffb798c17d'
  },
  {
    label: '京东 AI Agent 开发面经',
    url: 'https://www.nowcoder.com/feed/main/detail/4f35076e21474376acd443f1a2220b96'
  },
  {
    label: '京东 AI Agent 实习二面',
    url: 'https://www.nowcoder.com/feed/main/detail/7af26b7a99e54b29af671ac334b445b5'
  }
]

const dimensions = [
  {
    icon: GitBranch,
    title: '控制权归属',
    description: '能否指出核心差异是“谁决定下一步”，而不是有没有 LLM、Tool 或 Memory。'
  },
  {
    icon: Database,
    title: '状态与反馈',
    description: '是否理解 Agent 会读取当前状态和工具结果，再决定继续、换工具、追问或结束。'
  },
  {
    icon: Activity,
    title: '工程取舍',
    description: '能否比较稳定性、灵活性、成本、可测试性和异常行为，而不是说 Agent 更高级。'
  },
  {
    icon: Wrench,
    title: '场景选型',
    description: '能否判断固定流程优先 Workflow，不确定任务才值得把局部控制权交给 Agent。'
  }
]

const answerFramework = [
  {
    index: '01',
    title: '先给一句话结论',
    content: 'Workflow 的执行路径主要由开发者预先定义；Agent 会根据目标、状态和环境反馈动态决定下一步。'
  },
  {
    index: '02',
    title: '解释运行机制',
    content: 'Workflow 按预设节点和条件流转；Agent 通常在观察、决策、执行、读取结果之间形成循环。'
  },
  {
    index: '03',
    title: '比较工程特征',
    content: 'Workflow 更稳定、可预测、易测试；Agent 更灵活，但成本、延迟和异常路径更难控制。'
  },
  {
    index: '04',
    title: '给出生产选型',
    content: '生产系统通常采用外层 Workflow 保证边界，在局部不确定环节引入 Agent 做动态决策。'
  }
]

const followUps = [
  {
    question: '用了大模型和工具调用，就一定是 Agent 吗？',
    hint: '不一定。固定顺序调用 LLM 和 Tool 仍可能只是 Workflow，关键看模型是否拥有运行时决策权。'
  },
  {
    question: '什么场景应该优先使用 Workflow？',
    hint: '步骤稳定、审计严格、错误代价高、路径可穷举，例如支付、审批、核心交易和批处理。'
  },
  {
    question: 'Agent 的动态决策会引入哪些问题？',
    hint: '成本和延迟不稳定、循环、工具误调用、结果不可复现、测试困难以及权限与安全风险。'
  },
  {
    question: '如何把 Agent 控制在一个安全边界内？',
    hint: '限制工具权限、最大步数、预算、超时和停止条件；高风险动作交给确定性流程或人工审批。'
  }
]

const referenceAnswer = `我认为 Agent 和普通 Workflow 最核心的区别，是谁决定下一步执行什么。

普通 Workflow 的节点、顺序和主要分支通常由开发者提前定义。系统收到输入后按照确定的流程执行，因此它更稳定、可预测，也更容易测试和审计。

Agent 会把一部分运行时控制权交给模型。模型根据任务目标、当前上下文和工具返回结果，动态决定下一步是调用哪个工具、补充询问、重新规划还是结束。因此 Agent 更适合路径无法提前完全穷举的任务，但也会带来成本、延迟、循环、误调用和结果不稳定等问题。

所以工程上我不会把两者理解成谁替代谁。更常见的方案是外层使用 Workflow 保证关键路径和安全边界，只在需要理解、规划和动态选择的局部环节使用 Agent。`

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

export function JdAgentVsWorkflowPage() {
  const [answer, setAnswer] = useState('')
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [showReference, setShowReference] = useState(false)

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [running])

  const answerStatus = useMemo(() => {
    const text = answer.trim()
    if (!text) return '还未开始作答'

    const hasControl = /控制|决定下一步|动态决策/.test(text)
    const hasTradeoff = /稳定|可控|成本|延迟|测试|灵活/.test(text)
    const hasBoundary = /结合|混合|局部|外层|场景/.test(text)

    if (!hasControl) return '建议先回答：谁决定下一步？'
    if (!hasTradeoff) return '核心区别已有，再补充工程取舍'
    if (!hasBoundary) return '结构不错，再补充选型边界'
    return '回答框架完整，可以继续压缩表达'
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
            <strong>京东 · Agent 基础</strong>
          </nav>

          <header className={styles.hero}>
            <div className={styles.heroMain}>
              <div className={styles.badges}>
                <span className={styles.realBadge}><ShieldCheck size={14} /> 多份真实面经</span>
                <span>Agent 开发</span>
                <span>概念与选型</span>
                <span>入门</span>
              </div>
              <p className={styles.eyebrow}>JD · AI AGENT INTERVIEW · SECOND ROUND</p>
              <h1>Agent 和普通工作流有什么区别？</h1>
              <p className={styles.lead}>
                这道题不是让你背 Agent 的组件列表。面试官真正想听的是：控制权在哪里、系统如何运行，以及你会怎样做工程选型。
              </p>
              <div className={styles.heroMeta}>
                <span><Building2 size={16} /> 京东 · Agent / Java 方向</span>
                <span><Clock3 size={16} /> 建议回答 2 分钟</span>
                <span><Target size={16} /> 高频基础题</span>
              </div>
            </div>

            <aside className={styles.sourceCard}>
              <div className={styles.sourceHeader}>
                <div>
                  <span>来源可信度</span>
                  <strong>A-</strong>
                </div>
                <ShieldCheck size={22} />
              </div>
              <p>至少三份独立的京东候选人公开面经出现相同题目。仍属于候选人报告，不代表京东官方固定题库。</p>
              <dl>
                <div><dt>公司</dt><dd>京东</dd></div>
                <div><dt>常见轮次</dt><dd>二面</dd></div>
                <div><dt>来源类型</dt><dd>候选人自述</dd></div>
              </dl>
              <div className={styles.sourceLinks}>
                {sources.map((source, index) => (
                  <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                    来源 {index + 1}：{source.label} <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            </aside>
          </header>

          <div className={styles.layout}>
            <div className={styles.mainColumn}>
              <section className={`${styles.panel} ${styles.practicePanel}`}>
                <div className={styles.sectionHeader}>
                  <div>
                    <span>STEP 01 · ANSWER FIRST</span>
                    <h2>先用自己的话回答</h2>
                  </div>
                  <div className={styles.timer}><TimerReset size={17} /> {formatTime(seconds)}</div>
                </div>

                <textarea
                  aria-label="输入你的面试回答"
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  onFocus={() => setRunning(true)}
                  placeholder="提示：先回答谁决定下一步，再比较稳定性与灵活性，最后说明实际系统通常如何组合使用。"
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
                      <div><strong>2 分钟参考回答</strong><span>重点比较结构，而不是逐字背诵</span></div>
                    </div>
                    {referenceAnswer.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                ) : null}
              </section>

              <section className={styles.panel}>
                <div className={styles.sectionHeader}>
                  <div>
                    <span>STEP 02 · CORE DIFFERENCE</span>
                    <h2>最核心的区别：谁决定下一步</h2>
                  </div>
                  <Lightbulb size={21} />
                </div>

                <div className={styles.comparisonGrid}>
                  <article>
                    <span>WORKFLOW</span>
                    <h3>开发者预先决定路径</h3>
                    <ul>
                      <li><CheckCircle2 size={16} /> 节点和主要分支提前定义</li>
                      <li><CheckCircle2 size={16} /> 相同输入通常走相似路径</li>
                      <li><CheckCircle2 size={16} /> 执行结果更稳定、更容易审计</li>
                      <li><CheckCircle2 size={16} /> 适合步骤明确的确定性任务</li>
                    </ul>
                  </article>
                  <article>
                    <span>AGENT</span>
                    <h3>模型根据状态动态决策</h3>
                    <ul>
                      <li><CheckCircle2 size={16} /> 根据目标和上下文选择动作</li>
                      <li><CheckCircle2 size={16} /> 读取工具结果后重新决策</li>
                      <li><CheckCircle2 size={16} /> 路径可能在运行时发生变化</li>
                      <li><CheckCircle2 size={16} /> 适合无法预先穷举的任务</li>
                    </ul>
                  </article>
                </div>

                <div className={styles.boundaryNote}>
                  <MessageSquareQuote size={19} />
                  <div>
                    <strong>判断标准不是有没有 LLM、Tool 或 Memory</strong>
                    <p>固定顺序执行“检索 → 调模型 → 调工具 → 返回结果”，即使每一步都用了大模型，也可能仍然只是 Workflow。</p>
                  </div>
                </div>
              </section>

              <section className={styles.panel}>
                <div className={styles.sectionHeader}>
                  <div>
                    <span>STEP 03 · INTERVIEW INTENT</span>
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
                    <span>STEP 04 · ANSWER STRUCTURE</span>
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
                    <span>STEP 05 · PRODUCTION CHOICE</span>
                    <h2>真实系统通常不是二选一</h2>
                  </div>
                  <GitBranch size={21} />
                </div>

                <div className={styles.comparisonGrid}>
                  <article>
                    <span>OUTER WORKFLOW</span>
                    <h3>用确定性流程守住边界</h3>
                    <ul>
                      <li><CheckCircle2 size={16} /> 权限、预算和最大步数</li>
                      <li><CheckCircle2 size={16} /> 核心交易与高风险动作</li>
                      <li><CheckCircle2 size={16} /> 超时、重试和人工审批</li>
                      <li><CheckCircle2 size={16} /> 审计日志与停止条件</li>
                    </ul>
                  </article>
                  <article>
                    <span>LOCAL AGENT</span>
                    <h3>在不确定环节动态决策</h3>
                    <ul>
                      <li><CheckCircle2 size={16} /> 理解开放式用户意图</li>
                      <li><CheckCircle2 size={16} /> 动态拆解复杂任务</li>
                      <li><CheckCircle2 size={16} /> 根据反馈选择工具</li>
                      <li><CheckCircle2 size={16} /> 缺少信息时主动追问</li>
                    </ul>
                  </article>
                </div>
              </section>

              <section className={styles.panel}>
                <div className={styles.sectionHeader}>
                  <div>
                    <span>STEP 06 · FOLLOW UPS</span>
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
                <span className={styles.sideEyebrow}>一句话记忆</span>
                <h2>看控制权</h2>
                <p>Workflow 由开发者预设主要路径；Agent 根据状态与反馈动态决定下一步。</p>
                <div className={styles.tagList}>
                  <span>控制流</span><span>动态决策</span><span>状态</span><span>工程选型</span>
                </div>
              </section>

              <section className={styles.sidePanel}>
                <span className={styles.sideEyebrow}>答题检查</span>
                <ul className={styles.checklist}>
                  <li><CheckCircle2 size={16} /> 是否回答谁决定下一步</li>
                  <li><CheckCircle2 size={16} /> 是否讲清运行机制</li>
                  <li><CheckCircle2 size={16} /> 是否比较工程取舍</li>
                  <li><CheckCircle2 size={16} /> 是否给出混合架构</li>
                </ul>
              </section>

              <section className={`${styles.sidePanel} ${styles.warningPanel}`}>
                <span className={styles.sideEyebrow}>常见失分点</span>
                <strong>把 Agent 说成组件集合</strong>
                <p>“LLM + Tool + Memory”只描述了组成，没有解释系统为什么能够自主决定下一步。</p>
              </section>

              <Link className={styles.nextAction} href="/practice">
                <Sparkles size={17} />
                <span><strong>进入模拟面试</strong><small>继续练习连续追问</small></span>
                <ArrowRight size={16} />
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}
