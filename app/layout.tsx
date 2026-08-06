import './globals.css'

export const metadata = {
  title: 'Agent Interview | AI Agent 面试题库',
  description: 'AI Agent 工程面试题与专题解析，覆盖 Planning、可观测性、工具调用和长期记忆。'
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
