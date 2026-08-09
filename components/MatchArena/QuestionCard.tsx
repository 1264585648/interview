import Link from 'next/link'
import { ArrowUpRight, RotateCw } from 'lucide-react'
import { motion } from 'motion/react'
import type { InterviewQuestion } from '@/data/questions'
import type { ArenaPhase, MatchProfile } from './types'
import styles from './MatchArena.module.css'
import { matchAsset } from './assetPath'

type QuestionCardProps = {
  linkRef: React.RefObject<HTMLAnchorElement | null>
  onRematch: () => void
  phase: Extract<ArenaPhase, 'dealing' | 'ready'>
  profile: MatchProfile
  question: InterviewQuestion
  reduceMotion: boolean
  round: number
}

export function QuestionCard({ linkRef, onRematch, phase, profile, question, reduceMotion, round }: QuestionCardProps) {
  const ready = phase === 'ready'

  return (
    <div className={styles.cardTarget}>
      <motion.div
        animate={{ rotate: 0, scale: 1, x: 0, y: 0 }}
        className={styles.cardFlight}
        initial={reduceMotion ? false : { rotate: -18, scale: 0.42, x: '-40vw', y: '38vh' }}
        key={`${question.slug}-${round}`}
        transition={{ duration: reduceMotion ? 0 : 0.78, ease: [0.16, 0.72, 0.22, 1] }}
      >
        <motion.div
          animate={{ rotateY: ready ? 180 : 0 }}
          className={styles.cardFlipper}
          transition={{ duration: reduceMotion ? 0 : 0.52, ease: [0.2, 0.75, 0.2, 1] }}
        >
          <div className={styles.cardBack} aria-hidden="true">
            <img alt="" draggable="false" src={matchAsset('interview-card-back-square.webp')} />
          </div>

          <article
            className={`${styles.cardFront} ${ready ? styles.cardFrontReady : ''}`}
            aria-hidden={!ready}
            aria-label={ready ? '抽中的面试题' : undefined}
          >
            <span className={styles.difficultyGem} aria-label={`难度 ${question.difficulty}`}>{question.difficulty}</span>
            <div className={styles.cardCrest} aria-hidden="true">A</div>
            <p className={styles.cardCategory}>{question.category}</p>
            <h2>{question.title}</h2>
            <div className={styles.cardRule}>
              <strong>{profile.label} · 本局规则</strong>
              <span>{profile.modifier}</span>
            </div>
            <p className={styles.cardSummary}>{question.shortAnswer}</p>
            <div className={styles.cardTopics} aria-label="题目关键词">
              {question.topics.slice(0, 3).map((topic) => <span key={topic}>{topic}</span>)}
            </div>
            {ready ? (
              <div className={styles.cardActions}>
                <Link ref={linkRef} href={`/questions/${question.slug}`}>
                  进入这道题 <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
                <button onClick={onRematch} type="button">
                  <RotateCw size={14} aria-hidden="true" /> 再开一局
                </button>
              </div>
            ) : null}
          </article>
        </motion.div>
      </motion.div>
    </div>
  )
}
