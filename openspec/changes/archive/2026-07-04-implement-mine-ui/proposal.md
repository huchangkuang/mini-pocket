## Why

个人中心（我的 Tab）目前仅为「个人中心开发中」占位文案，与 Stitch 设计的完整个人中心体验（未登录/已登录双态、统计、菜单、等级进度）差距较大。工作坊与收藏页 UI 已落地，现在需要补齐第三个 Tab 的视觉与交互壳层，为后续真实登录与用户数据接入预留稳定 UI 结构。

## What Changes

- 将 `pages/mine/index` 从纯占位升级为 Stitch 个人中心 UI
- 新增个人中心专用顶栏（终端图标 +「个人中心」标题 + 通知按钮占位）
- 实现**未登录**与**已登录**两套 UI 状态，默认未登录
- 未登录态：居中头像 CTA、「点击登录/注册」、统计占位（--/0/--）、立即登录按钮、WORKSHOP LEVEL 进度卡
- 已登录态：横向资料卡（头像、昵称、加入日期、高级工匠徽章、编辑占位）、彩色统计（42/156/28）、切换账号 + 退出登录、当前等级进度卡（850/1000 XP）
- 本地 `isLoggedIn` state 驱动双态切换：登录入口 → 已登录；退出登录 → 未登录；点击 Profile Header 区域可 toggle（便于调 UI）
- 菜单四项（使用历史、问题反馈/意见反馈、系统设置、关于工坊）全部占位 toast
- 顶栏通知按钮占位 toast（未登录与已登录统一使用 notifications，不用 settings）
- Demo 用户数据使用设计稿：口袋达人、高级工匠、2023年10月12日、42/156/28、850 XP

## Capabilities

### New Capabilities

- `mine-ui`: 个人中心完整 UI——顶栏、未登录/已登录双态 Profile、统计网格、菜单列表、认证操作区、等级进度与占位交互

### Modified Capabilities

- `app-shell-navigation`: 我的页从「纯占位文案」升级为具备 Stitch 对齐 UI 壳层与未登录/已登录双态展示

## Impact

- **页面**：`src/pages/mine/index.tsx`、`index.scss` 大幅重构
- **组件**：新增 `mineTopBar`、`profileHeaderGuest`、`profileHeaderLoggedIn`、`statsGrid`、`mineMenuList`、`mineAuthActions`、`levelProgress`；复用 `bottomNav`
- **数据**：新增 `src/pages/mine/constants.ts`（demo 用户、统计、菜单项、等级进度）
- **资源**：新增本地头像 placeholder SVG（或 demo 头像图）
- **Spec**：更新 `app-shell-navigation` 中我的页占位要求；新增 `mine-ui` spec
- **依赖**：无新 npm 依赖；不引入 Tailwind / Material Symbols
