## Context

项目为 Taro 3.6 + React + SCSS 微信小程序。「节拍器」位于 `pages/metronome/index`，当前为 `#333` 深色背景 + 4 根高竖条 + Picker 选常用频率 + 表单行自定义输入 + 小 play/stop 图标。核心逻辑：`setInterval` 驱动 4/4 节拍循环，`InnerAudioContext` 播放 `beat_cut.mp3`。

Stitch 输出了 Tailwind + Material Symbols HTML 设计稿，需转为 Taro 可用实现，并与已落地的 MD3 Token（`src/style/tokens.scss`）及 decision-tool redesign 的平台约束保持一致。

**平台约束**（与首页 / decision-tool redesign 一致）：
- 不支持 Tailwind runtime、Google Fonts、Material Symbols Icon Font
- 尺寸使用 `rpx`（750 设计稿，1px ≈ 2rpx）
- 移动端无 hover，交互用 `:active` + scale
- 二级工具页通过 `navigateTo` 进入，**不渲染 BottomNav**

**探索阶段决策**（已写入 proposal）：
- 「查看全部」→ ActionSheet 展示完整 `CommonBeatList`
- 播放中允许改 BPM，变更后重启计时
- 声音/震动开关持久化 localStorage
- 顶栏 `⋯`/`⚙` 首版不实现
- 预设固定 4 个：60 / 72 / 84 / 120

## Goals / Non-Goals

**Goals:**
- 单页 UI 对齐 Stitch MD3 设计稿，复用 `tokens.scss`
- 保留现有节拍核心逻辑（4/4 循环、1–208 BPM 校验、分享）
- 中央 BPM Dial：大数字、± 按钮、SVG 进度弧（BPM/208）
- 4 预设卡片 + ActionSheet 全量列表
- 声音/震动开关（默认开/关，localStorage 持久化）
- FAB 播放/暂停，节拍胶囊 active 动画
- 原生导航栏浅色化

**Non-Goals:**
- 顶栏 `⋯`/`⚙` 菜单与独立设置页
- 二级页 BottomNav
- 多拍号（3/4、6/8）、复合节奏
- 暗色模式、自定义字体
- 修改 `CommonBeatList` 数据内容（仅改 UI 入口）

## Decisions

### D1: 单文件重构 index.tsx + index.scss

**选择**：在现有 `pages/metronome/` 目录内重构，不拆分子组件文件（除非 SCSS 超过 ~200 行时再抽 `BeatDial` 内联组件）。

**理由**：当前页面逻辑 ~170 行，与 decision-tool 单页复杂度相当；减少文件跳转成本。

**备选**：独立 `components/BeatDial/` — rejected 为首版，YAGNI。

### D2: SVG 进度环映射 BPM

**选择**：Taro 内嵌 `<svg>` + `<circle stroke-dasharray>`，周长按 `2πr` 计算，`strokeDashoffset = circumference * (1 - bpm/208)`。

**理由**：与设计稿一致；微信小程序基础库支持 SVG；BPM 变化时仅更新 offset。

**备选**：Canvas 2D — rejected，过重；conic-gradient — rejected，弧环端点 cap 不如 SVG 精确。

### D3: BPM 状态模型统一

**选择**：单一 `bpm` state（默认 72），预设卡片 / ± 按钮 / 自定义输入 / ActionSheet 均写入同一 state；自定义输入有值时清除预设卡片高亮，反之匹配预设则高亮对应卡片。

**理由**：设计稿以中央 Dial 为单一真相源；消除现有 `selectNum` + `customBeatNum` 双轨歧义。

**迁移**：
- 移除 `selectNum` index 与 Picker
- `customBeatNum` 改为受控 Input，blur/confirm 时同步 `bpm`
- 播放 interval 始终读当前 `bpm`

### D4: 预设 + ActionSheet 替代 Picker

**选择**：
```typescript
export const PRESET_BPM_LIST = [60, 72, 84, 120] as const;
// CommonBeatList 保留，供 ActionSheet itemList
```

「查看全部」点击 → `Taro.showActionSheet({ itemList: CommonBeatList.map(String) })` → 选中后 `setBpm(Number)`。

**理由**：最小改动复用现有 32 值数据；ActionSheet 为小程序原生体验。

### D5: 播放中 BPM 变更自动重启

**选择**：`setBpm` 时若 `beating === true`，先 `clearInterval` 再按新 BPM 重启 interval 并重置 `curN` 到 0。

**理由**：对齐设计稿交互；比 disabled 锁定更符合「边听边调」场景。

### D6: 反馈开关与持久化

**选择**：
```typescript
const STORAGE_KEY = 'metronome_settings';
interface MetronomeSettings { soundEnabled: boolean; vibrateEnabled: boolean; }
// 默认 { soundEnabled: true, vibrateEnabled: false }
```

- 声音关：`goBeatN` 跳过 `innerAudioContext.play()`
- 震动开：每拍 `Taro.vibrateShort({ type: 'medium' })`（支付宝需 `my.vibrateShort` 分支或 try/catch）

开关 UI 使用 Taro `<Switch>` 或 taro-ui `AtSwitch`，样式 SCSS 覆盖为 MD3 蓝色。

### D7: 原生导航栏 + 内容区 MD3

**选择**：更新 `index.config.ts`：
```typescript
navigationBarBackgroundColor: '#f7f9fc',
navigationBarTextStyle: 'black',
```

**理由**：与 decision-tool D2 一致；减少自定义 NavBar 适配成本。

### D8: FAB 与布局

**选择**：页面底部 `position: fixed` FAB，尺寸 `$fab-size`（112rpx），背景 `$color-primary-container`，图标复用现有 `start.svg` / `stop.svg` 或 `AtIcon` play/pause；主内容区 `padding-bottom` 预留 FAB + safe-area。

**理由**：tokens 已有 `$shadow-fab`；与设计稿视觉一致。

### D9: 节拍胶囊动画

**选择**：4 个 `View`，默认 `surface-container-highest` 背景、首拍更高；active 时 `transform: scaleY(1.2)`、`background: primary-container`、`box-shadow` glow。

**理由**：纯 CSS transition，无额外动画库；微信小程序 transform 性能可接受。

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| SVG 在部分旧版微信基础库渲染异常 | 真机验证；fallback 隐藏弧环仅保留数字 Dial |
| 支付宝 `vibrateShort` API 差异 | `IS_ALIPAY` 分支或 silent catch |
| 播放中频繁改 BPM 导致音频重叠 | 保持现有 `stop → seek(0) → play` 模式 |
| ActionSheet 最多 6 项（微信限制） | `CommonBeatList` 有 32 项，**需改用自定义半屏列表**而非原生 ActionSheet |
| 自定义输入与 bpm state 双写竞态 | Input 仅在有效整数时同步 bpm；清空时不改 bpm |

### D10 修正：ActionSheet 项数限制

**选择（修订 D4）**：「查看全部」改用页面内 `Modal` / 底部 `ScrollView` 面板展示 32 个 BPM 网格，而非 `showActionSheet`。

**理由**：微信小程序 `showActionSheet` itemList 上限 6 项，无法容纳 32 个常用值。

**备选**：保留 Picker 作为「查看全部」入口 — rejected，与 MD3 视觉不符。

## Migration Plan

1. 更新 `index.config.ts` 导航栏配色（非破坏性）
2. 重构 UI，保留路由 `/pages/metronome/index` 不变
3. 新增 localStorage settings key，无旧数据迁移需求
4. 回滚：git revert 单 change

## Open Questions

- 「查看全部」半屏面板是 4 列网格还是单列列表？（建议 4 列网格对齐预设卡片样式）
- 支付宝震动 API 是否需要在真机 spike？（实现阶段验证）
