import type { RichTextBlock } from './articleRichText'

export const memoryConflictRichText: RichTextBlock[] = [
  {
    type: 'heading',
    level: 2,
    id: 'not-latest-wins',
    content: ['冲突处理不是简单的“最新信息覆盖旧信息”']
  },
  {
    type: 'paragraph',
    content: [
      '长期记忆和当前会话出现不同值时，第一步不是比较时间，而是判断两条信息是不是在描述同一个对象、同一个属性和同一个适用范围。',
      { text: '“我平时只看 Java 岗位”', bold: true },
      ' 与 ',
      { text: '“这次帮我找 Agent 岗位”', bold: true },
      ' 可以同时成立：一个是长期偏好，一个是本次任务约束。'
    ]
  },
  {
    type: 'callout',
    tone: 'warning',
    title: '面试中的关键判断',
    content: [
      '先做 ',
      { text: 'scope resolution', code: true },
      '，再做值选择。很多所谓的 Memory 冲突，本质上是系统把 turn、session 和 long-term 三种作用域混在了一起。'
    ]
  },
  {
    type: 'heading',
    level: 2,
    id: 'priority-model',
    content: ['谁更可信，要看信息类型和权威来源']
  },
  {
    type: 'paragraph',
    content: [
      '不同类型的信息应走不同的解析路径。用户可以随时改变自己的偏好和本次任务要求，但不能通过一句自然语言改写系统安全策略，也不能让对话中的主观陈述覆盖订单、余额、审批状态等权威业务事实。'
    ]
  },
  {
    type: 'table',
    caption: '一套更稳妥的冲突优先级不是单一排序，而是先分类、再决策。',
    headers: ['冲突类型', '优先依据', '推荐处理'],
    rows: [
      ['系统规则 vs 用户信息', '权限级别', '系统与安全约束优先，用户信息不能覆盖'],
      ['当前明确指令 vs 历史偏好', '当前任务作用域', '当前会话优先，但默认只覆盖本次任务'],
      ['用户陈述 vs 业务系统事实', '权威数据源', '查询业务系统，必要时要求二次验证'],
      ['新偏好 vs 旧偏好', '明确程度、作用域、时间', '区分临时变化与永久纠正'],
      ['两条历史 Memory 冲突', '来源、时间、置信度', '版本化解析；无法判断时向用户确认'],
      ['模型推断 vs 用户明确表达', '直接证据', '明确表达优先，并降低或删除旧推断']
    ]
  },
  {
    type: 'heading',
    level: 2,
    id: 'resolution-dimensions',
    content: ['生产级解析至少要考虑五个维度']
  },
  {
    type: 'list',
    ordered: true,
    items: [
      [
        { text: 'Authority：', bold: true },
        '系统策略、权威业务状态、用户明确表达、模型推断分别处于什么权限层级。'
      ],
      [
        { text: 'Scope：', bold: true },
        '信息只对当前 turn、整个 session、特定项目生效，还是应该跨会话长期保留。'
      ],
      [
        { text: 'Recency：', bold: true },
        '在权限和作用域相同的前提下，新信息通常更有参考价值，但时间不能越过权限边界。'
      ],
      [
        { text: 'Confidence：', bold: true },
        '用户明确纠正、工具验证结果和模型从上下文推断出来的信息，置信度不能相同。'
      ],
      [
        { text: 'Risk：', bold: true },
        '推荐内容可以容忍低成本澄清，付款、退款、身份、权限等高风险动作必须验证。'
      ]
    ]
  },
  {
    type: 'quote',
    content: [
      '“当前会话优先”只适用于用户有权决定、且作用域明确的信息；“权威系统优先”适用于外部可验证事实；“询问用户”适用于系统无法安全确定的冲突。'
    ],
    attribution: '可以直接用于面试中的三段式结论'
  },
  {
    type: 'heading',
    level: 2,
    id: 'temporary-vs-permanent',
    content: ['解析结果要进入 State，写回 Memory 则必须更谨慎']
  },
  {
    type: 'paragraph',
    content: [
      '冲突解析完成后，本次任务应得到一个结构化的 ',
      { text: 'resolved value', code: true },
      '，并保存选择原因、适用范围和被压制的候选值。这样后续模型不需要再次从两段互相矛盾的文本中猜测，也能在 Trace 中解释为什么采用这个结果。'
    ]
  },
  {
    type: 'table',
    caption: 'State 更新和长期 Memory 写回是两个不同动作。',
    headers: ['用户表达', '当前任务 State', '长期 Memory'],
    rows: [
      ['“这次只看 Agent 岗位”', '写入 session override', '不修改原长期偏好'],
      ['“以后主要看 Agent 岗位”', '立即使用新偏好', '创建新版本并失效旧版本'],
      ['“我可能搬家了”', '保留不确定状态', '不覆盖已验证地址'],
      ['“把旧偏好删除”', '停止使用旧值', '执行显式删除或 tombstone']
    ]
  },
  {
    type: 'callout',
    tone: 'info',
    title: '为什么要保存 suppressed candidates',
    content: [
      '被压制的信息不能直接消失。保留其 value、source、version 和 resolution reason，才能支持审计、纠错、重新解析与用户主动恢复。'
    ]
  },
  {
    type: 'heading',
    level: 2,
    id: 'clarification-and-audit',
    content: ['无法安全决定时，确认本身就是 Runtime 的正常分支']
  },
  {
    type: 'paragraph',
    content: [
      '当两个候选值权威性接近、语义范围模糊，或者冲突会影响高风险操作时，系统应该进入 clarification 或 verification，而不是要求模型强行输出一个答案。确认结果应带来源和时间写回，避免下一次重复询问同一个问题。'
    ]
  },
  {
    type: 'list',
    items: [
      ['低风险偏好：允许本次任务临时采用当前表达，并在结果中体现作用域。'],
      ['可验证事实：调用订单、账户或权限 Tool 获取真实状态。'],
      ['高风险且无法验证：暂停动作，向用户明确展示冲突并请求确认。'],
      ['确认完成后：记录新版本、旧版本失效原因和完整审计事件。']
    ]
  }
]
