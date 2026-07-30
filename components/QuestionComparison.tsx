import { getQuestionComparison } from '@/data/questionComparisons'
import styles from './QuestionComparison.module.css'

export function QuestionComparison({ slug }: { slug: string }) {
  const comparison = getQuestionComparison(slug)

  if (!comparison) return null

  return (
    <figure className={styles.figure}>
      <figcaption>
        <strong>{comparison.title}</strong>
        <span>{comparison.description}</span>
      </figcaption>

      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              {comparison.headers.map((header) => <th key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map(([dimension, left, right]) => (
              <tr key={dimension}>
                <th scope="row">{dimension}</th>
                <td>{left}</td>
                <td>{right}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}
