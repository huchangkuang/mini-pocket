## Why

收藏页目前仅为「功能开发中」占位文案，与 Stitch 设计的完整收藏体验（搜索、筛选、横向收藏卡、空状态）差距较大。工作坊首页 UI 已落地，现在需要补齐收藏 Tab 的视觉与交互壳层，为后续真实收藏数据接入预留稳定 UI 结构。

## What Changes

- 将 `pages/favorites/index` 从纯占位升级为 Stitch 收藏页 UI
- 新增收藏页专用顶栏（终端图标 +「收藏」标题 + 筛选按钮占位）
- 新增搜索框、收藏页专用分类 Chips（全部 / 开发工具 / 效率办公 / 趣味生成）
- 新增横向 `FavoriteCard` 组件（图标、标题、描述、分类 tag、取消收藏爱心）
- 首版使用 **现有工具** 的 demo  mock 数据渲染列表，数据结构对齐 `classifyList`，便于后续替换为 storage 真数据而不改 UI
- 实现 Stitch 空状态页（心形 + 放大镜插图、「还没有收藏的工具」、去发现 CTA）
- 列表为空时展示空状态；取消全部收藏后自动切换
- 搜索与 Chips 对 demo 列表做本地过滤；筛选 tune、终端按钮为占位 toast
- 点击卡片跳转对应现有工具页；点击「去发现」跳转工作坊

## Capabilities

### New Capabilities

- `favorites-ui`: 收藏页完整 UI——顶栏、搜索、筛选 Chips、FavoriteCard 列表、空状态与占位交互

### Modified Capabilities

- `app-shell-navigation`: 收藏页从「纯占位文案」升级为具备 UI 壳层与 demo 列表/空状态双态展示

## Impact

- **页面**：`src/pages/favorites/index.tsx`、`index.scss` 大幅重构
- **组件**：新增 `favoritesTopBar`、`favoriteCard`、可选 `searchBar`；复用 `categoryChips`、`bottomNav`
- **数据**：新增 `src/pages/favorites/constants.ts`（demo 收藏列表、filter chips、tag 映射）；引用 `classifyList` 字段
- **资源**：新增空状态插图 `src/images/favorites/empty-heart.svg`（或 PNG）
- **Spec**：更新 `app-shell-navigation` 中收藏页占位要求
- **依赖**：无新 npm 依赖；不引入 Tailwind / Material Symbols
