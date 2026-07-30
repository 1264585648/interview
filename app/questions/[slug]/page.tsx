import { QuestionArticlePage } from './QuestionArticlePage'
import { questions } from '@/data/questions'

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return questions.map((question) => ({ slug: question.slug }))
}

export default async function QuestionDetailPage({ params }: Props) {
  const { slug } = await params
  return <QuestionArticlePage slug={slug} />
}
