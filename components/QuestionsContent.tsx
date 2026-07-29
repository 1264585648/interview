'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { categories, questions } from '@/data/questions'

function stars(value: number) {
  return '★'.repeat(value) + '☆'.repeat(5 - value)
}

export function QuestionsContent() {
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category') || '全部'

  return <QuestionsView activeCategory={activeCategory} />
}

export function QuestionsView({ activeCategory }: { activeCategory: string }) {
  const filtered = activeCategory === '全部'
    ? questions
    : questions.filter((question) => question.category === activeCategory)

  return (
    <main className="container library-page">
      <section className="library-hero">
        <span className="section-kicker">QUESTION DATABASE</span>
        <h1>Agent 面试题库</h1>
        <p>从基础概念、工程问题到生产级 System Design。先回答，再看解析。</p>
        <div className="library-summary"><strong>{questions.length}</strong><span>道 Demo 题目</span><strong>9</strong><span>个核心专题</span></div>
      </section>

      <section className="library-toolbar">
        <div className="search-shell"><Search size={17} /><input placeholder="搜索题目、知识点或公司..." aria-label="搜索题库" /></div>
        <button className="button button-secondary" type="button"><Filter size={16} /> 难度</button>
      </section>

      <div className="category-tabs" aria-label="题目分类">
        {categories.map((category) => (
          <Link
            key={category}
            href={category === '全部' ? '/questions' : `/questions?category=${encodeURIComponent(category)}`}
            className={category === activeCategory ? 'active' : ''}
          >
            {category}
          </Link>
        ))}
      </div>

      <section className="question-list">
        <div className="list-head"><span>题目</span><span>难度</span><span>类型</span><span></span></div>
        {filtered.length ? filtered.map((question, index) => (
          <article className="question-row" key={question.slug}>
            <div className="question-index">{String(index + 1).padStart(2, '0')}</div>
            <div className="question-info">
              <div className="question-row-tags"><span>{question.category}</span><span>{question.frequency}</span></div>
              <h2><Link href={`/questions/${question.slug}`}>{question.title}</Link></h2>
              <p>{question.topics.join(' · ')}</p>
            </div>
            <div className="question-difficulty"><span className="rating">{stars(question.difficulty)}</span><small>{question.estimate}</small></div>
            <div className="question-type">{question.type}</div>
            <Link className="row-link" href={`/questions/${question.slug}`} aria-label={`开始练习 ${question.title}`}><ArrowRight size={18} /></Link>
          </article>
        )) : (
          <div className="empty-state"><h2>这个专题还在补题</h2><p>Demo 先展示核心题型，后续会持续扩充。</p><Link className="button button-secondary" href="/questions">查看全部题目</Link></div>
        )}
      </section>
    </main>
  )
}
