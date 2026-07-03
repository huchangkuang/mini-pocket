## Why

当前小程序首页（`pages/classify/index`）视觉风格陈旧（绿色渐变 + 简单图标网格），与 Stitch 重新设计的「百宝口袋工坊」品牌与 Material 风格设计稿差距较大，影响产品专业感与工具发现体验。需要将 Stitch HTML 设计系统落地为 Taro 微信小程序可用实现，并同步完成品牌更名与底部导航框架搭建。

## What Changes

- 新增全局设计 Token 层（色彩、间距、圆角、字号），对齐 Stitch 提供的 MD3 色板
- 重构首页为「工作坊」布局：自定义 TopAppBar、今日推荐 Banner、Bento 工具卡片网格、分类 Chips（仅 UI，暂不过滤）
- 工具卡片增加副标题与三色 accent 图标底，保留现有跳转逻辑
- 新增自定义底部导航：工作坊 / 收藏 / 我的（收藏、我的为空白占位页）
- 新增 FAB 浮动按钮（占位，点击提示「开发中」）
- TopAppBar 搜索、终端按钮及「管理」链接均为占位交互
- **BREAKING**：产品名称由「简易口袋」全局更名为「百宝口袋工坊」（`app.config.ts` 等）
- **BREAKING**：首页从单页结构变为 Tab 壳层的一部分，需启用/实现底部 Tab 导航

## Capabilities

### New Capabilities

- `design-system-tokens`: 全局 SCSS 设计 Token（色彩、间距、圆角、字体尺度），供首页及后续页面复用
- `home-workshop-ui`: 工作坊首页 UI——TopAppBar、推荐 Banner、工具 Bento 网格、分类 Chips、FAB
- `app-shell-navigation`: 应用壳层底部 Tab 导航（工作坊 / 收藏 / 我的）及占位页路由

### Modified Capabilities

- `product-prd-baseline`: 产品名称由「简易口袋」更新为「百宝口袋工坊」；首页从纯分类网格升级为工作坊 Tab 壳层

## Impact

- **页面**：`src/pages/classify/index` 大幅重构；新增 `pages/favorites/index` 占位页；完善 `pages/mine/index` 占位页
- **组件**：新增或扩展 TopAppBar、ToolCard、BottomNav；可能复用现有 `navBar`、`bomFixed`
- **配置**：`src/app.config.ts`（tabBar、window 标题、页面注册）、`project.config.json`（项目名称）
- **数据**：`src/pages/classify/constants.ts` 扩展 `desc`、`accent` 字段（category 字段预留，Chips 暂不过滤）
- **样式**：`src/pages/classify/index.scss` 替换；新增 `src/style/tokens.scss`
- **依赖**：无新 npm 依赖；不使用 Tailwind / Material Symbols（沿用 SVG + SCSS）
- **平台约束**：小程序不支持 Google Fonts / Icon Font，毛玻璃用半透明底色兜底
