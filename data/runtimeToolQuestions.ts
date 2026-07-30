import type { InterviewQuestion } from './questions'

export const runtimeToolQuestions: InterviewQuestion[] = [
  {
    slug: 'agent-state-design',
    title: 'Agent Runtime 中的 State 应该如何设计？',
    category: 'Agent Runtime',
    difficulty: 4,
    frequency: '高频',
    type: '工程题',
    estimate: '4 分钟',
    topics: ['State Machine', 'Checkpoint', 'Recovery'],
    shortAnswer:
      'State 应该保存 Runtime 下一步决策真正需要相信的结构化事实，例如目标、已完成步骤、外部资源 ID、预算、失败计数和审批状态，而不是把完整聊天记录当成 State。生产环境还要让状态更新可解释、可 checkpoint、可恢复，并能回到外部业务系统确认真实副作用。',
    deepDive: [
      {
        title: '先区分 State、History 和 Context',
        content:
          'History 记录发生过什么，Context 是某一步真正送进模型的信息，而 State 是 Runtime 当前认可的结构化事实。把三者混在一起，会让模型不断从自然语言重新推断系统状态。'
      },
      {
        title: '状态更新需要可追踪和可恢复',
        content:
          '每次 Action 和 Observation 都应该产生明确的 State Transition，并在长任务中 checkpoint。进程重启后应从最后已确认状态继续，而不是重新播放全部聊天历史后让模型自己猜。'
      },
      {
        title: '外部副作用不能只相信本地状态',
        content:
          '创建订单、发送消息、修改资源等动作需要保存外部资源 ID、版本或执行状态。恢复和重试时还要能向业务系统重新确认，避免本地 State 与真实世界分叉。'
      }
    ],
    commonMistakes: [
      '把完整 messages 数组当成唯一 State，所有控制事实都依赖模型重新阅读文本。',
      '只记录当前步骤，不保存已执行副作用的资源 ID 和执行状态。',
      '有 checkpoint，但恢复后仍然重新执行已经成功的 Tool。'
    ],
    engineeringPractice: [
      '将 goal、current_step、completed_steps、budget、errors、approval 等控制字段结构化。',
      '对大 Tool Output 保存引用或摘要，避免把所有原始结果复制进 State。',
      '每次关键副作用后 checkpoint，并记录 Action、Observation 和状态版本。',
      '恢复任务时先验证外部资源状态，再决定继续、重试还是补偿。'
    ],
    keyPoints: ['Structured State', 'State Transition', 'Checkpoint', 'Recovery'],
    followUps: [
      'State 和 Memory 的边界是什么？',
      'Agent 执行中途宕机后，你会怎么恢复？',
      '多个并行 Tool 同时更新 State 时怎么避免冲突？'
    ]
  },
  {
    slug: 'agent-planning-replanning',
    title: 'Agent 为什么需要 Planning 和 Replanning？什么时候反而不该用？',
    category: 'Agent Runtime',
    difficulty: 4,
    frequency: '高频',
    type: '工程题',
    estimate: '4 分钟',
    topics: ['Planning', 'Replanning', 'Execution State'],
    shortAnswer:
      'Planning 的价值是把开放目标拆成可跟踪的步骤、依赖和完成条件；Replanning 则在 Observation 证明原计划假设失效时修改后续路径。它不是所有 Agent 的标配：短路径、稳定任务用 Workflow 更简单，Replan 也不应该每一步都重新生成整份计划。',
    deepDive: [
      {
        title: 'Plan 必须能进入 Runtime，而不是只给人看',
        content:
          '真正有用的 Plan 需要包含步骤、依赖、状态和完成条件，Runtime 才能知道当前做到哪里、哪些步骤可以并行、哪些步骤被阻塞。'
      },
      {
        title: 'Replan 应由新事实触发',
        content:
          '权限失败、关键假设变化、证据不足或用户补充约束等 Observation 才应该触发 Replan。每一步都重做全量计划会制造步骤漂移、重复工作和额外模型成本。'
      },
      {
        title: '规划本身也是成本',
        content:
          '如果任务只有两三步且路径稳定，单独 Planner 往往没有收益。只有任务开放、依赖复杂、运行时间长或反馈会改变路径时，显式 Planning 才更有价值。'
      }
    ],
    commonMistakes: [
      '把模型生成一个 Todo List 就等同于 Planning，却没有任何步骤状态和完成条件。',
      '每执行一步都重新规划完整任务，导致计划不断漂移。',
      '所有任务都先走 Planner，忽略额外 Token、延迟和失败点。'
    ],
    engineeringPractice: [
      'Plan 使用结构化步骤，记录 dependency、status、completion criteria。',
      '定义明确 Replan Trigger，例如关键资源不可用、假设失效或目标变化。',
      '优先局部修改受影响步骤，保留原计划和修改原因用于 Trace。',
      '短任务先使用确定性 Workflow，只有路径不确定时再引入 Planner。'
    ],
    keyPoints: ['Plan State', 'Dependency', 'Replan Trigger', 'Plan Drift'],
    followUps: [
      'Planner 和普通 Workflow 编排有什么区别？',
      '什么情况下应该局部 Replan，而不是重做整个 Plan？',
      '如何评价一个 Planner 生成的计划质量？'
    ]
  },
  {
    slug: 'tool-schema-design',
    title: 'Tool Schema 为什么会直接影响 Agent 的稳定性？',
    category: 'Tool Calling',
    difficulty: 3,
    frequency: '高频',
    type: '工程题',
    estimate: '3 分钟',
    topics: ['Tool Schema', 'Validation', 'Tool Selection'],
    shortAnswer:
      'Tool Schema 是模型和执行系统之间的接口契约。工具名称、描述、required、enum、范围、格式和参数边界越清楚，模型越少需要猜；但 Schema 合法不代表业务合法，执行前仍然需要服务端验证、授权和危险操作控制。',
    deepDive: [
      {
        title: '先减少工具选择歧义',
        content:
          '工具名称和描述要让模型知道什么时候应该调用、什么时候不该调用。职责重叠的 Tool 会在参数生成之前就造成错误选择。'
      },
      {
        title: '把执行语义显式写进 Schema',
        content:
          '能用 enum、required、范围、格式表达的约束不要藏在自然语言里。结构化字段越清楚，模型越不需要把业务行为全部塞进一个自由文本参数。'
      },
      {
        title: 'Schema Validation 不是权限系统',
        content:
          '参数格式合法只说明请求长得对，不说明当前用户有权限执行，也不说明业务状态允许执行。授权、业务校验和审计必须在执行层完成。'
      }
    ],
    commonMistakes: [
      '工具只有名字和几个 string 参数，没有明确 required、enum 或格式约束。',
      '把时间范围、数据源、分页等执行语义全部塞进 query 自然语言。',
      '认为模型生成了合法 JSON 就可以直接执行危险操作。'
    ],
    engineeringPractice: [
      'Tool 名称和描述明确职责、前置条件和不适用场景。',
      '使用 required、enum、min/max、format 等 Schema 约束缩小参数空间。',
      '执行前做服务端参数校验、授权和业务状态校验。',
      '错误返回使用结构化类型，告诉 Runtime 是否可修正参数或重试。'
    ],
    keyPoints: ['Schema Contract', 'Tool Selection', 'Validation', 'Authorization'],
    followUps: [
      '两个 Tool 功能很接近时，如何降低模型选错工具的概率？',
      'Tool 参数校验失败后，应该让模型怎么修正？',
      'Tool Description 能不能承担权限控制？'
    ]
  },
  {
    slug: 'tool-idempotency-retry',
    title: 'Agent 调用有副作用的 Tool，如何避免重试导致重复执行？',
    category: 'Tool Calling',
    difficulty: 4,
    frequency: '高频',
    type: '工程题',
    estimate: '4 分钟',
    topics: ['Idempotency', 'Retry', 'Side Effects'],
    shortAnswer:
      '有副作用的 Tool 不能把 Timeout 简单理解成失败，因为服务端可能已经执行成功。Runtime 应为一次逻辑 Action 生成稳定 idempotency key，超时后先查询执行状态，确认未提交并且错误可重试时才重试；高风险动作还需要审批、审计或补偿机制。',
    deepDive: [
      {
        title: 'Timeout 表示结果未知，不是操作没发生',
        content:
          '客户端没收到响应，可能是请求没到服务端，也可能是服务端已经成功但响应丢失。对创建订单、发消息、付款等 Tool，直接 retry 可能重复产生副作用。'
      },
      {
        title: '幂等键绑定逻辑 Action',
        content:
          '一次逻辑动作无论发出多少网络请求都应复用同一个 idempotency key，让业务系统识别它们属于同一次执行，并返回相同结果。'
      },
      {
        title: '部分副作用需要额外治理',
        content:
          '第三方系统可能不支持幂等，某些操作也不可逆。这时需要状态查询、补偿、事务 Outbox、审批或人工接管，而不是让模型自己决定是否重复调用。'
      }
    ],
    commonMistakes: [
      '所有 Tool 错误统一 retry 三次，不区分只读和有副作用操作。',
      '每次 retry 都生成新的请求 ID，业务系统无法识别重复动作。',
      '看到 Timeout 就认为第一次执行失败，没有查询真实业务状态。'
    ],
    engineeringPractice: [
      '为每次逻辑 Action 生成稳定 idempotency key，并在重试时复用。',
      'Tool 元数据声明 read-only、side-effect、retryable 等执行属性。',
      'Timeout 后优先查询执行状态，区分 FAILED、COMMITTED 和 UNKNOWN。',
      '不可幂等的高风险操作增加审批、补偿或人工处理流程。'
    ],
    keyPoints: ['Idempotency Key', 'Unknown Result', 'Side Effect', 'Compensation'],
    followUps: [
      '为什么 Timeout 不能直接重试？',
      '第三方 API 不支持幂等键时怎么办？',
      '幂等和分布式事务分别解决什么问题？'
    ]
  }
]
