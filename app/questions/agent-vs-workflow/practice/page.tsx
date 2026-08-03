import type { Metadata } from 'next'
import { PracticeWorkspace } from './PracticeWorkspace'

export const metadata: Metadata = {
  title: '作答：Agent 和普通工作流有什么区别？ | AgentInterview',
  description: '在独立的专注作答页完成京东 Agent 高频面试题练习，并与结构化参考答案进行对照。'
}

export default function Page() {
  return <PracticeWorkspace />
}
