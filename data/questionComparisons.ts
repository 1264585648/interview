export type QuestionComparison = {
  title: string
  description: string
  headers: [string, string, string]
  rows: Array<[string, string, string]>
}

export const questionComparisons: Record<string, QuestionComparison> = {
  'agent-observability-tracing': {
    title: '普通日志排错与 Agent Trace 排错',
    description: '普通日志说明发生了什么；Agent Trace 还要解释这些事件如何沿状态和决策链产生因果关系。',
    headers: ['维度', '普通日志', 'Agent Trace'],
    rows: [
      ['组织方式', '按服务或时间输出零散事件', '一次任务使用 trace_id，步骤使用 span_id 串联'],
      ['关注对象', '请求、异常、状态码和文本消息', 'Model Decision、Tool Call、Observation、State Transition 和副作用'],
      ['故障定位', '依赖关键词搜索与人工拼接上下文', '沿父子 Span 回溯 first upstream failure'],
      ['状态解释', '通常只看到某一时刻的字段值', '保存 state_version、前后差异和触发下一步的事实'],
      ['持续改进', '事故关闭后日志通常不再使用', '失败 Trace 可脱敏回放，并进入 Eval 数据集和发布门禁']
    ]
  }
}

export function getQuestionComparison(slug: string) {
  return questionComparisons[slug]
}
