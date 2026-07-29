import styles from './ConceptFlow.module.css'

export function ConceptFlow({ items, label = '知识路径' }: { items: string[]; label?: string }) {
  return (
    <figure className={styles.figure}>
      <figcaption>{label}</figcaption>
      <div className={styles.flow}>
        {items.map((item, index) => (
          <div className={styles.stepWrap} key={`${item}-${index}`}>
            <span className={styles.step}>{item}</span>
            {index < items.length - 1 ? <span className={styles.arrow} aria-hidden="true">→</span> : null}
          </div>
        ))}
      </div>
    </figure>
  )
}
