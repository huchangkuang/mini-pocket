## Context

项目为 Taro 3.6 + React + SCSS 微信小程序。「做个决定吧」位于 `pages/doDescription/`，含主页（转盘 + 常用列表）与编辑页（`edit/index`，通过 `type=edit|add` 区分编辑转盘 / 添加常用）。当前实现使用绿色渐变背景、`conic-gradient` 转盘、长按删除常用项，与已落地的 MD3 Token（`src/style/tokens.scss`）及工作坊首页风格不一致。

Stitch 输出了三页 HTML 设计稿（Tailwind + Material Symbols），需转为 Taro 可用实现。

**平台约束**（与首页 redesign 一致）：
- 不支持 Tailwind runtime、Google Fonts、Material Symbols Icon Font
- 尺寸使用 `rpx`（750 设计稿，1px ≈ 2rpx）
- 移动端无 hover，交互用 `:active` + scale
- 二级工具页通过 `navigateTo` 进入，**不渲染 BottomNav**

**用户决策**：
- 二级页不显示 Tab
- 旋转结果展示暂不实现，留 TODO
- 删除常用改到主页顶栏 `⋯` ActionSheet
- 三页（主页 + 编辑 + 添加常用）一起改
- 默认选项改为：火锅、披萨、寿司、烤肉、面条、沙拉

## Goals / Non-Goals

**Goals:**
- 三页 UI 对齐 Stitch MD3 设计稿，复用 `tokens.scss`
- 保留现有数据层（`decisionConfig`、`USE_LIST` localStorage CRUD）
- 转盘双入口旋转（中心 GO + 底部「开始抽取」），动画 4s cubic-bezier
- 常用列表始终展示（含空态），卡片式布局 + accent 轮换
- 编辑/添加页共用 `edit/index.tsx`，分支渲染差异区块
- 主页顶栏 `⋯` 提供删除选中常用项与分享

**Non-Goals:**
- 旋转结束后展示结果（TODO 占位，后续迭代）
- 智能生成 banner 真实功能（占位 toast）
- 二级页 BottomNav
- 修改 `DecisionItem` 数据结构或云同步
- 编辑页/添加页独立路由拆分
- 自定义字体加载、暗色模式

## Decisions

### D1: 复用 conic-gradient 转盘，换 MD3 配色

**选择**：保留现有 `conic-gradient` + 绝对定位文字方案，扇区色改为 `#f2f4f7` / `#ffffff` 交替，文字改为 `#404752`。

**理由**：改动最小，微信基础库 2.19+ 支持 conic-gradient；现有旋转逻辑可直接复用。

**备选**：Canvas 2D 绘制 — rejected，开发量大，当前文字方案可读性在 ≤8 选项时可接受。

### D2: 原生导航栏 + 内容区 MD3

**选择**：二级页继续使用微信原生导航栏（更新 `index.config.ts` / `edit.config.ts` 背景色为 `#f7f9fc`、标题文案），内容区应用 MD3 组件样式。

**理由**：减少胶囊区域自定义适配工作量；设计稿顶栏结构与原生 nav 等价（返回 + 标题 + 右侧操作可通过 `navigationBar` + 页面内按钮或后续扩展）。

**备选**：`navigationStyle: custom` + `NavBar` — rejected 为首版，除非原生 nav 无法满足右侧 `⋯` 按钮（可在页面内容顶部放操作区，或使用 Taro 自定义导航组件）。

**实现要点**：主页 `⋯` 菜单放在页面内 sticky 区域或使用 `showActionSheet`；若原生 nav 无右侧 slot，在内容顶部右侧放 `⋯` 按钮对齐设计。

### D3: edit/add 单文件分支，共享 OptionRow

**选择**：`edit/index.tsx` 内 `isAdd = type === 'add'` 分支渲染不同 Hero / 装饰区块；选项行逻辑抽为同文件 `OptionRow` 子组件。

**理由**：保存逻辑、选项增删、校验完全相同，避免双文件漂移。

**差异保留**：
| 区块 | edit | add |
|------|------|-----|
| 导航标题 | 编辑转盘 | 添加常用 |
| Hero | Decision Tool 标签 + 副标题 | 决策主题标签 |
| 问题输入 | 卡片内 recessed input | 单行 input + edit 图标 |
| 选项图标容器 | 方角 rounded-lg | 圆形 rounded-full |
| 底部装饰 | 智能生成 banner | 插图 + 说明文案 |
| 保存后 | updateLocalItem 或仅 decisionConfig | addLocalItem |

### D4: 常用项图标按 index 轮换 accent

**选择**：列表项与选项行图标底按 index % 3 轮换 primary / tertiary / secondary accent，统一使用 `decision.svg` 或 AtIcon 内置图标。

**理由**：与 `ToolCard` accent 模式一致，无需扩展 `DecisionItem` 类型。

### D5: 删除交互迁移至 ActionSheet

**选择**：移除 `onLongPress` + `showModal`；主页顶栏 `⋯` 点击 `Taro.showActionSheet`，当 `selectId` 存在时显示「删除此常用」，确认后调用 `deleteLocalItem`。

**理由**：符合用户决策；与设计稿顶栏 `more_horiz` 一致。

### D6: 默认数据更新

```typescript
// store.ts
title: "今晚吃什么？",
list: ["火锅", "披萨", "寿司", "烤肉", "面条", "沙拉"],
```

仅影响新用户或未持久化场景；已有 localStorage 数据不受影响。

### D7: 添加页插图

**选择**：优先使用本地 asset（`src/images/` 下 workshop 风格占位图）；若无素材，暂用 `decision.svg` 居中展示。

**理由**：小程序不支持 Stitch 外链 Google CDN 图片作为生产依赖。

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| conic-gradient 低端机兼容 | 真机验证；fallback 纯色圆盘 |
| 选项 >8 个时扇区文字拥挤 | 动态缩小字号；edit 页不限选项数逻辑不变 |
| 旋转结果未展示，用户不知落点 | TODO 注释 + 后续 Modal；当前与设计稿一致 |
| edit/add 单文件分支复杂度 | OptionRow 抽取；SCSS 用 BEM  modifier 区分 |
| 原生 nav 无法放右侧 ⋯ | 页面内 top-right 浮动按钮对齐视觉 |

## Migration Plan

1. 更新 `store.ts` 默认值（非破坏性，不影响已存 USE_LIST）
2. 逐页替换 UI，保留 navigateTo / navigateBack 路由不变
3. 移除长按删除，发布说明中无需用户迁移操作
4. 回滚：git revert 单 change，无数据 schema 变更

## Open Questions

- 添加页插图最终 asset 是否由设计提供？（实现阶段可用 decision.svg 占位）
- 主页 `⋯` 是否需「分享」入口？（建议保留 `useShareAppMessage`，ActionSheet 第二项）
