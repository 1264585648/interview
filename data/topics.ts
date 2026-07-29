export type TopicGuide = {
  slug: string
  title: string
  summary: string
  intro: string[]
  categories: string[]
  flow: string[]
  goals: string[]
  phases: Array<{
    title: string
    description: string
    questionSlugs: string[]
  }>
}

export const topicGuides: TopicGuide[] = [
  {
    slug: 'agent-runtime',
    title: 'Agent 基础与运行时',
    summary: '先理解 Agent 为什么能动态决定下一步，再把这种不确定性约束进一个可控的 Runtime。',
    intro: [
      'Agent 面试最容易出现的问题，是把它背成“LLM + Tool + Memory”。真正重要的是控制权：谁决定下一步、状态如何变化、什么时候停止。',
      '这一专题先建立 Agent 的行为模型，再进入循环控制、错误语义、预算和停止条件。把这条线讲清楚，后面的 Tool、Memory、Evaluation 才有共同的系统框架。'
    ],
    categories: ['Agent 基础', 'Agent Runtime'],
    flow: ['目标', '状态', '决策', 'Action', 'Observation', '停止'],
    goals: [
      '能解释 Agent、Workflow 和 Tool Calling 的边界',
      '能把 Agent 描述成状态驱动的决策循环，而不是组件集合',
      '能说明无限循环、失败重试、预算和停止条件如何在 Runtime 中落地'
    ],
    phases: [
      {
        title: '01 · 先建立行为模型',
        description: '先回答谁掌握控制权、状态如何驱动下一步决策。',
        questionSlugs: ['agent-vs-workflow']
      },
      {
        title: '02 · 再约束运行时',
        description: 'Agent 能动态行动之后，必须解决循环、错误和停止问题。',
        questionSlugs: ['agent-tool-loop']
      }
    ]
  },
  {
    slug: 'tools-knowledge',
    title: '工具、协议与知识',
    summary: '理解模型如何连接外部世界，以及 Function Calling、MCP、RAG 分别处在系统的哪一层。',
    intro: [
      '让模型“会干活”通常意味着把外部能力接入推理循环，但 Tool Calling、MCP 和 RAG 解决的并不是同一个问题。',
      '这一专题重点建立边界感：模型怎样表达调用意图、协议怎样标准化能力接入、检索怎样给模型补充证据，以及什么时候需要让 Agent 动态决定是否继续检索。'
    ],
    categories: ['Tool Calling', 'MCP', 'RAG'],
    flow: ['模型', '调用意图', '协议 / Schema', '外部能力', 'Observation', '继续决策'],
    goals: [
      '能说清 Function Calling 与 MCP 的问题层级',
      '能解释 Tool Schema、执行层和权限边界',
      '能比较固定 RAG 与 Agentic RAG 的收益和代价'
    ],
    phases: [
      {
        title: '01 · 连接工具与协议',
        description: '先分清模型调用机制与工具接入协议。',
        questionSlugs: ['mcp-vs-function-calling']
      },
      {
        title: '02 · 把检索变成可决策动作',
        description: '从一次检索进入查询改写、路由、证据判断和继续检索。',
        questionSlugs: ['rag-vs-agentic-rag']
      }
    ]
  },
  {
    slug: 'memory-context',
    title: '状态、记忆与上下文',
    summary: '长任务的核心不是“记得更多”，而是在有限 Context 中选择正确的状态、记忆和证据。',
    intro: [
      'Memory 和 Context 经常被混在一起讨论。Memory 解决跨步骤或跨 Session 的信息保留，Context Engineering 解决某一次模型调用前到底应该给模型什么。',
      '这一专题从写入、检索、更新和遗忘出发，再进入上下文选择、排序、压缩和 Token Budget。重点不是存储技术，而是信息生命周期。'
    ],
    categories: ['Memory', 'Context Engineering'],
    flow: ['当前状态', '写入', '长期记忆', '检索', '压缩 / 排序', 'Context'],
    goals: [
      '能区分短期状态、长期记忆与模型上下文',
      '能说明什么信息应该写入、什么时候读取、如何更新与遗忘',
      '能在有限 Token Budget 下组织指令、历史、Memory、RAG 和 Tool 结果'
    ],
    phases: [
      {
        title: '01 · 设计 Memory 生命周期',
        description: '从“存什么”转向写入、检索、冲突和遗忘机制。',
        questionSlugs: ['agent-memory-types']
      },
      {
        title: '02 · 组织每一次模型输入',
        description: '理解 Context Engineering 为什么比 Prompt Engineering 范围更大。',
        questionSlugs: ['context-engineering']
      }
    ]
  },
  {
    slug: 'reliability-design',
    title: '评估与系统设计',
    summary: '从单个 Agent 能跑，进入如何证明它可靠、如何定位失败，以及怎样设计完整生产系统。',
    intro: [
      '生产级 Agent 的难点不是把 Demo 跑起来，而是知道它什么时候做对了、为什么做错、一次任务花了多少成本，以及失败后怎么恢复。',
      '这一专题先建立轨迹级 Evaluation，再进入完整 Agent System Design。面试时需要把 Planner、Tool、Memory、Evidence、Budget、Trace、Eval 和 Recovery 串成一个系统。'
    ],
    categories: ['Evaluation', 'System Design'],
    flow: ['任务', '执行轨迹', 'Trace', 'Evaluation', '失败恢复', '系统迭代'],
    goals: [
      '能从最终答案扩展到任务、步骤、成本和线上指标的多层评估',
      '能说明 LLM Judge、确定性规则和业务指标各自的边界',
      '能完成一个带预算、缓存、引用、恢复与可观测性的 Agent 系统设计'
    ],
    phases: [
      {
        title: '01 · 先学会评价 Agent',
        description: '没有 Trace 和 Evaluation，就无法知道复杂 Agent 到底哪里出了问题。',
        questionSlugs: ['agent-evaluation']
      },
      {
        title: '02 · 最后做完整系统设计',
        description: '把规划、搜索、证据、Context、引用和可靠性组合成生产系统。',
        questionSlugs: ['deep-research-agent']
      }
    ]
  }
]

export const getTopicGuide = (slug: string) => topicGuides.find((topic) => topic.slug === slug)

export const getTopicForCategory = (category: string) => topicGuides.find((topic) => topic.categories.includes(category))
