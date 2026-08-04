import type { InterviewQuestion } from './questions'

export const memoryConflictQuestions: InterviewQuestion[] = [
  {
    slug: 'agent-memory-conflict',
    title: '长期记忆与当前会话信息冲突时，Agent 应该相信谁？',
    category: 'Memory',
    difficulty: 4,
    frequency: '高频',
    type: '工程题',
    estimate: '4 分钟',
    topics: ['Memory Conflict', 'Provenance', 'Recency', 'Confidence'],
    shortAnswer:
      '不能简单规定“永远相信当前会话”或“最新信息覆盖旧信息”。系统应先区分信息类型和适用范围，再综合权限级别、来源可信度、时间、置信度与业务风险做决策。对用户偏好和当前任务约束，当前会话中的明确表达通常优先；对账户状态、订单结果等可验证事实，应以权威业务系统为准。无法安全判断时要保留冲突并向用户确认，而不是让模型自行猜测。',
    deepDive: [
      {
        title: '先判断冲突的是偏好、指令还是客观事实',
        content:
          '“我平时只看 Java 岗位”和“这次帮我找 Agent 岗位”并不一定互相否定，后者可能只是当前任务的临时约束；而“我的收货地址已经改了”和账户系统中的已验证地址冲突，则属于需要外部确认的客观事实。不同信息类型不能使用同一条覆盖规则。'
      },
      {
        title: '优先级不能只看时间，还要看来源与权限',
        content:
          '系统规则、安全策略和权威业务状态不能被普通 Memory 或一段当前对话覆盖。在用户可自主决定的偏好范围内，当前会话中的明确表达通常比历史推断和旧摘要更可信；但高风险业务事实应先查询真实系统或触发二次验证。'
      },
      {
        title: '临时覆盖和永久更新必须分开',
        content:
          '当前会话的新说法可能只对本次任务生效，也可能是对长期记忆的明确纠正。Runtime 应把 resolved value、scope 和 valid time 写入当前 State；只有满足长期写入条件时，才对旧 Memory 做版本更新、失效标记或删除。'
      },
      {
        title: '无法确定时应显式暴露不确定性',
        content:
          '当两个来源权威性接近、语义范围不清或动作风险较高时，最安全的结果不是随机选一个，而是保留候选值、记录冲突原因并向用户确认。确认结果还应回写为可审计的新版本，避免同一冲突反复出现。'
      }
    ],
    commonMistakes: [
      '直接使用“最后写入获胜”，忽略系统规则、权威业务状态和信息适用范围。',
      '把当前任务中的临时要求永久写入用户画像，导致后续 Session 持续被错误偏好污染。',
      '只把选中的一条信息放入 Context，却不记录被压制的候选值、来源和决策原因。',
      '高风险事实发生冲突时仍让模型自行判断，不查询业务系统也不向用户确认。'
    ],
    engineeringPractice: [
      '为 Memory 保存 subject、attribute、value、scope、valid_from、valid_to、source、confidence 和 version。',
      '冲突检测后先按权限与来源过滤，再比较适用范围、时效和置信度。',
      '将本次任务的 resolved value 写入结构化 State，并记录 resolution reason 与 suppressed candidates。',
      '区分 session override、long-term correction 和 verified fact update，采用不同写回策略。',
      '高风险或低置信度冲突触发工具验证、用户确认或人工审批。'
    ],
    keyPoints: ['Authority', 'Scope', 'Provenance', 'Versioning', 'Clarification'],
    followUps: [
      '当前会话中的信息是否一定比长期记忆更新、更可信？',
      '临时偏好和永久偏好应该如何区分并存储？',
      '多个 Memory 来源互相冲突时，如何设计可解释的打分与审计？',
      '高风险动作执行前，哪些冲突必须强制让用户确认？'
    ]
  }
]
