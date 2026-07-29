import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Braces,
  ChartNoAxesCombined,
  CircleCheck,
  Database,
  GitBranch,
  Layers3,
  MemoryStick,
  Network,
  Sparkles,
  Star,
  TimerReset
} from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader'

const topics = [
  { name: 'Agent 基础', count: 18, progress: '9 / 18', icon: Layers3, desc: '理解 Agent 的核心概念与工作原理' },
  { name: 'Tool Calling', count: 16, progress: '7 / 16', icon: Braces, desc: '掌握工具调用的设计、执行与失败处理' },
  { name: 'MCP', count: 12, progress: '4 / 12', icon: Network, desc: '理解 Model Context Protocol 与工具生态' },
  { name: 'RAG', count: 20, progress: '11 / 20', icon: Database, desc: '检索增强生成、路由与证据质量' },
  { name: 'Memory', count: 14, progress: '6 / 14', icon: BrainCircuit, desc: '理解 Agent 如何保存、检索和管理状态' },
  { name: 'Context Engineering', count: 9, progress: '3 / 9', icon: MemoryStick, desc: '优化上下文结构、预算与信息利用' },
  { name: 'Evaluation', count: 13, progress: '5 / 13', icon: ChartNoAxesCombined, desc: '评估 Agent 效果、成本与可靠性' },
  { name: 'System Design', count: 15, progress: '6 / 15', icon: GitBranch, desc: '设计可扩展、可观测的 Agent 系统' }
]

const interviewRows = [
  ['字节跳动 · Agent Engineer', '2026.07', 'Agent Memory 如何设计？ · Tool 调用失败怎么处理？ · Deep Research Agent 怎么设计？'],
  ['阿里巴巴 · AI 应用开发', '2026.07', 'MCP 和 Function Calling 有什么区别？ · Agent Context 如何管理？'],
  ['美团 · LLM Engineer', '2026.06', 'Agent Evaluation 如何做？ · 如何检测 Agent 死循环？']
]

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero container">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={15} /> Agent Interview · 每日训练</span>
            <h1>每天一道<br />Agent 面试题</h1>
            <p className="hero-subtitle">从“知道答案”，到真正能在面试中说出来。</p>
            <p className="hero-meta">真实高频题 · AI 连续追问 · 深度解析 · 学习进度</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/questions/agent-tool-loop">开始今日面试 <ArrowRight size={16} /></Link>
              <Link className="button button-secondary" href="/questions">浏览全部题库</Link>
            </div>
          </div>

          <div className="mock-card">
            <div className="mock-card-head">
              <span>模拟面试</span>
              <span className="live-pill"><span /> LIVE DEMO</span>
            </div>
            <div className="chat-row">
              <span className="avatar">I</span>
              <div className="chat-content">
                <span className="speaker">面试官</span>
                <p>Agent 和 Workflow 最大的区别是什么？</p>
              </div>
            </div>
            <div className="chat-bubble user-bubble">我认为最大的区别在于执行流程是否固定……</div>
            <div className="chat-row followup">
              <span className="avatar">I</span>
              <div className="chat-content">
                <span className="speaker">面试官 · 追问</span>
                <p>那用了 Tool Calling 就一定算 Agent 吗？</p>
              </div>
            </div>
            <div className="mock-card-footer"><span>模拟面试</span><strong>2 / 5</strong></div>
          </div>
        </section>

        <section className="container section" id="daily">
          <div className="section-heading compact-heading"><div><span className="section-kicker">DAILY CHALLENGE</span><h2>今日一题</h2></div></div>
          <div className="daily-card">
            <div className="day-block"><span>Day</span><strong>027</strong></div>
            <div className="daily-main">
              <div className="question-tags"><span>Agent Runtime</span><span className="rating">★★★★☆</span><span>高频</span><span>工程题</span></div>
              <h3>Agent 为什么容易陷入无限 Tool Calling 循环？</h3>
              <div className="question-meta"><span><TimerReset size={15} />预计回答 3 分钟</span><span>考察：Stop Condition · Max Steps · Error Handling</span></div>
            </div>
            <Link className="button button-primary" href="/questions/agent-tool-loop">开始回答 <ArrowRight size={16} /></Link>
          </div>
        </section>

        <section className="container section">
          <div className="section-heading">
            <div><span className="section-kicker">CURATED TRACK</span><h2>Agent 100</h2><p>Agent Engineer 最值得掌握的 100 道面试题</p></div>
            <Link href="/questions">查看全部 <ArrowRight size={15} /></Link>
          </div>
          <div className="progress-card">
            <div className="progress-main">
              <div><strong>27</strong><span>/ 100</span></div>
              <p>已完成 27 道</p>
              <div className="progress-track"><span style={{ width: '27%' }} /></div>
              <small>27%</small>
            </div>
            <div className="metric"><BookOpen size={19} /><span>连续学习</span><strong>12 天</strong></div>
            <div className="metric"><CircleCheck size={19} /><span>本周完成</span><strong>8 道</strong></div>
            <div className="metric"><Star size={19} /><span>平均评分</span><strong>7.6</strong></div>
          </div>
        </section>

        <section className="container section" id="roadmap">
          <div className="section-heading"><div><span className="section-kicker">KNOWLEDGE MAP</span><h2>按专题学习</h2><p>从基础概念到生产级 Agent System Design</p></div></div>
          <div className="topic-grid">
            {topics.map((topic, index) => {
              const Icon = topic.icon
              const [done, total] = topic.progress.split(' / ').map(Number)
              return (
                <Link href={`/questions?category=${encodeURIComponent(topic.name)}`} className="topic-card" key={topic.name}>
                  <div className="topic-top"><span className="topic-icon"><Icon size={20} /></span><span>{String(index + 1).padStart(2, '0')}</span></div>
                  <h3>{topic.name}</h3><p>{topic.desc}</p>
                  <div className="topic-bottom"><span>{topic.count} 道题</span><strong>{topic.progress}</strong></div>
                  <div className="mini-track"><span style={{ width: `${Math.round((done / total) * 100)}%` }} /></div>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="container section continue-section">
          <div className="section-heading"><div><span className="section-kicker">KEEP GOING</span><h2>继续学习</h2></div></div>
          <div className="continue-grid">
            <div className="continue-card">
              <span className="topic-icon"><BrainCircuit size={22} /></span>
              <div className="continue-copy"><span className="tiny-label">Memory · ★★★☆☆</span><h3>Agent Memory 有哪些类型？</h3><p>上次学习：昨天</p></div>
              <div className="mastery"><span>掌握度</span><strong>68%</strong><div className="mini-track"><span style={{ width: '68%' }} /></div></div>
              <Link className="button button-secondary" href="/questions/agent-memory-types">继续练习 <ArrowRight size={15} /></Link>
            </div>
            <div className="stat-card"><TimerReset size={18} /><span>待复习</span><strong>3</strong></div>
            <div className="stat-card"><Star size={18} /><span>收藏题目</span><strong>12</strong></div>
            <div className="stat-card"><CircleCheck size={18} /><span>完成题目</span><strong>27</strong></div>
          </div>
        </section>

        <section className="container section interview-section" id="interviews">
          <div className="section-heading"><div><span className="section-kicker">REAL INTERVIEWS</span><h2>最新 Agent 面经</h2><p>从真实面试场景里反推最值得训练的问题</p></div><Link href="/questions">查看题库 <ArrowRight size={15} /></Link></div>
          <div className="interview-list">
            {interviewRows.map(([company, date, items]) => (
              <div className="interview-row" key={company}>
                <span className="company-mark">{company.slice(0, 1)}</span>
                <div className="company"><strong>{company}</strong><span>{date}</span></div>
                <p>{items}</p>
                <Link href="/questions">开始练习 <ArrowRight size={14} /></Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="footer"><div className="container"><span>AgentInterview · 为 Agent Engineer 面试而做</span><span>Build in public · Demo v0.1</span></div></footer>
    </>
  )
}
