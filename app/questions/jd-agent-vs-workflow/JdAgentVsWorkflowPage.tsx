import Link from 'next/link'
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  Clock3,
  Database,
  ExternalLink,
  GitBranch,
  Lightbulb,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  Target,
  Wrench
} from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader'
import styles from '../meituan-langgraph-agent/page.module.css'
import launchStyles from './JdAgentVsWorkflowPage.module.css'

const sources = [
  {
    label: '京东 Agent 二面面经',
    url: 'https://www.nowcoder.com/feed/main/detail/b51047e32faa44678b3e0fffb798c17d'
  },
  {
    label: '京东 AI Agent 开发面经',
    url: 'https://www.nowcoder.com/feed/main/detail/4f35076e21474376acd443f1a2220b96'
  },
  {
    label: '京东 AI Agent 实习二面',
    url: 'https://www.nowcoder.com/feed/main/detail/7af26b7a99e54b29af671ac334b445b5'
  }
]

const dimensions = [
  {
    icon: GitBranch,
    title: '控制权归属',
    description: '能否指出核心差异是“谁决定下一步”，而不是有没有 LLM、Tool 或 Memory。'
  },
  {
    icon: Database,
    title: '状态与反馈',
    description: '是否理解 Agent 会读取当前状态和工具结果，再决定继续、换工具、追问或结束。'
  },
  {
    icon: Activity,
    title: '工程取舍',
    description: '能否比较稳定性、灵活性、成本、可测试性和异常行为，而不是说 Agent 更高级。'
  },
  {
    icon: Wrench,
    title: '场景选型',
    description: '能否判断固定流程优先 Workflow，不确定任务才值得把局部控制权交给 Agent。'
  }
]

const answerFramework = [
  {
    index: '01',
    title: '先给一句话结论',
    content: 'Workflow 的执行路径主要由开发者预先定义；Agent 会根据目标、状态和环境反馈动态决定下一步。'
  },
  {
    index: '02',
    title: '解释运行机制',
    content: 'Workflow 按预设节点和条件流转；Agent 通常在观察、决策、执行、读取结果之间形成循环。'
  },
  {
    index: '03',
    title: '比较工程特征',
    content: 'Workflow 更稳定、可预测、易测试；Agent 更灵活，但成本、延迟和异常路径更难控制。'
  },
  {
    index: '04',
    title: '给出生产选型',
    content: '生产系统通常采用外层 Workflow 保证边界，在局部不确定环节引入 Agent 做动态决策。'
  }
]

const followUps = [
  {
    question: '用了大模型和工具调用，就一定是 Agent 吗？',
    hint: '不一定。固定顺序调用 LLM 和 Tool 仍可能只是 Workflow，关键看模型是否拥有运行时决策权。'
  },
  {
    question: '什么场景应该优先使用 Workflow？',
    hint: '步骤稳定、审计严格、错误代价高、路径可穷举，例如支付、审批、核心交易和批处理。'
  },
  {
    question: 'Agent 的动态决策会引入哪些问题？',
    hint: '成本和延迟不稳定、循环、工具误调用、结果不可复现、测试困难以及权限与安全风险。'
  },
  {
    question: '如何把 Agent 控制在一个安全边界内？',
    hint: '限制工具权限、最大步数、预算、超时和停止条件；高风险动作交给确定性流程或人工审批。'
  }
]

export function JdAgentVsWorkflowPage() {
  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <div className={styles.shell}>
          <nav className={styles.breadcrumb} aria-label="面包屑">
            <Link href="/questions"><ArrowLeft size={14} /> 面试题库</Link>
            <span>/</span>
            <span>真实面经</span>
            <span>/</span>
            <strong>京东 · Agent 基础</strong>
          </nav>

          <header className={styles.hero}>
            <div className={styles.heroMain}>
              <div className={styles.badges}>
                <span className={styles.realBadge}><ShieldCheck size={14} /> 多份真实面经</span>
                <span>Agent 开发</span>
                <span>概念与选型</span>
                <span>入门</span>
              </div>
              <p className={styles.eyebrow}>JD · AI AGENT INTERVIEW · SECOND ROUND</p>
              <h1>Agent 和普通工作流有什么区别？</h1>
              <p className={styles.lead}>
                这道题不是让你背 Agent 的组件列表。面试官真正想听的是：控制权在哪里、系统如何运行，以及你会怎样做工程选型。
              </p>
              <div className={styles.heroMeta}>
                <span><Building2 size={16} /> 京东 · Agent / Java 方向</span>
                <span><Clock3 size={16} /> 建议回答 2 分钟</span>
                <span><Target size={16} /> 高频基础题</span>
              </div>
            </div>

            <aside className={styles.sourceCard}>
              <div className={styles.sourceHeader}>
                <div>
                  <span>出现频率</span>
                  <strong>高频</strong>
                </div>
                <ShieldCheck size={22} />
              </div>
              <p>至少三份独立的京东候选人公开面经出现相同题目。仍属于候选人报告，不代表京东官方固定题库。</p>
              <dl>
                <div><dt>公司</dt><dd>京东</dd></div>
                <div><dt>常见轮次</dt><dd>二面</dd></div>
                <div><dt>来源类型</dt><dd>候选人自述</dd></div>
              </dl>
              <div className={styles.sourceLinks}>
                {sources.map((source, index) => (
                  <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                    来源 {index + 1}：{source.label} <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            </aside>
          </header>

          <div className={styles.layout}>
            <div className={styles.mainColumn}>
              <Link className={launchStyles.practiceLaunch} href="/questions/agent-vs-workflow/practice">
                <div className={launchStyles.launchIcon}><Sparkles size={21} /></div>
                <div className={launchStyles.launchCopy}>
                  <span>INTERVIEW PRACTICE</span>
                  <h2>先独立作答，再阅读解析</h2>
                  <p>进入专注作答页，完成 2 分钟回答后与参考答案对照。</p>
                </div>
                <strong>开始作答 <ArrowRight size={17} /></strong>
              </Link>

              <section className={styles.panel}>
                <div className={styles.sectionHeader}>
                  <div>
                    <span>STEP 01 · CORE DIFFERENCE</span>
                    <h2>最核心的区别：谁决定下一步</h2>
                  </div>
                  <Lightbulb size={21} />
                </div>

                <div className={styles.comparisonGrid}>
                  <article>
                    <span>WORKFLOW</span>
                    <h3>开发者预先决定路径</h3>
                    <ul>
                      <li><CheckCircle2 size={16} /> 节点和主要分支提前定义</li>
                      <li><CheckCircle2 size={16} /> 相同输入通常走相似路径</li>
                      <li><CheckCircle2 size={16} /> 执行结果更稳定、更容易审计</li>
                      <li><CheckCircle2 size={16} /> 适合步骤明确的确定性任务</li>
                    </ul>
                  </article>
                  <article>
                    <span>AGENT</span>
                    <h3>模型根据状态动态决策</h3>
                    <ul>
                      <li><CheckCircle2 size={16} /> 根据目标和上下文选择动作</li>
                      <li><CheckCircle2 size={16} /> 读取工具结果后重新决策</li>
                      <li><CheckCircle2 size={16} /> 路径可能在运行时发生变化</li>
                      <li><CheckCircle2 size={16} /> 适合无法预先穷举的任务</li>
                    </ul>
                  </article>
                </div>

                <div className={styles.boundaryNote}>
                  <MessageSquareQuote size={19} />
                  <div>
                    <strong>判断标准不是有没有 LLM、Tool 或 Memory</strong>
                    <p>固定顺序执行“检索 → 调模型 → 调工具 → 返回结果”，即使每一步都用了大模型，也可能仍然只是 Workflow。</p>
                  </div>
                </div>
              </section>

              <section className={styles.panel}>
                <div className={styles.sectionHeader}>
                  <div>
                    <span>STEP 02 · INTERVIEW INTENT</span>
                    <h2>面试官到底在考什么</h2>
                  </div>
                  <Target size={21} />
                </div>
                <div className={styles.dimensionGrid}>
                  {dimensions.map(({ icon: Icon, title, description }) => (
                    <article key={title}>
                      <Icon size={19} />
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className={styles.panel}>
                <div className={styles.sectionHeader}>
                  <div>
                    <span>STEP 03 · ANSWER STRUCTURE</span>
                    <h2>高质量回答框架</h2>
                  </div>
                  <BookOpenCheck size={21} />
                </div>
                <div className={styles.frameworkList}>
                  {answerFramework.map((item) => (
                    <article key={item.index}>
                      <span>{item.index}</span>
                      <div><h3>{item.title}</h3><p>{item.content}</p></div>
                    </article>
                  ))}
                </div>
              </section>

              <section className={styles.panel}>
                <div className={styles.sectionHeader}>
                  <div>
                    <span>STEP 04 · PRODUCTION CHOICE</span>
                    <h2>真实系统通常不是二选一</h2>
                  </div>
                  <GitBranch size={21} />
                </div>

                <div className={styles.comparisonGrid}>
                  <article>
                    <span>OUTER WORKFLOW</span>
                    <h3>用确定性流程守住边界</h3>
                    <ul>
                      <li><CheckCircle2 size={16} /> 权限、预算和最大步数</li>
                      <li><CheckCircle2 size={16} /> 核心交易与高风险动作</li>
                      <li><CheckCircle2 size={16} /> 超时、重试和人工审批</li>
                      <li><CheckCircle2 size={16} /> 审计日志与停止条件</li>
                    </ul>
                  </article>
                  <article>
                    <span>LOCAL AGENT</span>
                    <h3>在不确定环节动态决策</h3>
                    <ul>
                      <li><CheckCircle2 size={16} /> 理解开放式用户意图</li>
                      <li><CheckCircle2 size={16} /> 动态拆解复杂任务</li>
                      <li><CheckCircle2 size={16} /> 根据反馈选择工具</li>
                      <li><CheckCircle2 size={16} /> 缺少信息时主动追问</li>
                    </ul>
                  </article>
                </div>
              </section>

              <section className={styles.panel}>
                <div className={styles.sectionHeader}>
                  <div>
                    <span>STEP 05 · FOLLOW UPS</span>
                    <h2>面试官可能继续追问</h2>
                  </div>
                  <MessageSquareQuote size={21} />
                </div>
                <div className={styles.followupList}>
                  {followUps.map((item, index) => (
                    <details key={item.question}>
                      <summary><span>{String(index + 1).padStart(2, '0')}</span>{item.question}</summary>
                      <p>{item.hint}</p>
                    </details>
                  ))}
                </div>
              </section>
            </div>

            <aside className={styles.sidebar}>
              <section className={styles.sidePanel}>
                <span className={styles.sideEyebrow}>一句话记忆</span>
                <h2>看控制权</h2>
                <p>Workflow 由开发者预设主要路径；Agent 根据状态与反馈动态决定下一步。</p>
                <div className={styles.tagList}>
                  <span>控制流</span><span>动态决策</span><span>状态</span><span>工程选型</span>
                </div>
              </section>

              <section className={styles.sidePanel}>
                <span className={styles.sideEyebrow}>答题检查</span>
                <ul className={styles.checklist}>
                  <li><CheckCircle2 size={16} /> 是否回答谁决定下一步</li>
                  <li><CheckCircle2 size={16} /> 是否讲清运行机制</li>
                  <li><CheckCircle2 size={16} /> 是否比较工程取舍</li>
                  <li><CheckCircle2 size={16} /> 是否给出混合架构</li>
                </ul>
              </section>

              <section className={`${styles.sidePanel} ${styles.warningPanel}`}>
                <span className={styles.sideEyebrow}>常见失分点</span>
                <strong>把 Agent 说成组件集合</strong>
                <p>“LLM + Tool + Memory”只描述了组成，没有解释系统为什么能够自主决定下一步。</p>
              </section>

              <Link className={styles.nextAction} href="/questions/agent-vs-workflow/practice">
                <Sparkles size={17} />
                <span><strong>开始作答</strong><small>进入独立的专注作答页</small></span>
                <ArrowRight size={16} />
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </>
  )
}