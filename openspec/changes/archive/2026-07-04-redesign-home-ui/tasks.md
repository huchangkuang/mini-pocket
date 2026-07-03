## 1. 设计 Token 与品牌

- [x] 1.1 新建 `src/style/tokens.scss`，定义 MD3 色板、间距、圆角、字号、阴影变量（px→rpx）
- [x] 1.2 在 `src/style/common.scss` 或 `app.scss` 中引入 tokens.scss
- [x] 1.3 更新 `src/app.config.ts`：`navigationBarTitleText` 改为「百宝口袋工坊」，`backgroundColor` 改为 `#f7f9fc`
- [x] 1.4 扫描并更新 `project.config.json` 等项目名称字段（如有「简易口袋」）

## 2. 共享组件

- [x] 2.1 新建 `src/components/homeTopBar/`（tsx + scss）：Logo、标题、搜索/终端占位按钮，适配胶囊高度
- [x] 2.2 新建 `src/components/toolCard/`（tsx + scss）：icon、title、desc、accent 三色底、active 缩放
- [x] 2.3 新建 `src/components/bottomNav/`（tsx + scss）：工作坊/收藏/我的三 Tab，选中态 pill 样式，safe-area 适配
- [x] 2.4 新建 `src/components/featuredBanner/`（tsx + scss）：推荐 Banner + CTA 跳转指尖轮盘
- [x] 2.5 新建 `src/components/categoryChips/`（tsx + scss）：横向 ScrollView，UI 选中态，暂不过滤

## 3. 数据层扩展

- [x] 3.1 扩展 `src/pages/classify/constants.ts`：为每项工具添加 `desc`、`accent` 字段及 TypeScript 类型
- [x] 3.2 定义分类 Chips 静态数据（全部、生活、娱乐、效率、开发）

## 4. Tab 占位页

- [x] 4.1 新建 `src/pages/favorites/index`（tsx + scss + config）：空状态「收藏功能开发中」+ BottomNav
- [x] 4.2 完善 `src/pages/mine/index`：空状态「个人中心开发中」+ BottomNav + custom 导航
- [x] 4.3 在 `src/app.config.ts` 注册 favorites 页面，确保 classify 仍为首页

## 5. 工作坊首页重构

- [x] 5.1 重构 `src/pages/classify/index.tsx`：组装 HomeTopBar、FeaturedBanner、SectionHeader、ToolCard 网格、CategoryChips、FAB、BottomNav
- [x] 5.2 重写 `src/pages/classify/index.scss`：移除绿色渐变，应用 tokens 与 Bento grid 布局
- [x] 5.3 实现占位交互：搜索、终端、管理、FAB 点击调用 errorToast
- [x] 5.4 实现 CategoryChips 本地选中 state（不过滤列表）
- [x] 5.5 ScrollView 底部 padding 预留 BottomNav + FAB + safe-area 空间

## 6. 资源与配置

- [x] 6.1 添加本地 Logo 图片至 `src/images/`（或复用现有资源占位）
- [x] 6.2 确认 classify/favorites/mine 三页 `navigationStyle: "custom"`

## 7. 验证

- [x] 7.1 运行 `npm run dev:weapp`，确认三 Tab 切换正常
- [x] 7.2 确认工具卡片跳转与 excludeClassifyList 过滤行为不变
- [x] 7.3 确认子工具页无 BottomNav，返回后工作坊 Tab 正常
- [x] 7.4 在模拟器检查 safe-area、卡片按压反馈、Banner CTA 跳转
