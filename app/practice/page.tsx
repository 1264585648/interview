import { LearningWorkspace } from '@/components/LearningWorkspace'
import { questions } from '@/data/questions'
import { topicGuides } from '@/data/topics'

export const metadata = {
  title: '开始训练 | AgentInterview',
  description: '通过真实题目、连续追问与结构化复盘，训练 AI Agent 工程师面试表达。'
}

export default function PracticePage() {
  return <LearningWorkspace questions={questions} topics={topicGuides} />
}
