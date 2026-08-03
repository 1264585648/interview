import type { RichTextBlock } from './articleRichText'

export const observabilityRichText: RichTextBlock[] = [
  {
    type: 'heading',
    level: 2,
    id: 'why-observability',
    content: ['为什么普通日志不够']
  },
  {
    type: 'paragraph',
    content: [
      '普通服务通常围绕一次请求观察状态码、延迟和返回值，但 Agent 的结果可能受到十几个中间步骤影响。最终回答错误，根因可能来自 ',
      { text: 'Planning', bold: true },
      '、检索、Tool 参数、Observation 解析或 State 更新。只保存输入和最终输出，只能确认“失败了”，无法解释“从哪一步开始偏离”。'
    ]
  },
  {
    type: 'callout',
    tone: 'warning',
    title: '面试中的关键判断',
    content: [
      '不要从最后一个错误开始修。应该沿 ',
      { text: 'trace_id', code: true },
      ' 回溯，找到第一个破坏正确轨迹的 ',
      { text: 'first upstream failure', bold: true },
      '。'
    ]
  },
  {
    type: 'heading',
    level: 2,
    id: 'trace-model',
    content: ['一条可调试的 Agent Trace 应该记录什么']
  },
  {
    type: 'paragraph',
    content: [
      'Trace 不是把日志数量翻倍，而是建立因果关系。一次任务使用统一的 ',
      { text: 'trace_id', code: true },
      '，模型调用、Tool Call、检索、审批和状态更新分别形成 Span，并通过父子关系串联起来。'
    ]
  },
  {
    type: 'table',
    caption: '建议把下面这些字段作为 Agent Runtime 的基础观测协议。',
    headers: ['层级', '关键字段', '要回答的问题'],
    rows: [
      ['Task Trace', 'goal、user、status、total_cost、total_latency', '整次任务是否完成，代价是多少？'],
      ['Model Span', 'model、prompt_version、state_version、token、decision', '模型当时看到了什么，为什么选择这个动作？'],
      ['Tool Span', 'tool_name、args、observation、error_type、retryable', '工具是否成功，失败能否重试？'],
      ['State Event', 'from_version、to_version、changed_fields', '哪些事实发生变化，并触发了下一步？'],
      ['Side Effect', 'resource_id、idempotency_key、business_status', '真实业务系统是否已经产生副作用？']
    ]
  },
  {
    type: 'heading',
    level: 2,
    id: 'failure-analysis',
    content: ['故障定位：先做轨迹分层，再找第一个上游失败点']
  },
  {
    type: 'list',
    ordered: true,
    items: [
      ['确认最终环境状态，而不是只相信 Agent 自己声称“完成”。'],
      ['沿父子 Span 回溯，定位最后一个正确节点和第一个异常节点。'],
      ['判断异常属于 Planning、Retrieval、Tool、State、Policy 还是业务系统。'],
      ['修复上游根因，并把对应 Trace 脱敏后加入回归测试。']
    ]
  },
  {
    type: 'quote',
    content: [
      '一个成熟的排障结论不应该是“模型偶尔会错”，而应该是“订单查询 Span 超时后，State reducer 仍把步骤标记为成功，导致后续退款动作在缺少 order_id 的状态下继续执行”。'
    ],
    attribution: '更接近生产级的故障描述'
  },
  {
    type: 'heading',
    level: 2,
    id: 'feedback-loop',
    content: ['让 Trace 进入持续改进闭环']
  },
  {
    type: 'paragraph',
    content: [
      '可观测性不应只服务事故发生后的人工排查。生产 Trace 可以经过脱敏和裁剪，转成可回放 Case、离线 Eval 数据和发布门禁。这样每个真实事故都会变成一条永久测试，而不是修完一次就消失。'
    ]
  },
  {
    type: 'list',
    items: [
      ['线上失败自动进入 failure taxonomy，统计最常见的上游失败类型。'],
      ['关键 Trace 支持 Replay，用相同输入比较不同 Prompt、模型或 Runtime 版本。'],
      ['发布前同时检查任务成功率、Tool 正确率、步骤数、成本、延迟和人工接管率。']
    ]
  }
]
