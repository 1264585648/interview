import { LearningWorkspace } from '@/components/LearningWorkspace'
import { questions } from '@/data/questions'
import { topicGuides } from '@/data/topics'

export default function HomePage() {
  return <LearningWorkspace questions={questions} topics={topicGuides} />
}
