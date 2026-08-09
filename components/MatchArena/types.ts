import type { InterviewQuestion } from '@/data/questions'

export type ArenaPhase =
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

export type ArenaState = {
  phase: ArenaPhase
  result: MatchResult | null
}
