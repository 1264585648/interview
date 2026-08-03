import './globals.css'
import './editorial.css'

export const metadata = {
  title: 'AgentInterview | AI Agent 工程师面试训练',
  description: '通过真实面试题、AI 连续追问与结构化复盘，训练 AI Agent 工程师的系统设计与面试表达能力。'
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
