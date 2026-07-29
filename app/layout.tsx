import './globals.css'

export const metadata = {
  title: 'AgentInterview',
  description: 'AI Agent Engineer 面试训练平台'
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
