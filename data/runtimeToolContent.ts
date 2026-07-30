import type { QuestionArticleEnhancement } from './questionArticles'
import type { QuestionLongform } from './questionLongform'

export const runtimeToolArticles: Record<string, QuestionArticleEnhancement> = {
  'agent-state-design': {
    keyConclusion: 'Agent State 不是聊天记录，而是 Runtime 用来决定下一步、恢复任务和解释执行轨迹的结构化事实集合。',
    answerStructure: ['先区分 State、History 和 Context', '说明 State 应保存哪些可决策事实', '再讲更新、Checkpoint 与恢复', '最后补并发、一致性和审计边界'],
    interviewerNote: '如果只说“把历史消息存在 State 里”，说明你还停留在对话 Agent。工程上更重要的是哪些字段驱动控制流、哪些结果只存引用，以及 Runtime 如何从某个 checkpoint 继续执行。',
    pseudoCode: `state = load_or_create(run_id)\n\nwhile not state.done:\n    context = build_context(state)\n    action = agent.decide(context)\n    result = execute(action)\n    state = reduce(state, action, result)\n    checkpoint(run_id, state)`,
    codeCaption: '关键不是 state 是一个 dict 还是数据库对象，而是 reduce() 必须把一次 Action / Observation 转成明确的新状态，并且 checkpoint 后能够恢复。',
    engineeringCase: {
      problem: 'Runtime 只保存完整消息历史。任务执行到第 8 步进程重启后，系统只能把所有文本重新喂给模型，让模型自己猜哪些动作已经执行过，最终重复创建资源。',
      better: '把已完成步骤、外部资源 ID、预算、错误状态和审批结果作为结构化 State checkpoint；恢复时从明确状态继续，而不是从聊天文本重新推断。'
    },
    takeaway: 'State 保存的是“下一步决策需要相信的事实”，不是所有发生过的文本。'
  },
  'agent-planning-replanning': {
    keyConclusion: 'Planning 的价值是把开放目标变成可观察的中间状态；Replanning 的价值则是在环境反馈证明原计划失效时，局部调整路径。',
    answerStructure: ['先解释 Plan 为什么能暴露进度与依赖', '再讲什么 Observation 应触发 Replan', '说明过度 Planning 的成本', '最后给出计划粒度和停止边界'],
    interviewerNote: '“Agent 先生成 Todo List”不等于做了 Planning。面试官更想听到计划如何进入 State、步骤怎样标记完成、什么事实会让计划失效，以及 Replan 是局部修正还是每一步推倒重来。',
    pseudoCode: `plan = planner.create(goal, state)\n\nwhile not done(plan):\n    step = next_ready_step(plan, state)\n    observation = execute(step)\n    state = update(state, observation)\n\n    if invalidates_plan(observation, plan):\n        plan = planner.revise(plan, state)`,
    codeCaption: 'Replan 应该由“原计划假设失效”触发，而不是每执行一步都重新生成整份计划，否则规划本身会成为新的成本和不稳定源。',
    engineeringCase: {
      problem: '一个数据分析 Agent 每完成一个 Tool Call 都重新生成完整计划。结果步骤编号和目标不断变化，重复查询增多，而且无法判断任务究竟完成到哪里。',
      better: '计划写入结构化 State，默认按原计划推进；只有数据源不可用、关键假设变化或证据不足等事件触发局部 Replan，并保留修改原因。'
    },
    takeaway: 'Plan 负责把目标变成可检查的路径，Replan 只在事实证明路径失效时介入。'
  },
  'tool-schema-design': {
    keyConclusion: 'Tool Schema 是模型与执行系统之间的接口契约；Schema 越模糊，模型就越需要猜参数、边界和调用条件。',
    answerStructure: ['先说明 Tool Schema 是接口而不是提示词附件', '讲清名称、描述、参数和约束', '再讲服务端验证与结构化错误', '最后说明工具粒度和权限边界'],
    interviewerNote: '只说“JSON Schema 写清楚一点”不够。高质量回答会讨论 required、enum、格式约束、互斥参数、默认值、业务校验，以及为什么危险动作不能只靠描述文本限制。',
    pseudoCode: `tool = {\n  "name": "create_ticket",\n  "input": {\n    "title": "required string",\n    "priority": "enum: low | medium | high"\n  }\n}\n\nargs = validate_schema(model.tool_call.args)\nresult = authorize_and_execute(args)`,
    codeCaption: '模型负责生成候选参数，Schema 与执行层负责把候选参数约束成可执行请求；验证和授权不能交给模型自己保证。',
    engineeringCase: {
      problem: '一个 search 工具只有 query: string，却把时间范围、数据源、最大结果数和是否包含归档数据全部塞进自然语言 query。模型调用表面合法，实际语义却很难稳定。',
      better: '把真正影响执行行为的字段显式结构化，例如 source、time_range、limit，并通过 enum、范围和 required 约束减少模型猜测空间。'
    },
    takeaway: 'Tool Schema 越像真正的 API 契约，Agent 越不需要靠猜。'
  },
  'tool-idempotency-retry': {
    keyConclusion: 'Agent 可以重试“决策”，但有副作用的 Tool 不能因为模型重复调用就重复产生副作用；执行层必须提供幂等与状态确认机制。',
    answerStructure: ['先区分只读 Tool 与有副作用 Tool', '解释为什么网络超时会产生结果不确定性', '再讲 idempotency key、状态查询和重试策略', '最后补审批、审计和补偿机制'],
    interviewerNote: '如果答案只是“失败就 retry 三次”，在支付、发消息、创建资源这类场景会非常危险。面试官会看你是否意识到 Timeout 不代表服务端没执行，以及如何确认第一次调用的真实结果。',
    pseudoCode: `key = idempotency_key(run_id, action_id)\nresult = tool.execute(args, idempotency_key=key)\n\nif result.status == "UNKNOWN":\n    result = tool.get_status(idempotency_key=key)\n\nif result.retryable and not result.committed:\n    result = retry_same_key()`,
    codeCaption: '同一个逻辑 Action 的重试必须复用同一个 idempotency key。否则 Runtime 以为在重试，业务系统看到的却是两个独立请求。',
    engineeringCase: {
      problem: 'Agent 调用 create_order 后客户端超时，没有收到响应，于是重新调用一次。第一次请求其实已经成功，最终创建了两张订单。',
      better: 'Runtime 为逻辑 Action 生成稳定 idempotency key；超时先按 key 查询执行状态，确认未提交后才允许重试，并对高风险动作保留审批与审计记录。'
    },
    takeaway: 'Timeout 表示“结果未知”，不是“操作没发生”；有副作用的重试必须先解决幂等。'
  }
}

export const runtimeToolLongforms: Record<string, QuestionLongform> = {
  'agent-state-design': {
    intro: 'Agent 一旦从单轮问答进入多步执行，Runtime 就必须回答一个基础问题：系统现在究竟处于什么状态。这个 State 决定下一步、停止条件、恢复方式和可观测性。',
    sections: [
      {
        title: 'State、History 和 Context 不是同一个东西',
        paragraphs: [
          'History 记录发生过什么，Context 是某一次模型调用前真正放进去的信息，而 State 是 Runtime 当前认可的结构化事实。例如当前目标、已完成步骤、外部资源 ID、剩余预算、连续失败次数和审批状态，都比原始聊天文本更适合直接驱动控制流。',
          '如果只把完整消息历史当 State，系统会越来越依赖模型从自然语言里重新解释事实。长任务一旦重启或历史被压缩，哪些 Tool 已经执行、哪些结果仍有效就会变得模糊。'
        ],
        judgement: '真正影响下一步控制流的事实，应该尽量从文本 History 中提升为显式 State。'
      },
      {
        title: 'State 更新应该可解释、可重放',
        paragraphs: [
          '一次 Action 和 Observation 到来后，Runtime 应通过明确的更新逻辑产生新 State，例如 step 从 3 变成 4、order_id 被记录、retry_count 增加。这样 Trace 才能解释“为什么下一步发生变化”。',
          '对于长任务，还需要 checkpoint。进程崩溃后应该能从最后一个已确认状态继续，而不是把所有历史再次交给模型，让它重建世界状态。'
        ],
        judgement: 'State reducer 和 checkpoint 往往比“更聪明的 Prompt”更能决定 Agent 是否具备生产级恢复能力。'
      },
      {
        title: '外部世界才是一致性的最终来源',
        paragraphs: [
          'State 中记录“订单已创建”并不自动代表业务系统真的有这张订单。涉及外部副作用时，需要保存资源 ID、版本或执行状态，并在恢复和重试时允许重新确认。',
          '并发执行还会带来冲突：两个步骤可能同时更新同一字段，因此需要版本、锁、事件序列或其他一致性策略。具体技术可以不同，但不能默认模型生成的文本就是系统事实。'
        ],
        judgement: 'Agent State 是 Runtime 的控制事实；涉及外部副作用时，最终真相仍然要能回到业务系统验证。'
      }
    ]
  },
  'agent-planning-replanning': {
    intro: 'Planning 并不是为了让 Agent 看起来更“会思考”，而是把一个开放目标拆成 Runtime 可以跟踪、调度和判断完成度的中间结构。',
    sections: [
      {
        title: '一个有用的 Plan 必须能进入执行状态',
        paragraphs: [
          '“先调研，再分析，最后写报告”这种计划对人类可读，但对 Runtime 还不够。真正可执行的计划需要知道步骤依赖、当前状态、完成条件以及哪些步骤可以并行。',
          '当计划结构化以后，系统才能回答哪些步骤已经完成、哪个步骤被阻塞、剩余目标是什么，也才能在 Trace 里解释任务进度。'
        ],
        judgement: 'Plan 的价值不是生成一段 Todo List，而是把开放目标转成可检查的执行状态。'
      },
      {
        title: 'Replanning 应由新事实触发',
        paragraphs: [
          '执行过程会暴露计划阶段不知道的信息：某个 API 无权限、搜索结果证明假设错误、用户补充了新约束。这些 Observation 可能让原计划失效，此时需要修改后续路径。',
          '但如果每一步都重新生成完整计划，步骤会不断漂移，模型也可能重复已经完成的工作。更稳定的做法是定义触发条件，只修改被新事实影响的局部部分，并记录为什么改。'
        ],
        judgement: 'Replan 是异常和新信息驱动的控制机制，而不是每一步固定执行的仪式。'
      },
      {
        title: '简单任务不一定需要显式 Planner',
        paragraphs: [
          '两三步就能完成、路径稳定的任务，引入 Planner 会额外增加模型调用、Token 和失败点。此时确定性 Workflow 或短循环往往更直接。',
          'Planning 更适合目标开放、步骤有依赖、需要长期执行或执行结果会改变后续路径的任务。面试里应该能主动说明“什么时候不用”，而不是把 Planner 当成所有 Agent 的标配。'
        ],
        judgement: '规划本身也有成本；只有计划能显著改善可观察性或动态路径选择时，它才值得成为独立组件。'
      }
    ]
  },
  'tool-schema-design': {
    intro: 'Tool Calling 稳不稳定，很大程度上取决于模型看到的接口是否清楚。Tool Schema 不只是让输出变成 JSON，而是在缩小模型允许猜测的空间。',
    sections: [
      {
        title: 'Tool 描述首先要让“什么时候调用”足够清楚',
        paragraphs: [
          '两个工具如果名字相似、职责重叠，模型会先在工具选择阶段产生不确定性。例如 get_customer 和 search_customer 如果没有明确边界，模型可能用错误工具处理模糊输入。',
          '好的描述应说明用途、前置条件和不适用场景；高风险 Tool 还应该明确副作用，但真正的权限控制仍要留在执行层。'
        ],
        judgement: 'Tool Description 解决选择歧义，Schema 解决参数歧义，两者缺一都会把错误推给模型临场猜。'
      },
      {
        title: '把执行语义显式变成字段和约束',
        paragraphs: [
          '如果一个参数只能取 low、medium、high，就应该使用 enum，而不是让模型自由写字符串；如果 limit 必须在 1 到 100，就应该声明范围；互斥和 required 字段也应尽可能被 Schema 表达。',
          '这不仅减少格式错误，更重要的是让模型理解“哪些维度真的会改变工具行为”。把时间范围、数据源和结果数都藏进 query 文本，等于把结构化接口退化成自然语言协议。'
        ],
        judgement: '能结构化表达的业务选择，不要重新塞回自然语言参数。'
      },
      {
        title: 'Schema 验证之后仍然需要业务验证和授权',
        paragraphs: [
          'JSON Schema 能证明 priority 的取值合法，却不能证明当前用户有权限创建高优先级工单，也不能判断订单是否已经关闭。这些属于业务层验证。',
          '因此完整链路应该是模型生成候选调用、Schema 校验、授权与业务校验、执行、结构化返回。Tool Calling 只是提出动作，并不赋予模型执行权。'
        ],
        judgement: '把 Tool Call 当成“候选请求”而不是“可信命令”，是生产环境最重要的安全边界之一。'
      }
    ]
  },
  'tool-idempotency-retry': {
    intro: '只读 Tool 的重试通常只是成本问题；一旦 Tool 会付款、发消息、创建订单或修改数据，重试就会变成一致性问题。',
    sections: [
      {
        title: 'Timeout 最危险的地方是结果未知',
        paragraphs: [
          '客户端超时只能说明没有及时收到响应，不能证明服务端没有执行。create_order 在服务端成功后响应丢失，和请求根本没到服务端，在客户端都可能表现为 Timeout。',
          '如果 Runtime 简单把 Timeout 标成 retryable 并重新调用，第一次已经成功的场景就会产生重复副作用。'
        ],
        judgement: '对于有副作用的 Tool，UNKNOWN 应该是独立状态，不能粗暴等同于 FAILED。'
      },
      {
        title: '幂等键把“逻辑动作”与“网络请求”分开',
        paragraphs: [
          'Runtime 可以为一次逻辑 Action 生成稳定 idempotency key。无论网络层发出一次还是三次请求，只要 key 相同，业务服务都应该返回同一个执行结果，而不是重复创建资源。',
          '发生 Timeout 后，优先按 key 查询状态；只有确认未提交且错误允许重试时，才再次执行。这样重试的是同一个逻辑动作，而不是创建一个新动作。'
        ],
        judgement: '幂等的核心不是“不重试”，而是重复网络请求不会变成重复业务行为。'
      },
      {
        title: '不是所有副作用都能靠幂等键解决',
        paragraphs: [
          '某些第三方系统没有幂等接口，或者动作本身不可逆。这时可能需要事务 Outbox、补偿动作、执行前审批、状态查询或把副作用移到确定性 Workflow 中。',
          'Agent Runtime 至少应该知道 Tool 是否只读、是否可重试、是否有副作用，以及失败后应该查询、补偿还是人工接管。否则模型无法仅凭一段错误文本承担一致性责任。'
        ],
        judgement: '副作用治理属于 Runtime 和业务系统的共同职责，不能靠 Prompt 里的“不要重复调用”解决。'
      }
    ]
  }
}

export const getRuntimeToolLongform = (slug: string) => runtimeToolLongforms[slug]
