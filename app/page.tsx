import { LandingPage } from '@/components/LandingPage'
import { questions } from '@/data/questions'
import { topicGuides } from '@/data/topics'

export default function HomePage() {
  const featuredQuestion = questions.find((question) => question.slug === 'agent-planning-replanning') ?? questions[0]

  return (
    <LandingPage
      featuredQuestion={featuredQuestion}
      questionCount={questions.length}
      topicCount={topicGuides.length}
    />
  )
}
