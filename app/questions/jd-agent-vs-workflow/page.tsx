import type { Metadata } from 'next'
import { JdAgentVsWorkflowPage } from './JdAgentVsWorkflowPage'

export const metadata: Metadata = {
  title: '京东真实面试题：Agent 和普通 Workflow 有什么区别？ | AgentInterview',
  description:
    '来自多份候选人公开面经的京东 Agent 二面题，围绕控制权、动态决策、状态、工具调用和工程选型拆解 Agent 与普通 Workflow 的区别。'
}

export default function Page() {
  return <JdAgentVsWorkflowPage />
}
