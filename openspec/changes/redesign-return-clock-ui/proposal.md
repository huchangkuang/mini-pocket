## Why

「反方向的钟」（`pages/returnClock/index`）仍使用深色拟物风单页时钟，仅有固定 1x 逆流逻辑，与已落地的 MD3 设计体系（`tokens.scss`、工作坊首页及已改版工具页）视觉与交互体验严重脱节。Stitch 已输出完整 HTML 设计稿，需对齐浅色 MD3 风格，并补充数字时间、状态文案与三模式控制，强化「逆流时钟」的产品表达。

## What Changes

- 重构 `pages/returnClock/index` 页面 UI：浅色 surface 背景、点阵纹理、MD3 钟面（逆时针数字 + 负角度指针）、数字时间、状态指示行
- 新增三模式控制：**加速逆流**（1x 默认 / 再点 10x 切换）、**时空暂停**、**正常流动**
- 时钟驱动从 `setInterval(1s)` 改为 `requestAnimationFrame` + delta 时间，秒针平滑更新
- 更新 `index.config.ts`：导航栏背景 #f7f9fc、标题样式与 MD3 一致
- 移除旧版深色拟物 SCSS（#333 背景、重阴影边框）
- 二级页**不显示** BottomNav；**不做**设置按钮

## Capabilities

### New Capabilities

- `return-clock-ui`: 「反方向的钟」单页 UI 与三模式时钟交互——逆时针表盘、数字时间、状态文案、模式控制按钮

### Modified Capabilities

（无——本变更为工具子页 UI 改造，不修改 app-shell 或 product-prd 规范）

## Impact

- **页面**：`src/pages/returnClock/index.tsx`、`index.scss`、`index.config.ts`
- **数据**：无持久化层变更；`fakeTime` 为页面内 ref 状态
- **组件**：页面内聚实现，不新增通用组件（首版）
- **保留行为**：`useShareAppMessage` 分享能力不变
- **依赖**：无新 npm 依赖
- **平台约束**：不使用 Tailwind / Material Symbols / Google Fonts；二级页无 BottomNav
