import type { Metadata } from 'next'
import { MatchArena } from '@/components/MatchArena/MatchArena'
import { questions } from '@/data/questions'

export const metadata: Metadata = {
  title: '面试匹配 | Agent Interview',
  description: '启动 Interview Match Engine，依次锁定面试领域、题型与难度，再进入本场挑战。'
}

export default function MatchPage() {
  return <MatchArena questions={questions} />
}
