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
  deepDive: Array<{
    title: string
    content: string
  }>
  commonMistakes: string[]
  engineeringPractice: string[]
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
    deepDive: [
      {
        title: '先看控制权放在哪里',
        content:
          'Workflow 的执行图通常在运行前已经确定：先检索、再生成、失败走重试分支，开发者决定了主要控制流。Agent 则把一部分控制权交给模型，模型根据目标、历史状态和 Observation 选择下一步 Action，因此路径可以在运行时变化。'
      },
      {
        title: 'Agent 不是“组件更多的 Workflow”',
        content:
          'Tool、Memory、RAG 都可以出现在普通 Workflow 中。判断一个系统是不是 Agent，更应该看它是否存在基于状态的动态决策循环：观察当前状态、决定动作、执行工具、读取结果，再决定继续还是结束。'
      },
      {
        title: '生产环境更关注可控性，而不是谁更高级',
        content:
          '固定流程的任务通常优先使用 Workflow，因为更容易测试、观察和控制成本；只有当任务路径无法提前穷举、需要根据环境反馈动态选择动作时，Agent 才真正有价值。很多生产系统最终会采用“外层 Workflow + 局部 Agent”的混合架构。'
      }
    ],
    commonMistakes: [
      '把 Agent 简化成“LLM + Tools + Memory”。这描述了组件，没有说明系统为什么能够自主决定下一步。',
      '说 Agent 一定比 Workflow 更高级。工程上两者是不同控制策略，稳定任务通常更适合 Workflow。',
      '只强调“Agent 会调用工具”，却没有讲状态、Observation、停止条件和动态控制流。'
    ],
    engineeringPractice: [
      '先用确定性 Workflow 覆盖稳定主路径，把真正不确定的局部步骤交给 Agent。',
      '给 Agent 设置 Max Steps、Timeout、Token Budget 和明确的 Stop Condition。',
      '保存每一步 Action、Tool Input、Observation 和最终状态，便于 tracing 与回放。',
      '高风险动作增加权限控制或 Human Approval，不让模型拥有无限制执行权。'
    ],
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
    deepDive: [
      {
        title: '循环往往不是模型“笨”，而是状态没有变化',
        content:
          'Agent 每一步都是根据当前 Context 选择动作。如果同一个 Tool 返回的 Observation 没有提供新的决策信息，或者失败结果没有明确说明“为什么失败、还能不能重试”，模型看到的状态几乎不变，就很容易重复上一步动作。'
      },
      {
        title: '停止条件必须是 Runtime 的一等能力',
        content:
          '不能只依赖模型自己说“完成了”。Runtime 需要同时约束最大步数、总耗时、Token 与费用预算，并检测重复 Tool、重复参数、连续失败等异常轨迹。达到阈值后应该降级、换策略或进入人工处理。'
      },
      {
        title: '错误语义决定模型能不能做出正确下一步',
        content:
          'Tool Timeout、权限不足、参数错误、资源不存在和业务校验失败的处理方式完全不同。工具层应返回结构化错误类型和可重试信息，而不是把所有失败都包装成一段自然语言，让模型自己猜。'
      }
    ],
    commonMistakes: [
      '只设置 Max Steps。它只能保证最终停下来，却不能解决重复调用造成的成本、延迟和错误行为。',
      '工具失败后原样重试，不区分暂时性错误和永久性错误。',
      '把停止条件全部写进 Prompt，而 Runtime 没有任何硬约束。'
    ],
    engineeringPractice: [
      '对最近 N 步的 toolName + 参数做指纹，识别连续重复动作。',
      '将 Timeout、Rate Limit、Permission Denied、Invalid Args 等错误结构化返回。',
      '设置 Max Steps、Wall-clock Timeout、Token Budget 和 Cost Budget 多重硬限制。',
      '连续失败后触发 fallback，例如换工具、重新规划、请求用户补充信息或人工升级。'
    ],
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
    deepDive: [
      {
        title: 'Memory 先按生命周期拆分',
        content:
          '短期 Memory 主要服务当前任务，例如当前计划、已执行步骤、工具结果和中间状态；长期 Memory 跨任务或跨 Session 存活，例如用户偏好、稳定事实和历史经验。两类数据的写入频率、存储介质和一致性要求通常不同。'
      },
      {
        title: '真正困难的是写入和读取策略',
        content:
          '不是所有对话都值得写入长期记忆。系统需要判断信息是否稳定、是否有长期价值、是否允许保存；读取时也不能把全部 Memory 塞进 Context，而应该根据当前任务做检索、排序、过滤和压缩。'
      },
      {
        title: 'Memory 必须允许更新和遗忘',
        content:
          '长期运行后，旧偏好可能失效，事实可能被新信息覆盖，错误 Memory 也可能持续污染后续任务。因此需要版本、时间戳、可信度、来源以及 TTL 或删除机制，并明确冲突时谁覆盖谁。'
      }
    ],
    commonMistakes: [
      '把聊天记录全部存进向量数据库，并把这件事等同于 Agent Memory。',
      '只讨论存储，不讨论什么时候写、什么时候读以及错误信息怎么删除。',
      '认为 Memory 越多越好，忽略检索噪声、隐私和 Context 成本。'
    ],
    engineeringPractice: [
      '短期状态优先使用结构化 State，而不是全部依赖自然语言摘要。',
      '长期 Memory 保存 source、timestamp、confidence 等元数据，便于更新和审计。',
      '写入前做价值判断与敏感信息过滤，读取后做 relevance rerank。',
      '为用户提供删除、纠正或禁用长期记忆的能力。'
    ],
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
    deepDive: [
      {
        title: '两者解决的问题层级不同',
        content:
          'Function Calling 解决的是模型如何输出一个结构化工具调用意图，应用再负责执行函数。MCP 更靠近集成协议层，定义客户端如何发现 Server 提供的 Tools、Resources 等能力，以及双方如何交换上下文。'
      },
      {
        title: 'MCP 的价值来自标准化连接',
        content:
          '没有统一协议时，每个 Agent 应用都需要为 GitHub、数据库、文件系统等能力写自己的适配代码。MCP 试图把“能力如何暴露给模型应用”标准化，让同一个 Server 可以被多个支持 MCP 的客户端复用。'
      },
      {
        title: 'MCP 不会替你解决业务权限',
        content:
          '协议统一并不意味着安全问题自动消失。身份、授权、租户隔离、危险操作审批和审计仍然需要在客户端、Server 或下游业务系统中明确设计。'
      }
    ],
    commonMistakes: [
      '把 MCP 说成“新的 Function Calling API”。它更关注客户端与外部能力之间的标准协议。',
      '认为用了 MCP 就不需要 REST API 或内部 SDK。MCP Server 背后仍然可以调用现有服务。',
      '只讲工具，不知道 MCP 还可以暴露其他上下文资源。'
    ],
    engineeringPractice: [
      '把稳定、可复用的外部能力封装成 MCP Server，而不是每个 Agent 重写集成。',
      'Tool Schema 保持清晰、参数可验证，并限制危险操作的权限范围。',
      'Server 层记录调用者、参数、执行结果和错误，形成完整审计链路。',
      '内部单一应用且集成简单时，不要为了协议而协议，直接 Function Calling 可能更轻量。'
    ],
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
    deepDive: [
      {
        title: '传统 RAG 的控制流通常是预设的',
        content:
          '典型流程是用户问题 → Query Embedding → TopK 检索 → 将文档拼进 Prompt → 生成答案。开发者提前决定了什么时候检索、去哪里检索以及检索几次。'
      },
      {
        title: 'Agentic RAG 把检索变成一个动作',
        content:
          '模型可以先判断当前证据是否足够，再决定改写 Query、换数据源、补一次网页搜索或停止。检索从固定中间件变成动态决策循环的一部分，因此更适合开放研究、多源信息和复杂问题。'
      },
      {
        title: '能力提升的同时，评估难度也上升',
        content:
          '多次检索会增加费用和延迟，还可能把错误证据带入后续步骤。除了最终答案，还需要评估检索次数、来源质量、证据覆盖率、引用正确性以及什么时候停止。'
      }
    ],
    commonMistakes: [
      '认为 Agentic RAG 只是“多检索几次”，却没有讲检索决策权发生了变化。',
      '默认 Agentic RAG 一定比普通 RAG 好，忽略简单知识问答的成本和稳定性。',
      '只评估最终答案，不检查检索轨迹和证据质量。'
    ],
    engineeringPractice: [
      '先以固定 RAG 作为 baseline，只有复杂问题再进入 Agentic Retrieval。',
      '为不同数据源定义适用范围、费用、延迟和可信度，用于路由。',
      '每轮检索后判断 evidence coverage，避免无意义地继续搜索。',
      '保存 Query Rewrite、检索结果、选择理由和引用映射，便于评估。'
    ],
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
    deepDive: [
      {
        title: 'Prompt 只是 Context 的一部分',
        content:
          '一个真实 Agent 的输入不仅包含 System Prompt，还会包含对话历史、当前计划、工具结果、Memory、RAG 文档和业务状态。Context Engineering 关注的是这些信息如何被选择、组织、排序和压缩。'
      },
      {
        title: '核心问题是“这一刻模型应该看到什么”',
        content:
          '长任务中所有信息都塞进去通常不是最佳策略。需要根据当前 Step 选择最相关的信息，让关键约束靠近决策位置，同时移除过期、重复和低价值内容。'
      },
      {
        title: 'Context 本质上也是资源预算',
        content:
          'Context Window 再大也有成本、延迟和注意力稀释问题，因此需要 Token Budget。系统应决定历史保留多少、检索文档占多少、工具输出是否摘要，以及哪些状态应该结构化而不是自然语言展开。'
      }
    ],
    commonMistakes: [
      '把 Context Engineering 理解成“写更长、更好的 Prompt”。',
      '认为模型窗口足够大以后，就不需要做 Context 管理。',
      '只做历史摘要，却没有处理检索结果、Memory、工具反馈之间的优先级和冲突。'
    ],
    engineeringPractice: [
      '为 System、Task State、History、Memory、Retrieval 和 Tool Output 分配明确 Token Budget。',
      '长任务使用结构化 State 保存关键事实，对旧对话进行分层摘要。',
      '检索结果先去重和 rerank，再进入模型上下文。',
      '定义信息优先级和冲突规则，例如系统约束高于用户记忆、最新事实覆盖旧事实。'
    ],
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
    deepDive: [
      {
        title: 'Agent 评估至少有结果层和轨迹层',
        content:
          '结果层回答“任务最后有没有完成”，轨迹层回答“它是怎么完成的”。两个 Agent 最终答案可能一样，但一个调用 3 次工具，另一个调用 20 次并出现多次错误，工程质量显然不同。'
      },
      {
        title: '不同指标要用不同评估器',
        content:
          '格式正确率、工具参数校验适合确定性规则；开放式回答质量可以使用人工标注或 LLM Judge；成本、延迟、失败率直接来自 tracing。不要试图用单一总分覆盖所有问题。'
      },
      {
        title: '线上指标决定系统是否真的有价值',
        content:
          '离线集只能覆盖已知场景。上线后还要观察任务成功率、用户纠错率、人工接管率、平均步骤数、费用和 P95 延迟，并把真实失败样本回流到离线评估集。'
      }
    ],
    commonMistakes: [
      '只用最终答案准确率评价 Agent，忽略工具调用和执行轨迹。',
      '完全依赖 LLM-as-a-Judge，没有确定性指标和人工校准。',
      '评估集长期不更新，导致线上新失败模式完全没有覆盖。'
    ],
    engineeringPractice: [
      '每次运行记录完整 Trace，包括模型输入、Action、Tool Result、Token、Cost 和 Latency。',
      '建立小而高质量的黄金数据集，覆盖正常路径、边界情况和故障场景。',
      '将 deterministic checks、LLM Judge 和人工 review 组合使用。',
      '线上失败自动沉淀案例，定期加入回归测试，防止版本升级引入退化。'
    ],
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
    deepDive: [
      {
        title: '先把 Research 拆成可观察的阶段',
        content:
          '入口接收研究目标后，Planner 将问题拆成多个子问题；Search 层负责查询改写和多源检索；Fetcher 获取正文；Evidence 层抽取与问题相关的事实和引用；最后由 Writer 基于证据生成报告。每个阶段都应该有明确输入输出，而不是让一个 Agent Prompt 从头跑到尾。'
      },
      {
        title: 'Evidence Store 是整个系统的核心状态',
        content:
          '网页正文不应该全部留在 Context。更合理的做法是保存来源 URL、标题、时间、事实片段、引用位置、可信度和对应子问题。后续规划和写作围绕 Evidence Store 工作，并对重复、冲突和低质量证据做处理。'
      },
      {
        title: '停止条件与预算决定它能不能上线',
        content:
          'Research Agent 很容易无限搜索。系统需要按子问题定义 evidence coverage，同时限制最大搜索轮次、总抓取量、Token、费用和整体时延。当新增搜索不再带来新的有效证据时，应结束研究而不是继续调用工具。'
      },
      {
        title: '最终报告必须能回溯到来源',
        content:
          '生成阶段不只是写得像报告，还要确保核心事实有证据支持，引用能够定位到真实来源，并在来源冲突时明确展示分歧。生产环境还需要做 citation validation，避免模型生成不存在或错位的引用。'
      }
    ],
    commonMistakes: [
      '把系统设计成一个超长 Prompt + Search Tool，缺少 Planner、Evidence Store 和明确状态。',
      '把抓取到的全文不断塞回 Context，最终导致成本和噪声失控。',
      '只关心报告生成质量，不验证来源、引用和事实覆盖率。',
      '没有预算和停止条件，研究任务可能不断搜索直到超时。'
    ],
    engineeringPractice: [
      'Planner 输出结构化子问题与优先级，允许后续根据证据动态重规划。',
      '搜索与抓取并发执行，但设置域名级限流、超时、缓存和失败重试。',
      'Evidence Store 对事实去重，并保存 provenance、时间和可信度。',
      'Context 只放当前子任务需要的证据，通过摘要和分层检索控制 Token。',
      '报告生成后执行 citation validation 与关键事实一致性检查。',
      'Tracing 覆盖每个搜索 Query、来源选择、证据抽取、Token、费用和总延迟。'
    ],
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
