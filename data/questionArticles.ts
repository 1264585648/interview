export type QuestionArticleEnhancement = {
  keyConclusion: string
  answerStructure: string[]
  interviewerNote: string
  pseudoCode: string
  codeCaption: string
  engineeringCase: {
    problem: string
    better: string
  }
  takeaway: string
}

export const questionArticles: Record<string, QuestionArticleEnhancement> = {
  'agent-vs-workflow': {
    keyConclusion: '判断一个系统是不是 Agent，先看下一步动作的控制权在代码里，还是会根据运行时状态交给模型动态决定。',
    answerStructure: ['先定义两者的控制流差异', '说明 Tool、Memory 不是判断 Agent 的标准', '补充动态决策带来的工程代价', '最后给出“Workflow 主干 + Agent 局部”的生产取舍'],
    interviewerNote: '如果只回答“Agent = LLM + Tool + Memory”，说明你知道组件，但没有回答最关键的控制权问题。更好的回答会主动谈到状态、Observation、停止条件，以及什么时候不该用 Agent。',
    pseudoCode: `while not done:\n    action = agent.decide(state)\n    observation = tool.execute(action)\n    state = update(state, observation)\n    done = should_stop(state)`,
    codeCaption: '这段循环里真正属于 Agent 的不是 tool.execute，而是 decide(state)：下一步不是开发者在运行前写死的。',
    engineeringCase: {
      problem: '把“查库存 → 算价格 → 创建订单”这种稳定链路全部交给 Agent 决策。结果是同一业务可能走出不同路径，测试、审计和故障复现都变难。',
      better: '稳定主流程继续用确定性 Workflow，只把“用户需求不完整时该追问什么”“多个候选工具该选哪个”这类不确定局部交给 Agent。'
    },
    takeaway: '核心不是有没有 Tool，而是谁决定下一步。'
  },
  'agent-tool-loop': {
    keyConclusion: '无限 Tool Calling 的根因通常不是“模型不会停”，而是 Runtime 没有让状态产生足够变化，也没有提供硬停止边界。',
    answerStructure: ['先解释为什么相同状态会诱发相同动作', '再讲 Max Steps 等硬限制', '区分可重试错误和永久错误', '最后补充重复动作检测与人工升级'],
    interviewerNote: '如果答案只有“设置 Max Steps”，只能说明你知道兜底开关。面试官更想听到：为什么会循环、如何提前识别、错误语义怎样影响下一步，以及达到阈值后系统做什么。',
    pseudoCode: `for step in range(MAX_STEPS):\n    action = agent.decide(state)\n    if repeated(action, recent_actions):\n        return escalate("repeated_action")\n\n    result = tool.execute(action)\n    state = update(state, normalize_error(result))\n\nreturn escalate("max_steps")`,
    codeCaption: 'Max Steps 只是最后一道保险。重复动作检测和结构化错误能更早让 Runtime 发现“系统没有获得新信息”。',
    engineeringCase: {
      problem: 'Tool Timeout 后只返回字符串 “failed”。模型无法判断是临时超时、参数错误还是权限问题，于是再次调用同一个 Tool，连续消耗步骤和 Token。',
      better: '返回结构化错误，例如 { type: "TIMEOUT", retryable: true, retry_after: 2 }，并由 Runtime 记录连续失败次数；超过阈值后换策略或进入人工处理。'
    },
    takeaway: '让 Agent 停下来靠 Runtime 约束，不靠模型自觉。'
  },
  'agent-memory-types': {
    keyConclusion: 'Memory 的核心不是“存储”，而是信息在什么时候写入、什么时候被检索、如何更新，以及什么时候应该被忘掉。',
    answerStructure: ['先按生命周期区分短期状态与长期记忆', '再按用途说明事实、事件和偏好', '重点讲写入与检索策略', '最后补充冲突、TTL、删除和隐私'],
    interviewerNote: '把聊天记录写进向量库不等于做好了 Memory。面试官会继续追问写入门槛、错误记忆纠正、跨 Session 一致性和用户删除能力。',
    pseudoCode: `candidate = extract_memory(event)\nif should_write(candidate):\n    memory.upsert(\n        value=candidate.value,\n        source=event.id,\n        confidence=candidate.confidence,\n        expires_at=candidate.ttl\n    )\n\ncontext = retrieve(task, memory, top_k=5)`,
    codeCaption: 'Memory 的工程边界出现在 should_write 和 retrieve：不是每条信息都值得长期保存，也不是保存过的信息都应该进入当前 Context。',
    engineeringCase: {
      problem: '用户某次临时说“今天只看 Java 岗位”，系统把它当成永久偏好保存。之后所有求职任务都被错误过滤。',
      better: '写入时区分临时任务状态与长期偏好，长期事实带 source、timestamp、confidence 和 TTL，并允许新信息覆盖或用户主动删除。'
    },
    takeaway: 'Memory 不是记得越多越好，而是该记的能写、该用的能取、过期的能忘。'
  },
  'mcp-vs-function-calling': {
    keyConclusion: 'Function Calling 解决模型如何表达“我要调用某个函数”，MCP 解决应用如何用统一协议连接、发现和消费外部能力。',
    answerStructure: ['先说明两者所处层级不同', '解释 Function Calling 的调用意图', '解释 MCP 的协议与能力发现', '最后说明 MCP 不替代业务 API 和权限设计'],
    interviewerNote: '把 MCP 说成“新版 Function Calling”会丢分。一个成熟回答会把模型输出协议、客户端、MCP Server、下游业务服务这几层边界讲清楚。',
    pseudoCode: `# Function Calling\nmodel -> tool_call(name, args) -> app executes function\n\n# MCP\nclient -> discover server capabilities\nclient -> call tool / read resource\nserver -> invoke existing API or service`,
    codeCaption: '两条链路可以同时存在：模型仍可能通过 Function Calling 产生调用意图，而应用侧把某些外部能力通过 MCP 接入。',
    engineeringCase: {
      problem: '每个 Agent 应用分别为 GitHub、数据库和文件系统写一套私有 Tool Adapter，Schema、鉴权和错误格式各不相同。',
      better: '把稳定外部能力封装成可复用的 MCP Server；客户端统一发现和调用，但租户权限、危险操作审批和审计仍保留在业务边界。'
    },
    takeaway: 'Function Calling 是“怎么调用”，MCP 更关注“怎么标准化连接能力”。'
  },
  'rag-vs-agentic-rag': {
    keyConclusion: 'Agentic RAG 的关键变化不是检索次数更多，而是检索本身从固定步骤变成了模型可以动态决定的 Action。',
    answerStructure: ['先给传统 RAG 的固定控制流', '再指出 Agentic RAG 的检索决策权变化', '说明它适合什么复杂场景', '最后讲成本、延迟与评估代价'],
    interviewerNote: '如果只说“Agentic RAG 会多轮搜索”，还没有抓到本质。面试官会继续追问谁决定是否继续检索、证据什么时候算够，以及如何证明多轮检索值得。',
    pseudoCode: `evidence = []\nwhile not enough(evidence):\n    query = agent.rewrite(question, evidence)\n    source = agent.choose_source(query)\n    evidence += retrieve(source, query)\n\nreturn answer(question, evidence)`,
    codeCaption: 'while not enough(evidence) 是 Agentic RAG 最重要的新增控制点：系统必须定义 evidence coverage 和停止条件。',
    engineeringCase: {
      problem: '简单 FAQ 也进入多轮检索：改写 Query、搜索多个源、重新评分，再由模型决定继续。答案没明显变好，但延迟和费用翻倍。',
      better: '先用固定 RAG 做 baseline；仅在证据不足、问题需要多源验证或开放研究时升级到 Agentic Retrieval，并限制搜索轮次。'
    },
    takeaway: 'Agentic RAG 不是“多搜几次”，而是把检索决策权交给运行时 Agent。'
  },
  'context-engineering': {
    keyConclusion: 'Prompt Engineering 关注“怎么说”，Context Engineering 关注“这一刻模型到底应该看到什么”。',
    answerStructure: ['先把 Prompt 放回完整 Context 中', '列出状态、历史、Memory、RAG、Tool Output 等来源', '说明选择、排序与压缩机制', '最后补 Token Budget 和冲突优先级'],
    interviewerNote: '只说“Context Engineering 就是写更长 Prompt”基本等于没有回答。生产经验通常体现在预算、优先级、去重、摘要和结构化状态上。',
    pseudoCode: `context = build_context(\n    system=system_rules,\n    state=current_state,\n    history=summarize(history),\n    memory=retrieve_memory(task),\n    evidence=rerank(retrieval),\n    tool_output=compress(last_tool_result),\n    budget=TOKEN_BUDGET\n)`,
    codeCaption: 'build_context 本身就是一个系统组件：它需要在有限预算里选择信息，而不是把所有可用文本直接拼接。',
    engineeringCase: {
      problem: '长任务每一步都带完整历史、所有检索文档和原始 Tool Output。Context 越来越长，关键约束被淹没，费用和延迟持续上升。',
      better: '关键状态结构化保存；历史分层摘要；检索先去重和 rerank；大 Tool Output 只保留当前决策需要的字段，并按来源分配 Token Budget。'
    },
    takeaway: 'Context Engineering 的本质，是在每一步把正确的信息放到模型眼前。'
  },
  'agent-evaluation': {
    keyConclusion: 'Agent Evaluation 必须同时评结果和过程：任务做成了没有，以及它用了什么路径、成本和风险把任务做成。',
    answerStructure: ['先拆结果层与轨迹层', '按指标选择 deterministic、Judge 或人工评估', '补成本、延迟、失败恢复等 Runtime 指标', '最后说明线上失败如何回流离线集'],
    interviewerNote: '只讲准确率或只讲 LLM-as-a-Judge 都偏单薄。高质量回答会主动区分可确定验证的指标和开放式质量，并把 Trace 当作 Agent 评估的基础数据。',
    pseudoCode: `trace = run(agent, task)\nscore = {\n    "task_success": check_result(trace.output),\n    "tool_validity": check_tool_calls(trace.steps),\n    "trajectory": judge_trajectory(trace.steps),\n    "cost": trace.cost,\n    "latency": trace.latency\n}\nreturn score`,
    codeCaption: '不要先追求一个总分。先保留多维指标，定位“结果差”“路径差”还是“成本差”，再决定是否需要聚合。',
    engineeringCase: {
      problem: '新版 Agent 最终正确率从 86% 提到 90%，团队直接上线；随后发现平均 Tool Calls 从 4 次涨到 13 次，P95 延迟和费用显著恶化。',
      better: '发布门槛同时检查 Task Success、步骤数、错误率、Cost、Latency 和人工接管率；线上新失败自动进入回归集。'
    },
    takeaway: '评 Agent，既要看答案对不对，也要看它是怎么得到答案的。'
  },
  'deep-research-agent': {
    keyConclusion: '生产级 Deep Research 不是一个“会搜索的长 Prompt”，而是一条围绕 Planner、Evidence Store、预算和引用验证构建的可观察研究流水线。',
    answerStructure: ['先拆 Planner、Search、Fetch、Evidence、Writer 阶段', '说明 Evidence Store 为什么是核心状态', '再讲预算、并发、缓存和停止条件', '最后补来源可信度、引用验证与 Evaluation'],
    interviewerNote: '系统设计题里，面试官不缺一个“搜索 → 总结”的流程图。真正拉开差距的是状态放哪里、怎么并发、怎样恢复失败、何时停止，以及最终事实如何回溯来源。',
    pseudoCode: `plan = planner.decompose(goal)\nevidence = EvidenceStore()\n\nfor subtask in plan:\n    while not coverage_ok(subtask, evidence):\n        results = search(rewrite(subtask, evidence))\n        docs = fetch_with_cache(results)\n        evidence.add(extract(docs, subtask))\n        enforce_budget()\n\nreport = writer.compose(goal, evidence)\nreturn validate_citations(report, evidence)`,
    codeCaption: 'Evidence Store 把“搜索到的网页”和“可用于回答的证据”分开；enforce_budget 与 coverage_ok 则决定研究任务能否稳定结束。',
    engineeringCase: {
      problem: 'Agent 搜到网页后把全文不断追加进 Context，再继续规划和搜索。很快超过预算，而且后续结论无法确认到底来自哪个来源。',
      better: '抓取层缓存原文，Evidence Store 只保存与子问题相关的事实片段、来源、时间和引用位置；Writer 只读取筛选后的证据，并在输出后做 citation validation。'
    },
    takeaway: 'Deep Research 的核心不是搜得多，而是证据可管理、过程可停止、结论可追溯。'
  }
}

export function getQuestionArticle(slug: string) {
  return questionArticles[slug]
}
