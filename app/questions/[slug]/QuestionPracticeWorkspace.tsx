'use client'

import { useState } from 'react'
import { ArrowRight, Eye, MessageSquareText, Sparkles, UserRound } from 'lucide-react'
import type { InterviewQuestion } from '@/data/questions'
import styles from './QuestionDetail.module.css'

type Props = {
  question: InterviewQuestion
}

export function QuestionPracticeWorkspace({ question }: Props) {
  const [answer, setAnswer] = useState('')
  const [showHints, setShowHints] = useState(false)

  return (
    <section className={`${styles.panel} ${styles.scenePanel}`} id="intro">
      <div className={styles.panelHeader}>
        <div>
          <span className={styles.panelEyebrow}>INTERVIEW SCENE</span>
          <h1>面试场景</h1>
        </div>
        <div className={styles.sceneTags}>
          <span>{question.category}</span>
          <span>{question.type}</span>
          <span>{question.frequency}</span>
        </div>
      </div>

      <div className={styles.interviewerRow}>
        <div className={styles.interviewerAvatar} aria-hidden="true">
          <UserRound size={20} />
        </div>
        <div className={styles.interviewerContent}>
          <strong>面试官</strong>
          <div className={styles.questionBubble}>
            <p>{question.title}</p>
            <span>在实际的 Agent 系统中，你会怎样解释自己的设计判断？</span>
          </div>
        </div>
      </div>

      <label className={styles.answerComposer} htmlFor="practice-answer">
        <MessageSquareText size={18} />
        <textarea
          id="practice-answer"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="写下你的回答……建议先给结论，再解释原理和工程取舍。"
          rows={4}
        />
        <span>{answer.length} / 1000</span>
      </label>

      {showHints ? (
        <div className={styles.hintPanel}>
          <div>
            <Sparkles size={17} />
            <strong>参考要点</strong>
          </div>
          <ul>
            {question.keyPoints.map((point) => <li key={point}>{point}</li>)}
          </ul>
        </div>
      ) : null}

      <div className={styles.sceneActions}>
        <button type="button" className={styles.secondaryAction} onClick={() => setShowHints((value) => !value)}>
          <Eye size={17} />
          {showHints ? '收起参考要点' : '查看参考要点'}
        </button>
        <a className={styles.primaryAction} href="#detailed-answer">
          进入详细解析
          <ArrowRight size={17} />
        </a>
      </div>
    </section>
  )
}
