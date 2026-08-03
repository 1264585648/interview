import type { QuestionArticleEnhancement } from './questionArticles'
import type { QuestionLongform } from './questionLongform'

export const observabilityArticle: QuestionArticleEnhancement = {
  keyConclusion:
    '生产级 Agent 的可观测性，不是多打几行日志，而是把模型决策、Tool 执行、状态变化与外部副作用串成一条可检索、可回放、可比较的执行轨迹。',
  answerStructure: [
    '先说明为什么只看最终回答无法定位 Agent 故障',
    '再拆解 Trace、Span、事件和指标分别记录什么',
    '用 first upstream failure 解释故障定位方法',
    '最后说明线上 Trace 如何回流评测集与回归测试'
  ],
  interviewerNote:
    '如果答案只是“接入日志平台和监控告警”，说明你还在用普通服务的视角看 Agent。真正加分的是能把 State、Action、Observation、Tool Side Effect、Token、Latency 和错误语义放进同一条 Trace，并说明如何找到第一个上游失败点。',
  pseudoCode: `async function runAgent(task) {
  const trace = startTrace({ goal: task.goal })
  let state = createInitialState(task)

  for (let step = 0; step < MAX_STEPS; step++) {
    const decisionSpan = trace.startSpan('agent.decide', {
      step,
      stateVersion: state.version
    })
    const action = await agent.decide(buildContext(state))
    decisionSpan.end({ action, tokens: action.usage })

    if (action.type === 'final') {
      trace.end({ status: 'success', output: action.answer })
      return action.answer
    }

    const toolSpan = trace.startSpan('tool.execute', {
      step,
      tool: action.tool,
      args: redact(action.args)
    })
    const observation = await executeTool(action)
    toolSpan.end({
      status: observation.ok ? 'success' : 'error',
      errorType: observation.errorType,
      retryable: observation.retryable,
      latencyMs: observation.latencyMs
    })

    const previousVersion = state.version
    state = reduce(state, action, observation)
    trace.event('state.transition', {
      from: previousVersion,
      to: state.version,
      changedFields: diffState(state)
    })

    if (!observation.ok && !observation.retryable) {
      trace.markFirstUpstreamFailure(toolSpan.id)
      break
    }
  }

  trace.end({ status: 'escalated' })
  return escalateToHuman(trace.id, state)
}`,
  codeCaption:
    '同一条 Trace 中分别记录模型决策、Tool 执行和 State Transition。这样最终结果出错时，可以沿父子 Span 回溯，而不是在零散日志中猜测因果关系。',
  engineeringCase: {
    problem:
      '退款 Agent 最终回复“退款已提交”，但业务系统没有生成退款记录。团队只保存了最终对话和几条普通日志，一开始把问题归因于模型幻觉。后来才发现真正根因是订单查询 Tool 超时后返回了模糊字符串，Runtime 把它当成有效 Observation，状态中的 order_id 仍为空，却继续执行了退款步骤。',
    better:
      '整次任务使用统一 trace_id；订单查询、状态更新、退款调用分别作为 Span。Tool 错误结构化标记为 TIMEOUT，并记录 retryable、state_version 和 changed_fields。沿 Trace 回溯后可以立即看到第一个偏离点是订单查询失败后的错误状态更新，而不是最后的自然语言回答。'
  },
  takeaway: 'Agent 排障的目标不是找到最后一个报错，而是找到第一个让执行轨迹偏离正确路径的上游失败。'
}

export const observabilityLongform: QuestionLongform = {
  intro:
    'Agent 是一个由多次模型判断、工具调用、状态更新和外部系统交互组成的运行过程。最终输出只是整条轨迹的最后一个节点；想要稳定排障，就必须让中间决策也具备可观测性。',
  sections: [
    {
      title: '只记录 request / response，无法解释多步 Agent 为什么出错',
      paragraphs: [
        '普通接口通常可以围绕一次请求观察状态码、延迟和返回值，但 Agent 的最终结果可能受到十几个中间步骤影响。计划选错、检索证据缺失、Tool 参数错误、Observation 被误读、状态更新遗漏，最后都可能表现成同一句错误回答。',
        '因此可观测对象不能只停留在最终输出。一次运行至少要保留任务目标、模型决策、工具输入输出、状态版本、停止原因以及已经发生的外部副作用，才能还原系统在当时“看到了什么、相信了什么、为什么继续”。'
      ],
      judgement:
        'Agent 的最小可调试单元不是一次 HTTP 请求，而是一段由 State、Action、Observation 和副作用组成的执行轨迹。'
    },
    {
      title: 'Trace 负责串联因果，日志和指标负责补充证据',
      paragraphs: [
        'Trace 应为一次用户任务分配全局 trace_id，再把每次模型调用、Tool Call、检索、审批和状态写入拆成 Span。Span 之间的父子关系告诉我们哪一步触发了下一步，结构化事件则记录 state_version、错误类型、重试语义和 changed_fields。',
        '日志适合保存可搜索的事件细节，指标适合观察整体趋势，例如成功率、P95 延迟、平均 Tool Calls、Token 成本、循环率和人工接管率。三者不能互相替代：只有日志没有 Trace，很难还原因果；只有 Trace 没有指标，很难发现系统整体正在退化。'
      ],
      judgement:
        '高质量可观测性不是收集最多信息，而是让一次异常既能被指标发现，又能通过 Trace 下钻到具体决策和状态变化。'
    },
    {
      title: '故障定位要寻找 first upstream failure',
      paragraphs: [
        '最终回答错误通常只是症状。排障时应从目标结果反向检查轨迹，找到第一个让系统偏离正确路径的上游节点。例如检索阶段没有取到关键文档，那么后续模型引用错误、工具选择错误都可能只是连锁反应。',
        '为了支持这种定位，Tool 层要返回结构化错误，State Transition 要保存前后版本，外部副作用要记录资源 ID 和幂等身份。找到 first upstream failure 后，修复对象才会从“换一个更强模型”转向真正的问题组件。'
      ],
      judgement:
        '不要在最后一个错误节点上反复打补丁；先找到最早破坏正确轨迹的事实、动作或状态更新。'
    },
    {
      title: 'Trace 最终要进入评测、回放和发布门禁',
      paragraphs: [
        '一次线上事故如果只在日志平台里被关闭，下次模型、Prompt 或工具版本变化时仍可能再次出现。更成熟的闭环是把失败 Trace 脱敏后转成可重放 Case，加入离线评测集，并为对应失败模式建立确定性检查或 Judge。',
        '发布新模型或修改 Prompt 时，不仅比较最终正确率，还应比较轨迹指标：是否多调用了工具、是否出现新的错误类型、成本和延迟是否恶化、人工接管率是否上升。这样可观测性才不只是事后排障工具，也是持续改进和防止回归的基础设施。'
      ],
      judgement:
        '最有价值的 Trace 不是看完即丢，而是能被重放、归类，并永久转化为下一次发布必须通过的测试。'
    }
  ]
}
