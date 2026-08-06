'use client'

import { useState } from 'react'
import { ChevronDown, Eye, EyeOff, MessageSquareText } from 'lucide-react'
import type { InterviewQuestion } from '@/data/questions'
import styles from './QuestionDetail.module.css'

type Props = {
  question: InterviewQuestion
}

export function QuestionPracticeWorkspace({ question }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [answer, setAnswer] = useState('')
  const [showHints, setShowHints] = useState(false)

  return (
    <section className={styles.practiceDisclosure} aria-labelledby="practice-title">
      <button
        className={styles.practiceToggle}
        type="button"
        aria-expanded={expanded}
        aria-controls="question-practice-panel"
        onClick={() => setExpanded((value) => !value)}
      >
        <span><MessageSquareText size={16} /> <strong id="practice-title">先自己回答</strong></span>
        <span>{expanded ? '收起' : '展开'} <ChevronDown className={expanded ? styles.chevronOpen : ''} size={16} /></span>
      </button>

      {expanded ? (
        <div className={styles.practiceBody} id="question-practice-panel">
          <label className={styles.answerComposer} htmlFor="question-answer">
            <span>你的回答</span>
            <textarea
              id="question-answer"
              name="question-answer"
              value={answer}
              maxLength={1000}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="先给出结论，再说明依据和取舍。"
              rows={4}
            />
          </label>
          <div className={styles.practiceMeta}>
            <button type="button" onClick={() => setShowHints((value) => !value)}>
              {showHints ? <EyeOff size={15} /> : <Eye size={15} />}
              {showHints ? '隐藏提示' : '查看提示'}
            </button>
            <span>{answer.length} / 1000 · 仅保存在当前页面</span>
          </div>
          {showHints ? (
            <div className={styles.hintPanel} aria-live="polite">
              <strong>回答要点</strong>
              <ul>{question.keyPoints.map((point) => <li key={point}>{point}</li>)}</ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
