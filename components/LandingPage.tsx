import Link from 'next/link'
import {
  ArrowRight,
  Check,
  Library,
  MessageSquareText,
  Play,
  Sparkles
} from 'lucide-react'
import type { InterviewQuestion } from '@/data/questions'
import styles from './LandingPage.module.css'

type LandingPageProps = {
  featuredQuestion: InterviewQuestion
  questionCount: number
  topicCount: number
}

const highlights = [
  { icon: Library, label: '真实面试题' },
  { icon: MessageSquareText, label: 'AI 连续追问' },
  { icon: Check, label: '结构化复盘' }
]

export function LandingPage({ featuredQuestion, questionCount, topicCount }: LandingPageProps) {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} href="/" aria-label="AgentInterview 首页">
            <span className={styles.brandMark} aria-hidden="true">
              <span />
              <span />
            </span>
            <strong>AgentInterview</strong>
          </Link>

          <nav className={styles.nav} aria-label="主导航">
            <Link href="/questions">题库</Link>
            <Link href="/topics">学习路径</Link>
            <Link href="/practice">模拟面试</Link>
          </nav>

          <div className={styles.headerActions}>
            <Link className={styles.textLink} href="/questions">浏览题库</Link>
            <Link className={styles.headerCta} href="/practice">
              开始训练
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>
            <Sparkles size={14} />
            为 AI Agent 工程师打造
          </span>

          <h1>
            Agent 面试，
            <br />
            不是刷题，而是
            <span>练会真实回答。</span>
          </h1>

          <p>
            用真实面试题、连续追问与结构化复盘，
            把零散知识练成面试中讲得清、答得深的系统能力。
          </p>

          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href="/practice">
              <Play size={16} fill="currentColor" />
              开始今日练习
              <ArrowRight size={16} />
            </Link>
            <Link className={styles.secondaryButton} href="/questions">
              先看看题目
            </Link>
          </div>

          <div className={styles.highlights}>
            {highlights.map(({ icon: Icon, label }) => (
              <span key={label}>
                <Icon size={15} />
                {label}
              </span>
            ))}
          </div>

          <p className={styles.proof}>
            已收录 <strong>{questionCount}</strong> 道核心问题，覆盖 <strong>{topicCount}</strong> 条学习路径
          </p>
        </div>

        <div className={styles.heroScene} aria-label="AgentInterview 训练界面预览">
          <div className={styles.sceneGlow} />
          <div className={styles.windowHint} />

          <div className={styles.mug} aria-hidden="true">
            <span>Agent<br />Interview</span>
          </div>

          <div className={styles.books} aria-hidden="true">
            <span>BUILDING INTELLIGENT AGENTS</span>
            <span>DESIGNING AI SYSTEMS</span>
          </div>

          <div className={styles.laptop}>
            <div className={styles.laptopScreen}>
              <div className={styles.productTopbar}>
                <div className={styles.productBrand}>
                  <span className={styles.miniMark} />
                  AgentInterview
                </div>
                <span className={styles.liveStatus}>AI 面试官在线</span>
              </div>

              <div className={styles.productBody}>
                <div className={styles.productHeading}>
                  <span>今日训练</span>
                  <strong>准备好开始了吗？</strong>
                </div>

                <article className={styles.questionCard}>
                  <div className={styles.questionLabel}>面试题</div>
                  <h2>{featuredQuestion.title}</h2>
                  <div className={styles.questionMeta}>
                    <span>{featuredQuestion.category}</span>
                    <span>{featuredQuestion.type}</span>
                    <span>{featuredQuestion.estimate}</span>
                  </div>
                </article>

                <div className={styles.interviewFlow}>
                  <div>
                    <span>01</span>
                    <strong>先说结论</strong>
                  </div>
                  <i />
                  <div>
                    <span>02</span>
                    <strong>接受追问</strong>
                  </div>
                  <i />
                  <div>
                    <span>03</span>
                    <strong>完成复盘</strong>
                  </div>
                </div>

                <div className={styles.productFooter}>
                  <div>
                    <span className={styles.liveDot} />
                    面试官会根据你的回答继续追问
                  </div>
                  <Link href="/practice">
                    开始练习
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
            <div className={styles.laptopBase} />
          </div>

          <div className={styles.notebook} aria-hidden="true">
            <span />
            <i />
          </div>
        </div>
      </section>
    </main>
  )
}
