# Gemini Canvas 面试匹配轮参考说明

## 结论

Gemini Canvas 已生成并实际运行一个零依赖、单文件 HTML 原型：

- 原型文件：[gemini-canvas-prototype.html](./gemini-canvas-prototype.html)
- 视觉方向：深海军蓝/黑曜石、旧金/黄铜、青蓝能量、少量琥珀高光
- 实现边界：HTML/CSS/SVG 构成界面与转轮；唯一的 `<canvas>` 只负责命中粒子
- 内容模型：8 个匹配对象与独立题目牌库分开维护
- 状态机：`idle → searching → locking → reveal → dealing → ready`

原型没有引用 CDN、外链脚本、外链字体、外链图片或现有游戏资产。

## 验收记录

测试日期：2026-08-09（Asia/Shanghai）

| 项目 | 结果 |
| --- | --- |
| Gemini 登录状态 | 已登录 |
| Canvas 生成与预览 | 通过 |
| 验证码 | 未遇到 |
| 8 个匹配槽位 | 通过，SVG 8 等分，每格 45° |
| 匹配对象与题目牌库分离 | 通过，`OPPONENT_POOL` 与 `QUESTION_POOL` 独立 |
| 先确定对象再算角度 | 通过；PLAN 日志在锁定前产生 |
| 完整状态集合 | 通过 |
| 动画期间按钮禁用 | 通过；SEARCHING 时按钮不可用 |
| 两轮连续运行 | 通过；最终显示 ROUND 2 / READY |
| 控制台计划日志 | 2 条 `PLAN` |
| 控制台揭晓日志 | 2 条 `REVEAL` |
| 运行时 error | 0 条 |
| 第二轮结果示例 | 铁卫 贾克斯 / 算法结界题 |
| reduced motion | 已提供 CSS 覆盖，并将额外圈数从 5 圈降为 1 圈 |
| 自动验收入口 | `data-testid` 与 `window.__wheelTest` 已写入 |

测试使用 Canvas 预览内的真实按钮完成。首轮完成后点击“进入下一轮”回到 IDLE，再次启动并完成第二轮。

## 设计参数

### 色彩

| Token | 值 | 用途 |
| --- | --- | --- |
| `obsidian` | `#0B0F19` | 主背景 |
| `navyCard` | `#121829` | 卡牌和面板 |
| `brass` | `#C5A059` | 转轮边框 |
| `brassLight` | `#E5C07B` | 高亮文字 |
| `brassDark` | `#5E4823` | 金属暗部 |
| `cyanEnergy` | `#00E5FF` | 奥术能量和命中态 |
| `amberHighlight` | `#FFB300` | 搜索态和稀有度强调 |

### 尺寸与运动

| 参数 | 值 |
| --- | --- |
| 槽位数量 | 8 |
| 单槽角度 | 45° |
| 移动端轮盘 | 320 × 320 px |
| 桌面轮盘 | 440 × 440 px |
| searching | 1400 ms，linear，视觉上转 720° |
| locking | 2800 ms，`cubic-bezier(0.12, 0.85, 0.25, 1.02)` |
| reveal 发光 | 800 ms |
| dealing | 900 ms |
| 卡牌飞入 | 600 ms |
| 卡牌翻面延迟 | 300 ms |
| 普通额外圈数 | 5 圈 |
| reduced-motion 额外圈数 | 1 圈 |
| 命中粒子数 | 45 |

落点公式：

```text
sectorCenter = slotIndex × 45 + 22.5
baseLandingAngle = (360 - sectorCenter) % 360
lastLandingAngle = extraRounds × 360 + baseLandingAngle
```

流程先从 `OPPONENT_POOL` 选出 `targetOpponent`，记录 `targetOpponentId` 和 PLAN，再根据 `slotIndex` 计算落点。锁定完成后才从独立 `QUESTION_POOL` 抽题并记录 REVEAL。

## 可借鉴点

- 用 SVG path 动态构造 8 个扇区，文字与符号随扇区旋转，适合 React 组件化。
- 用 DOM transform 驱动轮盘，保留可访问的按钮、文字、焦点和响应式布局。
- 用 Canvas 只做一次性粒子爆发，避免把题目和交互全部画进画布。
- 通过显式状态机集中控制按钮禁用、阶段提示、轮盘动画和卡牌揭晓。
- `data-testid`、aria-live 和只读测试接口让动画可以自动验收。
- 颜色、时间参数集中定义，方便正式版本抽成 CSS variables 和 TypeScript 常量。

## 已知限制

1. Gemini 首次生成的源码被截断在 Tailwind 配置开头；第二次要求“完整重写、零依赖、自检闭合标签”后才得到可运行版本。
2. Canvas 代码编辑器在自动读取时只暴露可见片段，因此最终通过“下载”取得完整源码；下载事件回调超时，但文件已正常落入下载目录。
3. Canvas 预览位于跨域沙箱 iframe 中，浏览器自动化无法可靠读取页面的自定义全局对象；验收改用 `data-testid`、可见 ROUND/READY 状态和控制台 PLAN/REVEAL 日志。
4. 当前 `ready` 按钮第一次点击只进入下一轮 IDLE，需要再次点击才开始转轮。正式产品可合并成一次点击。
5. reduced-motion 会取消视觉过渡和 3D 翻转，并减少圈数，但状态机等待时间仍沿用普通时长；正式实现建议同步缩短到 300 ms 左右。
6. 示例题库只有 7 道题，仅用于表现牌库与匹配对象分离；正式应用应接入真实题库、去重和难度过滤。
7. 图标使用系统 emoji，跨平台外观可能不同；正式版本可替换为项目自有 SVG 符文系统。
