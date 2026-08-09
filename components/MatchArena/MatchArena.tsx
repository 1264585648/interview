'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, RotateCcw } from 'lucide-react'
import type { InterviewQuestion } from '@/data/questions'
import { ArenaHud } from './ArenaHud'
import { ArenaWheel } from './ArenaWheel'
import type { MatchPhase, MatchResult } from './types'
import { matchAsset } from './assetPath'
import styles from './MatchArena.module.css'

type MatchArenaProps = { questions: InterviewQuestion[] }

const phaseCopy: Record<MatchPhase, { eyebrow: string; title: string; description: string }> = {
  idle: {
    eyebrow: 'INTERVIEW MATCH',
    title: '准备好接受挑战了吗？',
    description: '启动匹配引擎，依次锁定本场面试的领域、题型与难度。'
  },
  searching: {
    eyebrow: 'MATCHMAKING',
    title: '正在生成本场挑战',
    description: '匹配引擎正在读取题库并组合适合本局的面试参数。'
  },
  'domain-locked': {
    eyebrow: 'DOMAIN LOCKED',
    title: '领域已锁定',
    description: '第一层完成，继续匹配本场面试题型。'
  },
  'type-locked': {
    eyebrow: 'TYPE LOCKED',
    title: '题型已锁定',
    description: '第二层完成，正在确定最终挑战强度。'
  },
  'level-locked': {
    eyebrow: 'LEVEL LOCKED',
    title: '难度已锁定',
    description: '本场参数已经确定，正在完成最终确认。'
  },
  matched: {
    eyebrow: 'MATCH FOUND',
    title: '本场面试已准备就绪',
    description: '只展示挑战参数，进入面试后才会揭晓具体问题。'
  }
}

const wait = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

function stars(difficulty: number) {
  return `${'★'.repeat(difficulty)}${'☆'.repeat(Math.max(0, 5 - difficulty))}`
}

export function MatchArena({ questions }: MatchArenaProps) {
  const [phase, setPhase] = useState<MatchPhase>('idle')
  const [result, setResult] = useState<MatchResult | null>(null)
  const runningRef = useRef(false)
  const runRef = useRef(0)

  async function startMatch() {
    if (runningRef.current || questions.length === 0) return

    runningRef.current = true
    const run = ++runRef.current
    const previousSlug = result?.question.slug
    const candidates = questions.length > 1
      ? questions.filter((question) => question.slug !== previousSlug)
      : questions
    const question = candidates[Math.floor(Math.random() * candidates.length)] ?? questions[0]
    const nextResult: MatchResult = {
      domain: question.category,
      type: question.type,
      difficulty: question.difficulty,
      topics: question.topics.slice(0, 2),
      estimate: question.estimate,
      question
    }

    setResult(nextResult)
    setPhase('searching')

    try {
      await wait(900)
      if (run !== runRef.current) return
      setPhase('domain-locked')

      await wait(720)
      if (run !== runRef.current) return
      setPhase('type-locked')

      await wait(720)
      if (run !== runRef.current) return
      setPhase('level-locked')

      await wait(620)
      if (run !== runRef.current) return
      setPhase('matched')
    } finally {
      if (run === runRef.current) runningRef.current = false
    }
  }

  if (questions.length === 0) {
    return (
      <main className={`${styles.arena} ${styles.emptyArena}`}>
        <h1>暂时没有可匹配的题目</h1>
        <p>题库补充内容后，这里会自动恢复匹配。</p>
        <Link href="/questions">返回题库</Link>
      </main>
    )
  }

  const copy = phaseCopy[phase]
  const showDomain = phase === 'domain-locked' || phase === 'type-locked' || phase === 'level-locked' || phase === 'matched'
  const showType = phase === 'type-locked' || phase === 'level-locked' || phase === 'matched'
  const showLevel = phase === 'level-locked' || phase === 'matched'

  return (
    <main className={`${styles.arena} ${phase === 'matched' ? styles.arenaMatched : ''}`}>
      <img
        alt=""
        aria-hidden="true"
        className={styles.atmosphere}
        draggable="false"
        src={matchAsset('interview-match-concept-16x9.webp')}
      />
      <div className={styles.atmosphereVeil} aria-hidden="true" />
      <ArenaHud />

      <section className={styles.matchLayout}>
        <header className={styles.matchIntro}>
          <span>{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </header>

        <ArenaWheel onStart={startMatch} phase={phase} result={result} />

        <div className={styles.matchFacts} aria-label="本场匹配参数">
          <div className={`${styles.fact} ${showDomain ? styles.factResolved : ''}`}>
            <span>DOMAIN</span>
            <strong>{showDomain && result ? result.domain : '—'}</strong>
            {showDomain ? <Check size={13} aria-hidden="true" /> : null}
          </div>
          <div className={`${styles.fact} ${showType ? styles.factResolved : ''}`}>
            <span>TYPE</span>
            <strong>{showType && result ? result.type : '—'}</strong>
            {showType ? <Check size={13} aria-hidden="true" /> : null}
          </div>
          <div className={`${styles.fact} ${showLevel ? styles.factResolved : ''}`}>
            <span>LEVEL</span>
            <strong className={styles.stars}>{showLevel && result ? stars(result.difficulty) : '—'}</strong>
            {showLevel ? <Check size={13} aria-hidden="true" /> : null}
          </div>
        </div>

        {phase === 'matched' && result ? (
          <div className={styles.matchResultActions}>
            <div className={styles.matchMeta}>
              <span>{result.topics.join(' · ') || result.domain}</span>
              <i aria-hidden="true" />
              <span>{result.estimate}</span>
              <i aria-hidden="true" />
              <span>3 ROUNDS</span>
            </div>
            <div className={styles.actionRow}>
              <Link className={styles.acceptButton} href={`/questions/${result.question.slug}`}>
                <span>接受挑战</span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <button className={styles.rematchButton} onClick={startMatch} type="button">
                <RotateCcw size={14} aria-hidden="true" />
                重新匹配
              </button>
            </div>
          </div>
        ) : (
          <p className={styles.matchHint}>{phase === 'idle' ? '预计 5–8 分钟 · 具体题目将在进入面试后揭晓' : '请稍候，匹配引擎正在锁定参数'}</p>
        )}
      </section>

      <p className={styles.liveStatus} aria-atomic="true" aria-live="polite">
        {phase === 'matched' && result
          ? `匹配完成：${result.domain}，${result.type}，难度 ${result.difficulty} 星`
          : copy.title}
      </p>
    </main>
  )
}
