'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, RotateCcw, Send, Sparkles } from 'lucide-react'
import type { InterviewQuestion } from '@/data/questions'

type Props = {
  question: InterviewQuestion
}

export function InterviewTrainer({ question }: Props) {
  const [answer, setAnswer] = useState('')
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const currentPrompt = step === 0 ? question.title : question.followUps[step - 1]
  const isFinished = step > question.followUps.length

  const score = useMemo(() => {
    if (!history.length) return 0
    const content = history.join(' ')
    const topicHits = question.keyPoints.filter((point) =>
      content.toLowerCase().includes(point.toLowerCase().split(' ')[0])
    ).length
    const lengthScore = Math.min(4, Math.max(1, Math.floor(content.length / 90)))
    return Math.min(9.2, 4.8 + topicHits * 0.7 + lengthScore * 0.55).toFixed(1)
  }, [history, question.keyPoints])

  function submitAnswer() {
    if (answer.trim().length < 8) return
    setHistory((items) => [...items, answer.trim()])
    setAnswer('')
    setSubmitted(true)
  }

  function nextQuestion() {
    setSubmitted(false)
    setStep((value) => value + 1)
  }

  function restart() {
    setAnswer('')
    setStep(0)
    setSubmitted(false)
    setHistory([])
  }

  if (isFinished) {
    return (
      <section className="trainer-card result-card">
        <div className="result-score">
          <span>本轮模拟评分</span>
          <strong>{score}</strong>
          <small>/ 10</small>
        </div>
        <div className="result-copy">
          <span className="eyebrow"><Sparkles size={15} /> Demo Feedback</span>
          <h2>不错，你已经完成一轮追问。</h2>
          <p>
            当前 Demo 使用规则评分展示完整交互闭环。接入模型后，这里会根据每轮回答动态选择追问，并输出概念理解、工程深度、表达结构和遗漏点。
          </p>
          <div className="feedback-points">
            {question.keyPoints.map((point) => (
              <span key={point}><CheckCircle2 size={15} /> {point}</span>
            ))}
          </div>
          <button className="button button-secondary" type="button" onClick={restart}>
            <RotateCcw size={16} /> 再练一次
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="trainer-card">
      <div className="trainer-topline">
        <span>AI 模拟面试</span>
        <span>{Math.min(step + 1, question.followUps.length + 1)} / {question.followUps.length + 1}</span>
      </div>

      <div className="interviewer-row">
        <span className="avatar">I</span>
        <div>
          <span className="speaker">面试官</span>
          <h2>{currentPrompt}</h2>
        </div>
      </div>

      {!submitted ? (
        <div className="answer-box">
          <label htmlFor="answer">你的回答</label>
          <textarea
            id="answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="像真实面试一样回答。建议先给结论，再解释原理，最后补充工程实践。"
            rows={7}
          />
          <div className="answer-actions">
            <span>{answer.length} 字</span>
            <button className="button button-primary" type="button" onClick={submitAnswer} disabled={answer.trim().length < 8}>
              提交回答 <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="followup-panel">
          <span className="status-dot" />
          <div>
            <strong>面试官正在基于你的回答继续追问</strong>
            <p>Demo 先使用预设高质量追问，后续接入 LLM 后会根据回答实时生成。</p>
          </div>
          <button className="button button-primary" type="button" onClick={nextQuestion}>
            {step === question.followUps.length ? '查看结果' : '继续追问'} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </section>
  )
}
