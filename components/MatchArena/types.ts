import type { InterviewQuestion } from '@/data/questions'

// Legacy card-arena types are kept temporarily so the old, now-unmounted
// components continue to type-check while the match page is migrated.
export type ArenaPhase = 'idle' | 'searching' | 'locking' | 'reveal' | 'dealing' | 'ready'

export type MatchProfile = {
  id: string
  label: string
  kind: 'opponent' | 'mode'
  eyebrow: string
  description: string
  modifier: string
}

export type ArenaState = {
  phase: ArenaPhase
  selectedProfile: MatchProfile | null
  selectedQuestion: InterviewQuestion | null
  selectedSlot: number | null
  round: number
}

export type MatchPhase =
  | 'idle'
  | 'searching'
  | 'domain-locked'
  | 'type-locked'
  | 'level-locked'
  | 'matched'

export type MatchResult = {
  domain: string
  type: InterviewQuestion['type']
  difficulty: InterviewQuestion['difficulty']
  topics: string[]
  estimate: string
  question: InterviewQuestion
}
