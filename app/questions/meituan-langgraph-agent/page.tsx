import type { Metadata } from 'next'
import { PilotQuestionDetail } from './PilotQuestionDetail'

export const metadata: Metadata = {
  title: '美团真实面试题：LangGraph 多轮对话 Agent | AgentInterview',
  description:
    '来自候选人公开面经的美团北斗大模型算法岗一面题：用 LangGraph 实现多轮对话 Agent，相比手写 Prompt 流程有哪些工程和效果优势？'
}

export default function MeituanLangGraphAgentPage() {
  return <PilotQuestionDetail />
}
