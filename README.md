# AgentInterview

一个面向 **AI Agent Engineer / LLM Application Engineer / 大模型应用开发工程师** 的面试训练站点。

当前题库只保留经过逐题选题、整理和确认的内容，不再保留早期批量生成的 AI 示例题。

## 当前题目

1. Agent 的 Planning 是由框架完成，还是由大模型完成？有哪些实现方式？
2. 如何为 Agent 设计可观测性、Tracing 和故障定位？
3. 长期记忆与当前会话信息冲突时，Agent 应该相信谁？

## 统一文章模板

所有面试题详情页遵循同一条学习路径：

1. 面试场景：先独立组织答案。
2. 简要回答：给出 30 秒核心结论和回答结构。
3. 详细解析：通过关键判断、技术架构、场景、原理和工程取舍建立完整理解。
4. 工程实践：展示错误现场、更稳妥的做法和可运行伪代码。
5. 总结与追问：沉淀参考要点、面试建议、递进追问和加分点。

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
/                                             首页
/questions                                    题库
/questions/agent-planning-replanning           Planning
/questions/agent-observability-tracing         Observability / Tracing
/questions/agent-memory-conflict                Memory Conflict
/topics                                       学习路径
/practice                                     模拟面试
```
