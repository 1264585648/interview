import { LandingPage } from '@/components/LandingPage'
import { questions } from '@/data/questions'
import { topicGuides } from '@/data/topics'

export default function HomePage() {
  const featuredQuestion = questions.find((question) => question.slug === 'agent-planning-replanning') ?? questions[0]

  return (
    <LandingPage
      featuredQuestion={featuredQuestion}
      recentQuestions={questions.slice(0, 3)}
      questions={questions}
      topics={topicGuides}
    />
  )
}
