import Link from 'next/link'
import { Search } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">AI</span>
          <span>AgentInterview</span>
        </Link>

        <nav className="main-nav" aria-label="主导航">
          <Link href="/#daily">今日一题</Link>
          <Link href="/questions">题库</Link>
          <Link href="/#roadmap">学习路线</Link>
          <Link href="/#interviews">面经</Link>
        </nav>

        <div className="nav-actions">
          <Link className="icon-button" href="/questions" aria-label="搜索题库">
            <Search size={18} strokeWidth={1.8} />
          </Link>
          <button className="text-button" type="button">登录</button>
          <Link className="button button-primary button-small" href="/questions/agent-tool-loop">
            开始练习
          </Link>
        </div>
      </div>
    </header>
  )
}
