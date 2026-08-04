import type { ReactNode } from 'react'
import styles from './QuestionDiagram.module.css'

function Arrow() {
  return <span className={styles.arrow} aria-hidden="true">→</span>
}

function Node({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return <span className={`${styles.node} ${muted ? styles.mutedNode : ''}`}>{children}</span>
}

function Pipeline({ items }: { items: string[] }) {
  return (
    <div className={styles.pipeline}>
      {items.map((item, index) => (
        <div className={styles.pipelineItem} key={item}>
          <Node>{item}</Node>
          {index < items.length - 1 ? <Arrow /> : null}
        </div>
      ))}
    </div>
  )
}

export function QuestionDiagram({ slug }: { slug: string }) {
  switch (slug) {
    case 'agent-planning-replanning':
      return (
        <figure className={styles.figure}>
          <figcaption>
            <strong>Model Planner + Agent Runtime</strong>
            <span>模型生成和修正计划；框架负责验证、调度、状态、恢复与停止边界。</span>
          </figcaption>
          <div className={styles.loopDiagram}>
            <Pipeline items={['Goal / Constraints', 'Model Planner', 'Structured Plan', 'Runtime Execute', 'Observation']} />
            <div className={styles.returnLine}>↺ 关键假设失效 → 保留已完成步骤并局部 Replan</div>
            <div className={styles.guardRow}>
              <Node muted>Schema Validation</Node>
              <Node muted>Dependency</Node>
              <Node muted>Checkpoint</Node>
              <Node muted>Budget / Stop</Node>
            </div>
          </div>
        </figure>
      )

    case 'agent-observability-tracing':
      return (
        <figure className={styles.figure}>
          <figcaption>
            <strong>一次 Agent Task 的 Trace 结构</strong>
            <span>同一个 trace_id 串联模型决策、Tool 执行、Observation 与 State Transition。</span>
          </figcaption>
          <div className={styles.loopDiagram}>
            <Pipeline items={['User Goal', 'Model Decision', 'Tool Call', 'Observation', 'State Update', 'Final / Next Action']} />
            <div className={styles.returnLine}>↺ 每个节点形成 Span；父子关系保留“为什么发生下一步”的因果链</div>
            <div className={styles.guardRow}>
              <Node muted>trace_id / span_id</Node>
              <Node muted>state_version</Node>
              <Node muted>error_type</Node>
              <Node muted>token / latency / cost</Node>
              <Node muted>replay / alert</Node>
            </div>
          </div>
        </figure>
      )

    case 'agent-memory-conflict':
      return (
        <figure className={styles.figure}>
          <figcaption>
            <strong>Memory Conflict Resolver</strong>
            <span>先识别信息类型和作用域，再决定采用、验证、临时覆盖或写回长期记忆。</span>
          </figcaption>
          <div className={styles.loopDiagram}>
            <Pipeline items={['当前会话', '长期 Memory', '冲突检测', '优先级解析', 'Resolved State']} />
            <div className={styles.returnLine}>↺ 明确长期纠正 → 新版本写入；高风险或低置信度 → Tool 验证 / 用户确认</div>
            <div className={styles.guardRow}>
              <Node muted>Authority</Node>
              <Node muted>Scope</Node>
              <Node muted>Recency</Node>
              <Node muted>Confidence</Node>
              <Node muted>Risk</Node>
            </div>
          </div>
        </figure>
      )

    default:
      return null
  }
}
