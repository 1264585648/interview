import { Suspense } from 'react'
import { QuestionsContent, QuestionsView } from '@/components/QuestionsContent'
import { SiteHeader } from '@/components/SiteHeader'

export default function QuestionsPage() {
  return (
    <>
      <SiteHeader />
      <Suspense fallback={<QuestionsView activeCategory="全部" />}>
        <QuestionsContent />
      </Suspense>
    </>
  )
}
