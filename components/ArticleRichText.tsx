import type { ReactNode } from 'react'
import type { RichTextBlock, RichTextInline } from '@/data/articleRichText'
import styles from './ArticleRichText.module.css'

type Props = {
  blocks: RichTextBlock[]
}

function renderInline(part: RichTextInline, index: number): ReactNode {
  if (typeof part === 'string') return part

  let node: ReactNode = part.text

  if (part.code) node = <code>{node}</code>
  if (part.bold) node = <strong>{node}</strong>
  if (part.italic) node = <em>{node}</em>

  if (part.href) {
    const external = part.href.startsWith('http://') || part.href.startsWith('https://')
    node = (
      <a href={part.href} rel={external ? 'noreferrer' : undefined} target={external ? '_blank' : undefined}>
        {node}
      </a>
    )
  }

  return <span key={`${part.text}-${index}`}>{node}</span>
}

function InlineContent({ content }: { content: RichTextInline[] }) {
  return <>{content.map(renderInline)}</>
}

export function ArticleRichText({ blocks }: Props) {
  return (
    <div className={styles.richText}>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`

        switch (block.type) {
          case 'paragraph':
            return <p key={key}><InlineContent content={block.content} /></p>

          case 'heading':
            return block.level === 2 ? (
              <h2 id={block.id} key={key}><InlineContent content={block.content} /></h2>
            ) : (
              <h3 id={block.id} key={key}><InlineContent content={block.content} /></h3>
            )

          case 'list': {
            const List = block.ordered ? 'ol' : 'ul'
            return (
              <List key={key}>
                {block.items.map((item, itemIndex) => (
                  <li key={`${key}-${itemIndex}`}><InlineContent content={item} /></li>
                ))}
              </List>
            )
          }

          case 'quote':
            return (
              <blockquote key={key}>
                <p><InlineContent content={block.content} /></p>
                {block.attribution ? <cite>{block.attribution}</cite> : null}
              </blockquote>
            )

          case 'callout':
            return (
              <aside className={`${styles.callout} ${styles[block.tone ?? 'info']}`} key={key}>
                <strong>{block.title}</strong>
                <p><InlineContent content={block.content} /></p>
              </aside>
            )

          case 'code':
            return (
              <figure className={styles.codeBlock} key={key}>
                {block.caption ? <figcaption>{block.caption}</figcaption> : null}
                <pre data-language={block.language}><code>{block.code}</code></pre>
              </figure>
            )

          case 'table':
            return (
              <figure className={styles.tableBlock} key={key}>
                {block.caption ? <figcaption>{block.caption}</figcaption> : null}
                <div>
                  <table>
                    <thead>
                      <tr>{block.headers.map((header) => <th key={header}>{header}</th>)}</tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, rowIndex) => (
                        <tr key={`${key}-${rowIndex}`}>
                          {row.map((cell, cellIndex) => <td key={`${key}-${rowIndex}-${cellIndex}`}>{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </figure>
            )

          case 'divider':
            return <hr key={key} />
        }
      })}
    </div>
  )
}
