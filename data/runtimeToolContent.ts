import type { QuestionArticleEnhancement } from './questionArticles'
import type { QuestionLongform } from './questionLongform'

export const runtimeToolArticles: Record<string, QuestionArticleEnhancement> = {
  'agent-planning-replanning': {
    keyConclusion:
      'Planning 通常由大模型与 Agent Runtime 共同完成：模型负责理解和生成计划，框架负责把计划变成可验证、可调度、可恢复的执行状态。',
    answerStructure: [
      '先回答不是框架或模型二选一，而是职责分层',
      '再说明模型负责目标理解、任务拆解和动态调整',
      '说明框架负责状态、调度、校验、恢复和停止边界',
      '最后对比 ReAct、Plan-and-Execute、Workflow、分层与混合规划'
    ],
    interviewerNote:
      '如果只回答“Planning 是大模型生成计划”，会忽略计划如何进入 Runtime；如果只回答“LangGraph 负责 Planning”，又会把编排能力误当成规划能力。高质量回答要把 Planner、Plan State、Executor 和 Replanner 的职责拆开。',
    pseudoCode: `plan = planner.create(goal, constraints)
plan = runtime.validate(plan)

while not runtime.done(plan):
    step = runtime.next_ready_step(plan)
    observation = runtime.execute(step)
    runtime.checkpoint(step, observation)

    if runtime.should_replan(observation):
        plan = planner.revise(
            current_plan=plan,
            state=runtime.state,
            reason=observation.reason
        )`,
    codeCaption:
      'planner.create / revise 可以由大模型完成；validate、next_ready_step、checkpoint、预算和停止条件则更适合由确定性 Runtime 控制。',
    engineeringCase: {
      problem:
        '团队接入 Agent 框架后，默认让模型每一步重新生成完整计划。计划编号不断变化，已经完成的步骤被重复执行，失败后也无法从明确位置恢复。',
      better:
        '让模型输出带步骤 ID、依赖和完成条件的结构化计划；Runtime 保存步骤状态并默认沿原计划执行，只有关键假设失效时才把受影响部分交给模型局部 Replan。'
    },
    takeaway: '模型负责“计划什么”，框架负责“怎样把计划可靠地跑完”。'
  }
}

export const runtimeToolLongforms: Record<string, QuestionLongform> = {
  'agent-planning-replanning': {
    intro:
      '面试官问 Planning 由谁完成，真正考察的是你能否区分模型的推理能力和 Agent 框架的运行时能力。生产系统里，它们通常不是替代关系，而是协作关系。',
    sections: [
      {
        title: '先拆开 Planner 与 Runtime 的职责',
        paragraphs: [
          '大模型更擅长理解开放目标、识别约束、拆解任务和根据 Observation 调整后续路径，因此 Planner 往往由模型驱动。但模型输出的计划只是候选结构，不天然具备可执行性、一致性或恢复能力。',
          'Agent 框架或自研 Runtime 更适合定义 Plan Schema、保存步骤状态、解析依赖、调度可执行节点、执行 Tool、Checkpoint、处理超时和控制预算。框架可以承载 Planning，却不会自动替你生成正确计划。'
        ],
        judgement:
          'Planning 的生成通常偏模型侧，Planning 的治理和执行通常偏 Runtime 侧。'
      },
      {
        title: '常见实现方式不是只有一种 Planner',
        paragraphs: [
          'ReAct 在每一步根据当前 Observation 决定下一个 Action，没有独立完整计划，适合路径短、反馈密集的任务。Plan-and-Execute 先生成结构化计划，再由 Executor 执行，适合步骤较多、需要展示进度和依赖的任务。',
          '固定 Workflow 或 DAG 完全由开发者预先编排，适合稳定、可枚举的业务流程。复杂任务还可以使用分层 Planner：高层模型拆目标，低层执行器处理具体步骤；Multi-Agent Planning 则让不同角色提出、审查或执行计划。'
        ],
        judgement:
          '选择实现方式时，应先看路径是否可枚举、任务长度、反馈频率和容错要求，而不是先选一个流行框架。'
      },
      {
        title: '生产环境通常采用混合规划',
        paragraphs: [
          '完全自由的模型规划灵活，但容易产生不可执行步骤、重复动作、权限越界和计划漂移；完全固定的 Workflow 稳定，却难以处理开放目标。',
          '常见折中是外层用确定性状态图控制阶段和权限，局部节点允许模型拆解或路由；Runtime 对计划做 Schema 校验、工具可用性检查和预算评估，必要时再让模型局部修正。'
        ],
        judgement:
          '最可靠的生产方案通常不是“全模型规划”，而是模型负责不确定性，代码负责边界。'
      },
      {
        title: 'Replanning 必须由新事实触发',
        paragraphs: [
          '当 API 无权限、资源不存在、用户增加约束或证据推翻原假设时，原计划才真正失效。此时应保留已完成步骤，只修改受影响的后续部分。',
          '如果每执行一步都重新生成全部计划，系统会付出额外 Token 和延迟，也更容易重复已经完成的动作。Runtime 应记录 replan reason、旧计划版本和新计划差异，便于 Trace 和回放。'
        ],
        judgement:
          'Replan 是异常与新信息驱动的控制机制，不是每一步固定执行的仪式。'
      }
    ]
  }
}

export const getRuntimeToolLongform = (slug: string) => runtimeToolLongforms[slug]
