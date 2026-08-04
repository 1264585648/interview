import { memoryConflictArticle } from './memoryConflictContent'
import { memoryConflictRichText } from './memoryConflictRichText'
import { observabilityArticle } from './observabilityContent'
import { observabilityRichText } from './observabilityRichText'
import { getQuestionArticle } from './questionArticles'
import { defineQuestionArticle } from './defineQuestionArticle'
import { getQuestionLongform, type QuestionLongform } from './questionLongform'
import { getRuntimeToolLongform } from './runtimeToolContent'
import type { QuestionArticleDocument, RichTextBlock } from './articleRichText'

const richArticleDocuments: Record<string, QuestionArticleDocument> = {
  'agent-memory-conflict': defineQuestionArticle({
    ...memoryConflictArticle,
    richText: memoryConflictRichText
  }),
  'agent-observability-tracing': defineQuestionArticle({
    ...observabilityArticle,
    richText: observabilityRichText
  })
}

function convertLongformToRichText(longform: QuestionLongform): RichTextBlock[] {
  const blocks: RichTextBlock[] = [
    {
      type: 'paragraph',
      content: [longform.intro]
    }
  ]

  longform.sections.forEach((section, index) => {
    blocks.push({
      type: 'heading',
      level: 2,
      id: `article-section-${index + 1}`,
      content: [section.title]
    })

    section.paragraphs.forEach((paragraph) => {
      blocks.push({
        type: 'paragraph',
        content: [paragraph]
      })
    })

    if (section.judgement) {
      blocks.push({
        type: 'callout',
        tone: 'info',
        title: '面试中的关键判断',
        content: [section.judgement]
      })
    }
  })

  return blocks
}

function getGeneratedRichText(slug: string): RichTextBlock[] | undefined {
  const longform = getQuestionLongform(slug) ?? getRuntimeToolLongform(slug)
  return longform ? convertLongformToRichText(longform) : undefined
}

export function getQuestionArticleDocument(slug: string): QuestionArticleDocument | undefined {
  const article = richArticleDocuments[slug] ?? getQuestionArticle(slug)

  if (!article || article.richText?.length) return article

  const richText = getGeneratedRichText(slug)
  return richText ? defineQuestionArticle({ ...article, richText }) : article
}
