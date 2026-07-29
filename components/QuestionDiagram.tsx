import styles from './QuestionDiagram.module.css'

function Arrow() {
  return <span className={styles.arrow} aria-hidden="true">→</span>
}

function Node({ children, muted = false }: { children: React.ReactNode; muted?: boolean }) {
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
