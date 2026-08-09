import type { MatchProfile } from './types'

export const matchProfiles: MatchProfile[] = [
  {
    id: 'architect',
    label: '架构师',
    kind: 'opponent',
    eyebrow: '对手',
    description: '关注边界、取舍与系统演进。',
    modifier: '回答中必须说明一项关键取舍。'
  },
  {
    id: 'failure-hunter',
    label: '故障猎手',
    kind: 'opponent',
    eyebrow: '对手',
    description: '沿执行链寻找第一个偏离点。',
    modifier: '补充一个失败场景与恢复策略。'
  },
  {
    id: 'memory-keeper',
    label: '记忆守门人',
    kind: 'opponent',
    eyebrow: '对手',
    description: '追问信息来源、时效与冲突。',
    modifier: '说明状态或记忆的可信来源。'
  },
  {
    id: 'tool-dispatcher',
    label: '工具调度官',
    kind: 'opponent',
    eyebrow: '对手',
    description: '检查调用边界与执行结果。',
    modifier: '指出工具调用的权限或失败边界。'
  },
  {
    id: 'timed',
    label: '限时局',
    kind: 'mode',
    eyebrow: '挑战模式',
    description: '压缩铺垫，先交付结论。',
    modifier: '在 3 分钟内完成结构化回答。'
  },
  {
    id: 'follow-up',
    label: '追问局',
    kind: 'mode',
    eyebrow: '挑战模式',
    description: '答案会被连续验证与下钻。',
    modifier: '回答后继续处理一道追问。'
  },
  {
    id: 'review',
    label: '复盘局',
    kind: 'mode',
    eyebrow: '挑战模式',
    description: '从真实决策回看证据链。',
    modifier: '结尾列出一个可改进的工程决策。'
  },
  {
    id: 'pressure',
    label: '压力局',
    kind: 'mode',
    eyebrow: '挑战模式',
    description: '在质疑中守住判断依据。',
    modifier: '必须回应一个反例或反方观点。'
  }
]
