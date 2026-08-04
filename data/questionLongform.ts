export type QuestionLongformSection = {
  title: string
  paragraphs: string[]
  judgement?: string
}

export type QuestionLongform = {
  intro: string
  sections: QuestionLongformSection[]
}

export const questionLongforms: Record<string, QuestionLongform> = {}

export function getQuestionLongform(slug: string) {
  return questionLongforms[slug]
}
