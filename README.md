# AgentInterview

<!-- deploy-trigger: 2026-08-03T16:14+08:00 -->

一个面向 **AI Agent Engineer / LLM Application Engineer / 大模型应用开发工程师** 的面试训练 Demo。

核心目标不是让用户“看答案”，而是通过 **每日一题 → 自己回答 → 连续追问 → 结果反馈 → 深度解析** 的方式，训练真实面试表达和工程思考。

## Demo 已包含

- 首页：今日一题、Agent 100、专题学习、学习进度、最新面经
- 题库：按专题筛选、难度和题型展示
- 单题页：题目背景、考察点、30 秒参考回答、追问列表
- 真实面经试点页：美团 LangGraph 多轮对话 Agent
- 模拟面试：输入回答、连续追问、结果反馈闭环
- 8 道真实 Agent / MCP / RAG / Memory / Evaluation / System Design 示例题
- 响应式桌面与移动端样式

> 当前模拟面试采用预设追问 + 规则评分，用来跑通产品交互。下一阶段再接入 LLM，让追问和反馈根据候选人的回答实时生成。

## 统一文章模板

所有面试题详情页统一遵循同一条学习路径：

1. 面试场景：先独立组织答案。
2. 简要回答：给出 30 秒核心结论和回答结构。
3. 详细解析：通过关键判断、技术架构、核心论点和工程取舍建立完整理解。
4. 工程实践：展示错误现场、更稳妥的做法和可运行伪代码。
5. 总结与追问：沉淀参考要点、面试建议、递进追问和加分点。

正文统一由富文本文章渲染器输出。已有长文数据会自动转换为二级标题、连续正文和“面试中的关键判断”提示框；新文章可以按需增加表格、引用、列表、代码块和不同语义的 Callout。

## 技术栈

- Next.js App Router
- TypeScript
- React
- Lucide Icons
- 原生 CSS Design System

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 页面

```text
/                                       首页
/questions                              Agent 面试题库
/questions/agent-tool-loop              单题训练示例
/questions/agent-memory-types           Memory 训练示例
/questions/meituan-langgraph-agent      美团真实面经试点页
```

## 下一步

1. 接入真实 LLM Interviewer API
2. 增加用户登录与学习进度持久化
3. 扩充 Agent 100 题库
4. 增加公司 / 岗位 / 年份维度的真实面经
5. 增加评分维度：概念、工程、表达、系统设计
6. 部署 Cloudflare / Vercel Demo
