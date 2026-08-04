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
    case 'agent-vs-workflow':
      return (
        <figure className={styles.figure}>
          <figcaption><strong>控制流差异</strong><span>Workflow 的路径由代码决定；Agent 的下一步由状态与模型动态决定。</span></figcaption>
          <div className={styles.compareGrid}>
            <div className={styles.compareLane}>
              <span className={styles.laneLabel}>Workflow</span>
              <Pipeline items={['输入', '步骤 A', '步骤 B', '输出']} />
              <p>主要分支在运行前已经写进程序。</p>
            </div>
            <div className={styles.compareLane}>
              <span className={styles.laneLabel}>Agent</span>
              <div className={styles.loopRow}>
                <Node>状态</Node><Arrow /><Node>模型决策</Node><Arrow /><Node>Action</Node><Arrow /><Node>Observation</Node>
              </div>
              <div className={styles.loopBack}>↖ 根据新状态继续决策，直到满足停止条件</div>
            </div>
          </div>
        </figure>
      )

    case 'agent-tool-loop':
      return (
        <figure className={styles.figure}>
          <figcaption><strong>Tool Calling 循环</strong><span>真正要控制的是“状态没有有效变化”时的重复决策。</span></figcaption>
          <div className={styles.loopDiagram}>
            <Pipeline items={['目标 / 当前状态', '模型选择 Tool', '执行 Tool', 'Observation']} />
            <div className={styles.returnLine}>↺ Observation 回到 Context，模型继续判断下一步</div>
            <div className={styles.guardRow}>
              <Node muted>Max Steps</Node><Node muted>重复动作检测</Node><Node muted>Timeout / Budget</Node><Node muted>Human Escalation</Node>
            </div>
          </div>
        </figure>
      )

    case 'agent-state-design':
      return (
        <figure className={styles.figure}>
          <figcaption><strong>State 驱动的 Runtime</strong><span>History 记录发生过什么；State 保存下一步控制流需要相信的事实。</span></figcaption>
          <div className={styles.loopDiagram}>
            <Pipeline items={['Structured State', 'Context Builder', '模型决策', 'Action / Observation']} />
            <div className={styles.returnLine}>↺ reducer 生成新 State；关键步骤写入 checkpoint</div>
            <div className={styles.guardRow}>
              <Node muted>completed steps</Node><Node muted>resource ids</Node><Node muted>budget</Node><Node muted>checkpoint / version</Node>
            </div>
          </div>
        </figure>
      )

    case 'agent-planning-replanning':
      return (
        <figure className={styles.figure}>
          <figcaption><strong>Plan → Execute → Replan</strong><span>默认沿计划推进，只有 Observation 让原假设失效时才修改后续路径。</span></figcaption>
          <div className={styles.loopDiagram}>
            <Pipeline items={['目标', '结构化 Plan', 'Next Ready Step', 'Execute', 'Observation']} />
            <div className={styles.returnLine}>↺ 假设失效 / 资源不可用 / 目标变化 → 局部 Replan</div>
            <div className={styles.guardRow}>
              <Node muted>Dependency</Node><Node muted>Step Status</Node><Node muted>Completion Criteria</Node><Node muted>Replan Reason</Node>
            </div>
          </div>
        </figure>
      )

    case 'agent-observability-tracing':
      return (
        <figure className={styles.figure}>
          <figcaption><strong>一次 Agent Task 的 Trace 结构</strong><span>同一个 trace_id 串联模型决策、Tool 执行、Observation 与 State Transition。</span></figcaption>
          <div className={styles.loopDiagram}>
            <Pipeline items={['User Goal', 'Model Decision', 'Tool Call', 'Observation', 'State Update', 'Final / Next Action']} />
            <div className={styles.returnLine}>↺ 每个节点形成 Span；父子关系保留“为什么发生下一步”的因果链</div>
            <div className={styles.guardRow}>
              <Node muted>trace_id / span_id</Node><Node muted>state_version</Node><Node muted>error_type</Node><Node muted>token / latency / cost</Node><Node muted>replay / alert</Node>
            </div>
          </div>
        </figure>
      )

    case 'tool-schema-design':
      return (
        <figure className={styles.figure}>
          <figcaption><strong>Tool Call 是候选请求</strong><span>模型负责提出动作，Schema、授权和业务校验负责决定它能不能执行。</span></figcaption>
          <div className={styles.loopDiagram}>
            <Pipeline items={['模型选 Tool', '生成参数', 'Schema Validation', '授权 / 业务校验', '执行']} />
            <div className={styles.guardRow}>
              <Node muted>required</Node><Node muted>enum / range</Node><Node muted>format</Node><Node muted>permission</Node>
            </div>
          </div>
        </figure>
      )

    case 'tool-idempotency-retry':
      return (
        <figure className={styles.figure}>
          <figcaption><strong>有副作用 Tool 的安全重试</strong><span>Timeout 可能代表结果未知；重试同一个逻辑 Action 必须保持同一个幂等身份。</span></figcaption>
          <div className={styles.loopDiagram}>
            <Pipeline items={['Logical Action', 'Idempotency Key', 'Tool Execute', 'Committed / Failed / Unknown']} />
            <div className={styles.returnLine}>↺ Unknown → 查询状态 → 确认未提交后才用同一 key 重试</div>
            <div className={styles.guardRow}>
              <Node muted>Side Effect</Node><Node muted>Status Query</Node><Node muted>Compensation</Node><Node muted>Approval / Audit</Node>
            </div>
          </div>
        </figure>
      )

    case 'agent-memory-types':
      return (
        <figure className={styles.figure}>
          <figcaption><strong>Memory 生命周期</strong><span>Memory 的重点不是“存下来”，而是写入、检索、更新与遗忘。</span></figcaption>
          <div className={styles.memoryGrid}>
            <div className={styles.memoryMain}>
              <Pipeline items={['当前任务', '短期状态', 'Context Builder', 'LLM']} />
            </div>
            <div className={styles.memoryStore}>
              <Node>长期 Memory</Node>
              <div className={styles.storeLinks}><span>↑ 有价值的信息写入</span><span>↓ 按任务相关性检索</span></div>
            </div>
            <div className={styles.guardRow}>
              <Node muted>source</Node><Node muted>timestamp</Node><Node muted>confidence</Node><Node muted>TTL / delete</Node>
            </div>
          </div>
        </figure>
      )

    case 'agent-memory-conflict':
      return (
        <figure className={styles.figure}>
          <figcaption><strong>Memory Conflict Resolver</strong><span>先识别信息类型和作用域，再决定采用、验证、临时覆盖或写回长期记忆。</span></figcaption>
          <div className={styles.loopDiagram}>
            <Pipeline items={['当前会话', '长期 Memory', '冲突检测', '优先级解析', 'Resolved State']} />
            <div className={styles.returnLine}>↺ 明确长期纠正 → 新版本写入；高风险或低置信度 → Tool 验证 / 用户确认</div>
            <div className={styles.guardRow}>
              <Node muted>Authority</Node><Node muted>Scope</Node><Node muted>Recency</Node><Node muted>Confidence</Node><Node muted>Risk</Node>
            </div>
          </div>
        </figure>
      )

    case 'mcp-vs-function-calling':
      return (
        <figure className={styles.figure}>
          <figcaption><strong>两者处在不同层级</strong><span>Function Calling 描述调用意图；MCP 标准化客户端如何连接外部能力。</span></figcaption>
          <div className={styles.compareGrid}>
            <div className={styles.compareLane}>
              <span className={styles.laneLabel}>Function Calling</span>
              <Pipeline items={['LLM', '结构化调用', '应用代码', '函数 / API']} />
            </div>
            <div className={styles.compareLane}>
              <span className={styles.laneLabel}>MCP</span>
              <Pipeline items={['Agent Client', 'MCP 协议', 'MCP Server', 'Tools / Resources']} />
            </div>
          </div>
        </figure>
      )

    case 'rag-vs-agentic-rag':
      return (
        <figure className={styles.figure}>
          <figcaption><strong>固定检索 vs 可决策检索</strong><span>Agentic RAG 把“是否检索、去哪检索、是否继续检索”变成动作。</span></figcaption>
          <div className={styles.compareGrid}>
            <div className={styles.compareLane}>
              <span className={styles.laneLabel}>传统 RAG</span>
              <Pipeline items={['Query', 'Retrieve', 'Context', 'Answer']} />
            </div>
            <div className={styles.compareLane}>
              <span className={styles.laneLabel}>Agentic RAG</span>
              <Pipeline items={['任务', '选择数据源', '检索', '评估证据']} />
              <div className={styles.loopBack}>↖ 证据不足：改写 Query / 换数据源 / 继续检索</div>
            </div>
          </div>
        </figure>
      )

    case 'context-engineering':
      return (
        <figure className={styles.figure}>
          <figcaption><strong>Context Builder</strong><span>Prompt 只是其中一块，真正的问题是每次调用前“给模型什么”。</span></figcaption>
          <div className={styles.contextDiagram}>
            <div className={styles.sourceGrid}>
              {['System', 'History', 'Memory', 'RAG', 'Tool Result', 'Structured State'].map((item) => <Node muted key={item}>{item}</Node>)}
            </div>
            <div className={styles.downArrow}>↓ 选择 · 排序 · 压缩 · 冲突处理</div>
            <Pipeline items={['Context Builder', '有限 Token Budget', 'LLM']} />
          </div>
        </figure>
      )

    case 'agent-evaluation':
      return (
        <figure className={styles.figure}>
          <figcaption><strong>Agent Evaluation 不是只看最终答案</strong><span>复杂 Agent 需要从任务结果一路看到执行轨迹、成本和失败恢复。</span></figcaption>
          <div className={styles.loopDiagram}>
            <Pipeline items={['Task', 'Execution Trace', 'Evaluators', 'Metrics']} />
            <div className={styles.guardRow}>
              <Node muted>Task Success</Node><Node muted>Tool Choice</Node><Node muted>Trajectory</Node><Node muted>Cost / Latency</Node>
            </div>
            <div className={styles.returnLine}>↺ 失败样本进入数据集与系统改进，再重新评估</div>
          </div>
        </figure>
      )

    case 'deep-research-agent':
      return (
        <figure className={styles.figure}>
          <figcaption><strong>Deep Research Agent 主链路</strong><span>生产级设计的核心是证据流，而不是让一个模型从搜索一路写到结论。</span></figcaption>
          <div className={styles.researchDiagram}>
            <Pipeline items={['拆解任务', 'Search', 'Evidence Store', '压缩 / 去重', 'Synthesis', '引用校验']} />
            <div className={styles.guardRow}>
              <Node muted>Budget</Node><Node muted>Source Quality</Node><Node muted>Conflict</Node><Node muted>Cache</Node><Node muted>Trace</Node>
            </div>
          </div>
        </figure>
      )

    default:
      return null
  }
}
