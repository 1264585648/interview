import type { InterviewQuestion } from './questions'

export const runtimeToolQuestions: InterviewQuestion[] = [
  {
    slug: 'agent-planning-replanning',
    title: 'Agent 的 Planning 是由框架完成，还是由大模型完成？有哪些实现方式？',
    category: 'Agent Runtime',
    difficulty: 4,
    frequency: '高频',
    type: '工程题',
    estimate: '5 分钟',
    topics: ['Planning', 'Planner', 'Runtime Orchestration'],
    shortAnswer:
      'Planning 通常不是单独由框架或大模型完成，而是两者协作：大模型负责理解目标、生成或调整计划，框架和 Runtime 负责定义计划结构、保存状态、调度步骤、校验结果、处理失败并控制停止。常见实现包括隐式 ReAct、显式 Plan-and-Execute、固定 Workflow / DAG、分层 Planner、Multi-Agent Planning，以及“模型规划 + 规则约束”的混合方案。',
    deepDive: [
      {
        title: '模型更适合生成计划，框架更适合管理计划',
        content:
          '大模型擅长把开放目标拆解成步骤、根据新信息修改路径，但不适合独自承担状态一致性、并发调度、重试和停止边界。框架通常提供 State、节点、边、Checkpoint、调度器和错误处理，让模型输出的计划真正进入可执行 Runtime。'
      },
      {
        title: 'Planning 有隐式、显式和确定性三类基础形态',
        content:
          'ReAct 在每一步边思考边行动，属于隐式规划；Plan-and-Execute 先生成结构化计划再逐步执行，属于显式规划；固定 Workflow 或 DAG 则由开发者提前确定路径。复杂系统通常还会加入分层 Planner、局部 Replanning 或多个专职 Agent 协作。'
      },
      {
        title: '生产环境通常采用混合规划',
        content:
          '稳定主流程由代码或状态图约束，模型只负责无法提前穷举的拆解、路由和局部调整。这样既保留模型处理开放任务的能力，又能控制权限、成本、步骤漂移和失败恢复。'
      }
    ],
    commonMistakes: [
      '认为使用 LangGraph、AutoGen 等框架后，Planning 就自动由框架完成。框架主要提供编排能力，不会自动替代任务规划逻辑。',
      '把模型输出的一段 Todo List 当成完整 Planning，却没有步骤状态、依赖、完成条件和失败处理。',
      '所有任务都使用独立 Planner，忽略固定 Workflow 对简单稳定任务更可靠、更便宜。'
    ],
    engineeringPractice: [
      '让 Planner 输出结构化步骤，包括 id、dependency、status、completionCriteria 和 riskLevel。',
      'Runtime 负责选择可执行步骤、Checkpoint、重试、超时、预算和权限校验。',
      '只有关键假设失效、资源不可用或目标变化时触发局部 Replanning。',
      '稳定且可枚举的业务路径优先使用 Workflow，只把不确定节点交给模型规划。'
    ],
    keyPoints: ['Model vs Framework', 'Plan-and-Execute', 'ReAct', 'Hybrid Planning'],
    followUps: [
      'ReAct 和 Plan-and-Execute 分别适合什么场景？',
      'LangGraph 在 Planning 中到底负责什么？',
      '如何避免模型生成的计划不可执行或不断漂移？'
    ]
  },
  {
    slug: 'agent-observability-tracing',
    title: '如何为 Agent 设计可观测性、Tracing 和故障定位？',
    category: 'Agent Runtime',
    difficulty: 4,
    frequency: '高频',
    type: '工程题',
    estimate: '4 分钟',
    topics: ['Observability', 'Tracing', 'Failure Analysis'],
    shortAnswer:
      'Agent 的可观测性不能只靠普通日志。生产环境需要用统一 Trace 串联目标、模型决策、Tool 调用、Observation、State Transition、外部副作用以及 Token、延迟和成本指标。故障定位时应沿轨迹寻找 first upstream failure，也就是第一个让系统偏离正确路径的上游节点，而不是只修最后的错误回答。',
    deepDive: [
      {
        title: '最终回答只是整条执行轨迹的最后一个节点',
        content:
          'Agent 是多步系统。最终结果错误，根因可能是计划选错、检索缺失、Tool 参数错误、Observation 被误读，或者状态更新遗漏。如果只保存输入和最终输出，只能知道任务失败，却无法解释从哪一步开始偏离。'
      },
      {
        title: 'Trace 必须串联决策、执行和状态变化',
        content:
          '一次任务应有全局 trace_id，每次模型调用、Tool Call、检索、审批和状态写入作为 Span。Span 需要记录父子关系、state_version、结构化错误、重试语义、Token、延迟和成本，让团队可以还原系统当时看到了什么、为什么采取下一步。'
      },
      {
        title: '排障要寻找 first upstream failure',
        content:
          '最后一个报错往往只是连锁反应。应沿 Trace 回溯，找到第一个破坏正确轨迹的节点，例如关键检索缺失、Tool Timeout 被错误当成成功、或 State reducer 丢失外部资源 ID。修复这个上游失败点，才能避免后续症状重复出现。'
      }
    ],
    commonMistakes: [
      '只保存自然语言对话和零散日志，没有 trace_id、span_id、state_version 和结构化 Tool Observation。',
      '把所有失败归因于模型能力不足，不区分规划、检索、工具、状态更新和业务系统故障。',
      '线上事故处理完就结束，没有把失败 Trace 转成可重放 Case、评测集和发布回归门禁。'
    ],
    engineeringPractice: [
      '为每次任务分配 trace_id，为模型调用、Tool Call、状态更新和审批动作创建 Span。',
      '结构化记录 goal、state_version、action、tool_input、observation、error_type、latency、token 和 cost。',
      '对外部副作用保存资源 ID、幂等键和真实执行状态，支持恢复、回放和审计。',
      '建立 failure taxonomy，把线上失败 Trace 脱敏后沉淀为回归测试与 Agent Eval 数据集。'
    ],
    keyPoints: ['Trace / Span', 'State Transition', 'First Upstream Failure', 'Replay'],
    followUps: [
      'Trace 和普通日志的区别是什么？',
      '如果用户说 Agent 最近变差了，你会怎么定位？',
      '你会如何区分是模型问题、Tool 问题还是 State 问题？'
    ]
  }
]
