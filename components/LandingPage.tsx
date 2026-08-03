import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Library,
  MessageSquareText,
  Play,
  Sparkles,
  Target
} from 'lucide-react'
import type { InterviewQuestion } from '@/data/questions'
import styles from './LandingPage.module.css'

type LandingPageProps = {
  featuredQuestion: InterviewQuestion
  questionCount: number
  topicCount: number
}

const benefits = [
  {
    icon: Library,
    title: '真实面试题',
    description: '围绕 Agent 架构、工具调用、记忆与评估等核心能力。'
  },
  {
    icon: MessageSquareText,
    title: 'AI 连续追问',
    description: '不止看答案，而是像真实面试官一样追问设计取舍。'
  },
  {
    icon: Target,
    title: '结构化反馈',
    description: '从结论、机制、工程实践与边界四个维度复盘。'
  }
]

const steps = [
  {
    number: '01',
    title: '题目',
    description: '用真实工程问题明确考察目标与约束。',
    icon: BookOpen
  },
  {
    number: '02',
    title: '追问',
    description: 'AI 沿着你的答案继续深入，暴露知识盲区。',
    icon: MessageSquareText
  },
  {
    number: '03',
    title: '复盘',
    description: '对照参考思路，沉淀属于自己的回答框架。',
    icon: Check
  }
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
            <a href="#features">产品能力</a>
            <Link href="/questions">题库</Link>
            <Link href="/topics">学习路径</Link>
            <a href="#how-it-works">如何训练</a>
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
            为 AI Agent 工程师打造的面试训练平台
          </span>

          <h1>
            Agent 面试，
            <br />
            不是刷题，而是
            <span>训练真实回答能力</span>
          </h1>

          <p>
            用真实面试题、连续追问与结构化复盘，
            帮你把零散知识变成能在面试中讲清楚的系统答案。
          </p>

          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href="/practice">
              <Play size={16} fill="currentColor" />
              开始今日练习
              <ArrowRight size={16} />
            </Link>
            <a className={styles.secondaryButton} href="#how-it-works">
              了解训练方式
            </a>
          </div>

          <div className={styles.heroProof}>
            <div className={styles.avatarStack} aria-hidden="true">
              <span>R</span>
              <span>M</span>
              <span>T</span>
              <span>E</span>
            </div>
            <p>
              已收录 <strong>{questionCount}</strong> 道核心问题 · 覆盖 <strong>{topicCount}</strong> 条学习路径
            </p>
          </div>
        </div>

        <div className={styles.heroScene} aria-label="AgentInterview 训练界面预览">
          <div className={styles.sceneGlow} />
          <div className={styles.windowHint} />
          <div className={styles.plant} aria-hidden="true">
            <span />
            <span />
            <span />
            <i />
          </div>
          <div className={styles.books} aria-hidden="true">
            <span>BUILDING INTELLIGENT AGENTS</span>
            <span>DESIGNING AI SYSTEMS</span>
          </div>
          <div className={styles.mug} aria-hidden="true">
            <span>Agent<br />Interview</span>
          </div>

          <div className={styles.laptop}>
            <div className={styles.laptopScreen}>
              <div className={styles.productTopbar}>
                <div className={styles.productBrand}>
                  <span className={styles.miniMark} />
                  AgentInterview
                </div>
                <div className={styles.productDots}>
                  <span />
                  <span />
                </div>
              </div>

              <div className={styles.productGreeting}>
                <span>今天准备好训练了吗？</span>
                <small>每日一道 · 逐步深入</small>
              </div>

              <div className={styles.productGrid}>
                <article className={styles.previewQuestion}>
                  <div className={styles.previewLabel}>今日题目</div>
                  <h2>{featuredQuestion.title}</h2>
                  <div className={styles.previewMeta}>
                    <span>{featuredQuestion.type}</span>
                    <span>{featuredQuestion.frequency}</span>
                    <span>{featuredQuestion.estimate}</span>
                  </div>
                </article>

                <aside className={styles.previewProgress}>
                  <div>
                    <span>本周练习</span>
                    <strong>4 / 7</strong>
                  </div>
                  <div className={styles.previewTrack}><span /></div>
                  <div>
                    <span>回答框架</span>
                    <strong>逐步形成</strong>
                  </div>
                </aside>
              </div>

              <div className={styles.previewFooter}>
                <div>
                  <span className={styles.liveDot} />
                  AI 面试官已就绪
                </div>
                <Link href="/practice">
                  开始练习
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
            <div className={styles.laptopBase} />
          </div>

          <div className={styles.notebook} aria-hidden="true">
            <i />
            <span />
          </div>
        </div>
      </section>

      <section className={styles.benefitStrip} id="features">
        {benefits.map(({ icon: Icon, title, description }) => (
          <article key={title}>
            <span className={styles.benefitIcon}><Icon size={19} /></span>
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.featuredSection}>
        <div className={styles.sectionIntro}>
          <span>Today&apos;s question</span>
          <h2>今天，只练透一道题</h2>
          <p>不追求浏览数量，而是完成一次完整的回答、追问与复盘。</p>
        </div>

        <article className={styles.featuredCard}>
          <div className={styles.featuredIcon}>
            <BookOpen size={23} />
          </div>

          <div className={styles.featuredMain}>
            <span>今日题目</span>
            <h3>{featuredQuestion.title}</h3>
            <div>
              <span>{featuredQuestion.category}</span>
              <span>{featuredQuestion.type}</span>
              <span><Clock3 size={13} /> {featuredQuestion.estimate}</span>
            </div>
          </div>

          <div className={styles.blockIllustration} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <Link className={styles.cardButton} href="/practice">
            开始练习
            <ArrowRight size={16} />
          </Link>
        </article>
      </section>

      <section className={styles.processSection} id="how-it-works">
        <div className={styles.processHeading}>
          <span>How it works</span>
          <h2>3 步把“知道”练成“会回答”</h2>
        </div>

        <div className={styles.steps}>
          {steps.map(({ number, title, description, icon: Icon }, index) => (
            <div className={styles.stepWrap} key={title}>
              <article className={styles.stepCard}>
                <span className={styles.stepNumber}>{number}</span>
                <span className={styles.stepIcon}><Icon size={20} /></span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
              {index < steps.length - 1 ? <ChevronRight className={styles.stepArrow} size={20} /> : null}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <div>
          <span>每天进步一点点</span>
          <h2>让下一次 Agent 面试，更有底气。</h2>
        </div>
        <Link href="/practice">
          开始今日练习
          <ArrowRight size={17} />
        </Link>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <span className={styles.brandMark} aria-hidden="true"><span /><span /></span>
          <strong>AgentInterview</strong>
        </div>
        <p>面向 AI Agent 工程师的系统化面试训练。</p>
        <div>
          <Link href="/questions">题库</Link>
          <Link href="/topics">学习路径</Link>
          <Link href="/practice">开始训练</Link>
        </div>
      </footer>
    </main>
  )
}
