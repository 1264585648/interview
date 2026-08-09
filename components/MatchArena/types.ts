import type { InterviewQuestion } from '@/data/questions'

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
