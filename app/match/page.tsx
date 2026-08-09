import type { Metadata } from 'next'
import { MatchArena } from '@/components/MatchArena/MatchArena'
import { questions } from '@/data/questions'

export const metadata: Metadata = {
  title: '星铸试炼 | Agent Interview',
  description: '在全屏卡牌试炼场匹配面试对手或挑战模式，再从 AI Agent 工程师题库抽取题目。'
}

export default function MatchPage() {
  return <MatchArena questions={questions} />
}
