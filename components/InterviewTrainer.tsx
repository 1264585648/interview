'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, RotateCcw, Send } from 'lucide-react'
import type { InterviewQuestion } from '@/data/questions'
import styles from './InterviewTrainer.module.css'

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
      <div className={styles.result}>
        <div className={styles.resultTop}>
          <div>
            <span>本轮模拟</span>
            <strong>{score} / 10</strong>
          </div>
          <button className={styles.secondaryButton} type="button" onClick={restart}>
            <RotateCcw size={14} /> 再练一次
          </button>
        </div>
        <p>当前 Demo 使用规则评分展示训练闭环。接入模型后，会根据每轮回答动态追问，并反馈概念理解、工程深度、表达结构和遗漏点。</p>
        <div className={styles.coverage}>
          <span>本题关键点</span>
          <p>{question.keyPoints.join(' · ')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.trainer}>
      <div className={styles.topLine}>
        <span>模拟面试</span>
        <span>{Math.min(step + 1, question.followUps.length + 1)} / {question.followUps.length + 1}</span>
      </div>

      <div className={styles.prompt}>
        <span>面试官</span>
        <h3>{currentPrompt}</h3>
      </div>

      {!submitted ? (
        <div className={styles.answerArea}>
          <label htmlFor="answer">你的回答</label>
          <textarea
            id="answer"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="像真实面试一样回答。先给结论，再解释为什么。"
            rows={6}
          />
          <div className={styles.actions}>
            <span>{answer.length} 字</span>
            <button className={styles.primaryButton} type="button" onClick={submitAnswer} disabled={answer.trim().length < 8}>
              提交回答 <Send size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.nextPanel}>
          <div>
            <strong>回答已记录</strong>
            <p>继续进入下一轮追问，完成后再统一看结果。</p>
          </div>
          <button className={styles.primaryButton} type="button" onClick={nextQuestion}>
            {step === question.followUps.length ? '查看结果' : '继续追问'} <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
