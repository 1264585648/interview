# Match Arena V2 验收记录

验收日期：2026-08-09

## 结论

V2 通过游戏场景化、交互、响应式、构建与运行时验收。`/match` 是独立全屏试炼场，不复用旧 `MatchWheel`、站点导航、后台容器或左右栏结构。

## 实测结果

- 完整状态链：`idle → searching → locking → reveal → dealing → ready`。
- 轮盘只匹配 8 个对手或挑战模式；题目在匹配揭晓后从独立牌库发出。
- Canvas 命中粒子、Web Audio、卡背飞行和 3D 翻面均正常。
- 题目链接可进入真实题目页，“再开一局”可重新开始匹配。
- dealing 阶段没有题目链接或重开按钮；ready 后才挂载并开放操作。
- 320px、768px、1440px 均无页面级横向溢出。
- 320px ready 题卡完整居中，两个操作按钮均在视口内。
- 浏览器控制台：0 warning、0 error。
- `git diff --check` 通过；`npm run build` 通过，`/match` 成功静态生成。
- `NEXT_PUBLIC_BASE_PATH` 已应用于三类游戏图片，可用于静态子路径部署。

## 稳定性与可访问性

- 用户手势后才初始化 AudioContext，流程退出时统一停止动画和 interval。
- 粒子使用 delta time，生命周期不依赖 60Hz/120Hz 刷新率，也不会在 reveal 结束时突然截断。
- `prefers-reduced-motion` 跳过连续旋转、粒子和长距离飞牌，并保留可辨识的阶段停留时间。
- 状态由唯一 `aria-live` 区域播报；ready 后焦点移动到题目链接。
- 主体状态动画仅使用 `transform` 与 `opacity`。

## 截图

- `qa-screenshots/arena-v2-1440-idle.png`
- `qa-screenshots/arena-v2-1440-ready.png`
- `qa-screenshots/arena-v2-768-reveal.png`
- `qa-screenshots/arena-v2-768-dealing.png`
- `qa-screenshots/arena-v2-320.png`
