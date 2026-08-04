import { runtimeToolArticles } from './runtimeToolContent'

export type QuestionArticleEnhancement = {
  keyConclusion: string
  answerStructure: string[]
  interviewerNote: string
  pseudoCode: string
  codeCaption: string
  engineeringCase: {
    problem: string
    better: string
  }
  takeaway: string
}

export const questionArticles: Record<string, QuestionArticleEnhancement> = {}

export function getQuestionArticle(slug: string) {
  return questionArticles[slug] ?? runtimeToolArticles[slug]
}
