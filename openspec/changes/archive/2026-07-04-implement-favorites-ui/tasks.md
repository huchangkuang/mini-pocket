## 1. 组件与资源

- [x] 1.1 新建 `src/components/favoritesTopBar/`（终端 + 标题「收藏」+ 筛选 tune，适配胶囊高度）
- [x] 1.2 新建 `src/components/favoriteCard/`（横向布局：icon、title、desc、tag、爱心取消收藏）
- [x] 1.3 新建 `src/components/searchBar/` 或在 favorites 页内联搜索框（placeholder、左侧图标）
- [x] 1.4 新建空状态插图 `src/images/favorites/empty-heart.svg`（心形 + 放大镜）
- [x] 1.5 新建 `src/components/favoritesEmpty/` 或页内空状态区块（插图 + 文案 + 去发现 CTA）

## 2. 数据层

- [x] 2.1 新建 `src/pages/favorites/constants.ts`：`demoFavorites`（3 条现有工具）、`favoriteFilterChips`、类型定义
- [x] 2.2 从 `classifyList` 映射 demo 数据，含 `favoriteCategory`（efficiency/fun/dev）与 `tag` 展示字段

## 3. 收藏页重构

- [x] 3.1 重构 `src/pages/favorites/index.tsx`：FavoritesTopBar + SearchBar + CategoryChips + 列表/空状态 + BottomNav
- [x] 3.2 实现本地 state：`favorites`、`searchQuery`、`selectedChip`；搜索 + Chips 过滤逻辑
- [x] 3.3 实现取消收藏（♥）移除项，列表空时切换 FavoritesEmpty
- [x] 3.4 占位交互：终端、筛选 tune → errorToast
- [x] 3.5 卡片点击 navigateTo；去发现 → reLaunch 工作坊
- [x] 3.6 重写 `src/pages/favorites/index.scss`：列表、搜索框、空状态样式，复用 tokens

## 4. 验证

- [x] 4.1 运行 `npm run build:weapp` 编译通过
- [x] 4.2 确认 demo 列表展示 3 个现有工具，点击可跳转
- [x] 4.3 确认搜索与 Chips 过滤生效
- [x] 4.4 确认取消全部收藏后展示空状态，「去发现」跳转工作坊
- [x] 4.5 确认 BottomNav 收藏 Tab 选中态正常
