## Context

项目为 Taro 3.6 + React + SCSS 微信小程序，当前首页 `pages/classify/index` 为简单 2 列图标网格，背景为绿色渐变，无自定义顶栏、Banner、分类筛选或底部 Tab。Stitch 输出了一套基于 Tailwind + Material Design 3 色板的 HTML 设计稿，产品更名为「百宝口袋工坊」。

**平台约束**：
- 不支持 Tailwind runtime、Google Fonts、Material Symbols Icon Font
- `backdrop-filter` 支持有限，需半透明底色兜底
- 尺寸使用 `rpx`（750 设计稿，1px ≈ 2rpx）
- 移动端无 hover，交互用 `:active` + scale

**用户决策**：
- 底部 Tab 一起做，收藏/我的先空白占位
- 分类 Chips 仅 UI，暂不过滤
- 搜索、终端、管理、FAB 均为占位（toast「开发中」）
- 全局品牌更名为「百宝口袋工坊」

## Goals / Non-Goals

**Goals:**
- 将 Stitch 设计 Token 落地为 `src/style/tokens.scss`，全局可复用
- 重构 classify 页为工作坊 UI（TopAppBar + Banner + Bento 卡片 + Chips + FAB）
- 实现自定义 BottomNav（工作坊 / 收藏 / 我的），收藏/我的为占位页
- 保留现有工具跳转逻辑与 `excludeClassifyList` 过滤
- 全局更新产品名称

**Non-Goals:**
- 分类 Chips 真实过滤逻辑（后续迭代）
- 搜索、管理、FAB、终端按钮的业务功能
- 收藏页业务逻辑（用户后续单独加 spec）
- 自定义字体加载（Plus Jakarta Sans），先用系统字体
- 暗色模式
- 各工具子页面 UI 统一改造

## Decisions

### D1: SCSS Token 而非 Tailwind

**选择**：新建 `src/style/tokens.scss`，在 SCSS 中定义 MD3 色板与间距变量。

**理由**：项目已有 SCSS 体系，无 Tailwind 依赖；Token 文件可被各页面 `@import` 复用。

**备选**：引入 Tailwind for Taro —  rejected，增加构建复杂度且与现有 SCSS 混用。

### D2: 自定义 BottomNav 而非原生 tabBar

**选择**：新建 `src/components/bottomNav` 组件，固定在页面底部，三 Tab 切换用 `Taro.switchTab` 或 `reLaunch`。

**理由**：设计稿选中态为蓝色浅底圆角 pill，原生 tabBar 定制能力有限；FAB 需浮于底栏之上，自定义更灵活。

**备选**：启用 `app.config.ts` 原生 tabBar — rejected，难以还原设计稿视觉。

**实现要点**：
- Tab 页：`pages/classify/index`（工作坊）、`pages/favorites/index`（收藏）、`pages/mine/index`（我的）
- 非 Tab 工具页仍用 `navigateTo`，返回后 BottomNav 不显示（仅 Tab 页渲染 BottomNav）
- 底栏预留 `env(safe-area-inset-bottom)`

### D3: 扩展 NavBar 为 HomeTopAppBar

**选择**：新建 `src/components/homeTopBar`，复用 `getMenuButtonBoundingClientRect()` 适配胶囊按钮高度（与现有 `navBar` 相同模式）。

**理由**：classify 页 `navigationStyle: "custom"` 已启用；子工具页仍用带返回的 `navBar`，职责分离。

### D4: 图标沿用现有 SVG

**选择**：继续使用 `@/images/classify/*.svg`，不引入 Material Symbols。

**理由**：小程序不支持 web icon font；现有 SVG 已覆盖全部工具，符合 ui-ux-pro-max「不用 emoji 作图标」规范。

### D5: ToolCard 抽为组件

**选择**：`src/components/toolCard/index.tsx`，props: `icon`, `title`, `desc`, `accent`, `onClick`。

**理由**：Bento 网格与后续收藏页可能复用；accent 三色轮换在 `constants.ts` 预定义。

### D6: constants.ts 数据扩展

```typescript
type Accent = 'primary' | 'secondary' | 'tertiary';
type ToolItem = {
  icon: string;
  text: string;
  desc: string;
  path: string;
  accent: Accent;
  category?: string; // 预留，Chips 暂不使用
};
```

accent 按 index % 3 或显式指定，与 Stitch 设计一致。

### D7: 占位交互统一用 errorToast

**选择**：搜索、终端、管理、FAB 点击调用现有 `errorToast("更多功能正在开发中...")` 或专用文案。

**理由**：项目已有 `src/utils/errorToast.ts`，零新增依赖。

### D8: 页面布局结构

```
classify 页
├── HomeTopBar
├── ScrollView (padding-bottom 留底栏 + FAB 空间)
│   ├── FeaturedBanner
│   ├── SectionHeader ("全部工具" + "管理")
│   ├── bento-grid → ToolCard[]
│   └── CategoryChips (ScrollView scrollX, 静态选中「全部」)
├── BottomNav (active=workshop)
└── FAB
```

收藏/我的页：HomeTopBar（简化，无搜索）+ 空状态文案 + BottomNav。

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| 自定义 BottomNav 与子页导航冲突 | 仅在三个 Tab 页渲染 BottomNav；工具页用现有 navBar + navigateBack |
| tabBar 页面栈与 navigateTo 混用 | Tab 页之间用 switchTab；进工具用 navigateTo，返回自然回到 Tab 页 |
| 毛玻璃效果不一致 | TopAppBar 用 `rgba(247,249,252,0.92)` 纯色，不依赖 backdrop-filter |
| 字体与设计稿偏差 | 首版系统字体；后续可选 loadFontFace |
| FAB 遮挡内容 | ScrollView 底部 padding ≥ 底栏高度 + FAB 高度 + safe-area |
| 品牌更名遗漏 | tasks 中列出 app.config / project.config / 文档扫描项 |

## Migration Plan

1. 新增 tokens.scss、组件、占位页
2. 重构 classify 页 UI
3. 更新 app.config（页面注册、window 标题）
4. 验证：`npm run dev:weapp`，检查三 Tab 切换、工具跳转、safe-area
5. 回滚：revert 本次变更即可，无数据迁移

## Open Questions

- Logo 图片资源：Stitch 用外链 Google 图，需替换为本地 `@/images/logo.png`（实现阶段处理）
- 收藏页后续 spec 由用户单独补充，本变更仅空状态占位
