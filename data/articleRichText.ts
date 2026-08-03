import type { QuestionArticleEnhancement } from './questionArticles'

export type RichTextInline =
  | string
  | {
      text: string
      bold?: boolean
      italic?: boolean
      code?: boolean
      href?: string
    }

export type RichTextBlock =
  | {
      type: 'paragraph'
      content: RichTextInline[]
    }
  | {
      type: 'heading'
      level: 2 | 3
      content: RichTextInline[]
      id?: string
    }
  | {
      type: 'list'
      ordered?: boolean
      items: RichTextInline[][]
    }
  | {
      type: 'quote'
      content: RichTextInline[]
      attribution?: string
    }
  | {
      type: 'callout'
      tone?: 'info' | 'warning' | 'success'
      title: string
      content: RichTextInline[]
    }
  | {
      type: 'code'
      code: string
      language?: string
      caption?: string
    }
  | {
      type: 'table'
      headers: string[]
      rows: string[][]
      caption?: string
    }
  | {
      type: 'divider'
    }

export type QuestionArticleDocument = QuestionArticleEnhancement & {
  richText?: RichTextBlock[]
}
