'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  MessageSquareQuote,
  RotateCcw,
  Sparkles,
  Target,
  TimerReset
} from 'lucide-react'
import styles from './page.module.css'

const referenceAnswer = `我认为 Agent 和普通 Workflow 最核心的区别，是谁决定下一步执行什么。

普通 Workflow 的节点、顺序和主要分支通常由开发者提前定义。系统收到输入后按照确定的流程执行，因此它更稳定、可预测，也更容易测试和审计。

Agent 会把一部分运行时控制权交给模型。模型根据任务目标、当前上下文和工具返回结果，动态决定下一步是调用哪个工具、补充询问、重新规划还是结束。因此 Agent 更适合路径无法提前完全穷举的任务，但也会带来成本、延迟、循环、误调用和结果不稳定等问题。

所以工程上我不会把两者理解成谁替代谁。更常见的方案是外层使用 Workflow 保证关键路径和安全边界，只在需要理解、规划和动态选择的局部环节使用 Agent。`

const answerSteps = [
  '先用一句话回答：谁决定下一步。',
  '再解释两者各自的运行机制。',
  '比较稳定性、灵活性、成本和可测试性。',
  '最后说明生产系统通常采用混合架构。'
]

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

export function PracticeWorkspace() {
  const [answer, setAnswer] = useState('')
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!running) return

    const timer = window.setInterval(() => {
      setSeconds((value) => value + 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [running])

  const assessment = useMemo(() => {
    const text = answer.trim()
    if (!text) return '还未开始作答'

    const hasControl = /控制|决定下一步|动态决策/.test(text)
    const hasTradeoff = /稳定|可控|成本|延迟|测试|灵活/.test(text)
    const hasBoundary = /结合|混合|局部|外层|场景/.test(text)

    if (!hasControl) return '建议先回答：谁决定下一步？'
    if (!hasTradeoff) return '核心区别已有，再补充工程取舍'
    if (!hasBoundary) return '结构不错，再补充选型边界'
    return '回答框架完整，可以提交对照'
  }, [answer])

  function reset() {
    setAnswer('')
    setSeconds(0)
    setRunning(false)
    setSubmitted(false)
  }

  function submitAnswer() {
    setSubmitted(true)
    setRunning(false)
  }

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <Link href="/questions/agent-vs-workflow">
          <ArrowLeft size={16} /> 返回题目解析
        </Link>
        <div className={styles.brand}>
          <Sparkles size={15} />
          <span>Agent Interview · 专注作答</span>
        </div>
        <div className={styles.timer}>
          <TimerReset size={16} /> {formatTime(seconds)}
        </div>
      </header>

      <div className={styles.shell}>
        <section className={styles.questionCard}>
          <div className={styles.badges}>
            <span>京东真实面经</span>
            <span>Agent 开发</span>
            <span>建议 2 分钟</span>
          </div>
          <p>INTERVIEW QUESTION</p>
          <h1>Agent 和普通工作流有什么区别？</h1>
          <div className={styles.questionHint}>
            <Target size={18} />
            <span>不要先罗列组件。先回答控制权在哪里，再比较工程取舍。</span>
          </div>
        </section>

        <div className={styles.workspace}>
          <section className={styles.editorCard}>
            <div className={styles.editorHeader}>
              <div>
                <span>YOUR ANSWER</span>
                <h2>用自己的话组织回答</h2>
              </div>
              <div>
                <strong>{answer.trim().length}</strong>
                <span>字</span>
              </div>
            </div>

            <textarea
              aria-label="输入你的面试回答"
              value={answer}
              onChange={(event) => {
                setAnswer(event.target.value)
                setSubmitted(false)
              }}
              onFocus={() => setRunning(true)}
              placeholder="建议结构：核心结论 → 运行机制 → 工程取舍 → 生产选型"
            />

            <div className={styles.editorFooter}>
              <div className={styles.status}>
                <Clock3 size={15} />
                <span>{assessment}</span>
              </div>
              <div className={styles.actions}>
                <button type="button" className={styles.secondaryButton} onClick={reset}>
                  <RotateCcw size={15} /> 重置
                </button>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={submitAnswer}
                  disabled={!answer.trim()}
                >
                  提交并对照 <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {submitted ? (
              <section className={styles.referenceCard}>
                <div className={styles.referenceHeader}>
                  <MessageSquareQuote size={18} />
                  <div>
                    <strong>2 分钟参考回答</strong>
                    <span>比较结构和遗漏点，不必逐字背诵</span>
                  </div>
                </div>
                {referenceAnswer.split('\n\n').map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ) : null}
          </section>

          <aside className={styles.guideColumn}>
            <section className={styles.guideCard}>
              <span>回答结构</span>
              <ol>
                {answerSteps.map((step, index) => (
                  <li key={step}>
                    <strong>{String(index + 1).padStart(2, '0')}</strong>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className={styles.guideCard}>
              <span>提交前检查</span>
              <ul>
                <li><CheckCircle2 size={16} /> 是否回答谁决定下一步</li>
                <li><CheckCircle2 size={16} /> 是否讲清动态决策与预设路径</li>
                <li><CheckCircle2 size={16} /> 是否比较稳定性和灵活性</li>
                <li><CheckCircle2 size={16} /> 是否说明混合架构</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}
