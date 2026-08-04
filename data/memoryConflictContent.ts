import type { QuestionArticleEnhancement } from './questionArticles'

export const memoryConflictArticle: QuestionArticleEnhancement = {
  keyConclusion:
    'Memory 冲突不能交给模型凭语感二选一。Runtime 应先识别信息类型和作用域，再按权限、来源、时效、置信度和风险解析；当前会话可以临时覆盖旧偏好，但不应自动改写权威事实或永久画像。',
  answerStructure: [
    '先否定“最新信息一律覆盖”和“长期记忆永远可信”两种绝对规则',
    '区分用户指令、偏好、推断信息与可验证业务事实',
    '给出 Authority、Scope、Recency、Confidence、Risk 五维冲突决策流程',
    '最后说明临时覆盖、永久纠正、版本失效和用户确认如何落地'
  ],
  interviewerNote:
    '只回答“相信最新信息”通常会被继续追问：当前对话能否覆盖系统安全规则？用户说订单已支付，是否比订单系统更可信？一次临时要求为什么不会污染长期画像？更成熟的回答会把信息来源、适用范围、写回策略和高风险确认机制讲清楚。',
  pseudoCode: `type MemoryCandidate = {
  value: unknown
  kind: 'instruction' | 'preference' | 'verified_fact' | 'inference'
  scope: 'turn' | 'session' | 'long_term'
  authority: number
  confidence: number
  observedAt: number
  source: string
}

async function resolveConflict(
  candidates: MemoryCandidate[],
  risk: 'low' | 'high'
) {
  const normalized = normalizeScopeAndTime(candidates)
  const authoritative = keepHighestAuthorityClass(normalized)
  const ranked = rank(authoritative, [
    'scope_match',
    'source_reliability',
    'recency',
    'confidence'
  ])

  if (risk === 'high' || isAmbiguous(ranked)) {
    return verifyWithToolOrAskUser(ranked)
  }

  const resolved = ranked[0]
  writeTaskState({
    value: resolved.value,
    reason: explainResolution(resolved, ranked),
    suppressedCandidates: ranked.slice(1)
  })

  if (isExplicitLongTermCorrection(resolved)) {
    versionedMemoryUpsert(resolved)
    invalidateSupersededMemories(resolved)
  }

  return resolved
}`,
  codeCaption:
    '解析过程先按权限级别过滤，再比较作用域、来源、时间和置信度。最终值写入当前任务 State；只有明确的长期纠正才更新长期 Memory，且旧版本不是静默覆盖，而是可追踪地失效。',
  engineeringCase: {
    problem:
      '求职 Agent 的长期记忆中保存了“用户只看 Java 后端岗位”。用户在当前会话说“这次帮我找 Agent 开发岗位”。系统采用 last-write-wins，把长期画像永久改成“只看 Agent 岗位”。几天后用户再次查 Java 岗位时，检索层仍按新画像过滤，导致大量正确职位被排除。',
    better:
      '系统把“这次”识别为 session scope，仅在当前任务 State 中覆盖岗位方向，同时保留长期偏好不变。如果用户明确说“以后主要看 Agent 岗位，请更新我的偏好”，才创建长期 Memory 新版本并让旧偏好失效。若冲突涉及薪资账户、订单状态或身份信息，则查询权威系统或要求确认，不能按对话时间直接覆盖。'
  },
  takeaway: '当前会话决定“这次怎么做”，长期记忆决定“通常怎么做”；权威事实由真实系统决定，无法确定时由确认流程决定。'
}
