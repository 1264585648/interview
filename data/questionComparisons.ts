export type QuestionComparison = {
  title: string
  description: string
  headers: [string, string, string]
  rows: Array<[string, string, string]>
}

export const questionComparisons: Record<string, QuestionComparison> = {
  'agent-vs-workflow': {
    title: 'Agent 和 Workflow，真正差在哪',
    description: '不要按“组件多少”区分两者，先看控制流、运行时决策和工程约束。',
    headers: ['维度', 'Workflow', 'Agent'],
    rows: [
      ['下一步由谁决定', '开发者在代码或编排图里预先定义', '模型根据目标、状态和 Observation 动态决定'],
      ['执行路径', '主路径通常可提前枚举', '路径会随运行时反馈变化'],
      ['适合任务', '稳定、重复、规则明确的流程', '路径难穷举、需要动态选择动作的任务'],
      ['测试重点', '分支覆盖、输入输出和异常路径', '除结果外，还要评估决策轨迹、步骤数和工具选择'],
      ['生产约束', '重试、幂等、事务、超时', '额外需要 Max Steps、Budget、Loop Detection、Human Approval']
    ]
  },
  'mcp-vs-function-calling': {
    title: 'MCP 和 Function Calling 不在同一层',
    description: '一个更靠近模型如何表达调用意图，一个更靠近应用如何标准化连接外部能力。',
    headers: ['维度', 'Function Calling', 'MCP'],
    rows: [
      ['解决的问题', '模型如何输出结构化函数调用意图', '客户端如何发现、连接和调用外部能力'],
      ['主要边界', 'Model ↔ Application', 'Client ↔ MCP Server'],
      ['能力发现', '通常由应用提前注册函数 Schema', '客户端可从 Server 获取 Tools、Resources 等能力'],
      ['复用方式', '函数定义常与单个应用绑定', '同一 MCP Server 可被多个兼容客户端复用'],
      ['是否替代业务 API', '不会', '不会；Server 背后仍可调用 REST、SDK 或内部服务']
    ]
  },
  'rag-vs-agentic-rag': {
    title: '固定检索链和 Agentic Retrieval 的边界',
    description: '关键不是“搜一次还是搜多次”，而是谁决定是否检索、搜什么、何时停止。',
    headers: ['维度', '传统 RAG', 'Agentic RAG'],
    rows: [
      ['检索触发', '流程预先规定', '模型可根据当前证据决定是否检索'],
      ['Query', '通常由用户问题直接构造或固定改写', '可动态改写、拆分并选择不同数据源'],
      ['检索轮次', '固定一次或少量固定步骤', '根据 Evidence Coverage 动态继续或停止'],
      ['适合场景', '知识问答、稳定文档检索', '开放研究、多源验证、复杂问题'],
      ['主要代价', '链路简单，成本和延迟更可控', '需要额外控制搜索预算、证据质量、停止条件和轨迹评估']
    ]
  },
  'context-engineering': {
    title: 'Prompt Engineering 和 Context Engineering 的边界',
    description: 'Prompt 是模型输入的一部分；Context Engineering 关注每一步真正送进模型的完整信息环境。',
    headers: ['维度', 'Prompt Engineering', 'Context Engineering'],
    rows: [
      ['核心问题', '指令应该怎么表达', '这一刻模型应该看到什么'],
      ['处理对象', 'System / User Prompt 的措辞与结构', 'Prompt、State、History、Memory、RAG、Tool Output 等全部输入'],
      ['发生时机', '多在设计或模板层优化', '每个运行步骤都可能动态重建'],
      ['主要手段', '角色、约束、示例、输出格式', '选择、排序、去重、压缩、预算、冲突处理'],
      ['生产目标', '让指令更清楚、更稳定', '在有限 Token 和注意力预算内保留最有决策价值的信息']
    ]
  }
}

export function getQuestionComparison(slug: string) {
  return questionComparisons[slug]
}
