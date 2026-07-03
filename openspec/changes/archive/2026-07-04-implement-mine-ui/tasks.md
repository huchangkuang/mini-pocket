## 1. 组件与资源

- [x] 1.1 新建 `src/components/mineTopBar/`（终端 + 标题「个人中心」+ 通知 bell，适配胶囊高度）
- [x] 1.2 新建 `src/components/profileHeaderGuest/`（居中头像 CTA、装饰背景、登录文案）
- [x] 1.3 新建 `src/components/profileHeaderLoggedIn/`（横向头像、昵称、加入日期、徽章、编辑占位）
- [x] 1.4 新建 `src/components/statsGrid/`（三列统计，支持 primary/secondary/tertiary 色值）
- [x] 1.5 新建 `src/components/mineMenuList/`（四行菜单 + chevron + 占位点击）
- [x] 1.6 新建 `src/components/mineAuthActions/`（guest: 立即登录 pill | loggedIn: 切换账号 + 退出登录）
- [x] 1.7 新建 `src/components/levelProgress/`（guest / loggedIn 两种 variant）
- [x] 1.8 新增头像 placeholder 资源 `src/images/mine/avatar-placeholder.svg`（及可选 demo 头像）

## 2. 数据层

- [x] 2.1 新建 `src/pages/mine/constants.ts`：demoLoggedInUser、guestStats、loggedInStats、mineMenuItems、levelProgress 常量与类型

## 3. 个人中心页重构

- [x] 3.1 重构 `src/pages/mine/index.tsx`：MineTopBar + 双态 Profile + StatsGrid + MineMenuList + MineAuthActions + LevelProgress + BottomNav
- [x] 3.2 实现本地 state：`isLoggedIn` 默认 false；登录/退出/Header toggle 切换逻辑
- [x] 3.3 移除 HomeTopBar，使用 MineTopBar
- [x] 3.4 占位交互：终端、通知、编辑、切换账号、菜单四项 → errorToast
- [x] 3.5 重写 `src/pages/mine/index.scss`：双态布局、卡片、按钮、进度条样式，复用 tokens

## 4. 验证

- [x] 4.1 运行 `npm run build:weapp` 编译通过
- [x] 4.2 确认默认未登录 UI 与设计稿结构一致
- [x] 4.3 确认立即登录/点击登录切换至已登录 demo（口袋达人、42/156/28、850 XP）
- [x] 4.4 确认退出登录回到未登录态；Profile Header toggle 双态可切换
- [x] 4.5 确认菜单与通知占位 toast；BottomNav「我的」Tab 选中态正常
