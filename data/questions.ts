export type InterviewQuestion = {
  slug: string
  title: string
  category: string
  difficulty: 1 | 2 | 3 | 4 | 5
  frequency: '高频' | '常见' | '进阶'
  type: '概念题' | '工程题' | '系统设计'
  estimate: string
  topics: string[]
  shortAnswer: string
  keyPoints: string[]
  followUps: string[]
}

export const questions: InterviewQuestion[] = [
  {
    slug: 'agent-vs-workflow',
    title: 'Agent 和 Workflow 最大的区别是什么？',
    category: 'Agent 基础',
    difficulty: 3,
    frequency: '高频',
    type: '概念题',
    estimate: '2 分钟',
    topics: ['Control Flow', 'Decision Making', 'State'],
    shortAnswer:
      '核心区别不是有没有 LLM 或 Tool，而是谁决定下一步执行什么。Workflow 的路径通常由开发者预先编排，Agent 则让模型基于目标、当前状态和工具结果动态决定下一步动作。',
    keyPoints: ['控制权归属', '动态决策', '状态与观察', '停止条件'],
    followUps: [
      '用了 Tool Calling 就一定算 Agent 吗？',
      '生产环境中你会优先选择 Agent 还是 Workflow？',
      'Agent 的动态控制流会带来哪些工程问题？'
    ]
  },
  {
    slug: 'agent-tool-loop',
    title: 'Agent 为什么容易陷入无限 Tool Calling 循环？',
    category: 'Agent Runtime',
    difficulty: 4,
    frequency: '高频',
    type: '工程题',
    estimate: '3 分钟',
    topics: ['Stop Condition', 'Max Steps', 'Error Handling'],
    shortAnswer:
      '常见原因是模型没有得到明确的完成信号、工具返回信息不足或重复、错误被模型误判为可重试状态。生产环境需要同时设计最大步数、预算、重复动作检测、工具错误语义和人工升级机制。',
    keyPoints: ['Max Steps', '重复动作检测', 'Token Budget', 'Human Escalation'],
    followUps: [
      '只设置 Max Steps 为什么还不够？',
      '你会如何识别 Agent 正在重复同一个无效动作？',
      '工具超时和工具业务失败应该如何区分？'
    ]
  },
  {
    slug: 'agent-memory-types',
    title: 'Agent Memory 有哪些类型？应该如何设计？',
    category: 'Memory',
    difficulty: 3,
    frequency: '高频',
    type: '工程题',
    estimate: '3 分钟',
    topics: ['Short-term Memory', 'Long-term Memory', 'Retrieval'],
    shortAnswer:
      '可以先按生命周期区分短期状态与长期记忆，再按用途区分事实、事件和用户偏好。设计重点不是“存下来”，而是写入条件、检索策略、更新冲突、过期与遗忘机制。',
    keyPoints: ['生命周期', '写入策略', '检索策略', '遗忘机制'],
    followUps: [
      '为什么 Memory 不应该全部写进向量数据库？',
      '如何避免错误记忆长期污染 Agent？',
      '跨 Session 的用户偏好应该怎么存？'
    ]
  },
  {
    slug: 'mcp-vs-function-calling',
    title: 'MCP 和传统 Function Calling 有什么区别？',
    category: 'MCP',
    difficulty: 3,
    frequency: '高频',
    type: '概念题',
    estimate: '2 分钟',
    topics: ['MCP', 'Tool Protocol', 'Function Calling'],
    shortAnswer:
      'Function Calling 更像模型与单个应用之间的工具调用机制；MCP 关注的是客户端如何用统一协议发现、连接和使用外部工具与上下文资源，从而降低不同 Agent 与工具生态之间的集成成本。',
    keyPoints: ['协议边界', '工具发现', '上下文资源', '生态互操作'],
    followUps: [
      'MCP Server 和普通 REST API 有什么区别？',
      '什么时候没有必要引入 MCP？',
      'MCP 的权限控制应该放在哪里？'
    ]
  },
  {
    slug: 'rag-vs-agentic-rag',
    title: '传统 RAG 和 Agentic RAG 有什么区别？',
    category: 'RAG',
    difficulty: 3,
    frequency: '常见',
    type: '概念题',
    estimate: '2 分钟',
    topics: ['RAG', 'Retrieval', 'Planning'],
    shortAnswer:
      '传统 RAG 往往是固定的一次或少量检索链路，而 Agentic RAG 会把检索作为可决策动作：模型可以改写查询、选择数据源、评估证据并决定是否继续检索。它能力更强，但成本、延迟和可控性也更差。',
    keyPoints: ['动态检索', 'Query Rewrite', 'Evidence', '成本与延迟'],
    followUps: [
      '如何判断是否需要继续检索？',
      '多数据源检索时如何做路由？',
      '怎样评价 Agentic RAG 是否真的优于普通 RAG？'
    ]
  },
  {
    slug: 'context-engineering',
    title: 'Context Engineering 和 Prompt Engineering 有什么区别？',
    category: 'Context Engineering',
    difficulty: 3,
    frequency: '常见',
    type: '概念题',
    estimate: '2 分钟',
    topics: ['Context', 'Prompt', 'Memory'],
    shortAnswer:
      'Prompt Engineering 主要关注如何表达指令；Context Engineering 的范围更大，关注在每一步推理前，怎样把系统指令、历史、记忆、检索结果、工具反馈和结构化状态组合成最合适的模型输入。',
    keyPoints: ['上下文选择', '信息排序', 'Token Budget', '状态压缩'],
    followUps: [
      'Context 越长为什么不一定越好？',
      '如何做长任务的上下文压缩？',
      '你会如何处理互相冲突的上下文？'
    ]
  },
  {
    slug: 'agent-evaluation',
    title: 'Agent Evaluation 应该怎么做？',
    category: 'Evaluation',
    difficulty: 4,
    frequency: '高频',
    type: '工程题',
    estimate: '4 分钟',
    topics: ['Evaluation', 'Tracing', 'Reliability'],
    shortAnswer:
      'Agent 评估不能只看最终答案，还要看任务完成率、工具选择、步骤质量、成本、延迟和失败恢复。实践中通常把离线基准、轨迹级评估、LLM Judge、确定性规则和线上业务指标组合起来。',
    keyPoints: ['Task Success', 'Trajectory', 'Cost', 'Online Metrics'],
    followUps: [
      'LLM-as-a-Judge 有哪些风险？',
      '工具调用正确率应该如何定义？',
      '离线分数提高但线上效果下降可能是什么原因？'
    ]
  },
  {
    slug: 'deep-research-agent',
    title: '如何设计一个生产级 Deep Research Agent？',
    category: 'System Design',
    difficulty: 5,
    frequency: '进阶',
    type: '系统设计',
    estimate: '10 分钟',
    topics: ['Planning', 'Search', 'Context', 'Citation', 'Evaluation'],
    shortAnswer:
      '可以拆成任务规划、搜索与抓取、证据提取、上下文压缩、冲突处理、报告生成与引用验证等模块。生产级设计还必须覆盖预算、并发、缓存、失败恢复、来源可信度和可观测性。',
    keyPoints: ['Planner', 'Evidence Store', 'Context Compression', 'Citation'],
    followUps: [
      '搜索结果超过 Context Window 怎么办？',
      '多个来源互相冲突时如何处理？',
      'Agent 怎么判断研究已经足够，可以停止？'
    ]
  }
]

export const categories = [
  '全部',
  'Agent 基础',
  'Agent Runtime',
  'Tool Calling',
  'MCP',
  'RAG',
  'Memory',
  'Context Engineering',
  'Evaluation',
  'System Design'
]

export const getQuestion = (slug: string) => questions.find((question) => question.slug === slug)
