import { memoryConflictQuestions } from './memoryConflictQuestion'
import { runtimeToolQuestions } from './runtimeToolQuestions'

export type InterviewQuestion = {
  slug: string
  title: string
  category: string
  difficulty: 1 | 2 | 3 | 4 | 5
  frequency: '高频' | '常见' | '进阶'
  type: '概念题' | '工程题' | '系统设计'
  estimate: string
  topics: string[]
  shortAnswer: string
  deepDive: Array<{
    title: string
    content: string
  }>
  commonMistakes: string[]
  engineeringPractice: string[]
  keyPoints: string[]
  followUps: string[]
}

export const questions: InterviewQuestion[] = [
  ...runtimeToolQuestions,
  ...memoryConflictQuestions
]

export const categories = ['全部', 'Agent Runtime', 'Memory']

export const getQuestion = (slug: string) => questions.find((question) => question.slug === slug)
