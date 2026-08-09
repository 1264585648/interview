'use client'

import { useEffect, useReducer, useRef, useState } from 'react'
import { animate, useMotionValue, useReducedMotion, type AnimationPlaybackControls } from 'motion/react'
import Link from 'next/link'
import type { InterviewQuestion } from '@/data/questions'
import { ArenaHud } from './ArenaHud'
import { ArenaWheel } from './ArenaWheel'
import { DeckStack } from './DeckStack'
import { OpponentSeat } from './OpponentSeat'
import { ParticleBurst } from './ParticleBurst'
import { matchProfiles } from './profiles'
import { QuestionCard } from './QuestionCard'
import type { ArenaPhase, ArenaState, MatchProfile } from './types'
import { useArenaAudio } from './useArenaAudio'
import { matchAsset } from './assetPath'
import styles from './MatchArena.module.css'

type MatchArenaProps = { questions: InterviewQuestion[] }

type ArenaAction =
  | { type: 'start'; profile: MatchProfile; question: InterviewQuestion; slot: number }
  | { type: 'phase'; phase: ArenaPhase }

const initialState: ArenaState = {
  phase: 'idle',
  selectedProfile: null,
  selectedQuestion: null,
  selectedSlot: null,
  round: 0
}

const phaseLabel: Record<ArenaPhase, string> = {
  idle: '点击轮心，召唤本局试炼',
  searching: '星盘正在巡游匹配池',
  locking: '命运指针正在锁定',
  reveal: '匹配印记已经降临',
  dealing: '题目牌库正在发牌',
  ready: '题目已揭晓，试炼开始'
}

function reducer(state: ArenaState, action: ArenaAction): ArenaState {
  if (action.type === 'start') {
    return {
      phase: 'searching',
      selectedProfile: action.profile,
      selectedQuestion: action.question,
      selectedSlot: action.slot,
      round: state.round + 1
    }
  }
  return { ...state, phase: action.phase }
}

const wait = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

export function MatchArena({ questions }: MatchArenaProps) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const reduceMotion = useReducedMotion() ?? false
  const rotation = useMotionValue(0)
  const audio = useArenaAudio(soundEnabled)
  const runningRef = useRef(false)
  const runRef = useRef(0)
  const animationRef = useRef<AnimationPlaybackControls | null>(null)
  const tickTimerRef = useRef<number | null>(null)
  const questionLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (state.phase === 'ready') questionLinkRef.current?.focus()
  }, [state.phase])

  useEffect(() => () => {
    runRef.current += 1
    animationRef.current?.stop()
    if (tickTimerRef.current !== null) window.clearInterval(tickTimerRef.current)
  }, [])

  async function startMatch() {
    if (runningRef.current || questions.length === 0) return
    runningRef.current = true
    const targetSlot = Math.floor(Math.random() * matchProfiles.length)
    const profile = matchProfiles[targetSlot]
    const question = questions[Math.floor(Math.random() * questions.length)]
    const run = ++runRef.current
    dispatch({ type: 'start', profile, question, slot: targetSlot })
    try {
      await audio.prime()
      if (run !== runRef.current) return

      const slotAngle = 360 / matchProfiles.length
      const targetAngle = ((-targetSlot * slotAngle) % 360 + 360) % 360

      if (reduceMotion) {
        await wait(360)
        if (run !== runRef.current) return
        dispatch({ type: 'phase', phase: 'locking' })
        rotation.set(targetAngle)
        await wait(360)
      } else {
        animationRef.current = animate(rotation, rotation.get() + 360, {
          duration: 0.78,
          ease: 'linear',
          repeat: Infinity
        })
        tickTimerRef.current = window.setInterval(audio.tick, 135)
        await wait(980)
        if (run !== runRef.current) return
        animationRef.current.stop()
        animationRef.current = null
        window.clearInterval(tickTimerRef.current)
        tickTimerRef.current = null
        dispatch({ type: 'phase', phase: 'locking' })

        const current = rotation.get()
        const normalized = ((current % 360) + 360) % 360
        const delta = (targetAngle - normalized + 360) % 360
        animationRef.current = animate(rotation, current + 720 + delta, {
          duration: 2.05,
          ease: [0.1, 0.7, 0.16, 1]
        })
        await animationRef.current
        animationRef.current = null
      }

      if (run !== runRef.current) return
      audio.lock()
      dispatch({ type: 'phase', phase: 'reveal' })
      await wait(reduceMotion ? 400 : 700)
      if (run !== runRef.current) return
      audio.deal()
      dispatch({ type: 'phase', phase: 'dealing' })
      await wait(reduceMotion ? 400 : 880)
      if (run !== runRef.current) return
      audio.ready()
      dispatch({ type: 'phase', phase: 'ready' })
    } finally {
      animationRef.current?.stop()
      animationRef.current = null
      if (tickTimerRef.current !== null) {
        window.clearInterval(tickTimerRef.current)
        tickTimerRef.current = null
      }
      if (run === runRef.current) runningRef.current = false
    }
  }

  function toggleSound() {
    const next = !soundEnabled
    setSoundEnabled(next)
    if (next) void audio.prime(true)
  }

  if (questions.length === 0) {
    return (
      <main className={`${styles.arena} ${styles.emptyArena}`}>
        <h1>试炼场尚未装入题目</h1>
        <p>先向题库添加题目，再回来召唤一局。</p>
        <Link href="/questions">返回题库</Link>
      </main>
    )
  }

  const liveMessage = state.phase === 'ready' && state.selectedQuestion
    ? `题目已揭晓：${state.selectedQuestion.title}`
    : state.phase === 'reveal' && state.selectedProfile
      ? `匹配到${state.selectedProfile.eyebrow}：${state.selectedProfile.label}`
      : phaseLabel[state.phase]

  return (
    <main className={`${styles.arena} ${state.phase === 'ready' ? styles.arenaReady : ''}`}>
      <img
        alt=""
        aria-hidden="true"
        className={styles.atmosphere}
        draggable="false"
        src={matchAsset('interview-match-concept-16x9.webp')}
      />
      <ArenaHud onToggleSound={toggleSound} soundEnabled={soundEnabled} />

      <div className={styles.battlefield}>
        <OpponentSeat phase={state.phase} profile={state.selectedProfile} reduceMotion={reduceMotion} />
        <div className={styles.summonAxis} aria-hidden="true" />
        <ArenaWheel
          onStart={startMatch}
          phase={state.phase}
          profiles={matchProfiles}
          reduceMotion={reduceMotion}
          rotation={rotation}
          selectedProfile={state.selectedProfile}
          selectedSlot={state.selectedSlot}
        />
        <ParticleBurst active={state.phase === 'reveal' || state.phase === 'dealing'} reduceMotion={reduceMotion} />

        {(state.phase === 'dealing' || state.phase === 'ready') && state.selectedQuestion && state.selectedProfile ? (
          <QuestionCard
            linkRef={questionLinkRef}
            onRematch={startMatch}
            phase={state.phase}
            profile={state.selectedProfile}
            question={state.selectedQuestion}
            reduceMotion={reduceMotion}
            round={state.round}
          />
        ) : null}

        <DeckStack count={questions.length} phase={state.phase} />
        <div className={styles.playerSeat}>
          <span className={styles.playerGem} aria-hidden="true">A</span>
          <p>{phaseLabel[state.phase]}</p>
          {state.phase === 'ready' && state.selectedProfile ? <small>{state.selectedProfile.modifier}</small> : null}
        </div>
      </div>

      <p className={styles.liveStatus} aria-atomic="true" aria-live="polite">{liveMessage}</p>
    </main>
  )
}
