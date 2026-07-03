## Context

项目为 Taro 3.6 + React + SCSS 微信小程序。「猜数字」位于 `pages/guessNumber/index`，当前为 `#f5f5f5` 浅色背景 + 旧 Ant Design 蓝（`#1890ff`）+ 简单白卡片布局。核心逻辑已实现：四位数字目标设置、A/B 计算、历史记录、胜负判定。

Stitch 输出了 Tailwind + Material Symbols HTML 设计稿，需转为 Taro 可用实现，并与已落地的 MD3 Token（`src/style/tokens.scss`）及节拍器 / 反方向的钟 redesign 的平台约束保持一致。

**平台约束**（与 decision-tool / metronome redesign 一致）：
- 不支持 Tailwind runtime、Google Fonts、Material Symbols Icon Font
- 尺寸使用 `rpx`（750 设计稿，1px ≈ 2rpx）
- 移动端无 hover，交互用 `:active` + scale
- 二级工具页通过 `navigateTo` 进入，**不渲染 BottomNav**

**探索阶段决策**（已写入 proposal）：
- 顶栏设置齿轮 **不实现**
- 目标锁定按钮文案 **「锁定目标」**
- **首版不做**「清空记录」
- **允许**四位数字重复
- 猜对后使用 **Modal** 反馈（含重新开始）

## Goals / Non-Goals

**Goals:**
- 单页 UI 对齐 Stitch MD3 设计稿，复用 `tokens.scss`
- 保留现有 A/B 算法与 hidden Input + 4 格展示交互模式
- 游戏规则 info 卡片、目标锁定两态、猜测卡片、历史徽章
- 历史不足 2 条时显示虚线空状态占位
- 胜利 Modal + 重新开始
- 原生导航栏浅色化

**Non-Goals:**
- 顶栏设置页 / 随机目标 / 位数切换
- 「清空记录」功能
- 重复数字校验
- 二级页 BottomNav
- 暗色模式、自定义字体
- 修改 classify 入口卡片
- 抽取通用 `NumberInputGrid` 组件（首版页面内聚）

## Decisions

### D1: 页面内聚，单文件重构

**选择**：在现有 `pages/guessNumber/` 目录内重构 `index.tsx` + `index.scss`，不拆分子组件。

**理由**：当前页面逻辑 ~220 行，与 metronome redesign 复杂度相当；减少文件跳转成本。

**备选**：抽 `components/NumberInputGrid/` — rejected 为首版，YAGNI。

### D2: 原生导航栏 + 内容区 MD3

**选择**：继续使用微信原生导航栏，更新 `index.config.ts` 背景色为 `#f7f9fc`、`navigationBarTextStyle: "black"`、标题「猜数字游戏」。

**理由**：与其他二级工具页一致；设计稿自定义 TopBar 与设置齿轮不做。

### D3: 保留 hidden Input 交互模式

**选择**：视觉上 4 格独立输入框（当前格 primary 描边 + ring），逻辑层保留单个 hidden `Input` 驱动输入与焦点。

**理由**：小程序中多 Input 焦点切换不稳定；现有实现已验证可用；仅改 SCSS 与 class 绑定即可对齐设计稿。

**备选**：4 个独立 Input — rejected，Taro 焦点与键盘体验风险高。

### D4: 目标数字两态 UI

**选择**：

| 状态 | 展示 |
|------|------|
| 未锁定 | 4 格可输入数字 + 全宽「锁定目标」主色按钮 |
| 已锁定 | 标题行右侧「已锁定」徽章；4 格虚线边框显示 `*`；隐藏锁定按钮；猜测区出现 |

**理由**：聚会场景 A 设数 B 猜的两阶段流程保留；设计稿仅展示锁定后态，未锁定态沿用同一视觉语言。

### D5: 历史结果徽章拆分

**选择**：`calculateResult()` 仍返回 `"0A4B"` 字符串；展示层解析为两个 pill 徽章：

```typescript
const parseResult = (result: string) => {
  const match = result.match(/^(\d)A(\d)B$/);
  return match ? { a: match[1], b: match[2] } : { a: "0", b: "0" };
};
```

- `XA` → `bg-primary-container` / `text-on-primary-container`
- `YB` → `bg-secondary-container` / `text-on-secondary-container`

历史项左侧显示 `#01` 序号（`String(index + 1).padStart(2, "0")`）。

### D6: 胜利反馈 Modal

**选择**：猜对（`4A0B`）时调用 `Taro.showModal`：

```typescript
Taro.showModal({
  title: "恭喜猜对了！",
  content: `用了 ${attempts} 次`,
  confirmText: "重新开始",
  showCancel: false,
}).then((res) => {
  if (res.confirm) resetGame();
});
```

**理由**：用户明确选择 Modal；页内保留历史列表供回顾；移除现有 `gameOverSection` 区块。

**备选**：保留 Toast + 页内区块 — rejected，与 Modal 决策冲突。

### D7: 历史空状态占位

**选择**：当 `results.length < 2` 时，在历史列表底部渲染虚线占位卡片，文案「继续猜测以查看更多历史」。

**理由**：对齐设计稿；有 0 或 1 条历史时均显示，引导继续游戏。

### D8: 图标方案

**选择**：规则卡片 info 图标、验证按钮 check 图标使用 taro-ui `AtIcon`（`alert-circle`、`check-circle`）。

**理由**：项目已有 taro-ui 依赖；无需引入 Material Symbols。

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| hidden Input 点击区域小 | 整个 inputGrid 区域 onClick 聚焦 hidden Input（现有模式保留） |
| Modal 与 Toast 重复提示 | 胜利时仅 Modal，移除 success Toast |
| 锁定后无法修改目标 | 需「重新开始」才能换目标——符合聚会游戏规则，Modal 确认后 reset |
| 设计稿 4 独立 Input 与实现视觉差异 | 通过 focus class 模拟当前格高亮，用户感知一致 |

## Migration Plan

1. 更新 `index.config.ts` 导航栏
2. 重写 `index.scss`（tokens.scss）
3. 重构 `index.tsx` JSX 结构与 Modal 逻辑
4. 移除 `gameOverSection` 及相关样式
5. 本地 `npm run dev:weapp` 验证完整游戏流程

无数据迁移；无 API 变更；可随时回滚单页三文件。

## Open Questions

（无——探索阶段决策已全部确认）
