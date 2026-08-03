import { observabilityArticle } from './observabilityContent'
import { observabilityRichText } from './observabilityRichText'
import { getQuestionArticle } from './questionArticles'
import type { QuestionArticleDocument } from './articleRichText'

const richArticleDocuments: Record<string, QuestionArticleDocument> = {
  'agent-observability-tracing': {
    ...observabilityArticle,
    richText: observabilityRichText
  }
}

export function getQuestionArticleDocument(slug: string): QuestionArticleDocument | undefined {
  return richArticleDocuments[slug] ?? getQuestionArticle(slug)
}
