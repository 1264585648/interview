export type QuestionLongformSection = {
  title: string
  paragraphs: string[]
  judgement?: string
}

export type QuestionLongform = {
  intro: string
  sections: QuestionLongformSection[]
}

export const questionLongforms: Record<string, QuestionLongform> = {
  'agent-vs-workflow': {
    intro: '这道题最容易答成“组件清单”。真正应该先抓住的是控制流：同样有 LLM、Tool、Memory 的两个系统，只要下一步由谁决定不同，工程属性就会完全不同。',
    sections: [
      {
        title: '先把“控制权”从组件里剥离出来',
        paragraphs: [
          'Workflow 的核心特征是主要路径由开发者提前定义。即使某一步调用了 LLM，后面走分支 A 还是分支 B，也往往由代码根据结构化结果决定。模型参与了计算，但没有真正接管流程控制。',
          'Agent 则把部分控制权放到运行时。模型看到目标、当前 State 和上一步 Observation 后，决定下一步是调用搜索、读取文件、继续推理，还是结束任务。也正因为下一步不是预先完全枚举的，Agent 才需要额外的状态管理、停止条件和轨迹观测。'
        ],
        judgement: '判断是不是 Agent，最有效的问题不是“有没有 Tool”，而是“下一步动作是谁在运行时决定的”。'
      },
      {
        title: 'Agent 和 Workflow 不是二元开关，而是一条连续谱',
        paragraphs: [
          '真实系统通常不会落在两个极端。一个客服流程可以先用确定性 Workflow 做身份校验、订单查询和退款资格判断，只在“用户诉求不明确”时让 Agent 决定追问什么。反过来，一个 Agent 也可能只能在预先批准的三个工具里选择，并受到固定状态机约束。',
          '因此工程讨论里更有价值的是说明“哪些决策交给模型，哪些决策仍由代码掌握”。控制权越动态，系统越灵活，但可测试性、可复现性和成本边界通常越差。'
        ],
        judgement: '生产系统里常见的最佳形态不是“全 Agent”，而是确定性主干里嵌入少量真正需要动态决策的 Agent 节点。'
      },
      {
        title: '什么时候值得为动态控制流付出代价',
        paragraphs: [
          '如果任务路径稳定、规则明确、失败分支可以枚举，例如支付、审批、订单状态流转，Workflow 通常更合适。因为这些场景更看重确定性、审计和一致行为，而不是开放探索能力。',
          '当任务必须根据外部反馈不断重新选择路径时，Agent 才开始体现价值。例如研究任务里，第一次搜索结果可能暴露新的实体，需要改写 Query、换数据源，再判断证据是否已经足够。这里提前把所有路径写死，维护成本反而会迅速上升。'
        ],
        judgement: '不要把 Agent 当成能力升级，而要把它看成一种控制策略；只有“不确定性收益”大于“动态控制成本”时才值得引入。'
      }
    ]
  },
  'agent-tool-loop': {
    intro: '无限 Tool Calling 表面上是“模型一直调用工具”，本质上通常是 Agent 的状态机没有得到足够的新信息，同时 Runtime 又缺少硬边界。',
    sections: [
      {
        title: '为什么状态不变，会反复得到同一个动作',
        paragraphs: [
          'Agent 每一步都是在当前 Context 上重新做决策。如果上一次调用 search(query="A") 返回超时，而系统只把结果写成一句 “failed”，下一轮模型看到的任务、历史和目标几乎没有变化。对于模型来说，再执行一次同样动作甚至可能是最合理的选择。',
          '所以重复调用不一定意味着模型能力差，而可能意味着系统没有把“这次失败带来了什么新事实”编码进状态。错误类型、已尝试次数、是否可重试、替代工具是否可用，都应该成为下一次决策可以利用的信息。'
        ],
        judgement: 'Loop 的第一诊断对象应该是状态变化，而不是先去改 Prompt。'
      },
      {
        title: '错误语义决定 Agent 有没有机会做对下一步',
        paragraphs: [
          'Timeout、Rate Limit、Permission Denied、Invalid Args 和 Not Found 都叫“失败”，但后续策略完全不同。Timeout 可能适合短暂退避后重试；Invalid Args 应该重新构造参数；Permission Denied 再试十次也不会成功。',
          '如果 Tool 层把所有失败压成自然语言，模型需要自己猜错误类别；一旦猜错，循环就会继续。更稳定的设计是先由工具或 Runtime 归一化为结构化错误，再决定哪些字段暴露给模型。'
        ],
        judgement: '好的 Tool 返回值不仅是“给模型看的结果”，还是控制流协议的一部分。'
      },
      {
        title: 'Max Steps 是保险丝，不是完整的循环治理',
        paragraphs: [
          '设置 Max Steps 可以保证任务最终停下来，但如果前 18 步都在重复同一个无效调用，成本、延迟和用户体验已经失控。更早期的检测应该看 toolName + 参数指纹、连续失败次数、状态是否变化，以及单位时间内是否出现相同动作模式。',
          '达到阈值后也不能只返回“失败”。系统需要明确 fallback：换工具、重新规划、请求用户补信息、降低任务目标，或者进入 Human Escalation。停止机制真正解决的是“下一步该由谁接管”，而不仅仅是终止 while 循环。'
        ],
        judgement: '生产级 Agent 的停止条件应该同时回答两件事：什么时候停，以及停下来以后做什么。'
      }
    ]
  },
  'agent-memory-types': {
    intro: 'Memory 的难点从来不是把数据存进数据库，而是判断哪些信息值得跨步骤、跨 Session 继续影响未来决策。',
    sections: [
      {
        title: '先按生命周期区分 State 和长期 Memory',
        paragraphs: [
          '当前计划、已经调用过的工具、订单 ID、待完成步骤，这类信息首先是任务 State。它们服务当前运行，通常要求结构明确、更新及时，并不应该因为用了向量数据库就自动变成“长期记忆”。',
          '长期 Memory 则跨任务存活，例如用户稳定偏好、历史事实、反复出现的工作习惯。两者最关键的差别不是存储介质，而是生命周期和影响范围：一次错误的长期 Memory 可能污染未来很多次任务。'
        ],
        judgement: '先问“这条信息应该活多久”，再问“它存在哪里”。生命周期比向量库还是关系库更重要。'
      },
      {
        title: '真正困难的是写入门槛和读取门槛',
        paragraphs: [
          '如果每句对话都自动写入长期 Memory，临时要求很容易被误判成永久偏好。例如“今天只看 Java 岗位”可能只是本次任务约束，而不是职业方向发生了永久变化。写入前需要判断稳定性、价值、敏感性和置信度。',
          '读取同样需要门槛。即使数据库里有一千条记忆，也不代表本轮都应该进入 Context。通常需要按当前任务检索，再做 relevance 排序、冲突过滤和数量限制，否则 Memory 会从帮助模型变成新的上下文噪声。'
        ],
        judgement: 'Memory 系统的质量主要由 should_write 和 should_read 两个决策决定，而不是由“存了多少”决定。'
      },
      {
        title: '可更新、可遗忘，才是真正长期可用的记忆',
        paragraphs: [
          '长期信息天然会过期。用户偏好会变化，组织关系会变化，甚至系统过去抽取出的事实本身就是错的。因此 Memory 至少需要 source、timestamp、confidence 等元数据，才能在冲突发生时判断哪一条更可信。',
          '对于不同类型的信息，还要设计覆盖、合并、TTL 和删除策略。事实类信息可能以最新高可信来源覆盖旧值；偏好类信息可能保留历史版本；敏感信息则可能根本不允许自动写入。'
        ],
        judgement: '一个只能 append、不能纠正和删除的 Memory，长期运行后几乎一定会成为 Agent 的污染源。'
      }
    ]
  },
  'mcp-vs-function-calling': {
    intro: 'MCP 和 Function Calling 经常被放在一起，是因为它们都和“工具”有关；但两者解决的问题并不在同一层。',
    sections: [
      {
        title: 'Function Calling 更靠近模型输出接口',
        paragraphs: [
          'Function Calling 解决的是：模型不直接输出“我想查天气”这句话，而是按照 Schema 输出一个结构化调用意图，例如函数名和参数。真正执行函数、处理鉴权、记录结果，仍然是应用程序的责任。',
          '这意味着 Function Calling 可以完全存在于单个应用内部。开发者预先把若干函数描述交给模型，模型选择其中一个，应用完成执行，再把结果回传给模型。它并不要求外部工具提供统一的发现协议。'
        ],
        judgement: 'Function Calling 的核心边界是 Model ↔ Application，而不是 Application ↔ External System。'
      },
      {
        title: 'MCP 关注的是外部能力如何被统一接入',
        paragraphs: [
          '当不同客户端都要接 GitHub、文件系统、数据库和内部服务时，如果每个应用都写自己的 Adapter，会快速出现重复集成。MCP 的价值在于定义客户端如何连接 Server、发现能力并调用这些能力，让工具接入从私有约定变成更标准的协议层。',
          'MCP Server 背后仍然可以调用 REST API、SDK 或内部 RPC。协议统一的是 Agent 应用看到外部能力的方式，并不是要替代原有业务服务。'
        ],
        judgement: '把 MCP 理解成“新的 Function Calling API”会丢掉它最重要的价值：跨客户端复用和能力发现。'
      },
      {
        title: '标准协议不会自动解决权限和业务安全',
        paragraphs: [
          '一个 Server 能暴露 delete_repository 工具，并不意味着任意客户端或任意用户都应该有权限调用。身份、租户隔离、最小权限、危险操作审批和审计仍然要由业务系统明确设计。',
          '同样，如果一个内部应用只有两三个稳定函数，团队也没有跨客户端复用需求，那么直接 Function Calling 可能更简单。引入协议本身也有部署、版本和治理成本。'
        ],
        judgement: 'MCP 解决的是集成边界，不是安全边界；没有复用和互操作需求时，也不必为了“标准”强行增加一层。'
      }
    ]
  },
  'rag-vs-agentic-rag': {
    intro: 'Agentic RAG 真正增加的不是“第二次检索”，而是让检索从固定中间步骤变成可以根据证据状态动态选择的动作。',
    sections: [
      {
        title: '传统 RAG 的关键优势，其实是控制流简单',
        paragraphs: [
          '典型 RAG 会固定执行 Query 构造、检索 TopK、拼接文档、生成答案。即使中间加入 rerank 或 query rewrite，只要这些步骤在运行前已经被编排好，本质上仍然是一个确定性较强的 Workflow。',
          '这种设计的好处是延迟、成本和故障位置都比较容易预测。对于企业知识库问答、产品文档检索等稳定任务，简单链路往往已经足够，而且更容易建立 baseline。'
        ],
        judgement: '不要因为 Agentic RAG 更“高级”就默认升级；固定 RAG 本身的可预测性是一项工程优势。'
      },
      {
        title: 'Agentic RAG 把“证据是否足够”变成运行时问题',
        paragraphs: [
          '开放问题往往一次检索不够。模型可能发现当前证据只回答了一半问题，于是改写 Query、切换数据源，甚至把原问题拆成几个子问题分别搜索。此时检索已经成为 Agent 可选择的 Action。',
          '这里最关键的新状态是 Evidence Coverage：系统必须知道哪些子问题已有证据、哪些结论仍缺来源、哪些来源互相冲突。没有这层状态，“多轮检索”很容易退化成不停搜索。'
        ],
        judgement: 'Agentic RAG 的核心能力不是多搜，而是根据当前证据决定“下一次还要不要搜、搜什么”。'
      },
      {
        title: '动态检索带来的代价必须可量化',
        paragraphs: [
          '每增加一轮检索，都可能增加搜索费用、抓取延迟、上下文长度和错误证据进入系统的概率。评价时不能只看最终回答是否更好，还要看平均检索轮次、Evidence Quality、引用正确率和 P95 延迟。',
          '更稳妥的架构通常会先走便宜的固定 RAG；只有证据不足、问题复杂或需要多源验证时，才升级到 Agentic Retrieval。这样可以把开放搜索能力留给真正需要它的请求。'
        ],
        judgement: '一个好的 Agentic RAG 应该知道什么时候“不值得继续检索”。停止能力和检索能力同样重要。'
      }
    ]
  },
  'context-engineering': {
    intro: 'Context Engineering 之所以比 Prompt Engineering 更接近系统工程，是因为真实 Agent 每一步面对的输入都不是一段 Prompt，而是一组不断变化的信息源。',
    sections: [
      {
        title: '模型真正看到的是完整 Context，不只是 Prompt',
        paragraphs: [
          'System 指令、用户问题、最近历史、任务 State、长期 Memory、RAG 文档、Tool Output 都会竞争有限的 Context Window。即使每一块信息单独看都“有用”，全部塞进去也可能让最重要的约束被噪声淹没。',
          '因此 Context Engineering 的第一步是把信息源显式拆开。不同来源承担不同职责：System 提供硬约束，State 保存当前事实，Memory 提供跨任务信息，Retrieval 提供外部证据。只有边界清楚，才能定义排序和冲突规则。'
        ],
        judgement: 'Context 不是聊天记录的别名，而是模型在当前 Step 做决策时能看到的全部信息环境。'
      },
      {
        title: 'Context Builder 本身应该被当成运行时组件',
        paragraphs: [
          '长任务里，每一步需要的信息不同。搜索前可能需要研究目标和已有 Query；写报告时则需要经过筛选的 Evidence，而不是原始抓取全文。一个成熟系统会在每个 Step 动态构建 Context，而不是把同一个大 Prompt 从头传到尾。',
          '构建过程通常包含检索、去重、rerank、摘要、结构化状态展开和 Token Budget 分配。这样才能明确“哪些信息被丢掉了，以及为什么”。'
        ],
        judgement: '当 Context 由多个动态来源组成时，build_context() 和调用模型本身一样值得被测试、Tracing 和评估。'
      },
      {
        title: '更大的 Context Window 不会消灭 Context Engineering',
        paragraphs: [
          '窗口变大只能缓解“放不下”，不能自动解决注意力稀释、重复信息、事实冲突和费用问题。把 100 页低相关文档塞进去，和把 10 页高相关证据放进去，模型得到的决策环境并不等价。',
          '实际工程里还需要规定优先级，例如 System Constraint 高于历史偏好，最新可信业务状态覆盖旧 Memory，原始 Tool Result 在必要时高于摘要。冲突处理如果没有规则，最终只能让模型临场猜。'
        ],
        judgement: 'Context Engineering 的目标不是最大化输入量，而是最大化单位 Token 的决策价值。'
      }
    ]
  },
  'agent-evaluation': {
    intro: '评估 Agent 最大的误区，是把它当成普通问答模型，只检查最终输出。Agent 是一个运行过程，因此结果和轨迹必须同时被评。',
    sections: [
      {
        title: '最终答案相同，不代表两个 Agent 一样好',
        paragraphs: [
          '假设两个 Agent 都成功创建了工单。A 调用 3 次工具，没有错误；B 调用 14 次工具，中间两次参数错误、三次重复查询，最后碰巧也完成了任务。只看 Task Success，两者都是 1；但生产质量显然差很多。',
          '因此至少要拆成结果层和轨迹层。结果层关注任务是否完成、输出是否正确；轨迹层关注工具选择、参数、步骤数、恢复方式、成本和延迟。'
        ],
        judgement: 'Agent Evaluation 的基本单位不是“答案”，而应该是一次带完整 Trace 的 Run。'
      },
      {
        title: '不同指标应该交给不同评估器',
        paragraphs: [
          '参数 Schema 是否合法、是否调用了禁止工具、引用 URL 是否存在，这些问题适合 deterministic checks，因为规则明确且可重复。开放式回答是否完整、推理路径是否合理，则可能需要人工标注或 LLM Judge。',
          'LLM Judge 不是万能总分器。它本身会受 Prompt、模型版本和位置偏差影响，因此需要用人工样本做校准，并尽可能把能确定性检查的部分从 Judge 中拆出去。'
        ],
        judgement: '先判断“这个指标能不能用规则验证”，再考虑 LLM Judge；不要反过来。'
      },
      {
        title: '评估系统最终要形成线上失败回流',
        paragraphs: [
          '离线黄金集只能覆盖已知问题。上线后会出现新的用户表达、新工具错误和新的长尾路径，因此还要观察人工接管率、用户纠错率、步骤数分布、费用和 P95 延迟。',
          '真正有效的评估闭环是：线上失败被 Trace 捕获，经过归因后沉淀成新的 regression case；下一次改 Prompt、模型、Tool 或 Runtime 时重新执行。这样评估集会随着系统真实失败模式增长。'
        ],
        judgement: '评估不是发布前的一次考试，而是把线上失败持续变成下一版系统约束的机制。'
      }
    ]
  },
  'deep-research-agent': {
    intro: 'Deep Research Agent 是很典型的系统设计题：搜索只是其中一个能力，真正困难的是如何把开放探索变成可观察、可停止、可验证的工程流程。',
    sections: [
      {
        title: '第一步不是搜索，而是把研究目标拆成可验证子问题',
        paragraphs: [
          '如果把“研究某家公司 AI 战略”直接交给一个 Agent 不断 Search，系统很难判断什么时候完成。Planner 更合理的职责是把目标拆成产品、组织、投资、技术路线等子问题，并为每个子问题定义需要什么证据。',
          '拆解后，搜索层才能围绕具体缺口生成 Query。更重要的是，后续发现新证据时可以只重规划受影响的子问题，而不是重新执行整个研究任务。'
        ],
        judgement: '好的 Planner 输出的不是漂亮的大纲，而是后续系统可以检查“完成没有”的工作单元。'
      },
      {
        title: 'Evidence Store 才是长任务真正的核心状态',
        paragraphs: [
          '网页正文通常很长，而且同一事实可能出现在多个来源。把所有抓取内容直接塞回 Context，会迅速造成 Token 膨胀，也让最终结论无法追溯来源。',
          'Evidence Store 应该保存与子问题相关的事实片段，并附带 source、时间、引用位置和可信度。Planner 判断覆盖率、Writer 组织报告、Citation Validator 校验来源，都围绕这层状态工作。原始网页只是输入材料，不应该成为 Agent 唯一的“记忆”。'
        ],
        judgement: 'Deep Research 的架构分水岭，是有没有把“网页”进一步加工成可管理的 Evidence。'
      },
      {
        title: '停止条件、预算和引用验证决定系统能不能上线',
        paragraphs: [
          '开放搜索天然没有终点。系统需要同时限制每个子问题的搜索轮次、总抓取量、Token、费用和整体时延，并根据 Evidence Coverage 判断继续搜索是否还能带来新信息。',
          '最终 Writer 也不能凭 Context 自由生成引用。核心事实应当映射回 Evidence Store 中真实存在的来源，输出后再做 citation validation；来源互相冲突时，应保留分歧，而不是让模型静默选一个答案。'
        ],
        judgement: '生产级 Deep Research 的质量标准不是“写得像研究报告”，而是过程能停、事实能追、失败能复现。'
      }
    ]
  }
}

export function getQuestionLongform(slug: string) {
  return questionLongforms[slug]
}
