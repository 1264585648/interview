import './globals.css'
import './editorial.css'

export const metadata = {
  title: 'Agent Interview',
  description: '面向 Agent Engineer 的开源面试手册：题库、完整解析、工程实践与面试官追问。'
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
