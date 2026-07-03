## Why

猜数字游戏页（`pages/guessNumber`）仍沿用旧版 `#f5f5f5` + `#1890ff` 表单布局，与已落地的 MD3 设计体系（`tokens.scss`、工作坊首页及已 redesign 的节拍器、反方向的钟等工具页）严重脱节。Stitch 已输出完整二级页设计稿（游戏规则卡片、目标锁定态、猜测输入区、历史徽章），需对齐实现以统一品牌体验并提升聚会场景下的可读性与操作反馈。

## What Changes

- 重构猜数字单页 UI：浅色 MD3 背景（`#f7f9fc`）、游戏规则 info 卡片、目标数字独立区块（未锁定可输入 / 锁定后虚线 `*` +「已锁定」徽章）
- 目标锁定按钮文案改为「锁定目标」（替代现有「完成」）
- 猜测区改为 MD3 卡片：4 格数字输入（视觉对齐设计稿，保留 hidden Input 交互模式）、全宽胶囊「验证」按钮（含 ✓ 图标）
- 历史猜测区：`#NN` 序号 + 分离的 `XA` / `YB` 徽章（primary / secondary 色）；历史不足 2 条时显示虚线空状态占位
- 猜对后使用 **Modal** 展示祝贺与「重新开始」（移除现有页内 gameOver 区块作为主要反馈）
- 更新原生导航栏为浅色（`#f7f9fc`、黑色标题「猜数字游戏」）
- 二级页**不显示**底部 Tab 导航；顶栏设置齿轮**不实现**
- **首版不做**「清空记录」功能
- **允许**四位数字重复（如 `1122`），不做唯一性校验
- 保留现有 A/B 计算逻辑、`useShareAppMessage` 分享能力

## Capabilities

### New Capabilities

- `guess-number-ui`: 猜数字二级页 MD3 UI 与交互——规则说明、目标锁定两态、猜测输入、历史徽章展示、Modal 胜利反馈

### Modified Capabilities

（无——本变更为工具子页 UI 改造，不修改 app-shell 或 product-prd 规范）

## Impact

- **页面**：`src/pages/guessNumber/index.tsx`、`index.scss`、`index.config.ts`
- **移除行为**：页内 `gameOverSection` 作为主要胜利反馈（改为 Modal）；「完成」按钮文案；设计稿中的「清空记录」入口
- **不变**：`classify/constants.ts` 入口映射；A/B 算法；允许重复数字规则
- **依赖**：无新 npm 依赖；图标使用 taro-ui `AtIcon` 或项目 SVG
- **平台约束**：不使用 Tailwind / Material Symbols / Google Fonts；二级页无 BottomNav；尺寸使用 rpx + `tokens.scss`
