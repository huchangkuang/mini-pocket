## Context

项目为 Taro 3.6 + React + SCSS 微信小程序。「反方向的钟」位于 `pages/returnClock/index`，当前为深色拟物风单页模拟钟：`setInterval(1s)` 驱动 `time -= 1000`，数字 1-12 顺时针排列，无数字时间、无模式控制，与已落地的 MD3 Token（`src/style/tokens.scss`）及已改版工具页风格不一致。

Stitch 输出了 HTML 设计稿（Tailwind + Material Symbols），需转为 Taro 可用实现。

**平台约束**（与 decision-tool / barrage redesign 一致）：
- 不支持 Tailwind runtime、Google Fonts、Material Symbols Icon Font
- 尺寸使用 `rpx`（750 设计稿，1px ≈ 2rpx）
- 移动端无 hover，交互用 `:active` + scale
- 二级工具页通过 `navigateTo` 进入，**不渲染 BottomNav**

**用户决策**：
- 钟面数字 **逆时针**排列，指针 **负角度**旋转
- 默认模式 **1x 逆流**（与现有一致），非 10x 加速
- 加速倍率 **写死 10x**
- **不做**设置按钮
- **不显示** TabBar
- **只改** `returnClock/index` 单页

## Goals / Non-Goals

**Goals:**
- 单页 UI 对齐 Stitch MD3 设计稿，复用 `tokens.scss`
- 逆时针表盘（数字 CCW + 指针负角度）+ 数字时间 + 状态文案
- 三模式控制：加速逆流（1x/10x 两档）、时空暂停、正常流动
- `requestAnimationFrame` 平滑驱动，页面 hide/unmount 时清理
- 保留 `useShareAppMessage` 分享能力

**Non-Goals:**
- 设置页 / 倍率可调
- BottomNav / 自定义 TopBar
- classify 入口卡片样式改动
- 抽取通用 `AnalogClock` 或 `FlowModeButton` 组件（首版页面内聚）
- 自定义字体、暗色模式

## Decisions

### D1: 页面内聚，不抽通用组件

**选择**：钟面、控制按钮、状态行均在 `returnClock/index.tsx` + `index.scss` 内实现。

**理由**：当前仅一处使用；与 barrage 的 `toolEdit` 抽取策略不同，本页控制区为 Bento 图标按钮，形态独特。

**备选**：抽 `components/analogClock` — rejected 为首版，待 metronome 等工具需求明确后再统一抽象。

### D2: 原生导航栏 + 内容区 MD3

**选择**：继续使用微信原生导航栏，更新 `index.config.ts` 背景色为 `#f7f9fc`、`navigationBarTextStyle: "black"`。

**理由**：与其他二级工具页一致；设计稿设置齿轮不做。

### D3: 逆时针表盘实现

**选择**：保留 12 个绝对定位数字 View，角度改为 CCW（`--angle: 0, -30, -60, ... -330`），指针旋转使用负角度：

```typescript
const sDeg = (s + ms / 1000) * -6;
const mDeg = (m + s / 60) * -6;
const hDeg = ((h % 12) + m / 60) * -30;
```

**理由**：与 HTML 稿一致，直观表达「反方向的钟」；复用现有 DOM 结构，改动小于 Canvas。

**备选**：无数字极简表盘（截图风格）— rejected，用户明确选择逆时针数字。

### D4: rAF 时间驱动

**选择**：`fakeTime` ref + `requestAnimationFrame` 循环，按 delta 更新：

| 模式 | 变化 |
|------|------|
| `reverse` | `fakeTime -= delta` |
| `accelerate` | `fakeTime -= delta * 10` |
| `pause` | 不变 |
| `normal` | `fakeTime += delta` |

**理由**：秒针平滑、加速模式自然；比 `setInterval(1000)` 体验更好。

**生命周期**：`useEffect` 启动 rAF；`useDidHide` / cleanup 取消 `cancelAnimationFrame`。

### D5: 「加速逆流」按钮两档切换

**选择**：三按钮布局不变（加速逆流 | 时空暂停 | 正常流动）。第一个按钮承担两档：

- 进入页面：模式 `reverse`（1x），按钮激活，状态「时光逆流中...」
- 已在 reverse/accelerate 且按钮已激活时再点：在 `reverse` ↔ `accelerate`（10x）间切换
- 从 pause/normal 点回「加速逆流」：重置为 `reverse` 1x

**理由**：保留设计稿三按钮布局；默认 1x 与「加速逆流」文案不矛盾（首次进入是 1x 逆流，再点才 10x）。

### D6: 控制按钮视觉

**选择**：
- **激活态**：primary 蓝底 + 白字，**无图标**（对齐截图）
- **未激活态**：`surface-container-low` 底 + `outline-variant` 边框 + AtIcon 图标在上 + 文字在下

图标映射：`fast_rewind` → AtIcon 或等价；`pause` / `play` 同理。

### D7: 视觉细节

| 元素 | 实现 |
|------|------|
| 页面背景 | `#f7f9fc` + 点阵 radial-gradient（opacity 0.03） |
| 钟面 | 576rpx 直径，径向渐变 + 8rpx 白边 + 柔和阴影 |
| 数字时间 | 96rpx tabular-nums，`HH:MM:SS` |
| 状态行 | 圆点 + 文案；reverse/accelerate 加 `breathe` 动画 |
| 秒针 | `#b7131a`（secondary）；时分针 `#191c1e` / `#404752` |
| 中心点 | primary 蓝 + 白边 |

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| rAF 后台耗电 | `useDidHide` 停止循环，`useDidShow` 恢复 |
| 「加速逆流」两档 UX 不直观 | 状态文案区分 1x/10x；首版无 tooltip |
| AtIcon 无 exact Material Symbol | 选最接近图标或内联 SVG |
| 逆时针数字在小屏拥挤 | 576rpx 钟面 + 28rpx 字号，与现有 400px 相当 |

## Migration Plan

1. 重写 `index.tsx` / `index.scss`，更新 `index.config.ts` 导航栏色
2. 路由、分享 path 不变；无数据迁移
3. 回滚：git revert 单 change

## Open Questions

- 无（探索阶段用户决策已闭合）
