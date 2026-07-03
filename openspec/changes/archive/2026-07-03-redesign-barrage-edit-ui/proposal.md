## Why

手持弹幕编辑页（`pages/handsBarrage/edit`）仍使用早期简陋表单布局（折叠「自定义」、Modal 选色、Picker 选模式），与工作坊/收藏/我的等已落地的 Stitch MD3 设计语言严重脱节。Stitch 已提供完整的弹幕编辑稿（实时预览、Bento 卡片、内联色板、固定底栏 CTA），现在需要补齐该工具二级页的 UI 壳层，并沉淀可复用的工具编辑组件供后续工具页改造使用。

## What Changes

- 将 `pages/handsBarrage/edit` 从旧表单布局升级为 Stitch 对齐的 Bento 卡片编辑页
- 新增顶部 **Live Preview** 实时预览区，所有配置项变更即时反映到预览
- 新增通用工具编辑组件库 `src/components/toolEdit/`（ToolFormCard、SegmentedControl、ColorSwatchGroup、ToolSliderRow、ToolTipCard、ToolBottomBar）
- 新增手持弹幕专用 `BarragePreview` 组件（21:9 预览区 + 三种动画模式）
- 弹幕形式改为 **3 段 SegmentedControl**（滚动弹幕 / 抖动文字 / 静止弹幕），保留现有三种 enum
- 颜色改为设计稿 **7 色内联色板**（4 字色 + 3 背景色），移除 Modal 9 色选择器
- 字号默认 64px、范围 20–100；滚动时间 1–10s；静止/抖动模式下滚动时间 Slider 禁用
- 底部固定 CTA「开始展示」（替代原「确认」按钮），保留现有 JSON 传参跳转逻辑
- 保留系统导航栏，不引入自定义 TopBar 或 TabBar
- **不改动**展示页（`pages/handsBarrage/index`）的交互与样式

## Capabilities

### New Capabilities

- `tool-edit-components`: 通用工具编辑 UI 组件——表单卡片、分段选择、色板、滑块行、提示卡、固定底栏 CTA
- `barrage-edit-ui`: 手持弹幕编辑页完整 UI——Live Preview、内容输入、三种弹幕形式、颜色/字号/时间配置、开始展示

### Modified Capabilities

（无——展示页与 Tab 导航行为不变，不涉及现有 spec 的需求变更）

## Impact

- **页面**：`src/pages/handsBarrage/edit/index.tsx`、`index.scss` 大幅重构
- **组件**：新增 `src/components/toolEdit/*`（6 个通用组件）、`src/components/barragePreview/*`
- **常量**：更新 `src/pages/handsBarrage/constants.ts`（7 色常量、「静止弹幕」文案）
- **不变**：`pages/handsBarrage/index` 展示页、路由传参格式、`BarrageType` enum 值
- **依赖**：无新 npm 依赖；复用 `tokens.scss`、`AtIcon`、`AtSlider` 或原生 Slider
