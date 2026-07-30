import type { InterviewQuestion } from '@/data/questions'
import { getQuestionLongform } from '@/data/questionLongform'
import { getRuntimeToolLongform } from '@/data/runtimeToolContent'
import styles from './QuestionLongform.module.css'

type Props = {
  question: InterviewQuestion
}

export function QuestionLongform({ question }: Props) {
  const longform = getQuestionLongform(question.slug) ?? getRuntimeToolLongform(question.slug)

  if (!longform) {
    return (
      <div className={styles.fallback}>
        {question.deepDive.map((item) => (
          <article key={item.title} className={styles.section}>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </article>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.longform}>
      <p className={styles.intro}>{longform.intro}</p>

      {longform.sections.map((section) => (
        <article className={styles.section} key={section.title}>
          <h3>{section.title}</h3>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.judgement ? (
            <blockquote className={styles.judgement}>
              <span>作者判断</span>
              <p>{section.judgement}</p>
            </blockquote>
          ) : null}
        </article>
      ))}
    </div>
  )
}
