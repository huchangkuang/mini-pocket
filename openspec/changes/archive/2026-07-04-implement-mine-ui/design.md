## Context

Taro 3.6 + React + SCSS 小程序。个人中心页当前复用 `HomeTopBar` + 简单 emptyState 文案。工作坊与收藏页已有 MD3 Token（`tokens.scss`）、`BottomNav`、`FavoritesTopBar` 等组件模式可复用。

Stitch 提供两套个人中心设计：
1. **未登录态**：居中头像 CTA + 统计占位 + 菜单 + 立即登录 pill + WORKSHOP LEVEL 进度卡
2. **已登录态**：横向资料卡 + 彩色统计 + 菜单 + 切换账号/退出登录 + 当前等级进度卡

**用户决策**：
- 默认展示未登录态；点击 Profile Header 区域可 toggle 到已登录 demo（便于调 UI）
- 登录入口（点击登录/注册、立即登录）→ 本地 `setIsLoggedIn(true)`
- 退出登录 → 本地 `setIsLoggedIn(false)`
- Demo 数据：口袋达人 / 高级工匠 / 加入于 2023年10月12日 / 42·156·28 / 850 XP
- TopBar 右侧统一 notifications（两种状态一致），占位 toast
- 菜单四项全部占位 toast

## Goals / Non-Goals

**Goals:**
- 完整还原 Stitch 个人中心 UI 结构与视觉层次（双态）
- UI 层与 demo 数据分离，便于 Phase 2 接真实 auth/storage
- 本地 `isLoggedIn` 驱动双态，登录/退出/Header toggle 可演示完整流程
- 复用现有 design tokens 与 BottomNav
- 移除 HomeTopBar，使用专用 MineTopBar

**Non-Goals:**
- 微信登录 / 后端用户体系
- `Taro.setStorage` 持久化登录态
- 菜单项真实页面跳转（关于工坊等）
- 通知中心业务功能
- 编辑资料、切换账号真实逻辑
- XP/等级系统后端计算

## Decisions

### D1: 专用 MineTopBar，不复用 HomeTopBar / FavoritesTopBar

**选择**：新建 `mineTopBar`，布局与 FavoritesTopBar 一致：

```
[ >_ ]  个人中心              [ bell ]
```

**理由**：Tab 内页标题模式；与工作坊品牌顶栏、收藏顶栏职责分离。

**偏差**：Stitch 未登录稿用 settings，用户要求统一 notifications。

### D2: Profile Header 拆为两个组件

**选择**：
- `profileHeaderGuest`：居中纵向布局，装饰圆形背景，头像占位 + CTA 文案
- `profileHeaderLoggedIn`：横向 flex，头像 + 信息区 + 编辑按钮

**理由**：两种布局差异大，拆开比单组件 `if/else` 更清晰。

**交互**：
- Guest：点击 Header 区域 → `onLogin()`（setIsLoggedIn true）+ 可选 toggle
- LoggedIn：点击 Header 区域 → toggle 回 guest（开发调 UI）；编辑 → toast

### D3: Demo 数据 constants.ts

```typescript
export type MineMenuItem = {
  id: string;
  label: string;
  icon: string; // AtIcon value
};

export const demoLoggedInUser = {
  nickname: '口袋达人',
  joinDate: '2023年10月12日',
  badge: '高级工匠',
  avatar: '...', // local asset
};

export const guestStats = [
  { value: '--', label: '已用工具', color: 'primary' },
  { value: '0', label: '活跃天数', color: 'primary' },
  { value: '--', label: '收藏工具', color: 'primary' },
];

export const loggedInStats = [
  { value: '42', label: '已用工具', color: 'primary' },
  { value: '156', label: '活跃天数', color: 'secondary' },
  { value: '28', label: '收藏', color: 'tertiary' },
];

export const mineMenuItems: MineMenuItem[] = [
  { id: 'history', label: '使用历史', icon: 'clock' },
  { id: 'feedback', label: '问题反馈', icon: 'message' }, // guest; loggedIn 可用「意见反馈」
  ...
];

export const guestLevelProgress = { current: 0, total: 1000, hint: '登录后开启工坊大师之路' };
export const loggedInLevelProgress = { current: 850, total: 1000, hint: '再使用 15 次工具即可晋升 "工坊大师"' };
```

### D4: StatsGrid 通用三列组件

```
┌──────────┬──────────┬──────────┐
│   42     │   156    │   28     │
│ 已用工具  │ 活跃天数  │  收藏    │
└──────────┴──────────┴──────────┘
```

- Props: `items: { value, label, color }[]`
- color 映射 tokens：primary / secondary / tertiary
- 未登录第三列 label「收藏工具」，已登录「收藏」（对齐各自 Stitch 稿）

### D5: MineAuthActions 双 variant

| 状态 | 内容 |
|---|---|
| guest | 实心 primary pill「立即登录」→ setIsLoggedIn(true) |
| loggedIn | outline「切换账号」toast + 灰色「退出登录」→ setIsLoggedIn(false) |

### D6: LevelProgress 双 variant

| 状态 | 样式 | 文案 |
|---|---|---|
| guest | 灰底 bordered 卡，medal + WORKSHOP LEVEL | 0/1000 XP，进度 ~2% |
| loggedIn | 渐变 primary/tertiary tint | 当前等级进度，850/1000，85% |

### D7: 双态切换逻辑

```typescript
const [isLoggedIn, setIsLoggedIn] = useState(false);

const handleProfileHeaderPress = () => {
  setIsLoggedIn((prev) => !prev); // toggle for UI dev
};

const handleLogin = () => setIsLoggedIn(true);
const handleLogout = () => setIsLoggedIn(false);
```

- 默认 `false`（未登录）
- 「立即登录」「点击登录/注册」→ `handleLogin`
- 「退出登录」→ `handleLogout`
- Profile Header 点击 → toggle（用户选项 C）

### D8: 占位交互

| 控件 | 行为 |
|---|---|
| 终端 `>_` | `errorToast('更多功能正在开发中...')` |
| 通知 bell | 同上 |
| 编辑资料 | 同上 |
| 切换账号 | 同上 |
| 菜单四项 | 同上 |

### D9: 图标与平台限制

- Material Symbols → `AtIcon`（taro-ui）或本地 SVG
- 无 hover → `:active scale(0.98)`
- 未登录装饰 blur → 纯色圆形 opacity，不用 backdrop-filter
- 头像：本地 placeholder SVG；已登录 demo 可用打包静态图

## Risks / Trade-offs

| 风险 | 缓解 |
|---|---|
| Header toggle 与登录按钮行为混淆 | 登录按钮明确 set true；toggle 仅 Header 区域 |
| 双态组件重复样式 | StatsGrid、MineMenuList、LevelProgress 抽共用 |
| HomeTopBar 误复用 | mine 页移除 HomeTopBar |
| 菜单文案 guest/loggedIn 不一致 | 按状态传入不同 label（问题反馈 vs 意见反馈） |
| 无持久化，刷新回未登录 | Phase 2 接 storage；首版可接受 |

## Migration Plan

1. 新增组件与 constants、头像资源
2. 重构 mine 页，移除 HomeTopBar
3. 验证：未登录默认、登录切换、退出回未登录、Header toggle、菜单/通知占位、BottomNav
4. 后续 change：微信登录 + 真实用户数据 + 菜单页

## Open Questions

- 已登录 demo 头像用本地 SVG 占位还是打包设计稿人像——首版优先本地 SVG placeholder，视觉接近即可
- Profile Header toggle 是否在已登录态仍保留——是，便于开发调 UI，不影响登录/退出主流程
