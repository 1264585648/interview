export type TopicGuide = {
  slug: string
  title: string
  summary: string
  intro: string[]
  categories: string[]
  flow: string[]
  goals: string[]
  phases: Array<{
    title: string
    description: string
    questionSlugs: string[]
  }>
}

export const topicGuides: TopicGuide[] = [
  {
    slug: 'agent-runtime',
    title: 'Agent Planning 与可观测性',
    summary: '理解模型与框架如何协作完成 Planning，并用 Trace 把计划、执行和状态变化串成可排障的运行轨迹。',
    intro: [
      '这一专题保留两道近期重点题：Planning 的职责边界，以及 Agent 的可观测性与故障定位。',
      '学习顺序从“计划由谁生成和管理”进入“执行出错后怎样沿 Trace 找到第一个上游失败点”。'
    ],
    categories: ['Agent Runtime'],
    flow: ['目标', 'Planner', 'Plan State', 'Execute', 'Trace', 'Failure Analysis'],
    goals: [
      '能区分大模型、Agent 框架和 Runtime 在 Planning 中的职责',
      '能比较 ReAct、Plan-and-Execute、Workflow 和混合规划',
      '能设计 Agent Trace，并用 first upstream failure 定位问题'
    ],
    phases: [
      {
        title: '01 · Planning 的职责与实现',
        description: '先回答计划由谁完成，再比较不同实现方式及其适用边界。',
        questionSlugs: ['agent-planning-replanning']
      },
      {
        title: '02 · Tracing 与故障定位',
        description: '把模型决策、Tool、Observation、State 和副作用串成完整轨迹。',
        questionSlugs: ['agent-observability-tracing']
      }
    ]
  },
  {
    slug: 'memory-context',
    title: '长期记忆冲突处理',
    summary: '当历史 Memory 与当前会话冲突时，基于权限、作用域、时效、可信度和风险做可解释决策。',
    intro: [
      '长期记忆不能被无条件相信，当前会话也不能仅凭“更新”就永久覆盖历史事实。',
      '这一专题聚焦冲突检测、临时覆盖、长期纠正、权威验证以及高风险场景中的用户确认。'
    ],
    categories: ['Memory'],
    flow: ['Current Session', 'Long-term Memory', 'Conflict Detection', 'Resolution', 'Versioned Write-back'],
    goals: [
      '能区分临时任务约束与长期偏好纠正',
      '能为 Memory 保存 source、scope、timestamp、confidence 和 version',
      '能在高风险或低置信度冲突中触发工具验证或用户确认'
    ],
    phases: [
      {
        title: '01 · 识别并解决记忆冲突',
        description: '建立可解释的冲突优先级，并区分 Session Override 与长期写回。',
        questionSlugs: ['agent-memory-conflict']
      }
    ]
  }
]

export const getTopicGuide = (slug: string) => topicGuides.find((topic) => topic.slug === slug)

export const getTopicForCategory = (category: string) => topicGuides.find((topic) => topic.categories.includes(category))
